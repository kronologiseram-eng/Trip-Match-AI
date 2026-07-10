import React from 'react'

interface JobProps {
  id: string;
  truckType: string;
  origin: string;
  destination: string;
  date: string;
  phone: string;
}

export default function JobCard({ truckType, origin, destination, date, phone }: JobProps) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md hover:border-amber-500/50 transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
          Lori {truckType}
        </span>
        <span className="text-slate-400 text-xs">{date}</span>
      </div>
      
      <div className="text-white font-medium text-base mb-4 flex items-center gap-2">
        <span>{origin}</span>
        <span className="text-amber-500">➔</span>
        <span>{destination}</span>
      </div>

      <div className="flex gap-2">
        <a 
          href={`https://wa.me/${phone}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          Hubungi Pelanggan (WhatsApp)
        </a>
      </div>
    </div>
  )
}
