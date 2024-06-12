import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import loadingImg from "../assets/images/MAXA_loading.gif";

interface LoadingType {
  isLoading: boolean;
}

const Loading: React.FC<LoadingType> = ({ isLoading }) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => setShowLoading(false), 300);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <CSSTransition
      in={showLoading}
      timeout={300}
      classNames="loading"
      unmountOnExit
    >
      <div className="fixed flex justify-center bg-[#000]/35 w-full h-full z-[200]">
        <div className="absolute top-[20px] flex flex-col justify-center items-center gap-[8px] w-[150px] h-[100px] rounded-[16px] bg-[#fff]">
          <img src={loadingImg} alt="loading" />
          <p className="text-[12px]">Loading...</p>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Loading;
