import { useEffect, useState } from 'react';
import './loaderCompo.css'; // We'll define the CSS animation here

const Loader = ({ onComplete }) => {
  // State to track when the loader should disappear
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading duration (e.g., 3 seconds for the effect)
    const timer = setTimeout(() => {
      setLoaded(true);
      onComplete(); // Call the onComplete callback to hide the loader and show homepage
    }, 1000); // Adjust the time to control the duration of the loader

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loader-wrapper ${loaded ? 'loaded' : ''}`}>
      <img src="./thunder-logo.svg" alt="logo" className="loader-logo" />
    </div>
  );
};

export default Loader;
