import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
    const [profileBtn, setProfileBtn] = useState(false);
    const {darkMode, unreadCount} = useContext(AuthContext);
    const [, setSideMenu] = useState(false);

const openSideMenu = () => {
    setSideMenu(prevState => {
        let sideDiv = document.querySelector('.slider-menu');
        
        if (!prevState) {
            sideDiv.classList.add('active'); // If prevState is false, it means we are opening the menu
        } else {
            sideDiv.classList.remove('active'); // If prevState is true, we are closing the menu
        }

        return !prevState; // Toggles the state
    });
}

    const handleProfileClick = () => {
        setProfileBtn(el => ! el);
    }
  return (
    <div className="navbar-main-desktop flex h-[100px] items-center px-8 md:px-20 py-8 justify-between">
        <div className="logo-container h-[80px] w-[250px]">
            <img src="./logo-main.svg" className="object-contain" alt="main-logo" />
        </div>
        <div className="navbar-options flex gap-6 items-center">
            <div className="home"><Link to="/home">Home</Link></div>
            <div className="analytics"><Link to="/analytics">Analytics</Link></div>
            <div className="devices"><Link to="/devices">Devices</Link></div>
            <div className="notifications">
                <Link
                    className="notification-link"
                    to="/notifications"
                    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                >
                    Notifications
                    {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
                </Link>
            </div>
            <div className={`profile-btn flex gap-2 border-solid border rounded-3xl p-2 ${darkMode ? 'border-white' : 'border-black'}`} 
                onClick={handleProfileClick}>
                <img
                src="./menu.svg"
                alt="menu"
                style={{ filter: darkMode ? 'invert(1) brightness(2)' : 'none' }}
                />

                <img
                src="./profile.png"
                alt="profile"
                style={{ filter: darkMode ? 'invert(1) brightness(2)' : 'none' }}
                />
                {profileBtn ? <div className="profile-dropdown">
                    <div className="profile"><Link to="/profile">Profile</Link></div>
                    <div className="settings"><Link to="/settings">Settings</Link></div>
                </div> : <></>}
            </div>
        </div>
        <div className="menuBtn-small-screen" onClick={openSideMenu}>
                <img
                src="./menu.svg"
                alt="menu"
                style={{ filter: darkMode ? 'invert(1) brightness(2)' : 'none' }}
                />
        </div>
        <div className="slider-menu">
            <div className="closeBtn" onClick={openSideMenu}>
                <img src="./close.png" alt="closeBtn" 
                style={{ filter: darkMode ? 'invert(1) brightness(2)' : 'none' }}/>
            </div>
            <div className="home"><Link to="/home">Home</Link></div>
            <div className="analytics"><Link to="/analytics">Analytics</Link></div>
            <div className="devices"><Link to="/devices">Devices</Link></div>
            <div className="notifications">
                <Link
                    className="notification-link"
                    to="/notifications"
                    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                >
                    Notifications
                    {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
                </Link>
            </div>
            <div className="profile"><Link to="/profile">Profile</Link></div>
            <div className="settings"><Link to="/settings">Settings</Link></div>
        </div>
    </div>
  )
}

export default NavBar
