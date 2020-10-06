const http = require("http")
const express = require("express")
const app = express()
const socketio = require("socket.io")
const path = require("path")

const { addUser, getUser, removeUser, getUsersInRoom } = require("./lib/user")

// setup public path

const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.resolve(__dirname, "../public")
// setup middleware
app.use(express.static(publicDirectoryPath))


io.on("connection", socket => {


    io.emit("message", "new user connected");


    socket.on("join", ({ username, room }, callback) => {

        const { error, user } = addUser(socket.id, username, room);

        if (error) {
            return callback(error)
        }
        socket.join(room);

        // get list of users
        const users = getUsersInRoom(user.room)
        // send message to room
        socket.broadcast.to(room).emit("new-user", { username, users })

        io.to(user.room).emit("roomData", users)

    })


    socket.on("disconnect", () => {

        const user = removeUser(socket.id);
        if (user) {
            io.emit("roomData", getUsersInRoom(user.room));

            io.to(user.room).emit('user-left', user.username)
        }

        // todo work on disconnection

    })


    socket.on("sendMessage", message => {

        const user = getUser(socket.id);

        console.log(user)

        io.to(user.room).emit("sendMessage", { username: user.username, message })
    })

})


const port = process.env.PORT || 3000
server.listen(port, () => console.log("Litening on port " + port))