"use client"
import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";


const SearchButton: React.FC<{ title: string }> = ({ title }) => {
    const [cameraOpen, setCameraOpen] = useState(false);

    const handleCameraClick = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                setCameraOpen(true);
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                // Handle error, e.g., show a message to the user
            });
    };

    return (
        <>
            <div className="relative">
                <input
                    className="appearance-none border-[2px] pl-10 border-slate-600 hover:border-gray-400 transition-colors focus:border-[#EEBA0B] rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline text-black"
                    id="username"
                    type="text"
                    placeholder={title}
                />
                <div className="absolute right-4 inset-y-0 flex items-center">
                    <button
                        className="focus:outline-none"
                        onClick={handleCameraClick}>
                        <CameraOutlined />
                    </button>
                </div>

                <div className="absolute left-2 inset-y-0 flex items-center">
                    <SearchOutlined />
                </div>
            </div>

            {/* Conditional rendering of camera view */}
            {cameraOpen && (
                <div className="fixed top-0 left-0 w-full h-full z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                    <p className="text-white">Camera view or QR scanner can go here</p>
                </div>
            )}
        </>
    );
}

export default SearchButton;
