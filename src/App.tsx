// router
import Routes from "./router";
// 匯入圖片
import mobileImg from "./assets/images/noMobile.png";

function App() {
  return (
    <div>
      <div
        className={`flex justify-center items-center bg-[#E8F0FF] w-full h-screen xl:hidden overflow-auto`}
      >
        <img src={mobileImg} alt="請使用電腦瀏覽" />
      </div>
      <div className={`hidden xl:block`}>
        <Routes />
      </div>
    </div>
  );
}

export default App;
