import Sidebar from "../components/Sidebar.jsx";
import '../styles/Settings/Settings.css'
import SettingsForm from "../components/Settings/SettingsForm";



const Settings = () => {
  return (
    <div className="s-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="settings-wrapper">
        
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
