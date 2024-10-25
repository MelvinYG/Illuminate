import { AuthContext } from '../../context/AuthContext';
import './notificationsPage.css';
import { useContext } from 'react';

const NotificationsPage = () => {
    const {notifications} = useContext(AuthContext);

  return (
    <div className='py-16 px-12 noti-page'>
        <h2>Notifications</h2>
            <div className='flex flex-col gap-4'>
                {notifications.map((notif, index) => (
                    <div key={index} className={`notification ${notif.type}`}>
                        {notif.message}
                    </div>
                ))}
            </div>
    </div>
  )
}

export default NotificationsPage;