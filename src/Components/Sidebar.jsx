import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import menu_24px from '../heroimages/menu_24px.svg';
import add_icon from '../heroimages/add_icon.svg';
import user_image from '../heroimages/user-image.svg';
import setting from '../heroimages/setting-image.svg';
import axios from 'axios';
import GoogleAuth, { onGoogleLoginSuccess } from './GoogleAuth';
import { AppContext } from './AppProvider';

export const Sidebar = ({ startNewChat }) => {
    const { selectedItem, setSelectedItem, useAlternativeUI, setUseAlternativeUI } = useContext(AppContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate(); // Initialize the navigate function
    const location = useLocation(); // Get the current location

    const toggleUI = () => {
        const newUIState = !useAlternativeUI;
        setUseAlternativeUI(newUIState);
        if (location.pathname === "/agentic-rag") {
            navigate("/"); 
        } else if (newUIState) {
            navigate("/agentic-rag"); 
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    let localData = JSON.parse(localStorage.getItem("user_info")) || { name: "" };

    const fetchData = () => {
        const postData = {
            userEmail: localData.hd || ""
        };
        axios.post(`${process.env.REACT_APP_CHATPRO_BACKEND_GET}/api/get/`, postData)
            .then(response => {
                let arr = [];
                for (let key in response.data.grouped_data) {
                    arr.push(key);
                }
                setHistory(arr);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleHistoryClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="relative w-[15%]">
            <button 
                className="fixed top-2.5 left-2.5 z-50 border-none bg-transparent cursor-pointer md:hidden"
                onClick={toggleSidebar}
            >
                <img src={menu_24px} alt="Menu Icon" />
            </button>
            <div className={`absolute h-[97vh] mt-[11px] ml-[10px] bg-[#242424] transition-all duration-500 ease-in-out rounded-tl-[20px] rounded-bl-[20px] ${isSidebarOpen ? 'w-[200px]' : 'w-[50px]'} md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-center items-center h-[50px]">
                        <img 
                            className="cursor-pointer"
                            src={menu_24px} 
                            alt="Menu Icon" 
                            onClick={toggleSidebar} 
                        />
                    </div>

                    {/* Toggle Button/Icon */}
                    <div className="mb-4 px-4">
                        {isSidebarOpen ? (
                            <button
                                onClick={toggleUI}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
                            >
                                <span>{useAlternativeUI ? "Main UI" : "Alternative UI"}</span>
                                <span className="text-lg">⇄</span>
                            </button>
                        ) : (
                            <button
                                onClick={toggleUI}
                                className="w-full flex items-center justify-center p-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
                            >
                                <span className="text-lg">⇄</span>
                            </button>
                        )}
                    </div>

                    <div className="flex justify-center items-center mt-4">
                        <img 
                            className="cursor-pointer"
                            src={add_icon} 
                            alt="Add Icon" 
                            onClick={startNewChat}
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto mt-4">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className={`text-[aliceblue] px-4 py-2 ${isSidebarOpen ? 'block' : 'hidden'} cursor-pointer hover:bg-gray-700`}
                                onClick={() => handleHistoryClick(item)}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto mb-4">
                        <div className="flex flex-col items-center space-y-4">
                            <img
                                className="cursor-pointer w-8 h-8"
                                src={user_image}
                                alt="User Icon"
                                onClick={onGoogleLoginSuccess}
                            />
                            <img 
                                className="w-8 h-8"
                                src={setting} 
                                alt="Setting Icon" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};






















// import React, { useState, useEffect, useContext } from 'react';
// import menu_24px from '../heroimages/menu_24px.svg';
// import add_icon from '../heroimages/add_icon.svg';
// import user_image from '../heroimages/user-image.svg';
// import setting from '../heroimages/setting-image.svg';
// import axios from 'axios';
// import GoogleAuth, { onGoogleLoginSuccess } from './GoogleAuth';
// import { AppContext } from './AppProvider';

// export const Sidebar = ({ startNewChat }) => {
//     const { selectedItem, setSelectedItem, useAlternativeUI, setUseAlternativeUI } = useContext(AppContext);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [history, setHistory] = useState([]);

//     const toggleUI = () => {
//         setUseAlternativeUI(!useAlternativeUI);
//     };

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     let localData = JSON.parse(localStorage.getItem("user_info")) || { name: "" };

//     const fetchData = () => {
//         const postData = {
//             userEmail: localData.hd || ""
//         };
//         axios.post(`${process.env.REACT_APP_CHATPRO_BACKEND_GET}/api/get/`, postData)
//             .then(response => {
//                 let arr = [];
//                 for (let key in response.data.grouped_data) {
//                     arr.push(key);
//                 }
//                 setHistory(arr);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     };

//     const handleHistoryClick = (item) => {
//         setSelectedItem(item);
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     return (
//         <div className="relative w-[15%]">
//             <button 
//                 className="fixed top-2.5 left-2.5 z-50 border-none bg-transparent cursor-pointer md:hidden"
//                 onClick={toggleSidebar}
//             >
//                 <img src={menu_24px} alt="Menu Icon" />
//             </button>
//             <div className={`absolute h-[97vh] mt-[11px] ml-[10px] bg-[#242424] transition-all duration-500 ease-in-out rounded-tl-[20px] rounded-bl-[20px] ${isSidebarOpen ? 'w-[200px]' : 'w-[50px]'} md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
//                 <div className="flex flex-col h-full">
//                     <div className="flex justify-center items-center h-[50px]">
//                         <img 
//                             className="cursor-pointer"
//                             src={menu_24px} 
//                             alt="Menu Icon" 
//                             onClick={toggleSidebar} 
//                         />
//                     </div>

//                     {/* Toggle Button/Icon */}
//                     <div className="mb-4 px-4">
//                         {isSidebarOpen ? (
//                             <button
//                                 onClick={toggleUI}
//                                 className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
//                             >
//                                 <span>{useAlternativeUI ? "Main UI" : "Alternative UI"}</span>
//                                 <span className="text-lg">⇄</span>
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={toggleUI}
//                                 className="w-full flex items-center justify-center p-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
//                             >
//                                 <span className="text-lg">⇄</span>
//                             </button>
//                         )}
//                     </div>

//                     <div className="flex justify-center items-center mt-4">
//                         <img 
//                             className="cursor-pointer"
//                             src={add_icon} 
//                             alt="Add Icon" 
//                             onClick={startNewChat}
//                         />
//                     </div>
//                     <div className="flex-grow overflow-y-auto mt-4">
//                         {history.map((item, index) => (
//                             <div
//                                 key={index}
//                                 className={`text-[aliceblue] px-4 py-2 ${isSidebarOpen ? 'block' : 'hidden'} cursor-pointer hover:bg-gray-700`}
//                                 onClick={() => handleHistoryClick(item)}
//                             >
//                                 {item}
//                             </div>
//                         ))}
//                     </div>
//                     <div className="mt-auto mb-4">
//                         <div className="flex flex-col items-center space-y-4">
//                             <img
//                                 className="cursor-pointer w-8 h-8"
//                                 src={user_image}
//                                 alt="User Icon"
//                                 onClick={onGoogleLoginSuccess}
//                             />
//                             <img 
//                                 className="w-8 h-8"
//                                 src={setting} 
//                                 alt="Setting Icon" 
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };