import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";


function DefaultLayout() {

  return (
    <div className=" flex flex-col min-h-[100vh] max-w-[1920px] m-[0_auto]">
      <Header />
      <div className="flex-1 ">
       <Outlet />  
      </div>
    </div>
    
  );
}

export default DefaultLayout;
