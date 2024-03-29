const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine' , 'ejs');
app.use(express.static('public'));

app.get('/' , (req,res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req,res)=>{
    res.render('room',{roomId:  req.params.room});
})

io.on("connection" , socket => {
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId);
        socket.broadcast.emit('user-connected',userId);
        socket.on('disconnect',()=>{
            socket.broadcast.emit('user-disconnected',userId);
        })
        // console.log(roomId,userId);
    })
})

server.listen(80);
console.log("server listening on port 80");