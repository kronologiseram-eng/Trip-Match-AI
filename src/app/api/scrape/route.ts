import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const APIFY_TOKEN = process.env.APIFY_TOKEN
const ACTOR_ID = 'apify/facebook-groups-scraper' 

export async function GET() {
  try {
    if (!APIFY_TOKEN) {
      return NextResponse.json({ error: 'APIFY_TOKEN tidak dijumpai di dalam .env' }, { status: 500 })
    }

    // 1. Panggil Apify Actor dan tunggu ia SELESAI ambil data (Sync)
    const apifyResponse = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "startUrls": [
            { "url": "https://www.facebook.com/groups/lorisewamalaysia" }
          ],
          "resultsLimit": 5,
          "viewOption": "CHRONOLOGICAL"
        })
      }
    )

    if (!apifyResponse.ok) {
      const errorData = await apifyResponse.json()
      throw new Error(`Apify Gagal: ${JSON.stringify(errorData)}`)
    }

    // Items di sini terus berisi array data hasil kikisan
    const items = await apifyResponse.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ message: 'Tiada data dijumpai dari Apify', items }, { status: 200 })
    }

    // 2. Masukkan data ke dalam Supabase guna Prisma
    const savedJobs = []
    for (const item of items) {
      const textContent = item.text || item.caption || ''
      const phoneRegex = /(601|01)[0-9]{8,9}/
      const matchPhone = textContent.match(phoneRegex)

      if (matchPhone) {
        const cleanPhone = matchPhone[0]

        const newJob = await prisma.job.create({
          data: {
            truckType: textContent.includes('3t') || textContent.includes('3 tan') ? '3 Tan' : '1 Tan',
            origin: textContent.includes('penang') || textContent.includes('pg') ? 'Penang' : 'Kuala Lumpur',
            destination: textContent.includes('kl') || textContent.includes('selangor') ? 'Kuala Lumpur' : 'Penang',
            date: new Date().toISOString(),
            phone: cleanPhone
          }
        })
        savedJobs.push(newJob)
      }
    }

    return NextResponse.json({
      message: 'Scraping berjaya!',
      jobsSavedCount: savedJobs.length,
      jobs: savedJobs
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
