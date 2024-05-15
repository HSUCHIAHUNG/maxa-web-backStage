import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface MaskProps {
    className ?: string;
}

const Mask: React.FC<MaskProps> = ({className}) => {
  useEffect(() => {
    // Lock scrolling when Mask component mounts
    document.body.style.overflow = "hidden";
    // Unlock scrolling when Mask component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 bg-[#000]/30 ${className}`}
    ></div>,
    document.getElementById("modal")!
  );
};

export default Mask;
