import { useLoaderData, useNavigate } from 'react-router-dom';
import './profilePage.css';
import apiRequest from '../../lib/apiRequest';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const profileData = useLoaderData();
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);

  const logoutHandler = async () => {
    const res = await apiRequest.post('/auth/logout');
    // console.log(res);
    logout();
    navigate('/login');
  }

  return (
    <div className='profile-page'>
        <div className="logout" onClick={logoutHandler}>
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