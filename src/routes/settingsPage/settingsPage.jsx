import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 
import './settingsPage.css';

const SettingsPage = () => {
    const { darkMode, toggleDarkMode } = useContext(AuthContext);

    const handleModeChange = (e) => {
        const isDarkMode = e.target.value === 'Dark';
        toggleDarkMode(isDarkMode);
    };

    return (
        <div className='settings-page'>
            <div className="settings-details">
                <h2>Settings</h2>
                <div className="general">
                    <h2>General</h2>
                    <div className="preference">
                        <form className='flex gap-4'>
                            <label>
                                <input
                                    type="radio"
                                    value="Dark"
                                    checked={darkMode === true}
                                    onChange={handleModeChange}
                                />
                                Dark
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Light"
                                    checked={darkMode === false}
                                    onChange={handleModeChange}
                                />
                                Light
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;