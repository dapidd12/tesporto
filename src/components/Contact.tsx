import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CV_DATA } from '../data';
import { useProfile, useCollection } from '../hooks/useContent';
import { Mail, MessageSquare, Send, Instagram, Music2, MapPin, Github, Linkedin, Twitter, Globe } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  'Instagram': Instagram,
  'Tiktok': Music2,
  'GitHub': Github,
  'LinkedIn': Linkedin,
  'Twitter': Twitter,
  'Website': Globe,
  'Telegram': Send
};

export default function Contact() {
  const { profile, loading: profileLoading } = useProfile();
  const { data: firestoreSocials, loading: socialsLoading } = useCollection('socials');
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (profileLoading || socialsLoading) return null;

  const email = profile?.email || CV_DATA.email;
  const whatsapp = profile?.whatsapp || CV_DATA.whatsapp;
  const mapsEmbed = profile?.mapsEmbed || CV_DATA.mapsEmbed;
  const socials = firestoreSocials.length > 0 ? firestoreSocials : CV_DATA.socials;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
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
    <section id="contact" className="relative overflow-hidden bg-background px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
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
                href={`mailto:${email}`}
                className="group flex items-center gap-5 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="text-lg font-bold tracking-tight text-foreground">{email}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <p className="text-lg font-bold tracking-tight text-foreground">+{whatsapp}</p>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {socials.map((social: any) => {
                const Icon = ICON_MAP[social.name] || Send;
                return (
                  <a
                    key={social.id || social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
                    title={social.name}
                  >
                    <div className="transition-transform duration-500 group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="overflow-hidden rounded-[2.5rem] border border-border/50 bg-muted/20 shadow-xl shadow-black/5 dark:shadow-black/20 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-xl p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dafid Sabria"
                    className="w-full rounded-2xl border border-border/50 bg-background/50 px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20"
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
                    className="w-full rounded-2xl border border-border/50 bg-background/50 px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20"
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
                  className="w-full rounded-2xl border border-border/50 bg-background/50 px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:hover:scale-100 mt-2"
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
