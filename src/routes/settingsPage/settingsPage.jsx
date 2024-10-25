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
                                    name="theme" // Same name for both radio buttons
                                    value="Dark"
                                    checked={darkMode === true}
                                    onChange={handleModeChange}
                                />
                                Dark
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="theme" // Same name for both radio buttons
                                    value="Light"
                                    checked={darkMode === false}
                                    onChange={handleModeChange}
                                />
                                Light
                            </label>
                        </form>
                    </div>
                </div>
                <div className="modes">
                    <h2>Mode</h2>
                    <div className="diff-modes">
                        {/* Each group of radio buttons should have a unique name */}
                        <div className="mode-1">
                            <div className="mode-details">
                                <div className="header">Self Consumption</div>
                                <div className="mode-details">
                                    Uses the battery to power appliances after solar generation drops.
                                </div>
                            </div>
                            <div className="select-btn">
                                <input type='radio' name='operationMode' value='selfConsumption' />
                            </div>
                        </div>
                        <div className="mode-1">
                            <div className="mode-details">
                                <div className="header">ToU savings</div>
                                <div className="mode-details">
                                    Uses electricity tariffs rate periods to maximise savings.
                                </div>
                            </div>
                            <div className="select-btn">
                                <input type='radio' name='operationMode' value='toUSavings' />
                            </div>
                        </div>
                        <div className="mode-1">
                            <div className="mode-details">
                                <div className="header">Full Backup reserve</div>
                                <div className="mode-details">
                                    Keeps the battery fully charged.
                                </div>
                            </div>
                            <div className="select-btn">
                                <input type='radio' name='operationMode' value='fullBackup' />
                            </div>
                        </div>
                        <div className="mode-1">
                            <div className="mode-details">
                                <div className="header">Low power Consumption mode</div>
                                <div className="mode-details">
                                    Turns OFF heavy appliances.
                                </div>
                            </div>
                            <div className="select-btn">
                                <input type='radio' name='operationMode' value='lowPowerConsumption' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;