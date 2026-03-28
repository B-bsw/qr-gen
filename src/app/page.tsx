'use client'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
    Button,
    ButtonGroup,
    Card,
    InputGroup,
    Key,
    Label,
    ListBox,
    Select,
    TextField,
    Toast,
    toast,
} from '@heroui/react'
import { Copy, CopyCheck } from 'lucide-react'

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

const placeholderURL = 'https://qr.b-bsw.com'

export default function Home() {
    const [text, setText] = useState<string>(placeholderURL)
    const [qrImage, setQrImage] = useState<string | null>(null)
    const [qrSvg, setQrSvg] = useState<string | null>(null)
    const [isDisable, setIsDisable] = useState<boolean>(true)
    const [isCheckCopy, setIsCheckCopy] = useState<boolean>(false)

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
            <Card variant="tertiary">
                <div className="flex min-w-full justify-center">
                    <section className={`w-86 rounded-lg p-1`}>
                        {text && (
                            <div className="flex flex-col items-center gap-4">
                                {qrImage && (
                                    <img
                                        src={qrImage}
                                        alt="QR Code"
                                        className="h-full w-full rounded-lg object-contain"
                                    />
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/*<div>
                    <h1 className="text-3xl">QR Code Generator</h1>
                </div>*/}

                <section className="flex w-full flex-col items-center justify-center gap-2">
                    <div className="w-full">
                        <TextField
                            className="w-full"
                            defaultValue={placeholderURL.split('//')[1]}
                            name="website"
                            // variant="secondary"
                            aria-label="input url"
                        >
                            <InputGroup>
                                <InputGroup.Prefix>https://</InputGroup.Prefix>
                                <InputGroup.Input
                                    onChange={(e) =>
                                        setText(
                                            'https://' + e.currentTarget.value
                                        )
                                    }
                                    className="max-w-70"
                                />
                                <InputGroup.Suffix className="pr-0">
                                    <Button
                                        isIconOnly
                                        aria-label="Copy"
                                        size="sm"
                                        variant="ghost"
                                        isDisabled={isCheckCopy}
                                        onPress={() => {
                                            navigator.clipboard.writeText(text)
                                            setIsCheckCopy(true)
                                            setTimeout(() => {
                                                setIsCheckCopy(false)
                                            }, 10000)
                                        }}
                                    >
                                        {isCheckCopy ? <CopyCheck /> : <Copy />}
                                    </Button>
                                </InputGroup.Suffix>
                            </InputGroup>
                        </TextField>
                    </div>

                    <div className="flex w-full flex-col items-center gap-3">
                        <div className="flex w-full items-center gap-2">
                            <Select
                                className="w-full"
                                placeholder="Select one"
                                // variant="secondary"
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
                        </div>
                        <div className="flex w-full max-w-70 justify-center gap-2">
                            <ButtonGroup>
                                <Button
                                    onPress={handleDownload}
                                    isDisabled={!qrImage || !qrSvg}
                                >
                                    Download
                                </Button>

                                <Button
                                    onClick={copyLink}
                                    isDisabled={isDisable}
                                >
                                    Copy QR Code ( Image )
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </section>
            </Card>
        </div>
    )
}
