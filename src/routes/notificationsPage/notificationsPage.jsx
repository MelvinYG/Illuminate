import { AuthContext } from '../../context/AuthContext';
import './notificationsPage.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import formatNotificationTimestamp from '../../lib/formatNotificationTimestamp';

const NotificationsPage = () => {
    const { notifications, notificationsLoading, notificationsError } = useContext(AuthContext);

  return (
    <div className='py-16 px-12 noti-page'>
        <h2>Recommendation notifications</h2>
            <div className='flex flex-col gap-4'>
                {notificationsLoading && <p>Loading notifications…</p>}
                {!notificationsLoading && notificationsError && <p>{notificationsError}</p>}
                {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                    <p>No notifications yet.</p>
                )}
                {notifications.map((notification) => (
                    <Link
                        to={`/notifications/${notification.id}`}
                        key={notification.id}
                        className={`notification ${notification.isRead ? 'read' : 'unread'}`}
                    >
                        <span className="notification-heading">
                            <strong>{notification.title}</strong>
                            {!notification.isRead && <span className="unread-badge">Unread</span>}
                        </span>
                        <span>{notification.message}</span>
                        <time dateTime={notification.createdAt}>
                            {formatNotificationTimestamp(notification.createdAt)}
                        </time>
                    </Link>
                ))}
            </div>
    </div>
  )
}

export default NotificationsPage;
