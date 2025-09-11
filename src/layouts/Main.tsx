import DragBar from "../components/dragBar";
import { Menu } from "@arco-design/web-react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { IconApps, IconSafe, IconFire, IconClose, IconMinus } from "@arco-design/web-react/icon";
import { useState, useEffect } from "react";
import { api } from "../commands";

const menus = [
  {
    key: '0',
    label: '项目',
    path: '/project',
    icon: <IconApps />
  },
  {
    key: '1',
    label: '工时',
    path: '/work',
    icon: <IconSafe />
  },
]

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentMenuKey = () => {
    const currentMenu = menus.find(menu => menu.path === location.pathname);
    return currentMenu ? currentMenu.key : '0';
  };
  const [selectKeys, setSelectKeys] = useState([getCurrentMenuKey()]);

  useEffect(() => {
    const currentKey = getCurrentMenuKey();
    setSelectKeys([currentKey]);
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    const activeMenu = menus.find(menu => menu.key === key);
    setSelectKeys([key]);
    if (activeMenu?.path) {
      navigate(activeMenu.path);
    }
  }

  const handleCloseClick = () => {
    api.closeWindow();
  };
  const handleMinSizeClick = () => {
    api.minSizeWindow();
  }

  return (
 
    <div className="w-full h-full">
      <div className="flex w-full h-[50px] bg-[#fff] border-b-[1px] border-[#e4e4e7] box-border select-none">
        <div className="h-[49px] w-[200px]  flex items-center pl-4 font-bold text-lg">
          Doge
        </div>
        <div className="flex-1 ">
          <DragBar />
        </div>
        <div className="flex h-[49px] items-center">
          <div onClick={handleMinSizeClick} className="h-[49px] w-[49px] flex justify-center items-center cursor-pointer hover:bg-[#f9f9f9] border-[#fff] border-b-[1px] ">
            <IconMinus className="text-[1.2rem]" />
          </div>
        </div>
        <div className="flex h-[49px] items-center" onClick={handleCloseClick}>
          <div className="h-[49px] w-[49px] flex justify-center items-center cursor-pointer hover:bg-[#f9f9f9] border-[#fff] border-b-[1px] ">
            <IconClose className="text-[1.2rem]" />
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-50px)] flex  box-border">
        <Menu className="border-r-[1px] border-[#e4e4e7] box-border" selectedKeys={selectKeys} style={{ width: 200 }} mode="pop" hasCollapseButton onClickMenuItem={(key) => { handleMenuClick(key) }}>
          {
            menus.map((menu) => (
              <Menu.Item key={menu.key}>
                {menu.icon}
                {menu.label}
              </Menu.Item>
            ))
          }
        </Menu>
        <div className="flex-1 bg-[#fff] h-[calc(100vh-50px)] overflow-auto box-border">
          <Outlet />
        </div>
      </div>
    </div>

  );
}