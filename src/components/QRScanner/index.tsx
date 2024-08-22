'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const QRScanner: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                fps: 15, // Increase FPS for better scanning performance
                qrbox: { width: 100, height: 100 }, // Adjust QR box size
            },
            false
        );

        // Function to handle QR code data
        const handleQRCodeData = async (decodedText: string) => {
            try {
                setLoading(true);

                console.log('Decoded Text:', decodedText); // Log decoded text

                // Parse the QR code data
                const data = JSON.parse(decodedText);
                console.log('Parsed QR Code Data:', data); // Log parsed data

                if (data.id) {
                    // Fetch the visitor data from the backend
                    const visitorResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${data.id}`);
                    console.log('Visitor Data Response:', visitorResponse.data); // Log response data

                    // Update the scan count
                    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${data.id}/scan`, {});
                    console.log('Scan count updated');

                    // Navigate to the visitor card page with the fetched data
                    router.push(`/visitors/${data.id}`);
                } else {
                    console.error('Invalid QR code data:', data);
                }
            } catch (error) {
                console.error('Failed to process QR code data:', error);
            } finally {
                setLoading(false);
                // Clear the scanner
                scanner.clear();
            }
        };

        // Initialize the QR code scanner
        scanner.render(
            handleQRCodeData,
            (error) => {
                console.error('QR code scan error:', error);
            }
        );

        // Cleanup function
        return () => {
            scanner.clear();
        };
    }, [router]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            <div id="reader" style={{ width: '100%' }} />
        </div>
    );
};

export default QRScanner;
