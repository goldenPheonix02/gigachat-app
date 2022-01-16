const user = Qs.parse(location.search, {
    ignoreQueryString: true
});

const username = user['?username']

function makeText(u_Name, msg, time, self, flag) {
    const mssg_box = document.createElement('div');
    const mssg_lol = document.createElement('div');
    const info = document.createElement('div');
    mssg_box.classList.add('message');
    if (!self) {
        mssg_lol.classList.add('lol');
        info.classList.add('info');
    } else {
        mssg_lol.classList.add('lol-self');
        info.classList.add('info-self');
    }
    mssg_lol.innerText = msg;
    info.innerText = u_Name;
    if (time != 0) {
        info.innerHTML += `<span> ${time}</span>`;
    }
    if (!flag) {
        mssg_box.appendChild(info);
    }
    mssg_box.appendChild(mssg_lol);
    document.querySelector('#chatbox').appendChild(mssg_box);
    var chatHistory = document.getElementById("chatbox");
    chatHistory.scrollTop = chatHistory.scrollHeight;

}

function makeNotifChild(msg, hehe) {
    const newDiv = document.createElement("div");
    const newContent = document.createTextNode(msg + hehe);
    newDiv.appendChild(newContent);
    newDiv.className += "notif";
    document.querySelector(".chat").appendChild(newDiv);
    document.querySelector("input").value = "";
    var chatHistory = document.getElementById("chatbox");
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function appendUser(username) {
    const newli = document.createElement("li");
    newli.innerText = username
    newli.classList.add(username)
    newli.setAttribute('id', username);
    var parent = document.querySelector("ul");
    parent.appendChild(newli);
}

function deleteUser(username) {
    ele = document.getElementById(username)
    var parent = document.querySelector("ul");
    parent.removeChild(ele)
}

var socket = io();

var form = document.querySelector("form");
var input = document.querySelector("input");
input.focus();
var my_id = "";

//ON USER CONNECTED
socket.on("connect", () => {
    my_id = socket.id
    setTimeout(makeText("AloneBot", "Hello There, " + username, 0, 0), 5000)
    socket.emit("user-connected", username, my_id);
});



form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (input.value) {
        var msg = input.value.trim()
        socket.emit("chat message", username, msg);
        input.value = "";
        input.focus();

    }
});

var prev_time = 0;
var prev_else_id = 0;
socket.on("chat message", function(id, name, msg, time) {
    console.log(prev_time, time);
    if (id == my_id) {
        prev_else_id = my_id
        if (prev_time === time) {
            makeText("You", msg, time, 1, 1);
        } else {
            prev_time = time
            makeText("You", msg, time, 1, 0);
        }

    } else {
        if (prev_else_id == id) {
            makeText(name, msg, time, 0, 1);

        } else {
            prev_else_id = id;
            makeText(name, msg, time, 0, 0);
        }
        prev_time = 0
    }
    window.scrollTo(0, document.body.scrollHeight);
});


socket.on("user-joined", function(u_name) {
    makeNotifChild(u_name, " joined");
    appendUser(u_name);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("addUserList", function(users) {
    console.log("hehe");
    users.forEach(user => {
        appendUser(user.uname)
    });
});

socket.on("user-left", function(u_name) {
    makeNotifChild(u_name, " left");
    deleteUser(u_name)
    window.scrollTo(0, document.body.scrollHeight);
});

appendUser(username)