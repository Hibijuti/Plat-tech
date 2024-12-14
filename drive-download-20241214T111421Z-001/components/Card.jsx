import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faEarthEurope, faDownload, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import Loader from "./Loader";

function Card() {
    const [dark, setDark] = useState(false);

    const initTheme = () => {
        if(localStorage.getItem("dark") === null){
            localStorage.setItem("dark", false);
        }
        if(localStorage.getItem("dark") === "true"){
            setDark(true);
        }  
    }
    
    const switchTheme = () => {
        setDark(!dark);
        localStorage.setItem("dark", !dark);
    }

    const urlRef = useRef("");
    const [metaData, setMetaData] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchMeta = async () => {
        setLoading(true);
        axios.get(`/api/fetchMeta/?url=${urlRef.current.value}`)
        .then(res => {
            setMetaData(res);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            console.error(err);
        });
    }

    useEffect(() => {
        initTheme();
    }, []);
    
    const submitHandler = () => {
        fetchMeta();
    }

    return (
        <div className={`transition-colors duration-300 ${ dark ? "dark" : ""}`}>
            <div className="font-Inter min-h-screen dark:bg-gray-900">
                {/* Theme Toggle */}
                <div className='flex justify-end p-4'>
                    <div className='flex items-center space-x-2'>
                        <FontAwesomeIcon icon={faMoon} onClick={switchTheme} 
                            className={`p-2 rounded-full cursor-pointer text-2xl transition ${dark ? 'bg-yellow-400' : ''}`} />
                        <FontAwesomeIcon icon={faSun} onClick={switchTheme} 
                            className={`p-2 rounded-full cursor-pointer text-2xl transition ${!dark ? 'bg-yellow-400' : ''}`} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center max-w-lg mx-4">
                        <motion.div
                            transition={{ duration: 0.8 }}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center space-y-2 mb-8"
                        >
                            <h1 className="text-5xl font-semibold text-primary dark:text-gray-300 uppercase tracking-wide">Social</h1>
                            <h2 className="text-4xl font-semibold text-primary dark:text-gray-300 uppercase tracking-wide">Carding</h2>
                        </motion.div>

                        {/* Input Field & Search Button */}
                        <motion.div 
                            transition={{ duration: 0.8 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center w-full mt-8"
                        >
                            <input ref={urlRef} type="text" placeholder="ex: https://facebook.com"
                                className="w-full h-12 px-4 text-lg border border-green-500 rounded-md bg-gray-200 dark:bg-gray-800 dark:text-white dark:border-green-400" />
                            <div 
                                className="flex items-center ml-4 bg-secondary text-white rounded-md px-4 py-2 cursor-pointer hover:bg-green-600 transition"
                                onClick={submitHandler}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                                <span className="uppercase font-semibold text-sm">Preview</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Loader */}
                {loading && 
                    <div className="flex justify-center mt-16">
                        <Loader />
                    </div>
                }

                {/* Meta Data Display */}
                { !loading && metaData && metaData.data && Object.keys(metaData.data.response).length !== 0 && (
                    <div className="flex justify-center mt-16">
                        <div className="max-w-lg bg-gray-100 dark:bg-gray-700 p-6 rounded-md shadow-md space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                {metaData.data.response.image && (
                                    <a href={`/api/download?url=${metaData.data.response.image.url}`} className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-slate-600">
                                        Download
                                        <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                                    </a>
                                )}
                            </div>

                            <div className="overflow-hidden rounded-md">
                                {metaData.data.response.image ? (
                                    <img src={metaData.data.response.image.url} alt="Card Image" className="w-full rounded-md" />
                                ) : (
                                    <img src="/missing-face.png" alt="Image missing" className="w-full" />
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">{metaData.data.response.title}</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400">{metaData.data.response.description || 'No description available.'}</p>

                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <FontAwesomeIcon icon={faEarthEurope} className="mr-2 text-lg" />
                                    <span className="text-lg font-medium">{metaData.data.response.site_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
