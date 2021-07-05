const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = [];

io.on("connection", socket => {
    
    socket.on('start', data => {
        let user = {};
        user.id = socket.id;
        user.name = (JSON.parse(data)).name;
        users.push(user);
        let responseData = {
            label: 'start',
            users
        }
        io.emit('start', JSON.stringify(responseData));
    })

    socket.on('messageChat', data => {
        const messageChat = JSON.parse(data);
        let responseData = {
            label: 'messageChat',
            message: data
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