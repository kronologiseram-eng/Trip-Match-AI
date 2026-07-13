import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const APIFY_TOKEN = process.env.APIFY_TOKEN
// Ganti dengan Task ID peribadi awak (contoh: "kronologiseram-eng/facebook-groups-scraper")
const TASK_ID = 'arynation1/facebook-groups-scraper-task'

export async function GET() {
  try {
    if (!APIFY_TOKEN) {
      return NextResponse.json({ error: 'Kunci APIFY_TOKEN tidak dijumpai di Vercel' }, { status: 500 })
    }

    // 1. Jalankan Task Scraper di Apify
    const runResponse = await fetch(`https://api.apify.com/v2/actor-tasks/${TASK_ID}/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const runData = await runResponse.json()
    
    if (!runResponse.ok) {
      return NextResponse.json({ error: 'Gagal jalankan robot Apify', details: runData }, { status: 500 })
    }

    const datasetId = runData.data.defaultDatasetId

    // Tunggu 8 saat untuk robot selesai mengikis data
    await new Promise((resolve) => setTimeout(resolve, 8000))

    // 2. Ambil data dari Apify
    const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`)
    const items = await datasetResponse.json()

    // 3. Simpan data ke Supabase Guna Prisma
    const savedJobs = []
    for (const item of items) {
      const phoneRegex = /(601|01)[0-9]{8,9}/
      const matchPhone = item.text ? item.text.match(phoneRegex) : null
      
      if (matchPhone) {
        const cleanPhone = matchPhone[0]
        
        const newJob = await prisma.job.create({
          data: {
            truckType: item.text.includes('3t') || item.text.includes('3 tan') ? '3 Tan' : '1 Tan',
            origin: item.text.includes('penang') || item.text.includes('pg') ? 'Penang' : 'Kuala Lumpur',
            destination: item.text.includes('kl') || item.text.includes('selangor') ? 'Kuala Lumpur' : 'Penang',
            date: 'Baru sat',
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
