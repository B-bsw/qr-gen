'use client'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function Home() {
    const [text, setText] = useState<string | null>(null)
    const [qrImage, setQrImage] = useState<string | null>(null)
    const [qrSvg, setQrSvg] = useState<string | null>(null)
    const [showSvg, setShowSvg] = useState(false)

    useEffect(() => {
        if (!text) {
            setQrImage(null)
            setQrSvg(null)
            return
        }

        // PNG
        QRCode.toDataURL(text, {
            width: 256,
            margin: 2,
        })
            .then((url) => setQrImage(url))
            .catch(console.error)

        // SVG
        QRCode.toString(text, {
            type: 'svg',
        })
            .then((svg) => setQrSvg(svg))
            .catch(console.error)
    }, [text])

    const downloadPNG = () => {
        if (!qrImage) return

        const a = document.createElement('a')
        a.href = qrImage
        a.download = 'qrcode.png'
        a.click()
    }

    const downloadSVG = () => {
        if (!qrSvg) return

        const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'qrcode.svg'
        a.click()

        URL.revokeObjectURL(url)
    }

    const downloadJPG = () => {
        if (!qrImage) return

        const img = new Image()
        img.src = qrImage

        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // background สีขาว (JPG ไม่มี transparency)
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.drawImage(img, 0, 0)

            const jpgUrl = canvas.toDataURL('image/jpeg', 0.9)

            const a = document.createElement('a')
            a.href = jpgUrl
            a.download = 'qrcode.jpg'
            a.click()
        }
    }

    const copySVG = async () => {
        if (!qrSvg) return

        try {
            await navigator.clipboard.writeText(qrSvg)
            alert('SVG copied!')
        } catch (err) {
            console.error(err)
        }
    }

    const handleShowSVG = () => {
        setShowSvg((prev) => !prev)
    }

    return (
        <div className="mx-4 flex h-full flex-col items-center justify-center gap-5 transition-all">
            <div
                className={`h-64 w-64 rounded-lg border-2 ${!text ? 'border-zinc-50' : 'border-zinc-500'} p-1`}
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

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={downloadPNG}
                    disabled={!qrImage}
                    className="rounded-md bg-zinc-800 px-3 py-1 text-white disabled:opacity-50"
                >
                    PNG
                </button>

                <button
                    onClick={downloadJPG}
                    disabled={!qrImage}
                    className="rounded-md bg-zinc-800 px-3 py-1 text-white disabled:opacity-50"
                >
                    JPG
                </button>

                <button
                    onClick={copySVG}
                    disabled={!qrSvg}
                    className="rounded-md bg-zinc-800 px-3 py-1 text-white disabled:opacity-50"
                >
                    Copy SVG
                </button>

                <button
                    onClick={downloadSVG}
                    disabled={!qrSvg}
                    className="rounded-md bg-zinc-800 px-3 py-1 text-white disabled:opacity-50"
                >
                    Download SVG
                </button>
            </div>
        </div>
    )
}
