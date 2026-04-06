import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { toast } from 'sonner';

interface ProjectCommentsProps {
  projectId: string;
}

export default function ProjectComments({ projectId }: ProjectCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!showComments) return;

    const q = query(
      collection(db, 'project_comments'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      // Ignore index errors initially as it might take time to build
      console.error("Error fetching project comments: ", error);
    });

    return () => unsubscribe();
  }, [projectId, showComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'project_comments'), {
        projectId,
        name: name.trim().substring(0, 50),
        text: text.trim().substring(0, 500),
        createdAt: serverTimestamp()
      });
      setName('');
      setText('');
      toast.success("Komentar berhasil dikirim!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'project_comments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-border/50 pt-6">
      <button 
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageSquare size={16} />
        {showComments ? 'Sembunyikan Komentar' : `Lihat Komentar (${comments.length || '...'})`}
      </button>

      {showComments && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className="rounded-xl border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis komentar..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                maxLength={500}
                className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground">Belum ada komentar. Jadilah yang pertama!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-muted/30 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{comment.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {comment.createdAt?.toDate().toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
