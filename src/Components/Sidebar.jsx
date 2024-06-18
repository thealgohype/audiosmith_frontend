import React, { useState, useEffect, useContext } from 'react';
import menu_24px from '../heroimages/menu_24px.svg';
import add_icon from '../heroimages/add_icon.svg';
import user_image from '../heroimages/user-image.svg';
import setting from '../heroimages/setting-image.svg';
import "../styles/sidebar.css";
import axios from 'axios';
import GoogleAuth from './GoogleAuth';
import onGoogleLoginSuccess from './GoogleAuth';
import { AppContext } from './AppProvider';
    

export const Sidebar = (props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const { setSelectedItem } = useContext(AppContext);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    let localData = JSON.parse(localStorage.getItem("user_info")) || { name: "" }
    const fetchData = () => {
        const postData = {
            userEmail : localData.hd || ""
          }
        axios.post(`${process.env.chatproBackedGet}`,postData)
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
        // console.log(item);
        setSelectedItem(item);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='side-container'>
            <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                <img src={menu_24px} alt="Menu Icon" />
            </button>
            <div className={isSidebarOpen ? 'side side-open' : 'side side-closed'}>
                <img className='hamburger' src={menu_24px} alt="Menu Icon" onClick={toggleSidebar} />
                <div className='add_icon_div'>
                    <img className='add-icon' src={add_icon} alt="Add Icon" onClick={props.startNewChat} />
                </div>
                <div className='history-container'>
                    {history.map((item, index) => (
                        <div
                            key={index}
                            className='history-item'
                            onClick={() => handleHistoryClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className='fixed-icons'>
                    <img
                        className='userimage'
                        src={user_image}
                        alt="User Icon"
                        onClick={onGoogleLoginSuccess}
                    />
                    <img className='setting_image' src={setting} alt="Setting Icon" />
                </div>
            </div>
        </div>
    );
};