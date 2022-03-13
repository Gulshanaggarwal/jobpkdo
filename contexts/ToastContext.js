import { createContext, useReducer } from "react";


export const ToastContext = createContext();
const initialState = [];



const reducer = (state, action) => {

    switch (action.type) {
        case "ADD":
            return [
                ...state,
                {
                    id: action.payload.id,
                    text: action.payload.text,
                    type: action.payload.type
                }
            ];
        case "REMOVE":
            return state.filter((ele) => ele.id !== action.payload.id);
        default:
            return state
    }

}


export default function ToastContextProvider(props) {

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ToastContext.Provider value={[state, dispatch]}>
            {props.children}
        </ToastContext.Provider>
    )
}