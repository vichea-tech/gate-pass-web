import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname || (pathname === '/' && item.route === '/')) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <>
      <li className="dark:text-white">
        <Link
          href={item.route}
          onClick={handleClick}
          className={`dark:text-white ${isItemActive ? "bg-[#EEBA0B] text-white shadow-4" : ""} group relative flex items-center gap-[10px] rounded-[6px] px-4 py-3 text-black hover:bg-grey font-medium`}
        >
          {item.icon}
          {item.label}
        </Link>
      </li>
    </>
  );
};

export default SidebarItem;
