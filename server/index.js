const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'], // Adjust based on your requirements
    },
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('draw', (line) => {
        // Broadcast drawing data to all clients except the sender
        socket.broadcast.emit('draw', line);
    });
});

server.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});