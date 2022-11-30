import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      window.scrollTo(0, 0);
    };
  }, [location]);

  return children;
};

export default ScrollToTop;
