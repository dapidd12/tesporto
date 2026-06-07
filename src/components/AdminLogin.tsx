import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Jika user memasukkan email lengkap, gunakan itu. 
      // Jika tidak, tambahkan @admin.com agar cocok dengan format Firebase Auth.
      const formattedEmail = username.includes('@') ? username : `${username.replace(/[^a-zA-Z0-9_.-]/g, '')}@admin.com`;
      await signInWithEmailAndPassword(auth, formattedEmail, password);
      toast.success('Login berhasil!');
      navigate('/admin');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Silakan coba lagi nanti.');
        toast.error('Gagal login: Percobaan terlalu banyak.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Username atau password salah.');
        toast.error('Username atau password salah.');
      } else {
        setError('Terjadi kesalahan: ' + err.message);
        toast.error('Terjadi kesalahan saat login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link 
          to="/" 
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-card hover:text-foreground"
        >
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>
        <div className="rounded-[2.5rem] border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">Masuk untuk mengelola portofolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username / Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-border/50 bg-background/50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20"
                placeholder="Masukkan username atau email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-border/50 bg-background/50 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-center text-sm font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        </div>
      </motion.div>
    </section>
  );
}
