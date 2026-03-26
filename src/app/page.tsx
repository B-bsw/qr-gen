'use client'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function Home() {
    const [text, setText] = useState<string | null>(null)
    const [qrImage, setQrImage] = useState<string | null>(null)

    useEffect(() => {
        if (!text) {
            setQrImage(null)
            return
        }

        QRCode.toDataURL(text, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        })
            .then((url) => setQrImage(url))
            .catch((err) => console.error(err))
    }, [text])
    return (
        <div className="mx-4 flex h-full flex-col items-center justify-center gap-5">
            <div
                className={`h-64 w-64 rounded-lg border-2 border-stone-300/80 p-1`}
            >
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
                    className="font-pormpt w-full rounded-md border-2 border-zinc-300 p-1 outline-0"
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com"
                />
            </div>
        </div>
    )
}
