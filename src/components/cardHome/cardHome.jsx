import './cardHome.css';

const CardHome = ({className, content}) => {
    return (
      <div 
        className={`card-outer border rounded rounded-tl-xl rounded-br-xl ${className}`} 
      >
        {content}
      </div>
    );
  }
  
  export default CardHome;
  