import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import sharp from 'sharp'

const allowedFormats = new Set(['png', 'jpg', 'svg'])

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const text = searchParams.get('text')
    const format = searchParams.get('format') ?? 'png'

    const fg = searchParams.get('fg') ?? '#000000'
    const bg = searchParams.get('bg') ?? '#ffffff'

    if (!text) {
        return NextResponse.json(
            { error: 'Missing text query parameter' },
            { status: 400 }
        )
    }

    if (!allowedFormats.has(format)) {
        return NextResponse.json(
            { error: 'Invalid format query parameter' },
            { status: 400 }
        )
    }

    const qrOptions = {
        width: 512,
        margin: 2,
        color: {
            dark: fg,
            light: bg,
        },
    }

    if (format === 'svg') {
        const svg = await QRCode.toString(text, {
            type: 'svg',
            ...qrOptions,
        })

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Content-Disposition': 'inline',
                'Cache-Control': 'no-store',
            },
        })
    }

    const pngBuffer = await QRCode.toBuffer(text, {
        type: 'png',
        ...qrOptions,
    })

    if (format === 'jpg') {
        const jpegBuffer = await sharp(pngBuffer)
            .flatten({ background: bg })
            .jpeg({ quality: 90 })
            .toBuffer()

        return new NextResponse(new Uint8Array(jpegBuffer), {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': 'inline',
                'Cache-Control': 'no-store',
            },
        })
    }

    return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': 'inline',
            'Cache-Control': 'no-store',
        },
    })
}
