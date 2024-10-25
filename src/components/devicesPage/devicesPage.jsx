import { useState } from "react";
import sampleDevices from "../../lib/sampleDevices.json";
import "./devicepage.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import apiRequest from "../../lib/apiRequest";

const DevicesPage = () => {
  const deviceData = sampleDevices;
  const [editActive, setEditActive] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [wattage, setWattage] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [category, setCategory] = useState("");
  const [addBtn, setAddBtn] = useState(false);

  const toggleEdit = (index) => {
    setEditActive((prevIndex) => (prevIndex === index ? null : index));
  };

  // Form submit and reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Request started")

    try {
      const response = await apiRequest.post("/device", {
        deviceName,
        wattage: Number(wattage), // Convert wattage to number
        deviceId,
        category,
      });
      console.log("Device added successfully:", response.data);
      // Reset form or provide feedback to user
      resetForm();
      setAddBtn(el => !el);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const resetForm = () => {
    setDeviceName("");
    setWattage("");
    setDeviceId("");
    setCategory("");
  };

  const handleAddButtonClick = () => {
    setAddBtn((prevAddBtn) => !prevAddBtn);
  };

  return (
    <div className="mx-20 py-16 flex flex-col gap-8 device-page">
      <div className="add-btn">
        <button onClick={handleAddButtonClick}>
          {addBtn ? "Cancel" : "Add Device"}
        </button>
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
                  <div className="device-wattage">
                    Wattage: {data.wattage} W
                  </div>
                  <div className="device-quantity">
                    Quantity: {data.quantity}
                  </div>
                </div>
                <div className="device-edit">
                  <MoreVertIcon
                    onClick={() => toggleEdit(index)}
                    className="cursor-pointer"
                  />
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

      {addBtn && (
        <div className="device-add-details">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={deviceName}
                placeholder="Device Name"
                onChange={(e) => setDeviceName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="number"
                value={wattage}
                placeholder="Wattage (in W)"
                onChange={(e) => setWattage(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={deviceId}
                placeholder="Device ID (IoT ID)"
                onChange={(e) => setDeviceId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Washing machine">Washing machine</option>
                <option value="Dishwasher">Dishwasher</option>
                <option value="Bulb">Bulb</option>
                <option value="AC">AC</option>
                <option value="Ceiling fan">Ceiling fan</option>
                <option value="Pump">Pump</option>
                <option value="TV">TV</option>
                <option value="Mixer grinder">Mixer grinder</option>
              </select>
            </div>
            <button type="submit">Add Device</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
