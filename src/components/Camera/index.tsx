'use client'
// src/components/Camera/index.tsx
import React, { useEffect, useRef, useState } from 'react';

const CameraComponent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera API is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.');
            setLoading(false);
            return;
        }

        const getUserMedia = async () => {
            try {
                console.log('Requesting camera access...');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                console.log('Camera access granted:', stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setLoading(false);
                    };
                }
            } catch (err) {
                console.error('Error accessing camera:', err);

                if (err instanceof Error) {
                    if (err.name === 'NotAllowedError') {
                        setError('Permission to access the camera was denied.');
                    } else if (err.name === 'NotFoundError') {
                        setError('No camera device found. Please ensure your camera is connected and properly set up.');
                    } else {
                        setError('Error accessing camera. Please ensure you have granted permission.');
                    }
                } else {
                    setError('An unknown error occurred.');
                }

                setLoading(false);
            }
        };

        getUserMedia();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading camera...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
            )}
        </div>
    );
};

export default CameraComponent;
