'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QRCode from 'qrcode'

function ViewSVGContent() {
    const searchParams = useSearchParams()
    const text = searchParams.get('text')
    const [qrSvg, setQrSvg] = useState<string | null>(null)

    useEffect(() => {
        if (!text) return

        QRCode.toString(text, {
            type: 'svg',
            width: 512,
            margin: 2,
        })
            .then((svg) => setQrSvg(svg))
            .catch(console.error)
    }, [text])

    if (!text) {
        return (
            <div className="p-10 text-center text-zinc-500">
                No text provided
            </div>
        )
    }

    return (
        <div className="block w-fit">
            {qrSvg ? (
                <div
                    className="max-w-full"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
            ) : (
                <div className="text-sm text-zinc-500 italic">
                    Loading QR Code...
                </div>
            )}
        </div>
    )
}

export default function ViewSVGPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-white">
                    <div className="text-sm text-zinc-500 italic">
                        Loading...
                    </div>
                </div>
            }
        >
            <ViewSVGContent />
        </Suspense>
    )
}
