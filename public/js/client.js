const socket = io()
const $form = document.querySelector("#form-wrapper form")
const $message = $form.querySelector("input")
const $messages = document.querySelector("#messages")

// get username from url 
const query = new URLSearchParams(location.search);
const username = query.get("username")
const room = query.get("room")

if (!username || !room) {

    location.href = "/"
}


socket.emit("join", { username, room })

socket.on("new-user", (username, users) => {
    loadUsers(users)

    const element = document.createElement("p")
    element.innerText = `${username} just joined!`

    $messages.insertAdjacentElement("beforeend", element)
})


socket.on("user-left", ({ username, users }) => {

    const element = document.createElement("p")
    element.innerText = `${username} just left`;
    $messages.insertAdjacentElement("beforeend", element);

    loadUsers(users)
})



// use this to setup welcome message
socket.on("message", data => {

    console.log(data)
})




// separate actual message from welcom message
socket.on("sendMessage", ({ username, message }) => {

    const element = document.createElement("p")

    // work on the styling later
    element.innerHTML = `${username}: ${message}`;

    $messages.insertAdjacentElement("beforeend", element)


})


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