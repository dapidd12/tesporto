import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CV_DATA } from '../data';
import { Mail, MessageSquare, Send, Instagram, Music2, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CV_DATA.email}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `Pesan Baru dari ${formData.name} (Portofolio)`
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="px-6 py-8 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Hubungi Saya</span>
            </div>
            <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl leading-[1.1]">Mari berkolaborasi untuk proyek Anda selanjutnya.</h2>
            
            <div className="space-y-4">
              <a
                href={`mailto:${CV_DATA.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="text-lg font-bold tracking-tight">{CV_DATA.email}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${CV_DATA.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/5 text-green-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <p className="text-lg font-bold tracking-tight">+{CV_DATA.whatsapp}</p>
                </div>
              </a>
            </div>

            <div className="flex gap-4">
              {CV_DATA.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card transition-all duration-500 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 active:scale-90"
                  title={social.name}
                >
                  <div className="transition-transform duration-500 group-hover:scale-110">
                    {social.name === 'Instagram' ? <Instagram size={20} /> : 
                     social.name === 'Tiktok' ? <Music2 size={20} /> : <Send size={20} />}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border bg-muted/20 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe
                src={CV_DATA.mapsEmbed}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dafid Sabria"
                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hello@example.com"
                    className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Pesan</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan proyek Anda..."
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-muted/20 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-5 text-sm font-black uppercase tracking-widest text-background transition-all hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === 'loading' ? 'Mengirim...' : status === 'success' ? 'Terkirim!' : status === 'error' ? 'Gagal Mengirim' : 'Kirim Pesan'}
                {status === 'idle' && <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
              </button>
              {status === 'success' && (
                <p className="text-center text-xs font-bold text-green-500 mt-2">
                  Pesan berhasil dikirim!
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-xs font-bold text-red-500 mt-2">
                  Gagal mengirim pesan. Silakan coba lagi.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
