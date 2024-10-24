import { useLoaderData } from 'react-router-dom';
import './profilePage.css';

const ProfilePage = () => {
  const profileData = useLoaderData();
  console.log(profileData);

  return (
    <div className='profile-page'>
        <div className="logout">
            Logout
        </div>
        <div className="greet">
            {`Hi ${profileData.firstname} ${profileData.lastname}!`}
        </div>
        <div className="profileImg-container">
            <img src="./profileDef.jpg" alt="" />
        </div>
        <div className="profile-email">Email:  
            {` ${profileData.email}`}
        </div>
        <div className="profile-devices">
            Devices connected: {` ${profileData.devices.length}`}
        </div>
    </div>
  )
}

export default ProfilePage;