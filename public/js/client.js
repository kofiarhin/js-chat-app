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


// join
socket.on("new-user", ({ username, users }) => {

    let textWrapper = document.createElement('div');
    textWrapper.innerHTML  = `<p class="join-message"> ${username} just joined!</p>`;
    $messages.insertAdjacentElement("beforeend", textWrapper)
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

    let textWrapper = document.createElement("div");
    textWrapper.innerHTML = `<p class="user-left"> ${username} just left </p>`
    $messages.insertAdjacentElement("beforeend", textWrapper);

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

     let textWrapper = document.createElement("div");
    textWrapper.classList.add("text-wrapper")

    // work on the styling later
    // element.innerHTML = `${username}: ${message}`;
    textWrapper.innerHTML = `<p class="message"> ${username}:  ${message} </p>`
    

    $messages.insertAdjacentElement("beforeend", textWrapper)


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