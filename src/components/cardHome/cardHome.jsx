import './cardHome.css';
import PropTypes from "prop-types";

const CardHome = ({className, content}) => {
    return (
      <div 
        className={`card-outer border rounded rounded-tl-xl rounded-br-xl ${className} card`} 
      >
        {content}
      </div>
    );
  }

  export default CardHome;

CardHome.propTypes = {
  className: PropTypes.string,
  content: PropTypes.node.isRequired,
};

CardHome.defaultProps = {
  className: "",
};
