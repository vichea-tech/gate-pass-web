"use client"
import { Vehicle } from "@/types/vehicle";
import { Types } from "@/types/vehicleType";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Modal, Popconfirm, Form, InputNumber, Upload, Button, notification, message, Input  } from "antd";
import Image from "next/image";
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

const { Search } = Input;

type Props = {
    vehicle: Vehicle[];
    types: Types[]; 
};

const VehicleList: React.FC<Props> = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<Types[]>([]);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [isAddVehicleModalVisible, setIsAddVehicleModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(0);
    const vehiclesToDisplay = selectedType ? filteredVehicles : vehicles;
    const [form] = Form.useForm();
    const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Calculate the index ranges for the current page
    const itemsPerPage  = 10;
    const startIndex    = currentPage * itemsPerPage;
    const endIndex      = startIndex + itemsPerPage;
    const visibleTypes  = vehicleTypes.slice(startIndex, endIndex);

    const handleNext = () => {
        if ((currentPage + 1) * itemsPerPage < vehicleTypes.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const fetchVehicles = async (query = '') => {
        try {
            
            const params: { code?: string; } = {};
            if (query) params.code = query;

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                } 
            });
    
            const fetchedVehicles = response.data;
    
            // Check if no vehicles were found
            if (fetchedVehicles.length === 0) {
                console.log("No vehicles found.");
                setNotFoundMessage('Vehicle not found');
            } else {
                setNotFoundMessage(null);
            }
            setVehicles(fetchedVehicles);
        } catch (error) {
            setError('Failed to fetch vehicles.');
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchVehicleTypes = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle/types`);
            setVehicleTypes(response.data);
        } catch (error) {
            console.error("Error fetching vehicle types:", error);
        }
    };
    
    const fetchVehiclesByType = async (typeId: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle/types/${typeId}`);
            setFilteredVehicles(response.data);
        } catch (error) {
            console.error("Error fetching vehicles by type:", error);
        }
    };
    
    useEffect(() => {
        fetchVehicles();
        fetchVehicleTypes();
        if (selectedType !== null) {
            fetchVehiclesByType(selectedType);
        }
    }, [selectedType]);    

    // Show the details modal
    const showDetailModal = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setIsDetailsModalVisible(true);
    };

    // Show the update modal
    const showUpdateModal = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        form.setFieldsValue(vehicle);
        setIsUpdateModalVisible(true);
    };
    
    // Show add vehicle modal
    const showAddVehicleModal = () => {
        form.resetFields();
        setIsAddVehicleModalVisible(true);
    };

    // Handle delete vehicle
    const deleteVehicle = async (id: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle/${id}`);
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    // Handle add vehicle submission
    const handleAddVehicle = async (vehicleData: { 
        code: string; 
        model: string; 
        capacity: string; 
        type_id: string; 
        driver_id: string; 
        image: { file: string | Blob; };  
    }) => {
        try {
            const formData = new FormData();
            formData.append("code", vehicleData.code as string);
            formData.append("model", vehicleData.model as string);
            formData.append("capacity", vehicleData.capacity as string);
            formData.append("driver_id", vehicleData.driver_id as string);
            formData.append("type_id", vehicleData.type_id as string);
            formData.append("image", vehicleData.image.file as Blob);
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            setVehicles([...vehicles, response.data]);
            setIsAddVehicleModalVisible(false);
            notification.success({
                message: 'Success',
                description: 'Vehicle has been added successfully!',
            });
        }  catch (error) {
            if (axios.isAxiosError(error)) {
                const errorResponse = error.response?.data;
                if (errorResponse) {
                    // Construct error message based on the response data
                    const errorMessages = Object.entries(errorResponse).map(([field, messages]) => {
                        // Check if messages is an array of strings
                        if (Array.isArray(messages) && messages.every(msg => typeof msg === 'string')) {
                            return `${field}: ${messages.join(', ')}`;
                        }
                        return `${field}: Invalid error message format`;
                    }).join('; ');
    
                    notification.error({
                        message: 'Failed to add vehicle',
                        description: errorMessages,
                    });
                } else {
                    notification.error({
                        message: 'Failed to add vehicle',
                        description: 'An unexpected error occurred. Please try again.',
                    });
                }
            } else {
                notification.error({
                    message: 'Failed to add vehicle',
                    description: 'An unknown error occurred. Please try again.',
                });
            }
        }
    };

    const handleUpdate = async (vehicleData: { 
        code: string; 
        model: string; 
        capacity: string; 
        type_id: string; 
        driver_id: string; 
        image: { fileList: string | any[]; file: { originFileObj: string | Blob; }; }; 
    }) => {
        const formData = new FormData();
        formData.append('code', vehicleData.code);
        formData.append('model', vehicleData.model);
        formData.append('capacity', vehicleData.capacity);
        formData.append('type_id', vehicleData.type_id);
        formData.append('driver_id', vehicleData.driver_id);
        formData.append("image", vehicleData.image.file as unknown as Blob);

        if (vehicleData.image && vehicleData.image.fileList.length > 0) {
            formData.append('image', vehicleData.image.file.originFileObj);
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicle/${currentVehicle?.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            if (response.status === 200) {
                message.success('Vehicle updated successfully');
            } else {
                message.error('Failed to update vehicle');
            }
        } catch (error) {
            console.error('Failed to update vehicle:', error);
            message.error('Failed to update vehicle');
        }
    };

    const onSearch = (value: string) => {
        setSearchQuery(value);
        fetchVehicles(value);
    };

    if (error) return <p className="text-rose-500 mt-[10px]">{error}</p>;

    return (
        <>
            <div className="w-[100%] flex justify-end gap-2 ">
                <Search
                    placeholder="Vehicle search"
                    onSearch={onSearch}
                    value={searchQuery} // Set the input value to the state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                    className="text-slate-950 hover:border-[#EEBA0B] w-full md:w-[20%]"
                />
                <div 
                    onClick={showAddVehicleModal} 
                    className="add-btn flex gap-2 bg-[#EEBA0B] hover:bg-[#DDAA00] w-fit py-1 px-2 rounded-md text-white hover:cursor-pointer text-[14px] items-center mt-[20px] md:mt-0 font-medium"
                >
                    <PlusCircleOutlined />
                    Add Vehicle
                </div>
            </div>

            <div className={`py-2 flex justify-end w-full`}>
                <div className="flex gap-2 w-fit justify-end overflow-x-auto whitespace-nowrap">
                    <button
                        className={`dark:text-white px-2 py-2 bg-gray-300 text-black rounded font-semibold ${fontClass}`}
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                    >
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].previous
                            : TRANSLATIONS[Languages.EN].previous
                        }
                    </button>
                    <p
                        className={`dark:text-whiter flex items-center px-2  cursor-pointer ${!selectedType ? 'text-[#EEBA0B] border-b-2 font-bold' : 'text-slate-900'}`}
                        onClick={() => setSelectedType(null)}
                    >
                        All
                    </p>
                    {visibleTypes.map((vehicleType) => (
                        <div key={vehicleType.id} className="flex items-center">
                            <p
                                className={`dark:text-whiter flex items-center px-2 cursor-pointer h-full ${selectedType === vehicleType.id ? 'text-[#EEBA0B] font-bold border-b-2' : 'text-slate-900'}`}
                                onClick={() => setSelectedType(vehicleType.id)}
                            >
                                {vehicleType.name}
                            </p>
                        </div>
                    ))}
                    <button
                        className={`dark:text-whiter px-2 py-2 bg-gray-300 text-black rounded font-semibold ${fontClass}`}
                        onClick={handleNext}
                        disabled={(currentPage + 1) * itemsPerPage >= vehicleTypes.length}
                    >
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].next
                            : TRANSLATIONS[Languages.EN].next
                        }
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
            
                <div className={`nav min-w-[900px] flex bg-gray-200 p-[10px] rounded-t-lg shadow-10 header text-[17px] font-bold ${fontClass}`}>
                    <div className="id w-[5%]">
                        {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].id
                            : TRANSLATIONS[Languages.EN].id
                        }
                    </div>
                    <div className="number w-[20%]">
                    {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].vehicleCode
                            : TRANSLATIONS[Languages.EN].vehicleCode
                        }
                    </div>
                    <div className="model w-[10%]">
                    {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].model
                            : TRANSLATIONS[Languages.EN].model
                        }
                    </div>
                    <div className="model w-[10%]">
                    {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].type
                            : TRANSLATIONS[Languages.EN].type
                        }
                    </div>
                    <div className="driver w-[10%]">
                    {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].driver
                            : TRANSLATIONS[Languages.EN].driver
                        }
                    </div>
                    <div className="capacity w-[10%]">
                    {
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].capacity
                            : TRANSLATIONS[Languages.EN].capacity
                        }
                    </div>
                </div>
                {notFoundMessage && (
                    <p className="p-2 text-red">{notFoundMessage}</p>
                )}
                <ul>
                    {vehiclesToDisplay.map((vehicle) => (
                        <li key={vehicle.id} className="flex items-center p-2 hover:bg-gray-50 py-2 border-b-[2px] border-slate-900 border-opacity-20">
                            <p className="w-[5%]">{vehicle.id}</p>
                            <p className="w-[20%] cursor-pointer" onClick={(e) => { e.preventDefault(); showDetailModal(vehicle); }}>{vehicle.code}</p>
                            <p className="w-[10%]">{vehicle.model}</p>
                            <p className="w-[10%]">{vehicle.type}</p>
                            <p className="w-[10%]">{vehicle.driver_name}</p>
                            <p className="w-[10%]">{vehicle.capacity} kg</p>
                            <div className="w-[15%] flex justify-center gap-2 items-center ">
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); showUpdateModal(vehicle); }}
                                >
                                    <EditOutlined className="text-blue-600 text-[17px]" />
                                </a>

                                <Popconfirm
                                    title="Delete the vehicle"
                                    description="Are you sure you want to delete this vehicle?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={() => deleteVehicle(vehicle.id)}
                                    okButtonProps={{
                                        style: { backgroundColor: '#EEBA0B', borderColor: '#EEBA0B' },
                                    }}
                                >
                                    <a href="#" onClick={(e) => e.preventDefault()}>
                                        <DeleteOutlined className="text-red text-[17px]" />
                                    </a>
                                </Popconfirm>

                                <div className="hover:shadow-12">
                                    <a 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); showDetailModal(vehicle); }}
                                    >
                                        <FaRegEyeSlash  className="text-[18px]" />
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Add vehicle Modal */}
                <Modal
                    title="Add Vehicle"
                    open={isAddVehicleModalVisible}
                    onCancel={() => setIsAddVehicleModalVisible(false)}
                    footer={null}
                    className={`${fontClass} ml-[42%] mt-[-50px]`}
                >
                    <Form form={form} onFinish={handleAddVehicle} layout="vertical">
                        <Form.Item
                            name="code"
                            label=
                            {
                                lang === Languages.KH
                                ? TRANSLATIONS[Languages.KH].vehicleCode
                                : TRANSLATIONS[Languages.EN].vehicleCode    
                            }
                            rules={[{ required: true, message: "Please input the vehicle code!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="model"
                            label=
                                {
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].model
                                    : TRANSLATIONS[Languages.EN].model    
                                }
                            rules={[{ required: true, message: "Please input the model!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="capacity"
                            label=
                                {
                                    `${lang === Languages.KH 
                                    ? TRANSLATIONS[Languages.KH].capacity 
                                    : TRANSLATIONS[Languages.EN].capacity} (kg)`
                                }
                            
                            rules={[{ required: true, message: "Please input the capacity!" }]}
                        >
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                        <Form.Item
                            name="type_id"
                            label=
                                {
                                    `${lang === Languages.KH 
                                    ? TRANSLATIONS[Languages.KH].type 
                                    : TRANSLATIONS[Languages.EN].type} (ID)`
                                }
                            rules={[{ required: true, message: "Please select the Type ID!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="driver_id"
                            label=
                                {
                                    `${lang === Languages.KH 
                                    ? TRANSLATIONS[Languages.KH].driver 
                                    : TRANSLATIONS[Languages.EN].driver} (ID)`
                                }
                            rules={[{ required: true, message: "Please input the driver ID!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label=
                                {
                                    lang === Languages.KH 
                                    ? TRANSLATIONS[Languages.KH].image 
                                    : TRANSLATIONS[Languages.EN].image
                                }
                            valuePropName="file"
                            rules={[{ required: true, message: "Please upload the vehicle image!" }]}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                beforeUpload={() => false} // Prevents auto-upload
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                htmlType="submit" 
                                className="w-full text-white"
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
                                Add Vehicle
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                
                {/* Show detail vehicle Modal */}
                <Modal
                    title={
                        <span className={fontClass}>{
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].vehicleDetail
                            : TRANSLATIONS[Languages.EN].vehicleDetail
                        }</span> 
                    }
                    open={isDetailsModalVisible}
                    onCancel={() => setIsDetailsModalVisible(false)}
                    footer={null}
                    className="ml-[42%] mt-[-50px]"
                >
                    {currentVehicle ? (
                        <div className={`text-[16px] ${fontClass}`}>
                            <div className="vehicleNumber flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].vehicleCode
                                    : TRANSLATIONS[Languages.EN].vehicleCode
                                }</p>
                                <p>{currentVehicle.code}</p>
                            </div>
                            <div className="model flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].model
                                    : TRANSLATIONS[Languages.EN].model
                                }</p>
                                <p>{currentVehicle.model}</p>
                            </div>
                            <div className="driver flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].type
                                    : TRANSLATIONS[Languages.EN].type
                                }</p>
                                <p>{currentVehicle.type}</p>
                            </div>
                            <div className="driver flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].driver
                                    : TRANSLATIONS[Languages.EN].driver
                                }</p>
                                <p>{currentVehicle.driver_name}</p>
                            </div>
                            <div className="driver flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].capacity
                                    : TRANSLATIONS[Languages.EN].capacity
                                }</p>
                                <p>{currentVehicle.capacity}</p>
                            </div>
                            <div className="flex py-2">
                                <p className="w-[25%] font-bold">{
                                    lang === Languages.KH
                                    ? TRANSLATIONS[Languages.KH].image
                                    : TRANSLATIONS[Languages.EN].image
                                }</p>
                                <Image
                                    src={`http://localhost:8000${currentVehicle.image}`}
                                    alt={`${currentVehicle.model}`}
                                    width={1000} 
                                    height={1000}
                                    className="max-w-[75%]"
                                    priority
                                />
                            </div>
                        </div>
                    ):(
                        <p className="text-red">No Vehicle found.</p>
                    )}

                </Modal>

                {/* Show update vehicle Modal */}
                <Modal
                    title={
                        <span className={fontClass}>{
                            lang === Languages.KH
                            ? TRANSLATIONS[Languages.KH].vehicleUpdate
                            : TRANSLATIONS[Languages.EN].vehicleUpdate
                        }</span> 
                    }
                    open={isUpdateModalVisible}
                    onCancel={() => setIsUpdateModalVisible(false)}
                    footer={null}
                    className="ml-[42%] mt-[-50px]"
                >
                    <Form form={form} onFinish={handleUpdate} layout="vertical">
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[{ required: true, message: "Please input the vehicle code!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="model"
                            label="Model"
                            rules={[{ required: true, message: "Please input the model!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="capacity"
                            label="Capacity (kg)"
                            rules={[{ required: true, message: "Please input the capacity!" }]}
                        >
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                        <Form.Item
                            name="type_id"
                            label="Type ID"
                            rules={[{ required: true, message: "Please input the Type ID!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="driver_id"
                            label="Driver ID"
                            rules={[{ required: true, message: "Please input the driver ID!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                className="w-full text-white"
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
                                Update Vehicle
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
        
    );
}

export default VehicleList;