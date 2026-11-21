import React, { useState } from 'react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { CheckCircle2, XCircle, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComparePage: React.FC = () => {
  const [bike1Id, setBike1Id] = useState<string>('bike-001');
  const [bike2Id, setBike2Id] = useState<string>('bike-003');
  const [bike3Id, setBike3Id] = useState<string>('bike-002');

  const bike1 = SEED_LISTINGS.find((b) => b.id === bike1Id) || SEED_LISTINGS[0];
  const bike2 = SEED_LISTINGS.find((b) => b.id === bike2Id) || SEED_LISTINGS[1];
  const bike3 = SEED_LISTINGS.find((b) => b.id === bike3Id) || SEED_LISTINGS[2];

  const selectedBikes = [bike1, bike2, bike3];

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold text-forest-300 uppercase tracking-widest">
            HEAD-TO-HEAD MATRIX
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            Compare Two-Wheelers Side-by-Side
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Evaluate specifications, estimated running cost, fair price valuation and AI verdict across up to 3 rides.
          </p>
        </div>

        {/* Vehicles Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedBikes.map((bike, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-[#101D19] border border-forest-800 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-forest-950">
                <img src={bike.primaryImage} alt={bike.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white uppercase">
                  {bike.category}
                </span>
              </div>

              <div>
                <select
                  value={bike.id}
                  onChange={(e) => {
                    if (idx === 0) setBike1Id(e.target.value);
                    if (idx === 1) setBike2Id(e.target.value);
                    if (idx === 2) setBike3Id(e.target.value);
                  }}
                  className="w-full bg-forest-950 text-white text-xs font-bold border border-forest-800 rounded-xl px-3 py-2"
                >
                  {SEED_LISTINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.year} {b.title}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-heading font-extrabold text-xl text-white">{formatINR(bike.price)}</span>
                  <Link to={`/bike/${bike.id}`} className="text-xs text-forest-300 font-bold hover:underline">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl bg-[#101D19] border border-forest-800 overflow-hidden shadow-2xl">
          <div className="p-5 bg-forest-950 border-b border-forest-800 flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Full Specifications Comparison</h3>
            <span className="text-xs text-forest-300 font-medium">3 Rides Selected</span>
          </div>

          <div className="divide-y divide-forest-900/60 text-xs">
            {/* Manufacturing Year */}
            <div className="grid grid-cols-4 p-4 items-center">
              <span className="text-slate-400 font-semibold">Manufacturing Year</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-white">{b.year} ({b.regState})</span>
              ))}
            </div>

            {/* Odometer */}
            <div className="grid grid-cols-4 p-4 items-center bg-forest-950/30">
              <span className="text-slate-400 font-semibold">Odometer (KM)</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-white">{b.km.toLocaleString('en-IN')} km</span>
              ))}
            </div>

            {/* Fuel / Powertrain */}
            <div className="grid grid-cols-4 p-4 items-center">
              <span className="text-slate-400 font-semibold">Powertrain</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-white capitalize">{b.fuel}</span>
              ))}
            </div>

            {/* Power Output */}
            <div className="grid grid-cols-4 p-4 items-center bg-forest-950/30">
              <span className="text-slate-400 font-semibold">Max Power</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-forest-300">{b.specs.powerBhp || 'N/A'}</span>
              ))}
            </div>

            {/* Fuel Mileage / EV Range */}
            <div className="grid grid-cols-4 p-4 items-center">
              <span className="text-slate-400 font-semibold">Efficiency / Range</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-emerald-400">
                  {b.specs.mileageKmpl ? `${b.specs.mileageKmpl} kmpl` : `${b.specs.rangeKm} km Range`}
                </span>
              ))}
            </div>

            {/* Estimated Running Cost per Month (assuming 500 km/month) */}
            <div className="grid grid-cols-4 p-4 items-center bg-forest-950/30">
              <span className="text-slate-400 font-semibold">Running Cost (500 km/mo)</span>
              {selectedBikes.map((b, i) => {
                const cost = b.fuel === 'electric' ? '₹125 / month' : '₹1,450 / month';
                return (
                  <span key={i} className="font-bold text-gold-light">{cost}</span>
                );
              })}
            </div>

            {/* Inspection Score */}
            <div className="grid grid-cols-4 p-4 items-center">
              <span className="text-slate-400 font-semibold">120-Point Inspection</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="font-bold text-white">{b.inspectionScore} / 5.0</span>
              ))}
            </div>

            {/* Document Verification */}
            <div className="grid grid-cols-4 p-4 items-center bg-forest-950/30">
              <span className="text-slate-400 font-semibold">RTO Verified</span>
              {selectedBikes.map((b, i) => (
                <span key={i} className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Yes (Parivahan)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Final Verdict Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#142B23] to-[#0D1C17] border border-forest-600/70 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">AI Verdict & Recommendations</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            • <strong>For Minimum Operating Costs:</strong> {bike2.title} ({bike2.fuel}) will save you over ₹15,000 per year in fuel.<br />
            • <strong>For Weekend Highway Touring:</strong> {bike1.title} provides superior torque and highway stability.<br />
            • <strong>For City Traffic & Grocery Errands:</strong> {bike3.title} offers the lightest kerb weight and easiest handling.
          </p>
        </div>
      </div>
    </div>
  );
};
