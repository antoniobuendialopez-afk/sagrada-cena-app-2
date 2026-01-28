
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, Calendar as CalendarIcon, Users, Music, Package, LogOut, Menu, X, Plus, 
  Download, Share2, Star, FileText, Mail, Key, UserPlus, CheckCircle2, Loader2, 
  FolderOpen, Check, AlertCircle, FileSpreadsheet, ChevronDown, ChevronUp, Copy, 
  Instagram, Facebook, Youtube, Send, MessageSquare, Image as ImageIcon, Mic, 
  Activity, Play, Pause, Smartphone, ExternalLink, Apple, Cpu, ShieldCheck,
  Search, Filter, ExternalLink as LinkIcon, ChevronLeft, Music2, ShieldAlert,
  Twitter, Lock, User, AtSign
} from 'lucide-react';
import { UserRole, Member, BandEvent, NewsItem, InventoryItem, AttendanceStatus, ChatMessage, Score, InstrumentType } from './types';
import { MOCK_MEMBERS, MOCK_NEWS, MOCK_EVENTS, MOCK_INVENTORY, ADMIN_ROLES, MOCK_SCORES, SCORE_CATEGORIES, INSTRUMENT_VOICES } from './constants';
import * as XLSX from 'xlsx';

const LOGO_URL = "https://i.ibb.co/MkqHRVJq/Whats-App-Image-2024-08-08-at-17-21-35-removebg-preview.png";
const BAND_ACCESS_CODE = "CENA2024";

const BrandLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img src={LOGO_URL} alt="Logo AM Sagrada Cena" className="w-full h-full object-contain" />
  </div>
);

// --- Componentes Auxiliares ---

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const playClick = () => {
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const osc = audioContextRef.current.createOscillator();
    const envelope = audioContextRef.current.createGain();
    osc.frequency.value = 880;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);
    osc.connect(envelope);
    envelope.connect(audioContextRef.current.destination);
    osc.start();
    osc.stop(audioContextRef.current.currentTime + 0.1);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timerRef.current = window.setInterval(playClick, interval);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, bpm]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="text-[#841525]" size={24} />
        <h3 className="font-black text-[#841525] uppercase tracking-tighter">Metrónomo</h3>
      </div>
      <div className="text-6xl font-black text-[#841525] mb-6 tabular-nums">{bpm} <span className="text-xl text-slate-300">BPM</span></div>
      <input type="range" min="40" max="220" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#D5A021] mb-8" />
      <button onClick={() => setIsPlaying(!isPlaying)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${isPlaying ? 'bg-[#841525] text-white scale-95' : 'bg-[#D5A021] text-white hover:scale-105'}`}>
        {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
      </button>
    </div>
  );
};

const Tuner = () => {
  const [active, setActive] = useState(false);
  const [cents, setCents] = useState(0);
  useEffect(() => {
    let interval: number;
    if (active) interval = window.setInterval(() => setCents(Math.floor(Math.random() * 20) - 10), 500);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-8">
        <Mic className="text-[#841525]" size={24} />
        <h3 className="font-black text-[#841525] uppercase tracking-tighter">Afinador</h3>
      </div>
      <div className="w-full h-32 relative flex items-end justify-center mb-6">
        <div className="absolute top-0 text-4xl font-black text-[#841525]">Sib</div>
        <div className="w-full h-1 bg-slate-100 absolute bottom-0"></div>
        <div className="w-1 h-16 bg-[#D5A021] absolute transition-all duration-500 rounded-full" style={{ transform: `translateX(${cents * 5}px)`, bottom: 0 }}>
          <div className="w-4 h-4 bg-[#D5A021] rounded-full absolute -top-2 -left-1.5 shadow-lg animate-pulse"></div>
        </div>
      </div>
      <button onClick={() => setActive(!active)} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-[#FDF2F4] text-[#841525] border border-[#841525]/20' : 'bg-[#841525] text-white shadow-lg'}`}>
        {active ? 'DETENER' : 'ACTIVAR'}
      </button>
    </div>
  );
};

const AttendanceModal = ({ event, members, onClose }: { event: BandEvent, members: Member[], onClose: () => void }) => {
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(event.attendance || {});

  const saveAndExport = () => {
    const data = members.map(m => ({ 
      'Músico': `${m.name} ${m.surname}`, 
      'Instrumento': m.instrument, 
      'Estado': attendance[m.id] || 'Pendiente' 
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, `Asistencia_${event.title}_${new Date(event.date).toLocaleDateString()}.xlsx`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#841525]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#FDF2F4]">
          <h2 className="text-xl font-black text-[#841525] uppercase tracking-tighter italic">Pasar Lista: {event.title}</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-xl text-slate-400"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {members.map(m => (
            <div key={m.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs">{m.name} {m.surname} <span className="text-[10px] text-[#D5A021] font-black uppercase">({m.instrument})</span></span>
              <div className="flex gap-1">
                {['Asistió', 'Falta Justificada', 'Falta Injustificada'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setAttendance(prev => ({...prev, [m.id]: status as AttendanceStatus}))}
                    className={`p-2 rounded-lg transition-all ${attendance[m.id] === status ? 'bg-[#841525] text-white shadow-md' : 'bg-white text-slate-300 border border-slate-100'}`}
                  >
                    {status === 'Asistió' ? <Check size={14}/> : status === 'Falta Justificada' ? <AlertCircle size={14}/> : <X size={14}/>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-slate-100 flex gap-4">
          <button onClick={saveAndExport} className="flex-1 bg-[#841525] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2">
            <FileSpreadsheet size={18} /><span>Guardar y Exportar Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- App Principal ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem('cena_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [accessCode, setAccessCode] = useState('');
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [loginStep, setLoginStep] = useState<'code' | 'identify' | 'register'>('code');
  
  // Formulario de Registro
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVoice, setRegVoice] = useState<InstrumentType>('Trompeta 1ª');

  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState<BandEvent | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<InstrumentType | null>(null);
  const [scoreSearch, setScoreSearch] = useState('');

  const isAdmin = useMemo(() => currentUser ? ADMIN_ROLES.includes(currentUser.role) : false, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cena_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cena_user');
    }
  }, [currentUser]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === BAND_ACCESS_CODE) {
      setIsCodeCorrect(true);
      setLoginStep('identify');
    } else {
      alert("Código incorrecto. Contacta con la directiva.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regSurname || !regEmail) return;
    
    const newUser: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      surname: regSurname,
      email: regEmail,
      instrument: regVoice,
      role: UserRole.MUSICO,
      joinDate: new Date().toISOString(),
      attendanceRate: 0
    };
    
    setCurrentUser(newUser);
  };

  const filteredScores = useMemo(() => {
    if (!selectedVoice) return [];
    return MOCK_SCORES.filter(s => {
      const matchesVoice = s.voice === selectedVoice;
      const matchesSearch = s.title.toLowerCase().includes(scoreSearch.toLowerCase()) || 
                           s.author?.toLowerCase().includes(scoreSearch.toLowerCase());
      return matchesVoice && matchesSearch;
    });
  }, [selectedVoice, scoreSearch]);

  // Pantalla de Login / Registro
  if (!currentUser) return (
    <div className="min-h-screen bg-[#FDF2F4] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 border border-[#841525]/5">
        <div className="text-center mb-10">
          <BrandLogo className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-[#841525] uppercase tracking-tighter mb-1">Sagrada Cena</h1>
          <p className="text-[9px] text-[#D5A021] font-black uppercase tracking-[0.4em]">INTRANET • ACCESO PRIVADO</p>
        </div>

        {loginStep === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Código de la Banda</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D5A021]" size={20} />
                <input 
                  type="password" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Introduce el código..." 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#841525]/10 rounded-[1.5rem] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#841525] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all">
              Validar Acceso
            </button>
          </form>
        )}

        {loginStep === 'identify' && (
          <div className="space-y-4">
             <div className="bg-[#FDF2F4] p-4 rounded-2xl border border-[#841525]/10 flex items-center gap-3 mb-6">
               <CheckCircle2 className="text-green-600" size={20} />
               <p className="text-[10px] font-black text-[#841525] uppercase">Código validado correctamente</p>
             </div>
             <button onClick={() => setLoginStep('register')} className="w-full bg-[#841525] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
               <UserPlus size={18} className="text-[#D5A021]" /><span>Soy Nuevo Músico</span>
             </button>
             <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black text-slate-300 uppercase italic">O entra como demo</span>
                <div className="flex-grow border-t border-slate-100"></div>
             </div>
             <button onClick={() => setCurrentUser(MOCK_MEMBERS[0])} className="w-full bg-white text-slate-400 border border-slate-100 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
               Entrar como Admin Demo
             </button>
          </div>
        )}

        {loginStep === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Nombre</label>
                <input value={regName} onChange={e => setRegName(e.target.value)} type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-xs" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Apellidos</label>
                <input value={regSurname} onChange={e => setRegSurname(e.target.value)} type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-xs" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Email</label>
              <input value={regEmail} onChange={e => setRegEmail(e.target.value)} type="email" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-xs" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Tu Voz / Instrumento</label>
              <select 
                value={regVoice} 
                onChange={e => setRegVoice(e.target.value as InstrumentType)}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-xs appearance-none outline-none border-r-8 border-transparent"
              >
                {INSTRUMENT_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-[#841525] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl mt-4">
              Finalizar Registro
            </button>
            <button type="button" onClick={() => setLoginStep('identify')} className="w-full text-slate-300 py-2 font-black text-[9px] uppercase tracking-widest">
              Volver atrás
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const RestrictedView = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="w-20 h-20 bg-red-50 text-[#841525] rounded-full flex items-center justify-center"><ShieldAlert size={40} /></div>
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Acceso Restringido</h2>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">Esta sección solo puede ser visualizada por miembros de la Junta Directiva o Encargados autorizados.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'feed': return (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4 mb-6">Tablón de Anuncios</h1>
          {MOCK_NEWS.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <span className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg mb-4 inline-block ${item.category === 'Urgente' ? 'bg-[#841525] text-white' : 'bg-[#FDF2F4] text-[#841525]'}`}>{item.category}</span>
              <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.content}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-300 uppercase italic">
                <span>{item.author}</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      );
      case 'calendar': return (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4 mb-6">Agenda de la Banda</h1>
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="bg-[#FDF2F4] w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center border border-[#841525]/10 shrink-0">
                <span className="text-[10px] font-black text-[#841525] uppercase">{new Date(event.date).toLocaleString('es-ES', { month: 'short' })}</span>
                <span className="text-3xl font-black text-[#841525]">{new Date(event.date).getDate()}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{event.title}</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold">{event.location} • {event.type}</p>
              </div>
              {isAdmin && (
                <button onClick={() => setSelectedEventForAttendance(event)} className="bg-[#841525] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all shrink-0">
                  <CheckCircle2 size={18} className="text-[#D5A021]" /><span>Pasar Lista</span>
                </button>
              )}
            </div>
          ))}
        </div>
      );
      case 'scores': return (
        <div className="space-y-8">
          {!selectedVoice ? (
            <>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4 mb-6">Archivo de Partituras</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INSTRUMENT_VOICES.map(voice => (
                  <button 
                    key={voice}
                    onClick={() => setSelectedVoice(voice)}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center group hover:bg-[#FDF2F4] transition-all"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#841525] mb-4 group-hover:scale-110 transition-transform"><Music2 size={28} /></div>
                    <span className="font-black text-[#841525] uppercase text-xs tracking-widest">{voice}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedVoice(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#841525] transition-colors"><ChevronLeft size={20}/></button>
                  <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Partituras: {selectedVoice}</h1>
                </div>
                <div className="relative flex-1 md:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar marcha..." 
                    value={scoreSearch}
                    onChange={(e) => setScoreSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScores.map(score => (
                  <div key={score.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="mb-4">
                      <span className="text-[8px] font-black uppercase text-[#D5A021] tracking-widest mb-1 block">{score.category}</span>
                      <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">{score.title}</h3>
                      <p className="text-xs text-slate-400 font-bold">{score.author || 'Autor desconocido'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                      {score.driveLink && (
                        <a href={score.driveLink} target="_blank" className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <div className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded text-white"><LinkIcon size={12}/></div>
                          <span className="text-[9px] font-black text-slate-600 uppercase">Drive</span>
                        </a>
                      )}
                      {score.dropboxLink && (
                        <a href={score.dropboxLink} target="_blank" className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <div className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded text-white"><LinkIcon size={12}/></div>
                          <span className="text-[9px] font-black text-slate-600 uppercase">Dropbox</span>
                        </a>
                      )}
                      {!score.driveLink && !score.dropboxLink && (
                        <div className="col-span-2 text-center py-2 text-[8px] text-slate-300 font-black uppercase italic">En preparación</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
      case 'inventory': 
        if (!isAdmin) return <RestrictedView />;
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4">Inventario General</h1>
               <button className="bg-green-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Download size={18}/><span>Exportar Excel</span></button>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              {MOCK_INVENTORY.map(item => (
                <div key={item.id} className="p-6 border-b border-slate-50 flex items-center justify-between last:border-0 hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-black text-slate-700 uppercase text-sm tracking-tighter">{item.name}</h4>
                    <p className="text-[10px] text-[#D5A021] font-black uppercase tracking-[0.2em] mt-1">{item.type} • {item.serialNumber || 'S/N'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${item.status === 'Buen estado' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'members': 
        if (!isAdmin) return <RestrictedView />;
        return (
          <div className="space-y-12">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4">Componentes por Voz</h1>
               <div className="flex gap-2">
                 <button className="bg-[#841525] text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><UserPlus size={18} className="text-[#D5A021]" /><span>Añadir</span></button>
               </div>
            </div>
            
            <div className="space-y-16">
              {INSTRUMENT_VOICES.map(voice => {
                const voiceMembers = MOCK_MEMBERS.filter(m => m.instrument === voice);
                return (
                  <div key={voice} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-0.5 bg-slate-100 flex-1"></div>
                      <div className="bg-[#FDF2F4] px-6 py-2 rounded-full border border-[#841525]/10 flex items-center gap-3">
                        <span className="font-black text-[#841525] uppercase text-[10px] tracking-widest italic">{voice}</span>
                        <span className="bg-[#841525] text-white text-[8px] font-black px-2 py-0.5 rounded-md">{voiceMembers.length}</span>
                      </div>
                      <div className="h-0.5 bg-slate-100 flex-1"></div>
                    </div>

                    {voiceMembers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {voiceMembers.map(member => (
                          <div key={member.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-all">
                            <div className="flex items-center space-x-5 mb-6">
                              <div className="w-14 h-14 bg-[#841525] rounded-[1.5rem] flex items-center justify-center text-[#D5A021] font-black text-2xl shadow-inner uppercase">{member.name[0]}</div>
                              <div>
                                <h4 className="font-black text-slate-800 tracking-tighter text-sm uppercase leading-none">{member.name} {member.surname}</h4>
                                <p className="text-[10px] text-[#D5A021] font-black uppercase tracking-widest mt-1">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase italic mb-2"><span>Asistencia Media</span><span>{member.attendanceRate}%</span></div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6"><div className="h-full bg-[#841525]" style={{ width: `${member.attendanceRate}%` }} /></div>
                            <div className="pt-4 border-t border-slate-50 space-y-2">
                              <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-2"><Mail size={12}/> {member.email}</p>
                              {member.phone && <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-2"><Smartphone size={12}/> {member.phone}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-white/50 border border-dashed border-slate-200 rounded-[2rem]">
                        <p className="text-[10px] text-slate-300 font-black uppercase italic tracking-widest">Sin componentes registrados en esta voz</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'tools': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Metronome />
          <Tuner />
        </div>
      );
      case 'app_install': return (
        <div className="space-y-8">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4">Instalar en el Móvil</h1>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5"><Apple size={150} /></div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Apple size={28} /></div>
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">Para iPhone (iOS)</h3>
               </div>
               <ol className="space-y-6 text-sm text-slate-600 font-medium list-decimal list-inside">
                  <li>Abre esta web en el navegador <b>Safari</b>.</li>
                  <li>Pulsa el botón de <b>Compartir</b> (cuadrado con flecha).</li>
                  <li>Busca y selecciona <b>"Añadir a pantalla de inicio"</b>.</li>
               </ol>
            </div>
            <div className="bg-[#841525] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10"><Cpu size={150} /></div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-white text-[#841525] rounded-2xl flex items-center justify-center shadow-lg"><Smartphone size={28} /></div>
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">Para Android</h3>
               </div>
               <p className="text-sm text-white/80 leading-relaxed mb-8">En <b>Chrome</b>, pulsa los 3 puntos y selecciona <b>"Instalar aplicación"</b>.</p>
               <a href="https://www.pwabuilder.com" target="_blank" className="bg-[#D5A021] text-[#841525] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">Ir a PWABuilder <ExternalLink size={16}/></a>
            </div>
          </div>
        </div>
      );
      case 'social': return (
        <div className="space-y-8">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic border-l-4 border-[#D5A021] pl-4 mb-6">Nuestra Presencia Online</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', link: 'https://www.instagram.com/amsagradacenacordoba/' },
              { name: 'TikTok', icon: Music2, color: 'bg-black', link: 'https://www.tiktok.com/@amsagradacena' },
              { name: 'YouTube', icon: Youtube, color: 'bg-[#FF0000]', link: 'https://www.youtube.com/@amsagradacenacordobaoficia8570' },
              { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', link: 'https://www.facebook.com/amsagradacenacordoba?locale=es_ES' },
              { name: 'Twitter (X)', icon: Twitter, color: 'bg-[#000000]', link: '#' },
            ].map(social => (
              <a key={social.name} href={social.link} target="_blank" className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:translate-y-[-5px] transition-all">
                <div className={`${social.color} p-5 rounded-[1.5rem] text-white shadow-xl mb-4 group-hover:scale-110 transition-transform`}><social.icon size={36} /></div>
                <span className="font-black text-[#841525] uppercase tracking-widest text-[10px]">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      );
      default: return null;
    }
  };

  const navItems = [
    { id: 'feed', label: 'Tablón', icon: Home, show: true },
    { id: 'calendar', label: 'Agenda', icon: CalendarIcon, show: true },
    { id: 'scores', label: 'Partituras', icon: Music, show: true },
    { id: 'members', label: 'Músicos', icon: Users, show: isAdmin },
    { id: 'inventory', label: 'Inventario', icon: Package, show: isAdmin },
    { id: 'tools', label: 'Herramientas', icon: Activity, show: true },
    { id: 'app_install', label: 'Instalar App', icon: Smartphone, show: true },
    { id: 'social', label: 'Redes', icon: Share2, show: true },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 select-none">
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 pt-safe pb-safe ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex flex-col items-center mb-10 shrink-0">
            <BrandLogo className="w-20 h-20 mb-3 shadow-sm" />
            <h2 className="font-black text-[#841525] uppercase tracking-tighter text-sm leading-none text-center">AM Sagrada Cena</h2>
            <p className="text-[7px] text-[#D5A021] font-black uppercase tracking-[0.5em] mt-1">CÓRDOBA • INTRANET</p>
          </div>
          <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
            {navItems.filter(i => i.show).map(item => (
              <button key={item.id} onClick={() => {setActiveTab(item.id); setSidebarOpen(false); if(item.id !== 'scores') setSelectedVoice(null)}} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all active:scale-95 ${activeTab === item.id ? 'bg-[#841525] text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
                <item.icon size={20} className={activeTab === item.id ? 'text-[#D5A021]' : ''} />
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="pt-6 border-t border-slate-50 mt-4">
             <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 overflow-hidden">
                <div className="w-10 h-10 bg-[#841525] rounded-xl flex items-center justify-center text-[#D5A021] font-black shrink-0">{currentUser.name[0]}</div>
                <div className="truncate">
                  <p className="text-xs font-black text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-[8px] text-[#841525] font-black uppercase truncate">{currentUser.role}</p>
                </div>
             </div>
            <button onClick={() => setCurrentUser(null)} className="w-full py-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"><LogOut size={16} /> Cerrar Sesión</button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 pt-24 lg:pt-12 overflow-y-auto pb-safe px-5">
        <div className="max-w-5xl mx-auto pb-20">
          <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 px-5 py-4 pt-safe flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrandLogo className="w-8 h-8" />
              <span className="font-black text-[#841525] uppercase text-[10px] tracking-tight">Sagrada Cena</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#841525] bg-[#FDF2F4] rounded-xl"><Menu size={24} /></button>
          </div>
          <div className="bg-[#841525] rounded-[3rem] p-12 mb-12 text-white relative overflow-hidden shadow-2xl border border-[#D5A021]/10">
             <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight mb-2">AM Sagrada <span className="text-[#D5A021]">Cena</span></h1>
                <p className="text-white/50 font-bold text-[9px] uppercase tracking-[0.5em]">CÓRDOBA • GESTIÓN INTEGRAL DE LA BANDA</p>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12"><BrandLogo className="w-64 h-64" /></div>
          </div>
          {renderContent()}
        </div>
      </main>

      {selectedEventForAttendance && <AttendanceModal event={selectedEventForAttendance} members={MOCK_MEMBERS} onClose={() => setSelectedEventForAttendance(null)} />}
    </div>
  );
}
