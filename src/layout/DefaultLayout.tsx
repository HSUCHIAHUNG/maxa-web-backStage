import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import NavMenu from "../components/layout/NavMenu";

function DefaultLayout() {
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
