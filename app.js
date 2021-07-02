const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on("connection", socket => {
    console.log(socket.id);

    socket.on('messageChat', data => {
        console.log(JSON.parse(data));
        io.emit('messageChat', JSON.stringify({text: 'Hola Mundo desde el Servidor!'}))
    })

    socket.on("disconnect", () => {
        console.log('Se ha desconectado ' + socket.id);
    })

})




const port = 3000;
http.listen(port, () => {
    console.log('Servidor escuchando en http://localhost:' + port);
})