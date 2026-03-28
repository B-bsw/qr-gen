'use client'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
    Button,
    InputGroup,
    Key,
    Label,
    ListBox,
    Select,
    TextField,
    Toast,
    toast,
} from '@heroui/react'

const format = [
    {
        key: 1,
        value: 'png',
        name: 'PNG',
    },
    {
        key: 2,
        value: 'jpg',
        name: 'JPG',
    },
    {
        key: 3,
        value: 'svg',
        name: 'SVG',
    },
]

const placeholderURL = 'https://b-bsw.com'

export default function Home() {
    const [text, setText] = useState<string | null>(placeholderURL)
    const [qrImage, setQrImage] = useState<string | null>(null)
    const [qrSvg, setQrSvg] = useState<string | null>(null)
    const [isDisable, setIsDisable] = useState<boolean>(true)

    const [selectedFormat, setSelectedFormat] = useState<Key>('png')

    useEffect(() => {
        if (!text) {
            setQrImage(null)
            setQrSvg(null)
            setIsDisable(true)
            return
        } else {
            setIsDisable(false)
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
                const url = canvas.toDataURL(
                    selectedFormat === 'png' ? 'image/png' : 'image/jpeg',
                    0.9
                )
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
        navigator.clipboard
            .writeText(url)
            .then(() => toast.info('Copy Success'))
            .catch(console.error)
    }

    return (
        <div className="mx-4 flex h-full flex-col items-center justify-center gap-5 transition-all">
            <Toast.Provider placement="bottom end" />
            <div
                className={`h-64 w-64 rounded-lg border-2 ${!text ? 'border-zinc-50' : 'border-zinc-500'} p-1`}
            >
                {text && (
                    <div className="flex flex-col items-center gap-4">
                        {qrImage && (
                            <img
                                src={qrImage}
                                alt="QR Code"
                                className="h-full w-full object-contain"
                            />
                        )}
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-3xl">QR Code Generator</h1>
            </div>
            <div className="w-64">
                <TextField
                    className="w-full max-w-70"
                    defaultValue={placeholderURL.split('//')[1]}
                    name="website"
                    variant="secondary"
                    aria-label="input url"
                >
                    <InputGroup>
                        <InputGroup.Prefix>https://</InputGroup.Prefix>
                        <InputGroup.Input
                            onChange={(e) => console.log(e.currentTarget.value)}
                            className="max-w-70] w-full"
                        />
                    </InputGroup>
                </TextField>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                    <Select
                        className="w-[256px]"
                        placeholder="Select one"
                        variant="secondary"
                        defaultValue={'png'}
                        aria-label="format"
                        onChange={(e) => setSelectedFormat(e as Key)}
                    >
                        <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            {format && (
                                <ListBox>
                                    {format.map((f) => (
                                        <ListBox.Item
                                            key={f.key}
                                            id={f.value}
                                            textValue={f.value}
                                        >
                                            {f.name}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            )}
                        </Select.Popover>
                    </Select>

                    <Button
                        onPress={handleDownload}
                        isDisabled={!qrImage || !qrSvg}
                    >
                        Download
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button onClick={copyLink} isDisabled={isDisable}>
                        Copy QR Code ( Image )
                    </Button>
                </div>
            </div>
        </div>
    )
}
