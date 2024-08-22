"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ChangeLanguage() {
    const [isKhFlag, setIsKhFlag] = useState(false);
    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setIsKhFlag(storedLanguage !== "en");
        }
    }, []);

    const handleClick = () => {
        if (isKhFlag) {
            localStorage.setItem("language", "en");
        } else {
            localStorage.setItem("language", "kh");
        }
        setIsKhFlag(!isKhFlag);
        window.location.reload(); // reload the page after click on the language button
    };

    return (
        <div onClick={handleClick} className="cursor-pointer flex">
            {isKhFlag ? (
                <Image
                    width={2000}
                    height={2000}
                    src={"/images/flage/kh_flage.png"}
                    alt="Flag"
                    className="text-black bg-black rounded-[100px] w-7 h-7"
                    priority
                />
            ) : (
                <Image
                    width={2000}
                    height={2000}
                    src={"/images/flage/uk_flage.png"}
                    alt="Logo"
                    className="text-black bg-black rounded-[100px] w-7 h-7 "
                    priority
                />
            )}
        </div>
    );
}
