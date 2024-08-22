"use client"
import React, { useState } from "react";
import TransferForm from "./form"; // Make sure the import path is correct

const Form = () => {
    const [formValues, setFormValues] = useState({
        from: {
            assetName: '',
            assetModel: '',
            assetCode: ''
        },
        to: {
            assetName: '',
            assetModel: '',
            assetCode: ''
        }
    });

    const handleClear = () => {
        setFormValues({
            from: {
                assetName: '',
                assetModel: '',
                assetCode: ''
            },
            to: {
                assetName: '',
                assetModel: '',
                assetCode: ''
            }
        });
    };

    const handleSubmit = () =>{

    }

    const handleChange = (section: 'from' | 'to', field: string, value: string) => {
        setFormValues(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section as keyof typeof formValues],
                [field]: value
            }
        }));
    };

    return (
        <div className="flex flex-col gap-20">
            <div className="flex lg:flex-row gap-20 sm:flex-col sm:items-center">
                <TransferForm 
                    title="Transfer from" 
                    values={formValues.from} 
                    onChange={(field, value) => handleChange('from', field, value)}
                />
                {/* <TransferForm 
                    title="Transfer to" 
                    values={formValues.to} 
                    onChange={(field, value) => handleChange('to', field, value)}
                /> */}
            </div>
            <div className="flex justify-between ">
                <button
                    type="button"
                    className="bg-red text-white p-2 rounded-md w-[10%]"
                    onClick={handleClear}
                >
                    Clear
                </button>
                <button 
                    type="button"
                    className="bg-green-700 text-white p-2 rounded-md w-[10%]"
                    onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default Form;
