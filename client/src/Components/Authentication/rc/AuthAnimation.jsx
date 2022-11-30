import Lottie from "lottie-react";
import { useEffect, useRef } from "react";
import SocialMediaAnimation from "../../../Files/insta-likes.json";
const AuthAnimation = () => {
  const lottieRef = useRef();
  return (
    <div
      style={{
        display: "flex",
        // zIndex: -1,
        alignItems: "center",
        justifyContent: "center",
        height: "250px",
      }}
    >
      <Lottie
        animationData={SocialMediaAnimation}
        loop={true}
        autoPlay={true}
        lottieRef={lottieRef}
        style={{
          height: "500px",
          width: "700px",
        }}
      />
    </div>
  );
};

export default AuthAnimation;
