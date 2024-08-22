"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

type User = {
    id:     string;
    name:   string;
    email:  string;
    role:   string;
    contact:string;
    bio:    string;
    avatar: string;
}

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the hidden file input
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('No token found');

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employee/${user.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setUser(res.data.employee);
                message.success('Avatar updated successfully');
            }
        } catch (error) {
            message.error('Failed to update avatar');
            setError((error as Error).message);
        }
    };
    
    useEffect(() => {
        const getMe = async () => {
            const token = localStorage.getItem('access_token');
        
            if (!token) {
                router.push('/login');
                return;
            }
        
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employee/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch user data');
                }
        
                const data = await res.json();
                setUser(data.user);
                form.setFieldsValue(data.user);
        
            } catch (error) {
                setError((error as Error).message);
            }
        };

        getMe();
    }, [router, form]);

    const handleUpdate = async (values: any) => {
        const token = localStorage.getItem('access_token');
        if (!token || !user) return;
    
        try {
            const formData = new FormData();
            formData.append('name', values.name || user.name);
            formData.append('contact', values.contact || user.contact);
            formData.append('bio', values.bio || user.bio);
            formData.append('avatar', values.avatar || user.avatar);
    
            const file = fileInputRef.current?.files?.[0];
            if (file) {
                formData.append('avatar', file);
            }
    
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employee/${user.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (res.status === 200) {
                setUser(res.data.employee);
                setIsModalVisible(false);
                message.success('Profile updated successfully');
            }
        } catch (error) {
            message.error('Failed to update profile');
            setError((error as Error).message);
        }
    };    
    
    return (
        <>
            {error && <div className="text-red-500">Error: {error}</div>}
            {user ? (
                <div className="p-6 w-[80%] mx-auto bg-white shadow-md rounded mt-10">
                    <div className='w-full flex justify-end'>
                        <Button 
                            className='text-white bg-[#EEBA0B] py-4 px-5 font-medium text-[14px]' 
                            onClick={() => setIsModalVisible(true)}
                            style={{
                                backgroundColor: '#EEBA0B',
                                borderColor: '#EEBA0B',
                                color: 'white',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#DDAA00';
                                e.currentTarget.style.borderColor = '#DDAA00';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#EEBA0B';
                                e.currentTarget.style.borderColor = '#EEBA0B';
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                    
                    <div className="m-auto mb-4 w-full flex justify-center">
                        {user.avatar ? (
                            <div onClick={handleImageClick} className="cursor-pointer">
                                <Image
                                    src={`http://localhost:8000/${user.avatar}`}
                                    alt={`${user.name}'s avatar`}
                                    width={1920} 
                                    height={1080}
                                    className="w-50 h-50 rounded-full object-cover shadow-14 border-4 border-slate-200"
                                    priority
                                />
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <span>No Avatar</span>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-[20px] text-center'>
                        <div>
                            <p><strong>Email</strong></p>
                            <p>{user.email}</p>
                        </div>
                        
                        <div>
                            <p><strong>Role</strong></p>
                            <p>{user.role}</p>
                        </div>

                        <div>
                            <p><strong>Contact</strong></p>
                            <p>{user.contact || ''}</p>
                        </div>

                        <div>
                            <p><strong>Bio</strong></p>
                            <p className='text-justify'>{user.bio || ''}</p>
                        </div>
                    </div>

                    {/* Modal for Edit Profile */}
                    <Modal
                        title="Edit Profile"
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                        className='lg:ml-[42%]'
                    >
                        <Form
                            form={form} // Pass the form instance here
                            layout="vertical"
                            onFinish={handleUpdate}
                            encType="multipart/form-data"
                        >
                            <Form.Item label="Name" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Contact" name="contact">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Bio" name="bio">
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item 
                                label="Avatar" 
                                name="avatar"
                                valuePropName="file"
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture"
                                    beforeUpload={() => false} // Prevents auto-upload
                                >
                                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button  
                                    className='w-full bg-[#EEBA0B] text-white font-medium' 
                                    htmlType="submit"
                                    style={{
                                        backgroundColor: '#EEBA0B',
                                        borderColor: '#EEBA0B',
                                        color: 'white',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#DDAA00';
                                        e.currentTarget.style.borderColor = '#DDAA00';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#EEBA0B';
                                        e.currentTarget.style.borderColor = '#EEBA0B';
                                    }}
                                    >
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </>
    );
};

export default ProfilePage;
