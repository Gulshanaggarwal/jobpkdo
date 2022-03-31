import { createContext, useReducer } from "react";



export const VoiceContext = createContext();


const initialState = {
    status: "",


}

const reducer = (state, action) => {

    switch (action.type) {
        case "LISTENING":
            return {
                status: "Listening"
            }
        case "PROCESSING":
            return {
                status: "Processing"
            }
        case "ERROR":
            return {
                status: "Error"
            }
        case "CLEAN":
            return {
                status: ""
            }
        default:
            return state
    }

}

export default function VoiceContextProvider(props) {

    const [voiceState, voiceDispatch] = useReducer(reducer, initialState);
    return (
        <VoiceContext.Provider value={[voiceState, voiceDispatch]}>
            {props.children}
        </VoiceContext.Provider>
    )
}