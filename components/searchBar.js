import TextLoop from "react-text-loop";
import { useState, useContext } from "react";
import hints from "../data/searchHints";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import { dispatchToast, removeToast } from "./tweetBox";
import { ToastContext } from "../contexts/ToastContext";

export default function SearchBar() {

    const [searchValue, setSearchValue] = useState("");
    const [listItem, setListItem] = useState([]);
    const router = useRouter();
    const [, dispatch] = useContext(ToastContext);



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


    const handleSearch = (e) => {
        e.preventDefault();

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
                        <input value={searchValue} className="outline-none py-3 w-full rounded-tl-md rounded-bl-md px-3 font-thin 230-270px:text-xs 271-300px:text-xs 301-330px:text-xs 331-360px:text-xs" type="text" placeholder="Search for Jobs, kills here.." onChange={handleSearchChange} />
                        <button className="bg-black p-3 rounded-tr-md rounded-br-md" onClick={handleSearch}>
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
        </section>
    )

}