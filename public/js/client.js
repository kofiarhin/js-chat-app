const socket = io()
const $form = document.querySelector("#form-wrapper form")
const $message = $form.querySelector("input")
const $messages = document.querySelector("#messages")
const $userList = document.querySelector(".users-list");
const $roomTitle = document.querySelector(".room-title")
const $showBtn = document.querySelector(".show-users")
const $usersWrapper = document.querySelector("#users-wrapper")

// get username from url 
const query = new URLSearchParams(location.search);
const username = query.get("username")
const room = query.get("room")

if (!username || !room) {

    location.href = "/"
}

$roomTitle.textContent = room;


socket.emit("join", { username, room }, (error) => {

    alert(error)
    window.location.href = "/"
})

socket.on("new-user", ({ username, users }) => {

    const element = document.createElement("p")
    element.innerText = `${username} just joined!`;
    element.classList.add("message")

    $messages.insertAdjacentElement("beforeend", element)
})


socket.on("roomData", data => {

    let markup = "";

    if (data && data.length > 0) {

        $userList.innerHTML = "";

        data.forEach(item => {

            const li = document.createElement("li")
            li.textContent = item.username;

            $userList.insertAdjacentElement("beforeend", li)
        });


    }


})

socket.on("user-left", username => {

    const element = document.createElement("p")
    element.classList.add("message")
    element.innerText = `${username} just left`;
    $messages.insertAdjacentElement("beforeend", element);


})



// use this to setup welcome message
socket.on("message", data => {

    console.log(data)
})



socket.on("error", data => {

    console.log("user already in use")
})

// separate actual message from welcom message
socket.on("sendMessage", ({ username, message }) => {

    const element = document.createElement("p");
    element.classList.add("message")

    // work on the styling later
    element.innerHTML = `${username}: ${message}`;

    $messages.insertAdjacentElement("beforeend", element)


})


$showBtn.addEventListener("click", () => {

    $usersWrapper.classList.toggle("active")
});

$form.addEventListener("submit", e => {

    e.preventDefault()

    const message = $message.value;

    if (message == "") {

        console.log("message cannot be empty")
    } else {

        // send message
        socket.emit("sendMessage", message)
        $message.value = ""

        $message.focus()

    }
})

function loadUsers(users) {

    console.log(users)
} 