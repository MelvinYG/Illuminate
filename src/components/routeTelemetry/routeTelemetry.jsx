import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { logger, normalizePath } from "../../lib/logger";

const RouteTelemetry = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastLoggedLocation = useRef(null);

  useEffect(() => {
    const signature = `${location.key}:${location.pathname}`;
    if (lastLoggedLocation.current === signature) return;
    lastLoggedLocation.current = signature;
    logger.info("page_view", {
      path: normalizePath(location.pathname),
      navigationType,
    });
  }, [location.key, location.pathname, navigationType]);

  return <Outlet />;
};

export default RouteTelemetry;
