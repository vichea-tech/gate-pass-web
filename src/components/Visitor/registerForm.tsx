"use client";
import { Button, Form, Input, notification, Modal, TimePicker, DatePicker } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import ChangeLanguage from '../Header/ChangeLanguage';
import DarkModeSwitcher from '../Header/DarkModeSwitcher';
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

const RegisterForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Send form data to API
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor`, {
                ...values,
                entry_time: values.entry_time.format('YYYY-MM-DD HH:mm:ss'),
                exit_time: values.exit_time.format('YYYY-MM-DD HH:mm:ss')
            });

            form.resetFields();
            notification.success({
                message: 'Success',
                description: 'Visitor registered successfully!',
            });

            // Prepare QR code data
            const qrData = {
                id: response.data.id,
                name: values.name,
                contact: values.contact,
                purpose: values.purpose,
                entry_time: values.entry_time.format('YYYY-mm-dd HH:mm:ss'),
                exit_time: values.exit_time.format('YYYY-mm-dd HH:mm:ss'),
                approver: response.data.approver,
                status: values.status,
            };

            setQrCodeData(JSON.stringify(qrData)); // Convert data to a JSON string
            setIsModalVisible(true); // Show the modal
        } catch (error) {
            console.error('Failed to register visitor', error);
            notification.error({
                message: 'Error',
                description: 'Failed to register visitor',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <div className='flex justify-end gap-2 p-2'>
                <ChangeLanguage />
                <DarkModeSwitcher />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-5 bg-white 2xl:2-[30%] lg:w-[35%] md:w-[60%] m-auto sm:w-[70%] s:w-[90%]">
                <div className=''>
                    <Image 
                        className="flex justify-center items-center  h-auto"
                        width={130}
                        height={20}
                        src="/images/logo/logo.svg"
                        alt="Logo"
                        priority
                    />
                    <h1 className='text-center text-[25px] font-semibold mb-5 mt-5'>Register Form</h1>
                </div>
                
                <Form form={form} layout="vertical" onFinish={onSubmit} className={`space-y-4 font-semibold ${fontClass}`}>
                    <Form.Item
                        name="name"
                        label= {
                            <span className={fontClass}>
                                {lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].fullName
                                    : TRANSLATIONS[Languages.EN].fullName
                                }
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input the name!' }]}>
                        <Input placeholder="Full Name" className='custom-input py-2'/>
                    </Form.Item>

                    <Form.Item
                        name="contact"
                        label= {
                            <span className={fontClass}>
                                {lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].contact
                                    : TRANSLATIONS[Languages.EN].contact
                                }
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input the contact!' }]}>
                        <Input placeholder="Contact" className='custom-input py-2'/>
                    </Form.Item>
                    
                    <Form.Item
                        name="purpose"
                        label= {
                            <span className={fontClass}>
                                {lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].purpose
                                    : TRANSLATIONS[Languages.EN].purpose
                                }
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input the purpose!' }]}>
                        <Input placeholder="Purpose" className='custom-input py-2'/>
                    </Form.Item>

                    <Form.Item
                        name="entry_time"
                        label= {
                            <span className={fontClass}>
                                {lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].entry_time
                                    : TRANSLATIONS[Languages.EN].entry_time
                                }
                            </span>
                        }
                        rules={[{ required: true, message: 'Please select the entry time!' }]}>
                        <DatePicker showTime className='py-2 hover:border-slate-950'/>
                    </Form.Item>

                    <Form.Item
                        className='hover:border-slate-950'
                        name="exit_time"
                        label= {
                            <span className={fontClass}>
                                {lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].exit_time
                                    : TRANSLATIONS[Languages.EN].exit_time
                                }
                            </span>
                        }
                        rules={[{ required: true, message: 'Please select the exit time!' }]}
                        >
                        <DatePicker showTime  className='py-2 hover:border-slate-950'/>
                    </Form.Item>

                    <Form.Item className='w-[100%]'>
                        <div className="w-[100%] flex justify-between items-center">
                            <Button 
                                htmlType="reset" 
                                loading={loading} 
                                className="font-semibold hover:border-slate-950"
                                style={{
                                    backgroundColor: '#00000',
                                    color: 'black',
                                    borderRadius: '0.375rem',
                                    padding: '18px 20px',
                                }}  
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#000000';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '';
                                }}
                            >
                                <span className={fontClass}>
                                    {lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].resetForm
                                        : TRANSLATIONS[Languages.EN].resetForm
                                    }
                                </span>
                            </Button>
                            <Button 
                                htmlType="submit" 
                                loading={loading} 
                                className="font-semibold"
                                style={{
                                    backgroundColor: '#EEBA0B',
                                    color: 'white',
                                    borderRadius: '0.375rem',
                                    padding: '18px 28px',
                                    border: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#DDAA00'; // Change this to your desired hover color
                                    e.currentTarget.style.borderColor = '#DDAA00';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#EEBA0B'; // Revert to original color
                                    e.currentTarget.style.borderColor = '#EEBA0B';
                                }}
                            >
                                <span className={fontClass}>
                                    {lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].register
                                        : TRANSLATIONS[Languages.EN].register
                                    }
                                </span>
                            </Button>
                        </div>
                        
                    </Form.Item>
                </Form>

                <Modal
                    title="You can save to use it later."
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    footer={null}
                    className='text-center'
                >
                    <div className="flex justify-center py-10">
                        {qrCodeData && (
                            <QRCode value={qrCodeData} size={300} />
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default RegisterForm;
