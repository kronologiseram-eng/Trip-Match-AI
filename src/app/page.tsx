import React from 'react'
import RouteForm from '../components/RouteForm'
import JobCard from '../components/JobCard'

const mockJobs = [
  { id: '1', truckType: '3 Tan', origin: 'Penang', destination: 'Kuala Lumpur', date: 'Baru sat (2 minit lepas)', phone: '60123456789' },
  { id: '2', truckType: '1 Tan', origin: 'Johor Bahru', destination: 'Kuala Lumpur', date: '15 minit lepas', phone: '60123456789' },
  { id: '3', truckType: '10 Tan', origin: 'Kuala Lumpur', destination: 'Penang', date: '1 jam lepas', phone: '60123456789' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard TripMatch AI</h1>
          <p className="text-sm text-slate-400 mt-1">Sistem padanan trip balik lori paling pantas.</p>
        </div>

        <RouteForm />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Padanan Live Terkini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockJobs.map((job) => (
              <JobCard 
                key={job.id}
                id={job.id}
                truckType={job.truckType}
                origin={job.origin}
                destination={job.destination}
                date={job.date}
                phone={job.phone}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
