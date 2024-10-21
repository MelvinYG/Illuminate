import { useState } from 'react';
import './navBar.css';

const NavBar = () => {
    const [profileBtn, setProfileBtn] = useState(false);

    const handleProfileClick = () => {
        setProfileBtn(el => ! el);
    }
  return (
    <div className="navbar-main-desktop flex h-[100px] items-center px-20 py-5 justify-between">
        <div className="logo-container h-[80px] w-[250px]">
            <img src="./main-logo.svg" className="object-cover" alt="main-logo" />
        </div>
        <div className="navbar-options flex gap-6 items-center">
            <div className="home">Home</div>
            <div className="analytics">Analytics</div>
            <div className="devices">Devices</div>
            <div className="notifications">Notifications</div>
            <div className="profile-btn flex gap-2 border-solid border border-black rounded-3xl p-2" onClick={handleProfileClick}>
                <img src="./menu.svg" alt="menu" />
                <img src="./profile.png" alt="" />
                {profileBtn ? <div className="profile-dropdown">
                    <div className="profile">Profile</div>
                    <div className="settings">Settings</div>
                </div> : <></>}
            </div>
        </div>
    </div>
  )
}

export default NavBar