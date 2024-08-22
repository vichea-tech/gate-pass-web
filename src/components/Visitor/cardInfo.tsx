'use client'
import React from 'react';
import { visitor } from '@/types/visitor';
import Image from 'next/image';
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";
type Props = {
    visitor: visitor;
};

const Card: React.FC<Props> = ({ visitor }) => {
    return (
        <div className="bg-white dark:bg-black-2 dark:text-white rounded-lg shadow-lg p-6 max-w-sm mx-auto my-auto">
            <Image
                className=" flex justify-center w-[70%] items-center m-auto my-3"
                width={160}
                height={120}
                src="/images/logo/logo.svg"
                alt="Logo"
                priority
            />
            <div className={`flex gap-10 justify-center ${fontClass}`} >
                <div className="space-y-2  flex flex-col gap-4 text-20 w-[100%]">
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].fullName
                                : TRANSLATIONS[Languages.EN].fullName
                            }
                        </p>
                        <p> {visitor.name} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].contact
                                : TRANSLATIONS[Languages.EN].contact
                            }
                        </p>
                        <p> {visitor.contact} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].purpose
                                : TRANSLATIONS[Languages.EN].purpose
                            }
                        </p>
                        <p className="max-w-[60%]"> {visitor.purpose} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].status
                                : TRANSLATIONS[Languages.EN].status
                            }
                        </p>
                        <p className={getStatusTextColor(visitor.status)}> {visitor.status} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].entry_time
                                : TRANSLATIONS[Languages.EN].entry_time
                            }
                        </p>
                        <p> {visitor.entry_time} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].exit_time
                                : TRANSLATIONS[Languages.EN].exit_time
                            }
                        </p>
                        <p> {visitor.exit_time} </p>
                    </div>
                    <div className="flex">
                        <p className="font-bold w-[40%]">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].approver
                                : TRANSLATIONS[Languages.EN].approver
                            }
                        </p>
                        <p> {visitor ? visitor.approver || 'NULL' : 'not approve yet.'} </p>
                    </div>
                    <Image
                        src={`${visitor.qr_code}`}
                        alt={`${visitor.name}'s QR code`}
                        width={1000} 
                        height={1000}
                        className="w-[100px] m-auto "
                        priority
                    />
                </div>
            </div>
            
        </div>
    );
};

const getStatusTextColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'text-green-700';
        case 'rejected':
            return 'text-[#FF0000]';
        case 'pending':
            return 'text-orange-500';
        default:
            return 'text-gray-500';
    }
};

export default Card;
