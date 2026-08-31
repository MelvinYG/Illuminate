import './recommendations.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import formatNotificationTimestamp from '../../lib/formatNotificationTimestamp';

const Recommendation = () => {
    const { notifications, notificationsLoading, notificationsError } = useContext(AuthContext);
    const recommendations = notifications.filter(
        (notification) => notification.kind === 'ml_recommendation',
    );

  return (
    <div className='recommendation-card'>
        <h2>Recommendations</h2>
        <div className="recomm">
            {notificationsLoading && <p>Loading recommendations…</p>}
            {!notificationsLoading && notificationsError && <p>{notificationsError}</p>}
            {!notificationsLoading && !notificationsError && recommendations.length === 0 && (
                <p>No recommendations have been generated yet.</p>
            )}
            {recommendations.map((recommendation) => (
                    <Link
                        className="recom-box"
                        key={recommendation.id}
                        to={`/notifications/${recommendation.id}`}
                    >
                        <div className="pin"></div>
                        <h3>{recommendation.title}</h3>
                        <div className="our-recom">{recommendation.message}</div>
                        <time dateTime={recommendation.createdAt}>
                            {formatNotificationTimestamp(recommendation.createdAt)}
                        </time>
                    </Link>
                ))}
        </div>
    </div>
  )
}

export default Recommendation
