import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit, Save, X, Briefcase, Award, Bell, Image as ImageIcon, Music } from 'lucide-react';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditingProject, setIsEditingProject] = useState<string | null>(null);
  const [editProjectForm, setEditProjectForm] = useState<any>({});
  
  const [isEditingCert, setIsEditingCert] = useState<string | null>(null);
  const [editCertForm, setEditCertForm] = useState<any>({});

  const [isEditingAnn, setIsEditingAnn] = useState<string | null>(null);
  const [editAnnForm, setEditAnnForm] = useState<any>({});

  const [isEditingGallery, setIsEditingGallery] = useState<string | null>(null);
  const [editGalleryForm, setEditGalleryForm] = useState<any>({});
  
  const [isEditingSong, setIsEditingSong] = useState<string | null>(null);
  const [editSongForm, setEditSongForm] = useState<any>({});
  
  const [confirmDelete, setConfirmDelete] = useState<{id: string, type: string} | null>(null);
  
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'announcements' | 'gallery' | 'playlist'>('projects');
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsSnap, certsSnap, annSnap, gallerySnap, playlistSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'certificates')),
        getDocs(collection(db, 'announcements')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'playlist'))
      ]);
      
      setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCertificates(certsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGallery(gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlaylist(playlistSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Check and auto-delete expired announcements
      const now = new Date();
      const validAnnouncements: any[] = [];
      for (const docSnap of annSnap.docs) {
        const data = docSnap.data();
        const expiresAt = data.expiresAt?.toDate();
        if (expiresAt && expiresAt < now) {
          // Auto delete expired
          await deleteDoc(doc(db, 'announcements', docSnap.id));
        } else {
          validAnnouncements.push({ id: docSnap.id, ...data });
        }
      }
      setAnnouncements(validAnnouncements);

    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- Projects ---
  const handleAddProject = async () => {
    const newProject = {
      name: "New Project",
      description: "Description here",
      url: "https://example.com",
      tags: ["Tag1"],
      image: "",
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, 'projects'), newProject);
      setProjects([{ id: docRef.id, ...newProject }, ...projects]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setConfirmDelete({ id, type: 'projects' });
  };

  const startEditProject = (project: any) => {
    setIsEditingProject(project.id);
    setEditProjectForm({ ...project, tags: project.tags?.join(', ') || '' });
  };

  const saveEditProject = async () => {
    try {
      const updatedData = {
        ...editProjectForm,
        tags: editProjectForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      };
      await updateDoc(doc(db, 'projects', isEditingProject!), updatedData);
      setProjects(projects.map(p => p.id === isEditingProject ? { ...updatedData, id: p.id } : p));
      setIsEditingProject(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // --- Certificates ---
  const handleAddCert = async () => {
    const newCert = {
      name: "New Certificate",
      tag: "Tag",
      url: "https://example.com/cert.pdf",
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, 'certificates'), newCert);
      setCertificates([{ id: docRef.id, ...newCert }, ...certificates]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteCert = async (id: string) => {
    setConfirmDelete({ id, type: 'certificates' });
  };

  const startEditCert = (cert: any) => {
    setIsEditingCert(cert.id);
    setEditCertForm({ ...cert });
  };

  const saveEditCert = async () => {
    try {
      await updateDoc(doc(db, 'certificates', isEditingCert!), editCertForm);
      setCertificates(certificates.map(c => c.id === isEditingCert ? { ...editCertForm, id: c.id } : c));
      setIsEditingCert(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // --- Announcements ---
  const handleAddAnn = async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days
    const newAnn = {
      title: "Pengumuman Baru",
      content: "Isi pengumuman",
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.fromDate(new Date())
    };
    try {
      const docRef = await addDoc(collection(db, 'announcements'), newAnn);
      setAnnouncements([{ id: docRef.id, ...newAnn }, ...announcements]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteAnn = async (id: string) => {
    setConfirmDelete({ id, type: 'announcements' });
  };

  const startEditAnn = (ann: any) => {
    setIsEditingAnn(ann.id);
    // Format date for datetime-local input
    const date = ann.expiresAt?.toDate() || new Date();
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEditAnnForm({ ...ann, expiresAtInput: formattedDate });
  };

  const saveEditAnn = async () => {
    try {
      const updatedData = {
        title: editAnnForm.title,
        content: editAnnForm.content,
        expiresAt: Timestamp.fromDate(new Date(editAnnForm.expiresAtInput))
      };
      await updateDoc(doc(db, 'announcements', isEditingAnn!), updatedData);
      setAnnouncements(announcements.map(a => a.id === isEditingAnn ? { ...a, ...updatedData } : a));
      setIsEditingAnn(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // --- Gallery ---
  const handleAddGallery = async () => {
    const newGallery = {
      title: "Foto Baru",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      createdAt: Timestamp.fromDate(new Date())
    };
    try {
      const docRef = await addDoc(collection(db, 'gallery'), newGallery);
      setGallery([{ id: docRef.id, ...newGallery }, ...gallery]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setConfirmDelete({ id, type: 'gallery' });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    try {
      await deleteDoc(doc(db, type, id));
      if (type === 'projects') setProjects(projects.filter(p => p.id !== id));
      if (type === 'certificates') setCertificates(certificates.filter(c => c.id !== id));
      if (type === 'announcements') setAnnouncements(announcements.filter(a => a.id !== id));
      if (type === 'gallery') setGallery(gallery.filter(g => g.id !== id));
      if (type === 'playlist') setPlaylist(playlist.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
    setConfirmDelete(null);
  };

  const startEditGallery = (item: any) => {
    setIsEditingGallery(item.id);
    setEditGalleryForm({ ...item });
  };

  const saveEditGallery = async () => {
    try {
      await updateDoc(doc(db, 'gallery', isEditingGallery!), editGalleryForm);
      setGallery(gallery.map(g => g.id === isEditingGallery ? { ...editGalleryForm, id: g.id } : g));
      setIsEditingGallery(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // --- Playlist ---
  const handleAddSong = async () => {
    const newSong = {
      title: "Judul Lagu",
      artist: "Nama Artis",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      createdAt: Timestamp.fromDate(new Date())
    };
    try {
      const docRef = await addDoc(collection(db, 'playlist'), newSong);
      setPlaylist([{ id: docRef.id, ...newSong }, ...playlist]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteSong = async (id: string) => {
    setConfirmDelete({ id, type: 'playlist' });
  };

  const startEditSong = (song: any) => {
    setIsEditingSong(song.id);
    setEditSongForm({ ...song });
  };

  const saveEditSong = async () => {
    try {
      await updateDoc(doc(db, 'playlist', isEditingSong!), editSongForm);
      setPlaylist(playlist.map(s => s.id === isEditingSong ? { ...editSongForm, id: s.id } : s));
      setIsEditingSong(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <section className="min-h-screen px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tighter">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola konten portofolio Anda</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-full bg-red-500/10 px-6 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="mb-8 flex overflow-x-auto pb-2 gap-2 border-b border-border hide-scrollbar">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Briefcase size={18} /> Projects
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'certificates' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Award size={18} /> Certificates
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'announcements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Bell size={18} /> Announcements
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <ImageIcon size={18} /> Gallery
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'playlist' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Music size={18} /> Playlist
          </button>
        </div>

        <div className="space-y-8">
          {activeTab === 'projects' && (
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Projects</h2>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={16} /> Tambah Proyek
                </button>
              </div>

              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingProject === project.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Nama Proyek</label>
                            <input
                              type="text"
                              value={editProjectForm.name}
                              onChange={e => setEditProjectForm({...editProjectForm, name: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="Nama Proyek"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">URL Proyek</label>
                            <input
                              type="text"
                              value={editProjectForm.url}
                              onChange={e => setEditProjectForm({...editProjectForm, url: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="URL"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Deskripsi</label>
                          <textarea
                            value={editProjectForm.description}
                            onChange={e => setEditProjectForm({...editProjectForm, description: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Deskripsi"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">URL Gambar</label>
                            <input
                              type="text"
                              value={editProjectForm.image}
                              onChange={e => setEditProjectForm({...editProjectForm, image: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="URL Gambar"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Tags (pisahkan dengan koma)</label>
                            <input
                              type="text"
                              value={editProjectForm.tags}
                              onChange={e => setEditProjectForm({...editProjectForm, tags: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="React, Tailwind, dll"
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditProject} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingProject(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.tags?.map((t: string) => <span key={t} className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{t}</span>)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditProject(project)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProject(project.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {projects.length === 0 && <p className="text-center text-muted-foreground">Belum ada proyek.</p>}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Certificates</h2>
                <button
                  onClick={handleAddCert}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={16} /> Tambah Sertifikat
                </button>
              </div>

              <div className="space-y-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingCert === cert.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Nama Sertifikat</label>
                          <input
                            type="text"
                            value={editCertForm.name}
                            onChange={e => setEditCertForm({...editCertForm, name: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Nama Sertifikat"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Tag / Penerbit</label>
                          <input
                            type="text"
                            value={editCertForm.tag}
                            onChange={e => setEditCertForm({...editCertForm, tag: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Tag (e.g. Dicoding)"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">URL PDF / Gambar</label>
                          <input
                            type="text"
                            value={editCertForm.url}
                            onChange={e => setEditCertForm({...editCertForm, url: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="URL PDF"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditCert} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingCert(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{cert.name}</h3>
                          <span className="mt-2 inline-block rounded bg-secondary/10 px-2 py-1 text-[10px] font-bold text-secondary">{cert.tag}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditCert(cert)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteCert(cert.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {certificates.length === 0 && <p className="text-center text-muted-foreground">Belum ada sertifikat.</p>}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Announcements</h2>
                <button
                  onClick={handleAddAnn}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={16} /> Tambah Pengumuman
                </button>
              </div>

              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingAnn === ann.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Judul Pengumuman</label>
                          <input
                            type="text"
                            value={editAnnForm.title}
                            onChange={e => setEditAnnForm({...editAnnForm, title: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Judul Pengumuman"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Isi Pengumuman</label>
                          <textarea
                            value={editAnnForm.content}
                            onChange={e => setEditAnnForm({...editAnnForm, content: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Isi Pengumuman"
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Hapus Otomatis Pada:</label>
                          <input
                            type="datetime-local"
                            value={editAnnForm.expiresAtInput}
                            onChange={e => setEditAnnForm({...editAnnForm, expiresAtInput: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditAnn} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingAnn(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{ann.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{ann.content}</p>
                          <span className="mt-3 inline-block rounded bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500">
                            Berakhir: {ann.expiresAt?.toDate().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditAnn(ann)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteAnn(ann.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {announcements.length === 0 && <p className="text-center text-muted-foreground">Belum ada pengumuman aktif.</p>}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Gallery</h2>
                <button
                  onClick={handleAddGallery}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={16} /> Tambah Foto
                </button>
              </div>

              <div className="space-y-4">
                {gallery.map(item => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingGallery === item.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Judul Foto</label>
                          <input
                            type="text"
                            value={editGalleryForm.title}
                            onChange={e => setEditGalleryForm({...editGalleryForm, title: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="Judul Foto"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">URL Gambar</label>
                          <input
                            type="text"
                            value={editGalleryForm.imageUrl}
                            onChange={e => setEditGalleryForm({...editGalleryForm, imageUrl: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="URL Gambar"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditGallery} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingGallery(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                          )}
                          <div className="overflow-hidden">
                            <h3 className="text-xl font-bold truncate">{item.title}</h3>
                            <p className="text-xs text-muted-foreground truncate">{item.imageUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditGallery(item)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteGallery(item.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {gallery.length === 0 && <p className="text-center text-muted-foreground">Belum ada foto di galeri.</p>}
              </div>
            </div>
          )}

          {activeTab === 'playlist' && (
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Playlist Musik</h2>
                <button
                  onClick={handleAddSong}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={16} /> Tambah Lagu
                </button>
              </div>

              <div className="space-y-4">
                {playlist.map(song => (
                  <div key={song.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingSong === song.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Judul Lagu</label>
                            <input
                              type="text"
                              value={editSongForm.title}
                              onChange={e => setEditSongForm({...editSongForm, title: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="Judul Lagu"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Nama Artis</label>
                            <input
                              type="text"
                              value={editSongForm.artist}
                              onChange={e => setEditSongForm({...editSongForm, artist: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                              placeholder="Nama Artis"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">URL Audio (mp3/wav)</label>
                          <input
                            type="text"
                            value={editSongForm.audioUrl}
                            onChange={e => setEditSongForm({...editSongForm, audioUrl: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            placeholder="URL Audio (mp3/wav)"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditSong} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingSong(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Music size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="text-xl font-bold truncate">{song.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            <p className="text-xs text-muted-foreground truncate">{song.audioUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditSong(song)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteSong(song.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {playlist.length === 0 && <p className="text-center text-muted-foreground">Belum ada lagu di playlist.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Konfirmasi Hapus</h3>
            <p className="mb-6 text-muted-foreground">Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg px-4 py-2 font-bold text-muted-foreground hover:bg-muted">Batal</button>
              <button onClick={executeDelete} className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
