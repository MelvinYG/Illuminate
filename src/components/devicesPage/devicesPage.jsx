import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLoaderData } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./devicepage.css";

const EMPTY_DEVICE = {
  deviceName: "",
  wattage: "",
  deviceId: "",
  category: "",
  usageHours: 1,
  priority: "normal",
  earliestHour: 0,
  latestHour: 24,
  contiguous: false,
};

const DevicesPage = () => {
  const initialDeviceData = useLoaderData();
  const [deviceData, setDeviceData] = useState(initialDeviceData);
  const [editMenu, setEditMenu] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(EMPTY_DEVICE);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_DEVICE);
    setEditingIndex(null);
    setError("");
  };

  const startEdit = (index) => {
    const device = deviceData[index];
    setForm({
      deviceName: device.deviceName,
      wattage: device.wattage,
      deviceId: device.deviceId,
      category: device.category,
      usageHours: device.usageHours ?? 1,
      priority: device.priority ?? "normal",
      earliestHour: device.earliestHour ?? 0,
      latestHour: device.latestHour ?? 24,
      contiguous: device.contiguous ?? false,
    });
    setEditingIndex(index);
    setFormVisible(true);
    setEditMenu(null);
  };

  const payload = () => ({
    ...form,
    wattage: Number(form.wattage),
    usageHours: Number(form.usageHours),
    earliestHour: Number(form.earliestHour),
    latestHour: Number(form.latestHour),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingIndex !== null) {
        const response = await apiRequest.put(
          `/device/${deviceData[editingIndex]._id}`,
          payload(),
        );
        setDeviceData((devices) => devices.map(
          (device, index) => index === editingIndex ? response.data : device,
        ));
      } else {
        const response = await apiRequest.post("/device", payload());
        setDeviceData((devices) => [...devices, response.data]);
      }
      resetForm();
      setFormVisible(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save device");
    }
  };

  const deleteDevice = async (index) => {
    setError("");
    try {
      await apiRequest.delete(`/device/${deviceData[index]._id}`);
      setDeviceData((devices) => devices.filter((_, deviceIndex) => deviceIndex !== index));
      setEditMenu(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete device");
    }
  };

  return (
    <div className="mx-20 py-16 flex flex-col gap-8 device-page">
      <div className="add-btn">
        <button onClick={() => {
          if (formVisible) resetForm();
          setFormVisible((visible) => !visible);
        }}>
          {formVisible ? "Cancel" : "Add Device"}
        </button>
      </div>

      {error && <p>{error}</p>}
      <div className="all-devices">
        {deviceData.length === 0 ? (
          <div>No devices added yet.</div>
        ) : (
          <div className="flex gap-4 flex-col">
            {deviceData.map((device, index) => (
              <div className="flex justify-between device-row" key={device._id}>
                <div className="device-details">
                  <div className="device-name">{device.deviceName}</div>
                  <div className="device-wattage">Wattage: {device.wattage} W</div>
                  <div>
                    Runs {device.usageHours ?? 1} hour(s), {device.priority ?? "normal"} priority,
                    {" "}{device.earliestHour ?? 0}:00–{device.latestHour ?? 24}:00
                  </div>
                </div>
                <div className="device-edit">
                  <MoreVertIcon
                    onClick={() => setEditMenu(editMenu === index ? null : index)}
                    className="cursor-pointer"
                  />
                  {editMenu === index && (
                    <div className="device-edit-options">
                      <div className="edit" onClick={() => startEdit(index)}>Edit</div>
                      <div className="delete" onClick={() => deleteDevice(index)}>Delete</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formVisible && (
        <div className="device-add-details">
          <form onSubmit={handleSubmit}>
            <input name="deviceName" value={form.deviceName} placeholder="Device Name" onChange={updateField} required />
            <input name="wattage" type="number" min="1" value={form.wattage} placeholder="Wattage (W)" onChange={updateField} required />
            <input name="deviceId" value={form.deviceId} placeholder="Device ID (IoT ID)" onChange={updateField} required />
            <label>
              Category
              <select name="category" value={form.category} onChange={updateField} required>
                <option value="">Select a category</option>
                {["Washing machine", "Dishwasher", "Bulb", "AC", "Ceiling fan", "Pump", "TV", "Mixer grinder"]
                  .map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <input name="usageHours" type="number" min="0" max="24" value={form.usageHours} onChange={updateField} required />
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={updateField}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Earliest start hour
              <input name="earliestHour" type="number" min="0" max="23" value={form.earliestHour} onChange={updateField} required />
            </label>
            <label>
              Latest end hour
              <input name="latestHour" type="number" min="1" max="24" value={form.latestHour} onChange={updateField} required />
            </label>
            <label>
              <input name="contiguous" type="checkbox" checked={form.contiguous} onChange={updateField} />
              Run in consecutive hours
            </label>
            <button type="submit">{editingIndex !== null ? "Update Device" : "Add Device"}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
