import React from 'react';
import { Award, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer className="bg-[#EFECE3] border-t border-[#E2DDD1] text-[#2C2824] pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
        {/* Brand Col */}
        <div className="space-y-3 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-[#1C1917] leading-none block">NMS Platform</span>
              <span className="text-[10px] text-[#A37B34] font-bold uppercase tracking-widest block">Enterprise Network</span>
            </div>
          </div>
          <p className="text-xs text-[#554F47] leading-relaxed">
            Enterprise-grade network management platform providing secure double-entry ledger wallets, automated binary pair income engines, cryptographic EPIN keys, and compliance verification.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-1.5 text-xs text-[#554F47]">
            <li><button onClick={() => setView('home')} className="hover:text-[#1B3B2B] hover:underline">Home</button></li>
            <li><button onClick={() => setView('services')} className="hover:text-[#1B3B2B] hover:underline">Services</button></li>
            <li><button onClick={() => setView('features')} className="hover:text-[#1B3B2B] hover:underline">Platform Features</button></li>
            <li><button onClick={() => setView('faq')} className="hover:text-[#1B3B2B] hover:underline">FAQ & Help</button></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider">Legal & Compliance</h4>
          <ul className="space-y-1.5 text-xs text-[#554F47]">
            <li><button onClick={() => setView('terms')} className="hover:text-[#1B3B2B] hover:underline">Terms & Conditions</button></li>
            <li><button onClick={() => setView('privacy')} className="hover:text-[#1B3B2B] hover:underline">Privacy Policy</button></li>
            <li><button onClick={() => setView('kyc')} className="hover:text-[#1B3B2B] hover:underline">KYC Requirements</button></li>
            <li><button onClick={() => setView('contact')} className="hover:text-[#1B3B2B] hover:underline">Contact Support</button></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 text-xs text-[#554F47]">
          <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider">Helpdesk</h4>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#A37B34] shrink-0" /> support@nms.acharyaworks.in
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#A37B34] shrink-0" /> +1 (800) 555-NMS-HELP
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#A37B34] shrink-0" /> Financial District, Suite 400
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#D8CEBE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#736C63] gap-3 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Network Management System (NMS). All rights reserved.</p>
        <div className="flex items-center gap-3 font-semibold">
          <button onClick={() => setView('terms')} className="hover:underline">Terms</button><span>•</span>
          <button onClick={() => setView('privacy')} className="hover:underline">Privacy</button><span>•</span>
          <button onClick={() => setView('contact')} className="hover:underline">Contact</button>
        </div>
      </div>
    </footer>
  );
}
