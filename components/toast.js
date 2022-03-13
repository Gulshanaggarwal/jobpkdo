import { ToastContext } from "../contexts/ToastContext"
import { useContext } from "react";

//Toast
export default function Toast() {

    const [state, dispatch] = useContext(ToastContext);
    return state.length > 0 ? (
        <div className="fixed right-2 bottom-2 text-sm">
            {
                state.map((ele, index) => {
                    if (ele.type === "success") {
                        return (
                            <div key={index} className="alert shadow-lg alert-success my-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{ele.text}</span>
                                </div>
                            </div>
                        )
                    }
                    else if (ele.type === "error") {
                        return (
                            <div key={index} className="alert shadow-lg alert-error my-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{ele.text}</span>
                                </div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div key={index} className="alert shadow-lg alert-info my-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>{ele.text}</span>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div >
    ) : (null)
}