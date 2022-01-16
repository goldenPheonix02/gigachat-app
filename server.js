const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const message = require('./utils/message.js')
var moment = require('moment-timezone');
const PORT = process.env.PORT || 3000;
const cors = require('cors')

app.use(express.urlencoded({ extended: true })); //BODY PARSER
app.use(express.static('public'))

app.use(
    cors({
        origin: "*"
    })
)

moment.updateLocale('en', {
    longDateFormat: {
        LT: "h:mm A",
    }
});

var users = [];

function removeUser(id) {
    var unot = users.find(user => user.id === id)
    users = users.filter(user => user.id !== id)
    return unot.uname;
}


io.on("connection", (socket) => {
    console.log('User connected ID:' + socket.id);
    console.log(io.engine.clientsCount); //


    socket.on("disconnect", () => {
        user_removed = removeUser(socket.id)
        io.emit("user-left", user_removed);
    });

    socket.on("chat message", (uname, msg) => {
        io.emit('chat message', socket.id, uname, msg, moment().tz("Asia/Colombo").format("LT"));
    });

    socket.on("user-connected", (name, id) => {
        socket.broadcast.emit('user-joined', name);
        io.to(id).emit("addUserList", users)
        users.push({ id: id, uname: name })

    })

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
})

server.listen(PORT, () => {
    console.log("listening on PORT 3000");
});