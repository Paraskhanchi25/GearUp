import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Users, FileText, Ban, Trash2 } from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';

export const AdminPage: React.FC = () => {
  const [listings, setListings] = useState(SEED_LISTINGS);

  const toggleVerify = (id: string) => {
    setListings(listings.map(l => {
      if (l.id === id) {
        return {
          ...l,
          verificationTier: l.verificationTier === 'physically_inspected' ? 'seller_provided' : 'physically_inspected',
          documentVerified: !l.documentVerified
        };
      }
      return l;
    }));
  };

  const removeListing = (id: string) => {
    if (confirm('Are you sure you want to flag and remove this listing for inspection review?')) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#101D19] border border-forest-800">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              SUPERADMIN PRIVILEGES
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-white mt-1">
              GEAR UP Marketplace Moderation & Trust Engine
            </h1>
            <p className="text-xs text-slate-400">
              Manage 120-point inspection clearances, verify Parivahan RTO filings, and moderate listings.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-red-950/80 text-red-300 border border-red-700/60 font-mono text-xs font-bold">
            Live Database ({listings.length} items)
          </span>
        </div>

        {/* Listings Moderation Table */}
        <div className="rounded-3xl bg-[#101D19] border border-forest-800 overflow-hidden shadow-2xl">
          <div className="p-4 bg-forest-950 border-b border-forest-800 font-bold text-xs text-slate-300 grid grid-cols-12 gap-4">
            <span className="col-span-4">Vehicle & Location</span>
            <span className="col-span-2">Asking Price</span>
            <span className="col-span-3">Verification Tier</span>
            <span className="col-span-3 text-right">Moderator Actions</span>
          </div>

          <div className="divide-y divide-forest-900/60 text-xs">
            {listings.slice(0, 10).map((bike) => (
              <div key={bike.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-forest-950/40 transition-colors">
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <img src={bike.primaryImage} alt={bike.title} className="w-12 h-10 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{bike.title}</p>
                    <p className="text-slate-400 text-[11px]">{bike.area}, {bike.city}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="font-heading font-bold text-white">{formatINR(bike.price)}</p>
                  <p className="text-[10px] text-slate-500">{bike.km.toLocaleString('en-IN')} km</p>
                </div>

                <div className="col-span-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    bike.verificationTier === 'physically_inspected'
                      ? 'bg-forest-700 text-white'
                      : bike.verificationTier === 'document_verified'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bike.verificationTier.replace('_', ' ')}
                  </span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => toggleVerify(bike.id)}
                    className="px-2.5 py-1 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-[11px] font-semibold transition-colors"
                  >
                    Toggle Cert
                  </button>
                  <button
                    onClick={() => removeListing(bike.id)}
                    className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800"
                    title="Flag listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
