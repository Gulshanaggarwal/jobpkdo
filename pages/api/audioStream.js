const { Server } = require("socket.io");
const { Deepgram } = require('@deepgram/sdk');
const WebSocket = require("ws");

//audiostream
const audioStream = async (req, res) => {
    const sampleRate = 16000;

    const deepgram = new Deepgram(process.env.DEEPGRAM_API_TOKEN);
    const mimetype = "audio/ogg";


    const io = new Server(res.socket.server);
    io.emit('can-open-mic', 'mic-ready');


    io.on('connection', (socket) => {
        socket.on("microphone-stream", (stream) => {
            deepgram.transcription.preRecorded({
                buffer: stream, mimetype
            },
                {
                    language: 'en-IN',
                    numerals: true,
                    search: ["jobs", "developer", "freelance"],
                    keywords: ['javascript:2', 'python:2', 'full:2', 'stack:2', 'developer:3', 'jobs:4', 'freelance:4', 'golang:2', 'react:2', 'frontend:2', 'backend:2', 'nodejs:2', 'hello:-10', 'hi:-10', 'the:-10', 'my:-10', 'and:-10', 'we:-10', 'i:-10']

                }).then((transcription) => socket.emit('transcription-result', transcription))
                .catch((err) => socket.emit('transcription-result', null))

        });
    })











    res.json({ status: "ok", message: "are you ready!" })
}

export default audioStream;