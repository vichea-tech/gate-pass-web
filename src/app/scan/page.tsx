'use client'
import React from 'react';
import QRScanner from '@/components/QRScanner';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const ScanPage: React.FC = () => {
    return (
        <DefaultLayout>
            <div className="container mx-auto my-10">
                <h1 className="text-center text-2xl font-bold mb-5">Scan QR Code</h1>
                <QRScanner />
            </div>
        </DefaultLayout> 
    );
};

export default ScanPage;
