import React from "react";
// import { AssetStatus } from "@/enums/AssetStatus";
import { CaretDownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { message, Space } from 'antd';

interface AssetCardProps {
    image: string;
    location: string;
    code: string;
    department: string;
    room: string;
    // status: AssetStatus;
    // onStatusChange: (id: number, newStatus: AssetStatus) => void;
    id: number;
}

const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

const AssetCard: React.FC<AssetCardProps> = ({id, image, location, code, department, room, }) => {

    // const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     onStatusChange(id, event.target.value as AssetStatus);
    // };

    return (
        <>
            <div className="asset-card flex items-center bg-white shadow-3 rounded-[10px] text-black-2 mt-[20px]">
                {/* <img className="rounded-s-xl w-[150px]"  src={image} alt={`${code} image`} /> */}
                <div className="flex w-full justify-between p-10">
                    <h2><b>Code</b>    <br />{code}</h2>
                    <p><b>Location</b> <br />{location}</p>
                    <p><b>Function</b> <br />{department}</p>
                    <p><b>Room</b>     <br />{room}</p>

                    <div className="dropdown-section">
                        <b><p>Status</p></b>
                        <div className="relative flex gap-10">
                            {/* <select
                                className="hover:cursor-pointer appearance-none bg-white border-[2px] border-gray-100 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm text-sm leading-tight focus:outline-none focus:border-[#EEBA0B] w-full max-w-xs"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                {Object.values(AssetStatus).map((statusValue) => (
                                    <option key={statusValue} value={statusValue}>
                                        {statusValue}
                                    </option>
                                ))}
                            </select> */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <CaretDownOutlined />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default AssetCard;