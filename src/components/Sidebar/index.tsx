"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { TbUsersGroup } from "react-icons/tb";
import { Languages, TRANSLATIONS } from "@/utils/translate";
import { 
  ArrowLeftOutlined,
  CameraOutlined,
  IdcardOutlined,
  ProductOutlined,
  TeamOutlined, 
  TruckOutlined } from "@ant-design/icons";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: (
          <ProductOutlined />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].dashboard
            : TRANSLATIONS[Languages.EN].dashboard,
        route: "/",
      },
      {
        icon: (
          <TbUsersGroup />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].users
            : TRANSLATIONS[Languages.EN].users,
        route: "/users",
      },
      {
        icon: (
          <TeamOutlined />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].visitors
            : TRANSLATIONS[Languages.EN].visitors,
        route: "/visitors",
      },
      {
        icon: (
          <TruckOutlined />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].vehicles
            : TRANSLATIONS[Languages.EN].vehicles,
        route: "/vehicle",
      },
      {
        icon: (
          <CameraOutlined />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].scan
            : TRANSLATIONS[Languages.EN].scan,
        route: "/scan",
      },
      {
        icon: (
          <IdcardOutlined />
        ),
        label:
          lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].pass
            : TRANSLATIONS[Languages.EN].pass,
        route: "/pass",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  // Conditionally add the Khmer font class
  const fontClass = lang === Languages.KH ? "khmer-font" : "";

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${fontClass}`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 shadow-md h-[80px]">
          <Link href="/" className="flex justify-center items-center w-[80%] text-black">
            <Image
              width={160}
              height={120}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              className="w-[400px] h-auto text-balck bg-balck"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <ArrowLeftOutlined />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="flex-1 h-[100%]">

          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            {/* <!-- Sidebar Menu --> */}
            <nav className="px-[20px] mt-[30px]">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>

                  <ul className="mb-6 flex flex-col gap-[20px]">
                    {group.menuItems.map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                        className="bg-green-500"
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            {/* <!-- Sidebar Menu --> */}
          </div>
        </div>
        
      </aside>
      
    </ClickOutside>
  );
};

export default Sidebar;
