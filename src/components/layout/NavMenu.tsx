// 原生方法
import { useState } from "react";
// router
import { useLocation, useNavigate } from "react-router-dom";
// ui kit
import { Menu, Button } from "@arco-design/web-react";

// ui kit
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

function NavMenu() {
  // nav開關狀態
  const [collapse, setCollapse] = useState(false);

  // 當前路由方法
  const location = useLocation();

  /** @const {string} 當前路由path */
  const currentPathName = location.pathname;

  // 動態路由
  const navigate = useNavigate()

  function isActive (path: string | undefined) {
    if(currentPathName === path) return 'text-[#3A57E8]';
  }

  // nav選單資料
  const navMenuTree = [
    {
      mainItem: "預約/查詢班次座位",
      icon: "icon-[solar--widget-bold-duotone]",
      path: "/",
      subMenu: [],
    },
    {
      mainItem: "訂單記錄",
      icon: "icon-[solar--clipboard-text-bold-duotone]",
      path: "/orderHistory",
      subMenu: [],
    },
    {
      mainItem: "會員列表",
      icon: "icon-[solar--smile-circle-bold-duotone]",
      path: "/memberList",
      subMenu: [],
    },
    {
      mainItem: "統計圖表",
      icon: "icon-[solar--chart-2-bold-duotone]",
      path: '1',
      subMenu: [
        { subItem: "路線時段預約售票數量統計(發車時間)", path: "/routesCharts" },
        { subItem: "業者路線預約數量統計", path: "/industryCharts" },
      ],
    },
    {
      mainItem: "營運報表",
      icon: "icon-[solar--hamburger-menu-bold-duotone]",
      path: '2',
      subMenu: [
        { subItem: "每日結帳明細查詢", path: "/checkoutDetails" },
        { subItem: "每日結帳報表", path: "/checkoutReport" },
      ],
    },
  ];

  // 路由導航
  const navigation = (key: string) => {
    navigate(key)
  };

  return (
    <div className=" flex flex-col border-r border-solid border-[#E4E6EF] justify-between items-center  ">
      <Menu
        style={{ width: 200, borderRadius: 4 }}
        theme="light"
        collapse={collapse}
        onClickMenuItem={navigation}
        // defaultOpenKeys={["0"]}
        // defaultSelectedKeys={["0_2"]}
      >
        {navMenuTree.map((item) => (
          <div key={item.path}>
            {/* 無子選單nav */}
            {item.subMenu.length === 0 && (
              <MenuItem key={item.path}>
                <div className={`flex items-center gap-[16px] group `}>
                  <div className={` flex items-center w-[20px] h-[20px]  `}>
                    <span
                      className={` w-[20px] h-[20px] group-hover:text-[#3A57E8] ${item.icon}
                      ${isActive(item.path)} `}
                    ></span>
                  </div>
                  <p className={`group-hover:text-[#3A57E8] ${isActive(item.path)}`}>
                    {item.mainItem}
                  </p>
                </div>
              </MenuItem>
            )}

            {/* 有子選單nav */}
            {item.subMenu.length !== 0 && (
              <SubMenu
                key={item.mainItem}
                title={
                  <div className={`flex items-center gap-[16px] group`}>
                    <div>
                      <span
                        className={`${item.icon} w-[20px] h-[20px] group-hover:text-[#3A57E8]  `}
                      ></span>
                    </div>
                    <p className={`group-hover:text-[#3A57E8]`}>
                      {item.mainItem}
                    </p>
                  </div>
                }
              >
                {item.subMenu.map((subMenu) => (
                  <MenuItem key={subMenu.path} className={`group`}>
                    <p className={`group-hover:!text-[#3A57E8]`}>
                      {subMenu.subItem}
                    </p>
                  </MenuItem>
                ))}
              </SubMenu>
            )}
          </div>
        ))}
      </Menu>
      <Button
        onClick={() => setCollapse(!collapse)}
        className={`w-[40px] h-[40px] !bg-[#F2F3F5] m-[12px] flex justify-center items-center ${
          collapse ? "self-center" : " self-end"
        } `}
      >
        {!collapse ? (
          <div className={` w-[24px] h-[24px]`}>
            <span className="icon-[solar--send-square-bold-duotone] w-[24px] h-[24px] text-[#485781] "></span>
          </div>
        ) : (
          <div className={` w-[24px] h-[24px]`}>
            <span className="icon-[solar--recive-square-bold-duotone] w-[24px] h-[24px] text-[#485781] "></span>
          </div>
        )}
      </Button>
    </div>
  );
}

export default NavMenu;
