//DOESNT WORK :(

function add() {
    parent = document.querySelector(".anime")
    newChild = document.createElement("div");
    newChild.classList.add('child')
    parent.appendChild(newChild)
}

for (var i = 0; i < 30; i++) {
    add()
}



function randomValues() {
    var elements = document.querySelectorAll('.child');

    anime({
        targets: elements,
        translateX: function() {
            return anime.random(-10, 5);
        },
        translateY: function() {
            return anime.random(-300, 300);
        },
        easing: 'easeInOutQuad',
        duration: 2000,
        rotate: 360,
        borderRadius: ['0%', '50%'],
        complete: randomValues
    });
}

randomValues()