import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

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

    // Map username to a dummy email for Firebase Auth
    const email = `${username}@admin.com`;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      // If user not found and it's the exact requested credentials, create it
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (username === 'kaidev' && password === 'kaidev0010') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/admin');
            return;
          } catch (createErr: any) {
            setError('Gagal membuat akun admin: ' + createErr.message);
          }
        } else {
          setError('Username atau password salah.');
        }
      } else {
        setError('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2.5rem] border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">Masuk untuk mengelola portofolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</label>
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
                placeholder="Masukkan username"
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
      </motion.div>
    </section>
  );
}
