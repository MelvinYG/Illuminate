import { useState } from "react";
import sampleDevices from "../../lib/sampleDevices.json";
import './devicepage.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const DevicesPage = () => {
    const deviceData = sampleDevices;
    
    const [editActive, setEditActive] = useState(null);
    const toggleEdit = (index) => {
        if (editActive === index) {
            setEditActive(null);
        } else {
            setEditActive(index);
        }
    };

    return (
        <div className="mx-20 py-4 flex flex-col gap-8 device-page">
            <div className="add-btn">
                <button>Add Device</button>
            </div>

            <div className="all-devices">
                {deviceData.length === 0 ? (
                    <div>No devices added yet.</div>
                ) : (
                    <div className="flex gap-4 flex-col">
                        {deviceData.map((data, index) => (
                            <div className="flex justify-between device-row" key={index}>
                                <div className="device-details">
                                    <div className="device-name">{data.deviceName}</div>
                                    <div className="device-wattage">Wattage: {data.wattage} W</div>
                                    <div className="device-quantity">Quantity: {data.quantity}</div>
                                </div>
                                <div className="device-edit">
                                    {/* Edit button to toggle the menu */}
                                    <MoreVertIcon 
                                        onClick={() => toggleEdit(index)} 
                                        className="cursor-pointer"
                                    />
                                    {/* Show edit options only if this device's menu is active */}
                                    {editActive === index && (
                                        <div className="device-edit-options">
                                            <div className="edit">Edit</div>
                                            <div className="delete">Delete</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="device-add-details">
                Add details
            </div>
        </div>
    );
};

export default DevicesPage;
