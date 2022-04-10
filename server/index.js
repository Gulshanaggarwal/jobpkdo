const app = require('express')();
const http = require('http').Server(app);
const { Deepgram } = require('@deepgram/sdk');
const cors = require("cors");
const io = require("socket.io")(http, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN,
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());


const deepgram = new Deepgram(process.env.DEEPGRAM_API_TOKEN);
const mimetype = "audio/ogg";

app.get("/", (req, res) => {
    res.send("Welcome to server")
})

io.on('connection', (socket) => {
    socket.emit("mic-ready");

})

io.on('connection', (socket) => {
    socket.on("microphone-stream", (stream) => {
        deepgram.transcription.preRecorded({
            buffer: stream, mimetype
        },
            {
                language: 'en-IN',
                numerals: true,
                keywords: ['web:3', 'android:2', 'machine:2', 'learning:2', 'cyber:2', 'security:2', 'blockchain:2', 'ML:2', 'php:2', 'javascript:2', 'python:2', 'full:2', 'stack:2', 'developer:3', 'django:2', 'jobs:3', 'freelance:3', 'golang:2', 'react:2', 'frontend:2', 'backend:2', 'nodejs:2', 'sales:2', 'marketing:2', 'c++:2', 'c:2', 'ruby:2', 'perl:2', 'js:2', 'springboot:2', 'graphic:2', 'designer:2', 'software:2', 'engineer:2', 'intern:3', 'full-time:3', 'part-time:3', 'web3:2', 'rails:2', 'internship:3', 'devops:2', 'kubernetes:2', 'docker:2', 'linux:2', 'hello:-10', 'hi:-10', 'the:-10', 'my:-10', 'and:-10', 'we:-10', 'i:-10', 'about:-10', 'us:-10', 'his:-10', 'her:-10', 'for:-10', 'this:-10', 'your:-10', 'it:-10', 'that:-10', 'you:-10']

            }).then((transcription) => socket.emit('transcription-result', transcription))
            .catch((err) => socket.emit('transcription-result', null))

    });
})




http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});