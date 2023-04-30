const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadAudio = (id, socket) => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  ytdl(url, { filter: 'audioonly' })
    .on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total * 100;
      socket.emit('progress', Math.round(percent));
    })
    .on('error', (error) => {
      console.error(error);
      socket.emit('error', error.message);
    })
    .on('finish', () => {
      socket.emit('finished', id);
    })
    .pipe(fs.createWriteStream(__dirname + `/public/downloads/audio/${id}.mp3`))
};

const downloadVideo = (id, socket) => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  id = url.split('v=')[1];
  ytdl(url, {
    filter: format => format.container === 'mp4',
    quality: quality => quality.itag === '136' || quality.itag === '135'
  })
    .on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total * 100;
      socket.emit('progress', Math.round(percent));
    })
    .on('error', (error) => {
      console.error(error);
      socket.emit('error', error.message);
    })
    .on('finish', () => {
      socket.emit('finished', id);
    })
    .pipe(fs.createWriteStream(__dirname + `/public/downloads/video/${id}.mp4`))
};

module.exports = {
  downloadAudio,
  downloadVideo
}