import React from 'react';
import { ShieldCheck, Compass, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242923] pb-24 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#596B59] uppercase tracking-widest">
            SIMPLE, TRANSPARENT MOBILITY
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            How GEAR UP Works
          </h1>
          <p className="text-[#77796F] text-sm max-w-xl mx-auto">
            From discovering rides on the GPS map to 120-point inspections and doorstep Parivahan RC transfers.
          </p>
        </div>

        {/* Buying Guide */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5E1D7] space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-white">Buying a Two-Wheeler</h2>

          <div className="space-y-4 text-xs">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-xl bg-[#E5D9C7]/40 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Select Your City Hub & Radius</h4>
                <p className="text-[#77796F] mt-0.5 leading-relaxed">
                  Choose from popular hubs like Chandigarh Sector 17, Delhi CP, or Bangalore Koramangala, or allow browser GPS permission. Adjust the radius from 2 km to 50 km.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-xl bg-[#E5D9C7]/40 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Listen to Rider Audio Stories & AI Valuation</h4>
                <p className="text-[#77796F] mt-0.5 leading-relaxed">
                  Every certified bike listing includes seller audio testimonials, battery diagnostics for EVs, and an AI fair-price meter based on true market data.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-xl bg-[#E5D9C7]/40 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Doorstep Test Ride & Parivahan Transfer</h4>
                <p className="text-[#77796F] mt-0.5 leading-relaxed">
                  Book a test ride at a certified partner hub or your doorstep. Once satisfied, our team coordinates the complete Form 29 & 30 ownership transfer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selling Guide */}
        <section className="p-8 rounded-3xl bg-white border border-[#E5E1D7] space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-white">Selling Your Two-Wheeler</h2>

          <div className="space-y-4 text-xs">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-xl bg-gold/30 text-gold-light flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Upload Photos & Get AI Cosmetic Observations</h4>
                <p className="text-[#77796F] mt-0.5 leading-relaxed">
                  Our computer vision models identify cosmetic imperfections and suggest missing camera angles to ensure buyers get full transparency.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-xl bg-gold/30 text-gold-light flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Optimize in the AI Resale Studio</h4>
                <p className="text-[#77796F] mt-0.5 leading-relaxed">
                  Don&apos;t settle for lowball offers. Spend ₹1,500 on detailing or seat reconditioning and pocket ₹7,500+ extra in resale value.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/sell"
              className="px-6 py-3 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>List Your Bike Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
