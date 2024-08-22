"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import type { DatePickerProps, GetProps, MenuProps } from 'antd';
import { message, DatePicker, Dropdown, Space, Input, Form, Button, Modal, Popconfirm } from 'antd';
import { CaretDownOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Image from "next/image";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

type Visitor = {
    id:         string;
    name:       string;
    purpose:    string;
    contact:    string;
    entry_time: string;
    exit_time:  string;
    status:     string;
    approver:   string | null;
    approver_id:number;
    qr_code:    string;
    date:       string;
    scan_count: number;
};

const { Search } = Input;
const { RangePicker } = DatePicker;

const VisitorList: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [totalCount, setTotalCount] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedDateRange, setSelectedDateRange] = useState<[string, string]>(['', '']);


    // State for modal
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false);
    const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null);
    const [form] = Form.useForm();

    // Show the update modal
    const showUpdateModal = (visitor: Visitor) => {
        setCurrentVisitor(visitor);
        form.setFieldsValue(visitor);   // Overide the field
        setIsUpdateModalVisible(true);
    };

    // Show the detail modal
    const showDetailsModal = (visitor: Visitor) => {
        setCurrentVisitor(visitor);
        setIsDetailsModalVisible(true);
    };
    
    const statusMenu: MenuProps['items'] = [
        {
          key: 'all',
          label: 
            <p className={`text-blue-700 font-semibold ${fontClass}`}>
                {
                    lang === Languages.KH
                    ? TRANSLATIONS[Languages.KH].all
                    : TRANSLATIONS[Languages.EN].all
                }
            </p>,
          onClick: () => handleStatusChange('all'),
        },
        {
          key: 'approved',
          label: 
            <p className={`text-green-700 font-semibold  ${fontClass}`}>
                {
                    lang === Languages.KH
                    ? TRANSLATIONS[Languages.KH].approve
                    : TRANSLATIONS[Languages.EN].approve
                }
          </p>,
          onClick: () => handleStatusChange('approved'),
        },
        {
          key: 'rejected',
          label: 
            <p className={`text-[#FF0000] font-semibold  ${fontClass}`}>
                {
                    lang === Languages.KH
                    ? TRANSLATIONS[Languages.KH].reject
                    : TRANSLATIONS[Languages.EN].reject
                }
            </p>,
          onClick: () => handleStatusChange('rejected'),
        },
        {
          key: 'pending',
          label: 
            <p className={`text-slate-900 font-semibold  ${fontClass}`}>
                {
                    lang === Languages.KH
                    ? TRANSLATIONS[Languages.KH].pending
                    : TRANSLATIONS[Languages.EN].pending
                }
            </p>,
          onClick: () => handleStatusChange('pending'),
        },
      ];

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        setLoading(true);
        fetchVisitors(searchQuery, status);
    };

    // get visitor by status, or by date
    const fetchVisitors = async (query = '', status = '', startDate = '', endDate = '') => {
        try {
            const params: { name?: string; status?: string; start_date?: string; end_date?: string } = {};
            if (query) params.name = query;
            if (status && status !== 'all') params.status = status;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
    
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log('Fetch response:', response.data);
            const { total_visitor, visitors } = response.data;
    
            if (total_visitor === 0) {
                setNotFoundMessage('Visitor not found');
            } else {
                setNotFoundMessage(null);
            }
    
            setTotalCount(total_visitor);
            setVisitors(visitors);
        } catch (err) {
            setError('Failed to fetch visitors');
        } finally {
            setLoading(false);
        }
    };
          
    const onSearch = (value: string) => {
        setSearchQuery(value);
        setLoading(true);
        fetchVisitors(value, statusFilter);
    };
    
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(visitors); // Convert JSON data to worksheet
        const wb = XLSX.utils.book_new(); // Create a new workbook and add the worksheet
        XLSX.utils.book_append_sheet(wb, ws, "Visitors");
        XLSX.writeFile(wb, "visitor_list.xlsx"); // Write workbook to a file and trigger download
    };

    const updateStatus = async (visitorId: string, newStatus: string) => {
        try {
            // Define the payload based on the new status
            const payload = newStatus === 'pending'
                ? { status: newStatus, approver: null }
                : { status: newStatus };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${visitorId}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            if (response.status === 200) {
                setVisitors(prevVisitors => prevVisitors.map(visitor =>
                    visitor.id === visitorId ? { ...visitor, status: newStatus, approver: newStatus === 'pending' ? null : visitor.approver } : visitor
                ));
                message.success(`Status updated to ${newStatus}`);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            message.error('Failed to update status');
        }
    };

    const deleteVisitor = async (visitorId: string) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${visitorId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            if (response.status === 200) {
                setVisitors(prevVisitors => prevVisitors.filter(visitor => visitor.id !== visitorId));
                message.success('Visitor deleted successfully');
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to delete visitor:', error);
            message.error('Failed to delete visitor');
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${currentVisitor?.id}`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            if (response.status === 200) {
                setVisitors(prevVisitors => prevVisitors.map(visitor =>
                    visitor.id === currentVisitor?.id ? { ...visitor, ...values } : visitor
                ));
                message.success('Visitor updated successfully');
                setIsUpdateModalVisible(false);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            message.error('Failed to update visitor');
        }
    };
    
    const getStatusMenuItems = (visitorId: string) => [
        {
            label: 
                <button 
                    onClick={() => updateStatus(visitorId, 'approved')} 
                    className={`text-green-700 font-semibold ${fontClass}`}>
                    {
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].approve
                        : TRANSLATIONS[Languages.EN].approve
                    }
                </button>,
            key: 'approved',
        },
        {
            label: 
                <button 
                    onClick={() => updateStatus(visitorId, 'rejected')} 
                    className={`text-[#FF0000] font-semibold ${fontClass}`}>
                    {
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].reject
                        : TRANSLATIONS[Languages.EN].reject
                    }
                </button>,
            key: 'rejected',
        },
        {
            label: 
                <button 
                    onClick={() => updateStatus(visitorId, 'pending')} 
                    className={`text-slate-900 font-semibold ${fontClass}`}>
                    {
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].pending
                        : TRANSLATIONS[Languages.EN].pending
                    }
                </button>,
            key: 'pending',
        },
    ];
    
    const onDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        console.log('Dates:', dates); // Log the date objects
        console.log('Date Strings:', dateStrings); // Log the date strings
    
        if (dateStrings[0] && dateStrings[1]) {
            setStartDate(dateStrings[0]);
            setEndDate(dateStrings[1]);
            setSelectedDateRange(dateStrings); // Update the selectedDateRange state
        } else {
            setStartDate(null);
            setEndDate(null);
            setSelectedDateRange(dateStrings); // Reset the selectedDateRange state
        }
    };
    
    const onSubmit = async () => {
        console.log('Selected Date Range:', selectedDateRange); // Log the date range state
    
        const [start, end] = selectedDateRange;
        console.log('Submitting with:', { start, end }); // Log the dates being submitted
    
        if (!start || !end) {
            message.error("Please select a valid date range.");
            return;
        }
    
        setLoading(true);
        await fetchVisitors(searchQuery, statusFilter, start, end);
    };

    useEffect(() => {
        fetchVisitors();
    }, []);  
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-rose-500 mt-[10px]">{error}</p>;

    return (
        <>
            <div className="flex mt-[15px] md:justify-end md:mt-0">
                <div className="flex flex-col gap-3 md:flex-row w-full md:justify-end">
                    <button
                        className="text-[14px] bg-[#EEBA0B] text-white hover:bg-[#DDAA00] rounded-md shadow-md font-medium px-3 py-1"
                        onClick={handleExport}
                    >
                        Export to Excel
                    </button>
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={onDateRangeChange}
                        onOk={onSubmit}
                        className="h-auto md:w-[30%] w-full"
                    />
                    <Search
                        placeholder="Visitor search"
                        onSearch={onSearch}
                        value={searchQuery} // Set the input value to the state
                        onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                        className="text-slate-950 hover:border-[#EEBA0B] w-full md:w-[20%]"
                    />
                </div>
            </div>

            <div className={`container mx-auto overflow-x-auto ${fontClass}`}>
                <div className="min-w-[900px] bg-gray-100 rounded-lg mt-[15px]">
                    <div className="flex bg-gray-200 p-[10px] rounded-t-lg shadow-10 header text-[17px]">
                        <p className="w-[5%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].id
                                : TRANSLATIONS[Languages.EN].id
                            }
                        </p>
                        <p className="w-[15%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].fullName
                                : TRANSLATIONS[Languages.EN].fullName
                            }
                        </p>
                        <p className="w-[15%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].purpose
                                : TRANSLATIONS[Languages.EN].purpose
                            }
                        </p>
                        <p className="w-[15%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].contact
                                : TRANSLATIONS[Languages.EN].contact
                            }
                        </p>
                        <p className="w-[10%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].entry_time
                                : TRANSLATIONS[Languages.EN].exit_time
                            }
                        </p>
                        <p className="w-[10%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].exit_time
                                : TRANSLATIONS[Languages.EN].exit_time
                            }
                        </p>
                        <p className="w-[10%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].approver
                                : TRANSLATIONS[Languages.EN].approver
                            }
                        </p>
                        <p className="w-[10%] font-semibold flex items-center">
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].status
                                : TRANSLATIONS[Languages.EN].status
                            }
                        </p>
                        <p className="w-[15%] flex justify-center">
                            <Dropdown menu={{ items: statusMenu }} trigger={['click']}>
                                <Button className={`font-semibold ${fontClass}`}>
                                    {
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].filterStatus
                                        : TRANSLATIONS[Languages.EN].filterStatus
                                    }
                                    <CaretDownOutlined />
                                </Button>
                            </Dropdown>
                        </p>
                    </div>
                    {notFoundMessage ? (
                        <p className="text-red p-2">{notFoundMessage}</p>
                    ) : (
                        <ul className="">
                            {visitors.map((visitor) => (
                                <li key={visitor.id} className="flex items-center p-2 hover:bg-gray-50 py-2 border-b-[2px] border-slate-900 border-opacity-20">
                                    <p className="w-[5%]">{visitor.id}. </p>
                                    <p className="w-[15%] cursor-pointer" onClick={(e) => { e.preventDefault(); showDetailsModal(visitor); }}>{visitor.name}</p>
                                    <div className="w-[15%]">
                                        <p className="truncate pr-4">{visitor.purpose}</p>
                                    </div>
                                    <p className="w-[15%]">{visitor.contact || 'N/A'}</p>
                                    <p className="w-[10%]">{visitor.entry_time}</p>
                                    <p className="w-[10%]">{visitor.exit_time}</p>
                                    <p className="w-[10%]">{visitor.approver || 'N/A'}</p>
                                    <div className="w-[10%] font-bold">
                                        <Dropdown
                                            menu={{ items: getStatusMenuItems(visitor.id) }}
                                            trigger={['click']}
                                            className="py-1 rounded-[5px] hover:cursor-pointer shadow-2 hover:bg-slate-300 w-[100%] flex justify-between"
                                        >
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space className={`text-[14px] ${getStatusTextColor(visitor.status)} w-[100%] flex justify-between px-3`}>
                                                    {visitor.status}
                                                    <CaretDownOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>
                                    <div className="w-[15%] flex justify-center gap-2 items-center ">
                                        <a href="#" onClick={(e) => { e.preventDefault(); showUpdateModal(visitor); }}>
                                            <EditOutlined className="text-blue-600 text-[17px]" />
                                        </a>
                                        <Popconfirm
                                            title="Delete the visitor"
                                            description="Are you sure you want to delete this visitor?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => deleteVisitor(visitor.id)}
                                            okButtonProps={{
                                                style: { backgroundColor: '#EEBA0B', borderColor: '#EEBA0B' },
                                            }}
                                        >
                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                <DeleteOutlined className="text-red text-[17px]" />
                                            </a>
                                        </Popconfirm>
                                        <a href="#" onClick={(e) => { e.preventDefault(); showDetailsModal(visitor); }}>
                                            <FaRegEyeSlash className="text-[18px]"/>
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
            {/* Modal for updating visitor details */}
            <Modal
                title= {
                    <span className={fontClass}>{
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].visitorUpdate
                        : TRANSLATIONS[Languages.EN].visitorUpdate
                    }</span> 
                }
                open={isUpdateModalVisible}
                onOk={handleUpdate}
                onCancel={() => setIsUpdateModalVisible(false)}
                okText="Update"
                footer={null}
                className="ml-[42%] mt-[-50px]"
            >
                {/* <p className="text-center font-semibold text-[20px]">Update Visitor</p> */}
                <Form
                    form={form}
                    initialValues={currentVisitor|| {}}
                    onFinish={handleUpdate}
                >
                    <label>Name</label>
                    <Form.Item name="name">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label >Purpose</label>
                    <Form.Item name="purpose">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label>Contact</label>
                    <Form.Item name="contact">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label>Scan count</label>
                    <Form.Item name="scan_count">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label>Date</label>
                    <Form.Item name="date">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label>Entry Time</label>
                    <Form.Item name="entry_time">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <label>Exit Time</label>
                    <Form.Item name="exit_time">
                        <Input className="hover:border-slate-950"/>
                    </Form.Item>
                    <div className="w-full flex justify-end gap-2">
                        <Button 
                            htmlType="submit" 
                            className="w-full"
                            style={{
                                backgroundColor: '#EEBA0B',
                                borderColor: '#EEBA0B',
                                color: 'white',
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
                            Update
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Details Modal */}
            <Modal
                title={
                    <span className={fontClass}>{
                        lang === Languages.KH
                        ? TRANSLATIONS[Languages.KH].visitorDetail
                        : TRANSLATIONS[Languages.EN].visitorDetail
                    }</span> 
                }
                open={isDetailsModalVisible} // Ensure this is the correct state
                onOk={() => setIsDetailsModalVisible(false)}
                onCancel={() => setIsDetailsModalVisible(false)}
                footer={null}
                className="ml-[42%] mt-[-50px]"
            >   
                {currentVisitor ? (
                    <div className={`flex flex-col text-[16px] ${fontClass}`}>
                        <div className="gap-[10px] justify-center w-full m-auto">
                            <div className="flex py-2">
                                <p className="w-[25%]">
                                    <strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].fullName
                                        : TRANSLATIONS[Languages.EN].fullName
                                    }</strong> 
                                </p>
                                <p>{currentVisitor.name}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].purpose
                                        : TRANSLATIONS[Languages.EN].purpose
                                    }</strong> </p>
                                <p className="max-w-[75%]">{currentVisitor.purpose}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].contact
                                        : TRANSLATIONS[Languages.EN].contact
                                    }</strong> </p>
                                <p>{currentVisitor.contact || 'N/A'}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].entry_time
                                        : TRANSLATIONS[Languages.EN].entry_time
                                    }</strong> </p>
                                <p>{currentVisitor.entry_time}</p>
                            </div> 
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].exit_time
                                        : TRANSLATIONS[Languages.EN].exit_time
                                    }</strong> </p>
                                <p>{currentVisitor.exit_time}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].approver
                                        : TRANSLATIONS[Languages.EN].approver
                                    }</strong> </p>
                                <p>{currentVisitor.approver || 'N/A'}</p>
                            </div>
                            <div className="flex py-2">
                                <p className={`w-[25%]`}><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].status
                                        : TRANSLATIONS[Languages.EN].status
                                    }</strong> </p>
                                <p className={getStatusTextColor(currentVisitor.status)} >{currentVisitor.status}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>{
                                        lang === Languages.KH
                                        ? TRANSLATIONS[Languages.KH].date
                                        : TRANSLATIONS[Languages.EN].date
                                    }</strong> </p>
                                <p>{currentVisitor.date}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%]"><strong>QR Code</strong></p>
                                <Image
                                    // src={`http://localhost:8000/${currentVisitor.qr_code}`}
                                    src={`${currentVisitor.qr_code}`}
                                    alt={`${currentVisitor.name}'s QR code`}
                                    width={1000} 
                                    height={1000}
                                    className="max-w-[75%] bg-red border-2 border-slate-950 p-[-100px] rounded-md"
                                    priority    
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-rose-500">No details available</p>
                )}
            </Modal>
        </>
    );
};

const getStatusTextColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'text-green-700';
        case 'rejected':
            return 'text-[#FF0000]';
        case 'pending':
            return 'text-slate-900';
        default:
            return 'text-gray-500';
    }
};

export default VisitorList;
