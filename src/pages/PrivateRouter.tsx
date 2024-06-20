import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { RootState } from "../stores/index.ts";

const PrivateRouter = () => {
  // 動態路由
  const navigate = useNavigate();
  const location = useLocation();

  // 全域狀態auth
  const auth = useSelector((state: RootState) => state.auth.isMember);

  // 監聽路由變化，顯示 Loading 並設定 0.3 秒後隱藏
  useEffect(() => {
    if (
      (location.pathname === "/login" || location.pathname === "/Login") &&
      auth
    ) {
      navigate("/");
      return;
    }

    if (!auth) {
      navigate("/login");
    }
  }, [location.pathname, navigate, auth]);

  return <Outlet />;
};

export default PrivateRouter;
