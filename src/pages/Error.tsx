import React from "react";
import ErrorImg from "../assets/images/404.png";
import { NavLink } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className={`flex flex-col gap-[20px] justify-center items-center h-screen bg-[#F7F8FA]`}>
      <img src={ErrorImg} alt="404" />
      <p className={`text-[16px] w-[280px] text-center`}>很抱歉，我們無法找到您需要的頁面， 請返回首頁重新開始，謝謝您。</p>
      <NavLink to={`/`} className={`text-[#fff] bg-[#3A57E8] rounded-[100px] w-[88px] p-[5px_16px]`}>返回首頁</NavLink>
    </div>
  );
};

export default ErrorPage;
