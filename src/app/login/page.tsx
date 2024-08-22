"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoginOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { saveTokens } from "@/utils/auth";
import axios from 'axios';
import { TbLogout } from "react-icons/tb";
import { Languages, TRANSLATIONS } from "@/utils/translate";
import ChangeLanguage from '@/components/Header/ChangeLanguage';
import DarkModeSwitcher from '@/components/Header/DarkModeSwitcher';

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Basic front-end validation
        if (!email) {
            setError('Email is required.');
            return;
        }
        if (!password) {
            setError('Password is required.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                { 
                    email, 
                    password 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;
                if (data.tokenData && data.tokenData.access_token) {
                    saveTokens(data.tokenData.access_token, data.tokenData.refresh_token);
                    router.push('/');
                } else {
                    setError('Access token not found in response.');
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorData = error.response?.data;
                setError(errorData?.message || 'Login failed.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12 text-black-2 font-semibold">
            <div className='flex justify-end gap-2 p-2 relative top-[-70px] right-5'>
                <ChangeLanguage />
                <DarkModeSwitcher />
            </div>
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md xl:max-w-[550px]">
                <Image
                    className="flex justify-center w-[70%] items-center m-auto"
                    width={160}
                    height={120}
                    src="/images/logo/logo.svg"
                    alt="Logo"
                    priority
                />
                <form className="px-5 py-7" onSubmit={handleSubmit}>
                    <div className="bg-transparent shadow-lg w-full rounded-lg divide-y divide-gray-200">
                        <div className={`px-5 py-7 ${fontClass}`}>
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">{
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].email
                                : TRANSLATIONS[Languages.EN].email
                            }</label>
                            <input
                                type="email"
                                className="border rounded-md px-3 py-2 mt-1 mb-5 text-sm w-full"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">{
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].password
                                : TRANSLATIONS[Languages.EN].password
                            }</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="border rounded-md px-3 py-2 mt-1 mb-5 text-sm w-full pr-10"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 py-4 h-fit"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>
                            {error && <p className="text-red text-sm mb-3">{error}</p>}
                            <button
                                type="submit"
                                className="text-white gap-[10px] bg-[#EEBA0B] hover:bg-[#DDAA00] w-full py-2.5 rounded-md text-sm shadow-sm hover:shadow-md flex justify-center mt-2 "
                            >
                                <TbLogout size={20} />
                                <span className="inline-block ml-[5px]">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].login
                                    : TRANSLATIONS[Languages.EN].login
                                }</span>
                            </button>  
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
