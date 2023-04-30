const express = require('express');
const io = require('socket.io')(3001, {
    cors: {
        origin: '*',
    }
});
const cleaner = require('./cleaner');

cleaner('audio');
cleaner('video');
setInterval(() => {
    cleaner('audio');
    cleaner('video');
}, 300000);

const port = 3000;
const app = express();

const downloadAudio = require('./download').downloadAudio;
const downloadVideo = require('./download').downloadVideo;

app.use(express.static('./public'));

io.on('connection', (socket) => {
    socket.on('downloadAudio', (url) => {
        downloadAudio(url, socket);
    });
    socket.on('downloadVideo', (url) => {
        downloadVideo(url, socket);
    });
});


app.get('/', (req, res) => res.sendFile(__dirname + '/public/home.html'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));