import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from 'react';
import { TbLogout2 } from "react-icons/tb";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { PiUserCircleLight } from "react-icons/pi";
import axios from "axios";
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center dark:text-white light:black-2"
        href="#"
      >
        <PiUserCircleLight size={35}/>
        
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
            className={`${fontClass} absolute right-0 mt-3 flex w-52.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark z-50 text-[10px] font-bold`}
        >
            <ul className={` flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark`}>
                <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3.5 text-md font-sm duration-300 ease-in-out hover:text-[#EEBA0B] lg:text-base"
                    >
                      <UserOutlined />
                      {
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].myProfile
                        : TRANSLATIONS[Languages.EN].myProfile
                      }
                    </Link>
                </li>
                <li>
                    <Link
                        href="#"
                        className="flex items-center gap-3.5 text-md font-sm duration-300 ease-in-out hover:text-[#EEBA0B] lg:text-base"
                    >
                        <SettingOutlined />
                        {
                          lang === Languages.KH
                          ? TRANSLATIONS[Languages.KH].accountSetting
                          : TRANSLATIONS[Languages.EN].accountSetting
                        }
                    </Link>
                </li>
            </ul>
            <button  
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-semibold duration-300 ease-in-out hover:text-[#EEBA0B] lg:text-base">
                <TbLogout2 size={20}/>
                {
                  lang === Languages.KH
                  ? TRANSLATIONS[Languages.KH].logout
                  : TRANSLATIONS[Languages.EN].logout
                }
            </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
