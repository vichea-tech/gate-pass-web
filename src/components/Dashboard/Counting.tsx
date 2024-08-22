"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import SearchBtn from "../Search/index";
import AssetCard from "../Asset/Card";
// import { AssetStatus } from '../../enums/AssetStatus';
import { CaretRightOutlined } from "@ant-design/icons";

const Counting = () => {
  const [activeButton, setActiveButton] = useState<string>("Counting");
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

  const [cards, setCards] = useState([
    { id: 1, image: "/images/product/chair.jpg", location: "Warehouse B", code: "A123", department: "ICT", room: "Room 101"}, //status: AssetStatus.NotYetCheck },
    { id: 2, image: "/images/product/chair.jpg", location: "Warehouse B", code: "A123", department: "ICT", room: "Room 101"}, //status: AssetStatus.NotYetCheck },
    { id: 3, image: "/images/product/chair.jpg", location: "Warehouse B", code: "A123", department: "ICT", room: "Room 101"}, //status: AssetStatus.NotYetCheck },
    { id: 4, image: "/images/product/chair.jpg", location: "Warehouse B", code: "A123", department: "ICT", room: "Room 101"}, //status: AssetStatus.NotYetCheck },
    { id: 5, image: "/images/product/chair.jpg", location: "Warehouse B", code: "A123", department: "ICT", room: "Room 101"}, //status: AssetStatus.NotYetCheck },
  ]);
  // const handleStatusChange = (id: number, newStatus: AssetStatus) => {
  //   setCards((prevCards) =>
  //     prevCards.map((card) =>
  //       card.id === id ? { ...card, status: newStatus } : card
  //     )
  //   );
  // };
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

      <div className="flex w-full justify-between">
        <div className="lg:w-[30%] md-w-[40%] sm:w-[70%]">
          <SearchBtn title={"Search for an asset"} />
        </div>
        <div>
          <button type="submit" className="bg-[#EEBA0B] h-full px-10 text-white rounded-[5px]">Submit</button>
        </div>
      </div>
      
      <div>
            {/* {cards.map((card) => (
                <AssetCard
                    key={card.id}
                    id={card.id}
                    image={card.image}
                    location={card.location}
                    code={card.code}
                    department={card.department}
                    room={card.room}
                    status={card.status}
                    onStatusChange={handleStatusChange}
                />
            ))} */}
        </div>

    </>
  );
};

export default Counting;
