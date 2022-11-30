import { useEffect } from "react";
import { useSelector } from "react-redux";

const useScript = (onload) => {
  const url = "https://accounts.google.com/gsi/client";
  const user = useSelector((state) => state.Reducer.user);
  useEffect(() => {
    if (!user) {
      const script = document.createElement("script");
      script.src = url;
      script.onload = onload;
      document.head.appendChild(script);
    }
  }, [user]);
};

export default useScript;
