"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    contact: string | null;
    bio: string | null;
    avatar: string | null;
}

const UserList: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const fontClass = lang === Languages.KH ? "khmer-font" : "";
    
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                // setError('No access token found.');
                router.push('/login');
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employee`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            
                const data = res.data;
                
                if (!data['Employee list']) throw new Error('Unexpected API response structure');

                setUsers(data['Employee list']);
            } catch (err) {
                setError(axios.isAxiosError(err) ? err.response?.data?.message : (err as Error).message);
            }
        };

        fetchUsers();
    }, [router]);

    if (error) return <div className='text-rose-500 mt-[10px]'>{error}</div>;
    
    if (!users || users.length === 0) return <div>No users found.</div>;

    return (
        <div className={`mt-10 overflow-x-auto ${fontClass} bg-transparent`}>
            <div className='min-w-[600px]'>
                <div className='header flex font-bold text-[18px] p-[10px] shadow-6 rounded-t-lg w-full'>
                    <p className='w-[20%]'>
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].username
                            : TRANSLATIONS[Languages.EN].username
                        }
                    </p>
                    <p className='w-[30%]'>
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].email
                            : TRANSLATIONS[Languages.EN].email
                        }
                    </p>
                    <p className='w-[20%]'>
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].contact
                            : TRANSLATIONS[Languages.EN].contact
                        }
                    </p>
                    <p className='w-[10%]'>
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].role
                            : TRANSLATIONS[Languages.EN].role
                        }
                    </p>
                </div>

                <div className='list'>
                    {users.map((user) => (
                        <li key={user.id} className='flex p-2 border-b-[2px] border-slate-900 border-opacity-20 w-full'>
                            <p className='w-[20%]'>{user.name}</p>
                            <p className='w-[30%]'>{user.email}</p>
                            <p className='w-[20%]'>{user.contact || 'N/A'}</p>
                            <p className='w-[10%]'>{user.role}</p>
                        </li>
                    ))}
                </div>
            </div>
        </div>


    );
};

export default UserList;