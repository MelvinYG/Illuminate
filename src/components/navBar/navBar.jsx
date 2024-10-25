import { useContext, useState } from 'react';
import './navBar.css';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
    const [profileBtn, setProfileBtn] = useState(false);
    const {darkMode} = useContext(AuthContext);
    const [sideMenu, setSideMenu] = useState(false);

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
            <div className="home"><a href="/">Home</a></div>
            <div className="analytics"><a href="/analytics">Analytics</a></div>
            <div className="devices"><a href="/devices">Devices</a></div>
            <div className="notifications"><a href="/notifications">Notifications</a></div>
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
                    <div className="profile"><a href="/profile">Profile</a></div>
                    <div className="settings"><a href="/settings">Settings</a></div>
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
            <div className="home"><a href="/">Home</a></div>
            <div className="analytics"><a href="/analytics">Analytics</a></div>
            <div className="devices"><a href="/devices">Devices</a></div>
            <div className="notifications"><a href="/notifications">Notifications</a></div>
            <div className="profile"><a href="/profile">Profile</a></div>
            <div className="settings"><a href="/settings">Settings</a></div>
        </div>
    </div>
  )
}

export default NavBar