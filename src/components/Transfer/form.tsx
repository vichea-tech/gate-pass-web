import React from "react";

interface FormProps {
    title: string;
    values: {
        assetName: string;
        assetModel: string;
        assetCode: string;
    };
    onChange: (field: string, value: string) => void;
}

const TransferForm: React.FC<FormProps> = ({ title, values, onChange }) => {

    return (
        <>
            <form action="post" className="w-[50%] flex flex-col bg-white mt-10 text-[18px] p-10 rounded-lg shadow-4">
                <p className="text-center text-[20px] font-bold">{title}</p>

                <label htmlFor="assetName">Asset name</label>
                <input
                    className="focus:outline-[#EEBA0B] border border-gray-400 border-1 p-[10px] rounded-md mb-[20px]"
                    type="text"
                    placeholder="Enter asset name"
                    value={values.assetName}
                    onChange={(e) => onChange('assetName', e.target.value)}
                />

                <label htmlFor="assetModel">Asset model</label>
                <input
                    className="focus:outline-[#EEBA0B] border border-gray-400 border-1 p-[10px] rounded-md mb-[20px]"
                    type="text"
                    placeholder="Enter asset model"
                    value={values.assetModel}
                    onChange={(e) => onChange('assetModel', e.target.value)}
                />

                <label htmlFor="assetCode">Asset Code</label>
                <input
                    className="focus:outline-[#EEBA0B] border border-gray-400 border-1 p-[10px] rounded-md mb-[20px]"
                    type="text"
                    placeholder="Enter asset code"
                    value={values.assetCode}
                    onChange={(e) => onChange('assetCode', e.target.value)}
                />
            </form>
        </>
    );
}

export default TransferForm;
