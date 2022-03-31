import TextLoop from "react-text-loop";
import { useState, useContext, useEffect } from "react";
import hints from "../data/searchHints";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import { dispatchToast, removeToast } from "./tweetBox";
import { ToastContext } from "../contexts/ToastContext";
import io from 'socket.io-client'
import { VoiceContext } from "../contexts/voiceModalContext";
import VoiceModal from "./Modal.js/voiceModal";
const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.setMaxListeners(11);

var socket;
var mediaRecorder;


const showVoiceModal = () => {
    const checkbox = document.getElementById("my-voice-modal");
    checkbox.checked = true;
}

const hideVoiceModal = () => {
    const checkbox = document.getElementById("my-voice-modal");
    checkbox.checked = false;
}

export default function SearchBar() {

    const [searchValue, setSearchValue] = useState("");
    const [listItem, setListItem] = useState([]);
    const router = useRouter();
    const [, dispatch] = useContext(ToastContext);
    const [, voiceDispatch] = useContext(VoiceContext)


    useEffect(() => socketInitializer(), []);

    const socketInitializer = async () => {
        await fetch('/api/audioStream')
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })
        socket.on('can-open-mic', (msg) => console.log(msg));
    }




    const handleSearchChange = (e) => {

        const val = e.target.value;
        setSearchValue(val);
        const filterArr = hints.filter((ele) => ele.includes(val))
        setListItem(filterArr);
    }

    const handleItemClick = (e) => {
        const params = router.query;
        router.push({
            query: {
                ...params,
                q: e.target.innerHTML
            }
        })
        setSearchValue(e.target.innerHTML);
        setListItem([]);
    }


    const handleSearch = () => {

        const params = router.query;

        if (searchValue !== "") {
            router.push({
                query: {
                    ...params,
                    q: searchValue.trim()
                }
            })
        }
        else {
            const id = nanoid();
            dispatchToast(id, "Field cannot be empty!", "info", dispatch);
            removeToast(id, dispatch);
        }

    }

    const handleVoiceStream = () => {

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

            navigator.mediaDevices.getUserMedia(
                {
                    audio: true
                }
            ).then((stream) => {
                console.log(stream);
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.start(5000);

                // dispatch listening status...
                setTimeout(() => {
                    voiceDispatch({
                        type: "LISTENING",
                    })

                }, 1000)


                // when data is available...



                mediaRecorder.addEventListener("dataavailable", (e) => {

                    socket.emit('microphone-stream', e.data);
                })

                setTimeout(() => {
                    mediaRecorder.stop();
                    voiceDispatch({
                        type: "PROCESSING"
                    })
                }, 5000)


            })
                .catch((err) => console.log(err))


            socket.on('transcription-result', (transcription) => {
                console.log(transcription);
                if (!transcription || transcription.results.channels[0].alternatives[0].words.length === 0) {

                    voiceDispatch({
                        type: "ERROR",
                    })
                    setTimeout(() => {
                        hideVoiceModal();
                        voiceDispatch({
                            type: "CLEAN",
                        })
                    }, 1000)
                    return;
                }
                hideVoiceModal();
                setSearchValue(transcription.results.channels[0].alternatives[0].transcript);

            })


            return;
        }
        alert("Media not supported on your browser")
    }

    return (
        <section className="bg-amber-400">
            <div className="py-10 text-center">
                <TextLoop>
                    <p className="230-270px:text-sm  271-300px:text-base sm:text-2xl pb-8">Search for full-time jobs here</p>
                    <p className="230-270px:text-sm  271-300px:text-base sm:text-2xl pb-8">Search for remote jobs here</p>
                    <p className="230-270px:text-sm  271-300px:text-base sm:text-2xl pb-8">Share &#38; Save for later</p>
                </TextLoop>
                <form className="relative w-5/6 mx-auto rounded-md sm:w-1/2 xl:w-1/3">
                    <div className="flex rounded-md">
                        <button type="button" onClick={() => {
                            handleVoiceStream();
                            showVoiceModal();
                        }} className="bg-white p-3 rounded-tl-md rounded-bl-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 16c2.206 0 4-1.794 4-4V6c0-2.217-1.785-4.021-3.979-4.021a.933.933 0 0 0-.209.025A4.006 4.006 0 0 0 8 6v6c0 2.206 1.794 4 4 4z"></path><path d="M11 19.931V22h2v-2.069c3.939-.495 7-3.858 7-7.931h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6H4c0 4.072 3.061 7.436 7 7.931z"></path></svg></button>
                        <input value={searchValue} className="outline-none py-3 w-full  px-3 font-thin 230-270px:text-xs 271-300px:text-xs 301-330px:text-xs 331-360px:text-xs" type="text" placeholder="Search for Jobs, kills here.." onChange={handleSearchChange} />
                        <button type="button" className="bg-black p-3 rounded-tr-md rounded-br-md" onClick={handleSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    {
                        listItem.length > 0 && (
                            <ul className="searchbar absolute top-14 z-49 text-left rounded-lg  border-1 border-gray-600 max-h-36 w-full overflow-y-scroll bg-gray-100 230-270px:text-xs 271-300px:text-sm 301-330px:text-base">
                                {
                                    listItem.map((ele, index) => <li key={index} onClick={handleItemClick} className="border-b-1 border-gray-400 p-3 rounded-lg capitalize cursor-pointer">{ele}</li>)
                                }
                            </ul>
                        )
                    }
                </form>
            </div>
            <input type="checkbox" id="my-voice-modal" className="modal-toggle"></input>
            <VoiceModal />
        </section>
    )

}