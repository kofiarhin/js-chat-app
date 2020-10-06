const users = []

const addUser = (id, username, room) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find(user => user.username === username && user.room === room);

    if (existingUser) {

        throw new Error("username already in use!")
        // return { error: "user in use" }
    } else {

        const newUser = { id, username, room }
        users.push(newUser)

        return { user: newUser }
    }


}


const getUsersInRoom = (room) => {

    return users.filter(user => user.room === room);

    return users;
}


const getUser = (id) => {

    const user = users.find(user => user.id === id);

    if (user) {

        return user
    }

    return null
}

const removeUser = (id) => {

    const index = users.findIndex(user => user.id === id);

    if (index > -1) {

        const user = users.splice(index, 1)[0];

        return user;
    }
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


