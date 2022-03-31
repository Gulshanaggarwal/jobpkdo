const { Server } = require("socket.io");
const { Deepgram } = require('@deepgram/sdk');
const WebSocket = require("ws");



const audioStream = async (req, res) => {
    const sampleRate = 16000;

    const deepgram = new Deepgram('057357930d351bb8abb8d8645b69728773f67299');
    const mimetype = "audio/ogg";


    const io = new Server(res.socket.server);
    io.emit('can-open-mic', 'mic-ready');


    io.on('connection', (socket) => {
        socket.on("microphone-stream", (stream) => {
            deepgram.transcription.preRecorded({
                buffer: stream, mimetype
            },
                {
                    punctuate: true,
                    language: 'en-IN'
                }).then((transcription) => socket.emit('transcription-result', transcription))
                .catch((err) => socket.emit('transcription-result', null))

        });
    })











    res.json({ status: "ok", message: "are you ready!" })
}

export default audioStream;