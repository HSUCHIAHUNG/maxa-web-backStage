import { useEffect } from "react";
// router
import { Outlet, useNavigate } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState } from "../stores/index.ts";
// 匯入組件
import Header from "../components/layout/Header";
import NavMenu from "../components/layout/NavMenu";

function DefaultLayout() {
  // 全域狀態auth
  const auth = useSelector((state: RootState) => state.auth.isMember);

  // 動態路由
  const navigate = useNavigate();

  // 如果沒登入就被踢回登入頁面
  useEffect(() => {
    if(!auth) navigate('login')
  },[navigate, auth])


  return (
    <div className=" flex flex-col min-h-[100vh] m-[0_auto]">
      <Header />
      <div className="flex flex-1">
        <NavMenu />
        <Outlet />
      </div>
    </div>
  );
}

export default DefaultLayout;
