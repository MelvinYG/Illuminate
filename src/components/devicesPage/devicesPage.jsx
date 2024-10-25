import { useState } from "react";
import "./devicepage.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import apiRequest from "../../lib/apiRequest";
import { useLoaderData } from "react-router-dom";

const DevicesPage = () => {
  const initialDeviceData = useLoaderData();
  const [deviceData, setDeviceData] = useState(initialDeviceData); // Store device data in local state
  const [editVert, setEditVert] = useState(null);
  const [editActive, setEditActive] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [wattage, setWattage] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [category, setCategory] = useState("");
  const [addBtn, setAddBtn] = useState(false);

  const toggleEdit = (index) => {
    setEditActive((prevIndex) => (prevIndex === index ? null : index));
    if (index !== null) {
      // Populate form fields with existing device data for editing
      const deviceToEdit = deviceData[index];
      setDeviceName(deviceToEdit.deviceName);
      setWattage(deviceToEdit.wattage);
      setDeviceId(deviceToEdit.deviceId);
      setCategory(deviceToEdit.category);
    }
  };

  const toggleVerticalDots = (index) => {
    setEditVert((prevInd) => (prevInd === index ? null : index));
  };

  // Form submit and reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Request started");

    try {
      if (editActive !== null) {
        // Edit existing device
        const response = await apiRequest.put(`/device/${deviceData[editActive]._id}`, {
          deviceName,
          wattage: Number(wattage), // Convert wattage to number
          deviceId,
          category,
        });
        console.log("Device updated successfully:", response.data);

        // Update local state with edited device data
        setDeviceData((prevDevices) =>
          prevDevices.map((device, index) =>
            index === editActive ? { ...device, ...response.data } : device
          )
        );
      } else {
        // Add new device
        const response = await apiRequest.post("/device", {
          deviceName,
          wattage: Number(wattage), // Convert wattage to number
          deviceId,
          category,
        });
        console.log("Device added successfully:", response.data);

        // Update local state with new device data
        setDeviceData((prevDevices) => [...prevDevices, response.data]);
      }

      // Reset form or provide feedback to user
      resetForm();
      setAddBtn(false); // Close add form if it was open
    } catch (error) {
      console.error("Error adding/updating device:", error);
    }
  };

  const resetForm = () => {
    setDeviceName("");
    setWattage("");
    setDeviceId("");
    setCategory("");
    setEditActive(null); // Reset edit state
  };

  const handleAddButtonClick = () => {
    resetForm(); // Reset the form when adding a new device
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
                </div>
                <div className="device-edit">
                  <MoreVertIcon
                    onClick={() => toggleVerticalDots(index)}
                    className="cursor-pointer"
                  />
                  {editVert === index && (
                    <div className="device-edit-options">
                      <div className="edit" onClick={() => toggleEdit(index)}>Edit</div>
                      <div className="delete">Delete</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(addBtn || editActive !== null) && (
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
            <button type="submit">{editActive !== null ? "Edit Device" : "Add Device"}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;