'use client'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
    Button,
    ButtonGroup,
    Card,
    InputGroup,
    Key,
    ListBox,
    Select,
    TextField,
    Toast,
    toast,
    ColorPicker,
    ColorArea,
    ColorSlider,
    ColorSwatch,
    ColorField,
    Color,
    parseColor,
} from '@heroui/react'
import { Check, Copy } from 'lucide-react'

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
    const [colorPickerFg, setColorPickerFg] = useState<Color>(
        parseColor('#000000')
    )
    const [colorPickerBg, setColorPickerBg] = useState<Color>(
        parseColor('#FFFFFF')
    )

    const [selectedFormat, setSelectedFormat] = useState<Key>('png')

    useEffect(() => {
        if (!text) {
            setQrImage(null)
            setQrSvg(null)
            setIsDisable(true)
            return
        } else {
            setIsDisable(false)
            setIsCheckCopy(false)
        }

        // PNG
        QRCode.toDataURL(text, {
            width: 512,
            margin: 2,
            color: {
                dark: colorPickerFg.toString('hex'),
                light: colorPickerBg.toString('hex'),
            },
        })
            .then((url) => setQrImage(url))
            .catch(console.error)

        // SVG
        QRCode.toString(text, {
            type: 'svg',
            width: 512,
            margin: 2,
            color: {
                dark: colorPickerFg.toString('hex'),
                light: colorPickerBg.toString('hex'),
            },
        })
            .then((svg) => setQrSvg(svg))
            .catch(console.error)
    }, [text, selectedFormat, colorPickerFg, colorPickerBg])

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

        const fg = colorPickerFg.toString('hex')
        const bg = colorPickerBg.toString('hex')

        const url = `${window.location.origin}/qr?text=${encodeURIComponent(text)}&format=${selectedFormat}&fg=${encodeURIComponent(fg)}&bg=${encodeURIComponent(bg)}`
        navigator.clipboard
            .writeText(url)
            .then(() => toast.info('Copy Success'))
            .catch(console.error)
    }

    return (
        <div className="flex h-full flex-col items-center justify-center overflow-auto transition-all">
            <Toast.Provider placement="bottom end" />
            <Card
                variant="tertiary"
                className="overflow-auto max-sm:rounded-none max-sm:bg-white max-sm:shadow-none"
            >
                <div className="flex min-w-full justify-center">
                    <section className={`w-86 rounded-lg p-1 max-sm:w-full`}>
                        {text && (
                            <div className="flex flex-col items-center">
                                {qrImage && (
                                    <img
                                        src={qrImage}
                                        alt="QR Code"
                                        className="h-full w-full rounded-xl object-contain drop-shadow-md"
                                    />
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/*<div>
                    <h1 className="text-3xl">QR Code Generator</h1>
                </div>*/}

                <div className="flex w-full justify-center gap-5">
                    <ColorPicker
                        value={colorPickerFg}
                        onChange={setColorPickerFg}
                    >
                        <ColorPicker.Trigger>
                            <ColorSwatch size="lg" />
                            {/*<Label className="text-black">Pick a color</Label>*/}
                        </ColorPicker.Trigger>
                        <ColorPicker.Popover className="gap-2">
                            <ColorArea
                                aria-label="Color area"
                                className="max-w-full"
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                            >
                                <ColorArea.Thumb />
                            </ColorArea>
                            <div className="flex items-center gap-2 px-1">
                                <ColorSlider
                                    aria-label="Hue slider"
                                    channel="hue"
                                    className="flex-1"
                                    colorSpace="hsb"
                                >
                                    <ColorSlider.Track>
                                        <ColorSlider.Thumb />
                                    </ColorSlider.Track>
                                </ColorSlider>
                            </div>
                            <ColorField aria-label="Color field">
                                <ColorField.Group variant="secondary">
                                    <ColorField.Prefix>
                                        <ColorSwatch size="xs" />
                                    </ColorField.Prefix>
                                    <ColorField.Input />
                                </ColorField.Group>
                            </ColorField>
                        </ColorPicker.Popover>
                    </ColorPicker>

                    <ColorPicker
                        onChange={setColorPickerBg}
                        value={colorPickerBg}
                    >
                        <ColorPicker.Trigger>
                            <ColorSwatch size="lg" />
                            {/*<Label className="text-black">Pick a color</Label>*/}
                        </ColorPicker.Trigger>
                        <ColorPicker.Popover className="gap-2">
                            <ColorArea
                                aria-label="Color area"
                                className="max-w-full"
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                            >
                                <ColorArea.Thumb />
                            </ColorArea>
                            <div className="flex items-center gap-2 px-1">
                                <ColorSlider
                                    aria-label="Hue slider"
                                    channel="hue"
                                    className="flex-1"
                                    colorSpace="hsb"
                                >
                                    <ColorSlider.Track>
                                        <ColorSlider.Thumb />
                                    </ColorSlider.Track>
                                </ColorSlider>
                            </div>
                            <ColorField aria-label="Color field">
                                <ColorField.Group variant="secondary">
                                    <ColorField.Prefix>
                                        <ColorSwatch size="xs" />
                                    </ColorField.Prefix>
                                    <ColorField.Input />
                                </ColorField.Group>
                            </ColorField>
                        </ColorPicker.Popover>
                    </ColorPicker>
                </div>

                <section className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="w-full">
                        <TextField
                            className="w-full"
                            defaultValue={placeholderURL.split('//')[1]}
                            name="website"
                            // variant="secondary"
                            aria-label="input url"
                        >
                            <InputGroup onClick={() => setIsCheckCopy(false)}>
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
                                        }}
                                    >
                                        {isCheckCopy ? <Check /> : <Copy />}
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
                                    <ButtonGroup.Separator />
                                    Download
                                </Button>
                                <Button
                                    onClick={copyLink}
                                    isDisabled={isDisable}
                                >
                                    <ButtonGroup.Separator />
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
