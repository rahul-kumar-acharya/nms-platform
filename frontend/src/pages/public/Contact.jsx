import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <SEO 
        title="Contact Support & Helpdesk Bureau"
        description="Get in touch with the NMS Platform support bureau and engineering desk for EPIN inquiries, member registration, and withdrawal assistance."
        keywords="contact nms support, nms helpdesk, network portal contact, binary platform support, epin support desk"
        canonicalPath="/contact"
      />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">Contact Helpdesk & Support</h1>
        <p className="text-sm text-[#554F47]">Have questions regarding registration, EPIN keys, or binary pair payouts?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#1C1917] text-lg">Email Support</h3>
            <p className="text-xs text-[#554F47]">Send your support tickets to our dedicated compliance desk.</p>
            <p className="text-xs font-bold text-[#1B3B2B]">support@nms-platform.com</p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#A37B34] text-white flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#1C1917] text-lg">Telephone Helpline</h3>
            <p className="text-xs text-[#554F47]">Monday through Friday, 9:00 AM – 6:00 PM EST.</p>
            <p className="text-xs font-bold text-[#A37B34]">+1 (800) 555-NMS-HELP</p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#5C1D24] text-[#F7F4EF] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#1C1917] text-lg">Headquarters</h3>
            <p className="text-xs text-[#554F47]">Financial District Tower, Suite 400</p>
          </div>
        </div>

        {/* Interactive Form */}
        <div className="glass-card p-8 lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Send Support Inquiry</h2>

          {submitted && (
            <div className="p-4 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Thank you! Your support message has been logged. Our helpdesk team will respond promptly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Your Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
              </div>
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input type="text" placeholder="e.g. EPIN Key Inquiry" value={subject} onChange={e => setSubject(e.target.value)} required className="form-input" />
            </div>

            <div>
              <label className="form-label">Message Content</label>
              <textarea placeholder="Describe your question or issue in detail..." value={message} onChange={e => setMessage(e.target.value)} required className="form-input h-32" />
            </div>

            <button type="submit" className="btn-primary text-sm py-3 px-8">
              <Send className="w-4 h-4" /> Transmit Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
