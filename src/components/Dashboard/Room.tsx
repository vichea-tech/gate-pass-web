"use client"
import React, { useState } from "react";
import { Metadata } from "next";
import { useRouter } from 'next/navigation';
import SearchBtn from "../Search/index";
import Location from "../Location/index";
import { CaretRightOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Room",
};

const Room = () => {
  const [activeButton, setActiveButton] = useState<string>("Room");
  const router = useRouter();

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    if (buttonName === "Room") {
      router.push('/room');
    } else if (buttonName === "Counting") {
      router.push('/counting');
    } else {
      router.push('/')
    }
  };
  const locations = [
    { id: 1, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 2, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 3, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 4, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 5, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 6, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 7, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
    { id: 8, building: 'Building 1', floor: 2, room: 'Room 2', code: 'OFL001' },
  ];
  
  return (
    <>
      <h1 className="text-black-2 text-[30px]">Dashboard</h1>
      {/* section change  */}
      <div className="w-[40%] flex gap-2 mt-[20px] mb-[20px] text-black-2">
        <button
          className={`${activeButton === "Dashboard" ? "font-bold" : ""}`}
          onClick={() => handleButtonClick("Dashboard")}>
          Dashboard
        </button>
        <CaretRightOutlined />
        <button
          className={`${activeButton === "Room" ? "font-bold" : ""}`}
          onClick={() => handleButtonClick("Room")}>
          Room
        </button>
        <CaretRightOutlined />
        <button
          className={`${activeButton === "Counting" ? "font-bold" : ""}`}
          onClick={() => handleButtonClick("Counting")}>
          Counting
        </button>
      </div>
      {/* section change  */}

      <div className="lg:w-[30%] md-w-[40%] sm:w-[70%]">
        <SearchBtn title={"Search for a location"} />
      </div>

      {locations.map(location => (
        <Location
          key={location.id}
          building={location.building}
          floor={location.floor}
          room={location.room}
          code={location.code}
        />
      ))}
    </>
  );
};

export default Room;
