const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = [];
let messagesChat = [];

io.on("connection", socket => {

    socket.on('start', data => {
        let user = {};
        user.id = socket.id;
        user.name = (JSON.parse(data)).name;
        user.avatar = (JSON.parse(data)).avatar;
        users.push(user);
        console.log(users);
        let responseData = {
            label: 'start',
            users,
            messagesChat
        }
        io.to(socket.id).emit('start', JSON.stringify(responseData));
    })

    socket.on('messageChat', data => {
        messagesChat.push(JSON.parse(data));
        let responseData = {
            label: 'messageChat',
            message: (JSON.parse(data))
        }
        io.emit('messageChat', JSON.stringify(responseData))
    })

    socket.on("disconnect", () => {
        let userName;
        users.forEach((elem, i) => {
            if(elem.id === socket.id) {
                userName = elem.name;
                users.splice(i, 1);
            }
        })
        let responseData = {
            label: 'end',
            users,
            userName
        }
        io.emit('end', JSON.stringify(responseData))
    })

})




const port = 3000;
http.listen(port, () => {
    console.log('Servidor escuchando en http://localhost:' + port);
})