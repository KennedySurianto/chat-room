import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const CHAT_PASSWORD = 'sharedz';

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join request', (data) => {
        if (data.password === CHAT_PASSWORD) {
            socket.emit('join response', { success: true });
        } else {
            socket.emit('join response', { success: false });
        }
    });

    socket.on('user joined', (name) => {
        console.log(`${name} joined the chat`);
        socket.broadcast.emit('chat message', { user: 'System', message: `${name} joined the chat` });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
