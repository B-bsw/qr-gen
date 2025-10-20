"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const [text, setText] = useState<string | null>(null);
    return (
        <div className="flex justify-center items-center h-screen flex-col gap-5 mx-4 ">
            {text && (
                <div className="flex flex-col justify-center absolute top-10 items-center gap-8">
                    <QRCode
                        value={text}
                        size={256}
                        className="w-auto top-10"
                        level="Q"
                    />
                    {/*<div className="text-2xl underline text-blue-700">
                        <Link href={"http://" + text} target="_blank">
                            {text}
                        </Link>
                    </div>*/}
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
