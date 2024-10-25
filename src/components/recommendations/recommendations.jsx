import './recommendations.css';
import data from '../../utils/recommendations.json';

const Recommendation = () => {
    let recomData = data;
    recomData = recomData.slice(0,3);
  return (
    <div className='recommendation-card'>
        <h2>Recommendations</h2>
        <div className="recomm">
            {
                recomData.map((recom,index) => (
                    <div className="recom-box" key={index}>
                        <div className="pin"></div>
                        <div className="our-recom">
                            {recom.recommendation}
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Recommendation