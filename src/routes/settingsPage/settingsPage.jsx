import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./settingsPage.css";

const MODES = [
  {
    value: "self_consumption",
    label: "Self Consumption",
    description: "Uses the battery to power appliances after solar generation drops.",
  },
  {
    value: "tou_savings",
    label: "ToU savings",
    description: "Uses electricity tariff periods to maximise savings.",
  },
  {
    value: "full_backup",
    label: "Full Backup reserve",
    description: "Keeps battery discharge reserved for backup operation.",
  },
  {
    value: "low_power",
    label: "Low power Consumption mode",
    description: "Turns off scheduled heavy appliances in the optimizer.",
  },
];

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useContext(AuthContext);
  const [operationMode, setOperationMode] = useState("");
  const [status, setStatus] = useState("Loading settings…");

  useEffect(() => {
    let active = true;
    apiRequest.get("/settings")
      .then(({ data }) => {
        if (active) {
          setOperationMode(data.mode);
          setStatus("");
        }
      })
      .catch((error) => {
        if (active) setStatus(error.response?.data?.message || "Unable to load settings");
      });
    return () => {
      active = false;
    };
  }, []);

  const handleThemeChange = (event) => {
    toggleDarkMode(event.target.value === "Dark");
  };

  const handleOperationModeChange = async (event) => {
    const previousMode = operationMode;
    const mode = event.target.value;
    setOperationMode(mode);
    setStatus("Saving…");
    try {
      const response = await apiRequest.put("/settings", { mode });
      setOperationMode(response.data.mode);
      setStatus("Saved");
    } catch (error) {
      setOperationMode(previousMode);
      setStatus(error.response?.data?.message || "Unable to save settings");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-details">
        <h2>Settings</h2>
        <div className="general">
          <h2>General</h2>
          <div className="preference">
            <form className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="Dark"
                  checked={darkMode}
                  onChange={handleThemeChange}
                />
                Dark
              </label>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="Light"
                  checked={!darkMode}
                  onChange={handleThemeChange}
                />
                Light
              </label>
            </form>
          </div>
        </div>
        <div className="modes">
          <h2>Mode</h2>
          <div className="diff-modes">
            {MODES.map((mode) => (
              <div className="mode-1" key={mode.value}>
                <div className="mode-details">
                  <div className="header">{mode.label}</div>
                  <div className="mode-details">{mode.description}</div>
                </div>
                <div className="select-btn">
                  <input
                    type="radio"
                    name="operationMode"
                    value={mode.value}
                    checked={operationMode === mode.value}
                    onChange={handleOperationModeChange}
                    disabled={!operationMode}
                  />
                </div>
              </div>
            ))}
          </div>
          {status && <p>{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
