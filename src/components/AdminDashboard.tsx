import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit, Save, X, Briefcase, Award, Bell, Image as ImageIcon, Music, User, MessageCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({
    name: '',
    nickname: '',
    location: '',
    email: '',
    whatsapp: '',
    summary: '',
    status: '',
    profileImage: '',
    roles: [],
    mapsEmbed: '',
    vision: '',
    mission: '',
    intro: '',
    marqueeSpeed: 30
  });
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

  const [isEditingSkill, setIsEditingSkill] = useState<string | null>(null);
  const [editSkillForm, setEditSkillForm] = useState<any>({});

  const [isEditingSocial, setIsEditingSocial] = useState<string | null>(null);
  const [editSocialForm, setEditSocialForm] = useState<any>({});

  const [isEditingTestimonial, setIsEditingTestimonial] = useState<string | null>(null);
  const [editTestimonialForm, setEditTestimonialForm] = useState<any>({});
  
  const [confirmDelete, setConfirmDelete] = useState<{id: string, type: string} | null>(null);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'certificates' | 'skills' | 'socials' | 'testimonials' | 'announcements' | 'gallery' | 'playlist' | 'comments'>('profile');
  
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
      const [projectsSnap, certsSnap, annSnap, gallerySnap, playlistSnap, skillsSnap, socialsSnap, testimonialsSnap, commentsSnap, profileSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'certificates')),
        getDocs(collection(db, 'announcements')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'playlist')),
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'socials')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'comments')),
        getDocs(collection(db, 'settings'))
      ]);
      
      setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCertificates(certsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGallery(gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlaylist(playlistSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSkills(skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSocials(socialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTestimonials(testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setComments(commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const profileDoc = profileSnap.docs.find(d => d.id === 'profile');
      if (profileDoc) {
        setProfile({ ...profileDoc.data(), id: profileDoc.id });
      }

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
      handleFirestoreError(error, OperationType.GET, 'multiple_collections');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Berhasil logout!");
    navigate('/');
  };

  // --- Profile ---
  const saveProfile = async () => {
    try {
      const updatedProfile = {
        ...profile,
        roles: typeof profile.roles === 'string' ? profile.roles.split(',').map((r: string) => r.trim()).filter(Boolean) : profile.roles
      };
      await setDoc(doc(db, 'settings', 'profile'), updatedProfile, { merge: true });
      setProfile(updatedProfile);
      toast.success("Profil berhasil disimpan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/profile');
    }
  };

  // --- Skills ---
  const handleAddSkill = async () => {
    const newSkill = {
      category: "New Category",
      items: ["Skill 1"],
      type: "programming",
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, 'skills'), newSkill);
      setSkills([{ id: docRef.id, ...newSkill }, ...skills]);
      toast.success("Skill berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'skills');
    }
  };

  const startEditSkill = (skill: any) => {
    setIsEditingSkill(skill.id);
    setEditSkillForm({ ...skill, items: skill.items?.join(', ') || '' });
  };

  const saveEditSkill = async () => {
    try {
      const updatedData = {
        ...editSkillForm,
        items: editSkillForm.items.split(',').map((i: string) => i.trim()).filter(Boolean)
      };
      await updateDoc(doc(db, 'skills', isEditingSkill!), updatedData);
      setSkills(skills.map(s => s.id === isEditingSkill ? { ...updatedData, id: s.id } : s));
      setIsEditingSkill(null);
      toast.success("Skill berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `skills/${isEditingSkill}`);
    }
  };

  // --- Socials ---
  const handleAddSocial = async () => {
    const newSocial = {
      name: "Instagram",
      handle: "@username",
      url: "https://instagram.com/username",
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, 'socials'), newSocial);
      setSocials([{ id: docRef.id, ...newSocial }, ...socials]);
      toast.success("Social media berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'socials');
    }
  };

  const startEditSocial = (social: any) => {
    setIsEditingSocial(social.id);
    setEditSocialForm({ ...social });
  };

  const saveEditSocial = async () => {
    try {
      await updateDoc(doc(db, 'socials', isEditingSocial!), editSocialForm);
      setSocials(socials.map(s => s.id === isEditingSocial ? { ...editSocialForm, id: s.id } : s));
      setIsEditingSocial(null);
      toast.success("Social media berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `socials/${isEditingSocial}`);
    }
  };

  // --- Testimonials ---
  const handleAddTestimonial = async () => {
    const newTestimonial = {
      name: "Nama Pengirim",
      role: "Jabatan",
      text: "Isi testimoni",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Test",
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
      setTestimonials([{ id: docRef.id, ...newTestimonial }, ...testimonials]);
      toast.success("Testimoni berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'testimonials');
    }
  };

  const startEditTestimonial = (testimonial: any) => {
    setIsEditingTestimonial(testimonial.id);
    setEditTestimonialForm({ ...testimonial });
  };

  const saveEditTestimonial = async () => {
    try {
      await updateDoc(doc(db, 'testimonials', isEditingTestimonial!), editTestimonialForm);
      setTestimonials(testimonials.map(t => t.id === isEditingTestimonial ? { ...editTestimonialForm, id: t.id } : t));
      setIsEditingTestimonial(null);
      toast.success("Testimoni berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `testimonials/${isEditingTestimonial}`);
    }
  };

  // --- Comments ---
  const handleDeleteComment = async (id: string) => {
    setConfirmDelete({ id, type: 'comments' });
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
      toast.success("Project berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
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
      toast.success("Project berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${isEditingProject}`);
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
      toast.success("Sertifikat berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'certificates');
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
      toast.success("Sertifikat berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `certificates/${isEditingCert}`);
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
      toast.success("Pengumuman berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
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
      toast.success("Pengumuman berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `announcements/${isEditingAnn}`);
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
      toast.success("Foto berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'gallery');
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
      if (type === 'skills') setSkills(skills.filter(s => s.id !== id));
      if (type === 'socials') setSocials(socials.filter(s => s.id !== id));
      if (type === 'testimonials') setTestimonials(testimonials.filter(t => t.id !== id));
      if (type === 'comments') setComments(comments.filter(c => c.id !== id));
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${type}/${id}`);
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
      toast.success("Foto berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `gallery/${isEditingGallery}`);
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
      toast.success("Lagu berhasil ditambahkan!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'playlist');
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
      toast.success("Lagu berhasil diperbarui!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `playlist/${isEditingSong}`);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <section className="min-h-screen px-4 py-12 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-black tracking-tighter md:text-4xl">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground md:text-sm">Kelola konten portofolio Anda</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white md:hidden"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="hidden items-center justify-center gap-2 rounded-full bg-red-500/10 px-6 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white md:flex"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="mb-8 flex overflow-x-auto pb-4 gap-2 border-b border-border hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'certificates', label: 'Certs', icon: Award },
            { id: 'skills', label: 'Skills', icon: Plus },
            { id: 'socials', label: 'Socials', icon: Plus },
            { id: 'testimonials', label: 'Testimoni', icon: Plus },
            { id: 'announcements', label: 'News', icon: Bell },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'playlist', label: 'Music', icon: Music },
            { id: 'comments', label: 'Comments', icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6 md:space-y-8">
          {activeTab === 'profile' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Profil Global</h2>
                <button
                  onClick={saveProfile}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Save size={18} /> Simpan Profil
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Panggilan / Nickname</label>
                  <input
                    type="text"
                    value={profile.nickname}
                    onChange={e => setProfile({...profile, nickname: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lokasi</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={e => setProfile({...profile, location: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status (e.g. Pelajar)</label>
                  <input
                    type="text"
                    value={profile.status}
                    onChange={e => setProfile({...profile, status: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">WhatsApp (e.g. 628...)</label>
                  <input
                    type="text"
                    value={profile.whatsapp}
                    onChange={e => setProfile({...profile, whatsapp: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">URL Foto Profil</label>
                  <input
                    type="text"
                    value={profile.profileImage}
                    onChange={e => setProfile({...profile, profileImage: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ringkasan / Summary</label>
                  <textarea
                    value={profile.summary}
                    onChange={e => setProfile({...profile, summary: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Roles (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={Array.isArray(profile.roles) ? profile.roles.join(', ') : profile.roles}
                    onChange={e => setProfile({...profile, roles: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    placeholder="Web Developer, Cyber Security, dll"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={profile.mapsEmbed}
                    onChange={e => setProfile({...profile, mapsEmbed: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pengenalan Singkat</label>
                  <textarea
                    value={profile.intro || ''}
                    onChange={e => setProfile({...profile, intro: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Visi</label>
                  <textarea
                    value={profile.vision || ''}
                    onChange={e => setProfile({...profile, vision: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Misi</label>
                  <textarea
                    value={profile.mission || ''}
                    onChange={e => setProfile({...profile, mission: e.target.value})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kecepatan Running Text (detik)</label>
                  <input
                    type="number"
                    value={profile.marqueeSpeed || 30}
                    onChange={e => setProfile({...profile, marqueeSpeed: Number(e.target.value)})}
                    className="rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Projects</h2>
                <button
                  onClick={handleAddProject}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Proyek
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
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Certificates</h2>
                <button
                  onClick={handleAddCert}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Sertifikat
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

          {activeTab === 'skills' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Skills</h2>
                <button
                  onClick={handleAddSkill}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Kategori Skill
                </button>
              </div>

              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingSkill === skill.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Kategori</label>
                            <input
                              type="text"
                              value={editSkillForm.category}
                              onChange={e => setEditSkillForm({...editSkillForm, category: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Tipe</label>
                            <select
                              value={editSkillForm.type}
                              onChange={e => setEditSkillForm({...editSkillForm, type: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            >
                              <option value="programming">Programming</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Items (pisahkan dengan koma)</label>
                          <input
                            type="text"
                            value={editSkillForm.items}
                            onChange={e => setEditSkillForm({...editSkillForm, items: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditSkill} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingSkill(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{skill.category}</h3>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">{skill.type}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {skill.items?.map((item: string) => (
                              <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">{item}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditSkill(skill)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => setConfirmDelete({id: skill.id, type: 'skills'})} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Social Links</h2>
                <button
                  onClick={handleAddSocial}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Social
                </button>
              </div>

              <div className="space-y-4">
                {socials.map(social => (
                  <div key={social.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingSocial === social.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Platform</label>
                            <input
                              type="text"
                              value={editSocialForm.name}
                              onChange={e => setEditSocialForm({...editSocialForm, name: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Handle / Username</label>
                            <input
                              type="text"
                              value={editSocialForm.handle}
                              onChange={e => setEditSocialForm({...editSocialForm, handle: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">URL Profil</label>
                          <input
                            type="text"
                            value={editSocialForm.url}
                            onChange={e => setEditSocialForm({...editSocialForm, url: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditSocial} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingSocial(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{social.name}</h3>
                          <p className="text-sm text-muted-foreground">{social.handle}</p>
                          <p className="text-xs text-primary truncate">{social.url}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditSocial(social)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => setConfirmDelete({id: social.id, type: 'socials'})} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Testimonials</h2>
                <button
                  onClick={handleAddTestimonial}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Testimoni
                </button>
              </div>

              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    {isEditingTestimonial === testimonial.id ? (
                      <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Nama</label>
                            <input
                              type="text"
                              value={editTestimonialForm.name}
                              onChange={e => setEditTestimonialForm({...editTestimonialForm, name: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Role / Jabatan</label>
                            <input
                              type="text"
                              value={editTestimonialForm.role}
                              onChange={e => setEditTestimonialForm({...editTestimonialForm, role: e.target.value})}
                              className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">URL Foto</label>
                          <input
                            type="text"
                            value={editTestimonialForm.image}
                            onChange={e => setEditTestimonialForm({...editTestimonialForm, image: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground">Testimoni</label>
                          <textarea
                            value={editTestimonialForm.text}
                            onChange={e => setEditTestimonialForm({...editTestimonialForm, text: e.target.value})}
                            className="rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
                            rows={3}
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={saveEditTestimonial} className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"><Save size={16} /> Simpan</button>
                          <button onClick={() => setIsEditingTestimonial(null)} className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/80"><X size={16} /> Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          {testimonial.image ? (
                            <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                              {testimonial.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold">{testimonial.name}</h3>
                            <p className="text-sm text-primary font-bold uppercase tracking-widest">{testimonial.role}</p>
                            <p className="text-sm text-muted-foreground mt-1 italic">"{testimonial.text}"</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => startEditTestimonial(testimonial)} className="rounded-full bg-blue-500/10 p-3 text-blue-500 hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => setConfirmDelete({id: testimonial.id, type: 'testimonials'})} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-display font-bold md:text-2xl">Moderasi Komentar</h2>
              </div>

              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold">{comment.name}</h3>
                          <span className="text-[10px] font-bold text-muted-foreground">{comment.createdAt?.toDate().toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleDeleteComment(comment.id)} className="rounded-full bg-red-500/10 p-3 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-center text-muted-foreground">Belum ada komentar.</p>}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Announcements</h2>
                <button
                  onClick={handleAddAnn}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Pengumuman
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
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Gallery</h2>
                <button
                  onClick={handleAddGallery}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Foto
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
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl md:rounded-[2rem] md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-display font-bold md:text-2xl">Playlist Musik</h2>
                <button
                  onClick={handleAddSong}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus size={18} /> Tambah Lagu
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
