import { useEffect, useState } from "react";
// router
import { Outlet, useNavigate, useLocation } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState } from "../stores/index.ts";
// 匯入組件
import Header from "../components/layout/Header";
import NavMenu from "../components/layout/NavMenu";
import { CSSTransition } from "react-transition-group";

function DefaultLayout() {
  // 全域狀態auth
  const auth = useSelector((state: RootState) => state.auth.isMember);

  // 動態路由
  const navigate = useNavigate();
  const location = useLocation();

  // 控制 Loading 顯示的狀態
  const [isLoading, setIsLoading] = useState(true);

  // 如果沒登入就被踢回登入頁面
  useEffect(() => {
    if (!auth) {
      navigate("login");
    }
  }, [navigate, auth]);

  // 監聽路由變化，顯示 Loading 並設定 0.3 秒後隱藏
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex flex-col min-h-[100vh] m-[0_auto]">
      <Header />
      <div className="flex flex-1">
        <NavMenu />
        <CSSTransition
          in={isLoading}
          timeout={300}
          classNames={"fade"}
          unmountOnExit={false}
        >
          <Outlet />
        </CSSTransition>
      </div>
    </div>
  );
}

export default DefaultLayout;
