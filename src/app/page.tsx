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
        <div className="flex justify-center items-center h-full flex-col gap-5 mx-4">
            <div className="w-64 h-64 border-2 rounded-lg border-stone-300/80 p-1">
                {text && (
                    <div>
                        {qrImage && (
                            <div className="flex flex-col items-center gap-4">
                                <img src={qrImage} alt="QR Code" className="" />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-3xl">QR Code generate</h1>
            </div>
            <div className="w-64">
                <input
                    type="text"
                    className="w-full p-1 border-2 border-zinc-300 rounded-md outline-0  font-pormpt "
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://"
                />
            </div>
        </div>
    );
}
