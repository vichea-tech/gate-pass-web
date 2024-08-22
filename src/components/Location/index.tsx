import React from 'react';
import Link from 'next/link';

const ArrowBtn: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    viewBox="0 0 24 24"
    id="angle-right"
  >
    <path
      fill=""
      d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"
    />
  </svg>
);

const Location: React.FC<{ building: string; floor: number; room: string; code: string }> = ({
  building,
  floor,
  room,
  code,
}) => {
  return (
    <Link href="/room">
      <div className="bg-white rounded-[10px] max-h-full flex justify-between p-[20px] items-center shadow-2 text-black-2 mt-5 ">

        <div className="flex items-center gap-[300px]">
          <div>
            <p>
              <span className="text-[18px]">{building}</span> <br />
              Floor: {floor} {room}
            </p>
          </div>
          <div className="font-bold">Location Code: {code}</div>
        </div>

        <div>
          <ArrowBtn />
        </div>

      </div>
    </Link>
  );
};

export default Location;
