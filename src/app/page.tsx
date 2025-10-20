"use client";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Home() {
    const [text, setText] = useState<string | null>(null);
    const [qrImage, setQrImage] = useState<string | null>(null);
    useEffect(() => {
        if (!text) {
            setQrImage(null);
            return;
        }

        QRCode.toDataURL(text, {
            width: 256,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        })
            .then((url) => setQrImage(url))
            .catch((err) => console.error(err));
    }, [text]);
    return (
        <div className="flex justify-center items-center h-screen flex-col gap-5 mx-4 ">
            {text && (
                <div className="flex flex-col justify-center absolute top-10 items-center gap-8">
                    {qrImage && (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={qrImage}
                                alt="Generated QR"
                                className="w-64 h-64 border-2 rounded-lg"
                            />
                        </div>
                    )}
                </div>
            )}
            <div>
                <h1 className="text-3xl">QR Generator</h1>
            </div>
            <input
                type="text"
                className="border-2 rounded-md p-1 font-pormpt"
                onChange={(e) => setText(e.target.value)}
                placeholder="link url or text"
            />
        </div>
    );
}
