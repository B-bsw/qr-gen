'use client'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function Home() {
    const [text, setText] = useState<string | null>(null)
    const [qrImage, setQrImage] = useState<string | null>(null)
    const [qrSvg, setQrSvg] = useState<string | null>(null)

    const [selectedFormat, setSelectedFormat] = useState('png')

    useEffect(() => {
        if (!text) {
            setQrImage(null)
            setQrSvg(null)
            return
        }

        // PNG
        QRCode.toDataURL(text, {
            width: 512,
            margin: 2,
        })
            .then((url) => setQrImage(url))
            .catch(console.error)

        // SVG
        QRCode.toString(text, {
            type: 'svg',
            width: 512,
            margin: 2,
        })
            .then((svg) => setQrSvg(svg))
            .catch(console.error)
    }, [text])

    const handleDownload = () => {
        if (!text) return

        if (selectedFormat === 'svg') {
            if (!qrSvg) return
            const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'qrcode.svg'
            a.click()
            URL.revokeObjectURL(url)
        } else if (selectedFormat === 'png' || selectedFormat === 'jpg') {
            if (!qrImage) return
            const img = new Image()
            img.src = qrImage
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                if (!ctx) return

                if (selectedFormat === 'jpg') {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                }
                ctx.drawImage(img, 0, 0)
                const url = canvas.toDataURL(selectedFormat === 'png' ? 'image/png' : 'image/jpeg', 0.9)
                const a = document.createElement('a')
                a.href = url
                a.download = `qrcode.${selectedFormat}`
                a.click()
            }
        }
    }

    const copyLink = () => {
        if (!text) return
        const url = `${window.location.origin}/qr?text=${encodeURIComponent(text)}&format=${selectedFormat}`
        navigator.clipboard.writeText(url)
            .then(() => alert(`Link copied for ${selectedFormat.toUpperCase()} format!`))
            .catch(console.error)
    }


    return (
        <div className="mx-4 flex h-full flex-col items-center justify-center gap-5 transition-all">
            <div
                className={`h-64 w-64 rounded-lg border-2 ${!text ? 'border-zinc-50' : 'border-zinc-500'} p-1`}
            >
                {text && (
                    <div className="flex flex-col items-center gap-4">
                        {qrImage && (
                            <img src={qrImage} alt="QR Code" className="h-full w-full object-contain" />
                        )}
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-3xl">QR Code Generator</h1>
            </div>
            <div className="w-64">
                <input
                    type="text"
                    className="font-pormpt w-full rounded-md border-2 border-zinc-300 p-1 outline-0"
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com"
                />
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="rounded-md border-2 border-zinc-300 p-1 outline-0"
                    >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="svg">SVG</option>
                    </select>

                    <button
                        onClick={handleDownload}
                        disabled={!qrImage || !qrSvg}
                        className="rounded-md bg-zinc-800 px-4 py-1 text-white disabled:opacity-50"
                    >
                        Download
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={copyLink}
                        disabled={!text}
                        className="text-sm text-zinc-600 underline disabled:opacity-50"
                    >
                        Copy QR Code
                    </button>
                </div>
            </div>
        </div>
    )
}
