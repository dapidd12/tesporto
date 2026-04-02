import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send, User } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: Timestamp | null;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    }, (err) => {
      console.error("Error fetching comments:", err);
      setError("Gagal memuat komentar.");
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'comments'), {
        name: name.trim().substring(0, 50),
        text: text.trim().substring(0, 500),
        createdAt: serverTimestamp(),
      });
      
      setName('');
      setText('');
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Baru saja';
    const date = timestamp.toDate();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <section id="comments" className="bg-muted/20 px-6 py-8 dark:bg-muted/5 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Buku Tamu</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Komentar</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <form onSubmit={handleSubmit} className="sticky top-24 space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-display font-bold tracking-tight mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-primary" />
                Tinggalkan Pesan
              </h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nama Anda</label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Komentar</label>
                <textarea
                  required
                  maxLength={500}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis sesuatu yang menarik..."
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 text-center">{error}</p>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-black uppercase tracking-widest text-background transition-all hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'} 
                {!isSubmitting && <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
              </button>
            </form>
          </motion.div>

          {/* Comments List Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold tracking-tight">{comments.length} Komentar</h3>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment, i) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={20} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">{comment.name}</h4>
                      <span className="text-[10px] font-medium text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {comment.text}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
                  <MessageCircle size={32} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">Belum ada komentar.</p>
                  <p className="text-xs">Jadilah yang pertama meninggalkan pesan!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
