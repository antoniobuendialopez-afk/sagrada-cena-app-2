
import { UserRole, Member, BandEvent, NewsItem, InventoryItem, ChatMessage, Score, InstrumentType } from './types';

export const ADMIN_ROLES = [
  UserRole.PRESIDENTE,
  UserRole.DIRECTOR,
  UserRole.DIRECTOR_MUSICAL,
  UserRole.ENCARGADO_VOZ,
  UserRole.TESORERO,
  UserRole.SECRETARIO
];

export const INSTRUMENT_VOICES: InstrumentType[] = [
  'Trompeta 1ª',
  'Trompeta 2ª',
  'Trompeta 3ª',
  'Trombón 1º',
  'Trombón 2º',
  'Bombardino 1º',
  'Bombardino 2º',
  'Tuba',
  'Cornetas',
  'Batería'
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Juan',
    surname: 'Pérez',
    role: UserRole.DIRECTOR,
    instrument: 'Trompeta 1ª',
    email: 'admin@cena.com',
    phone: '+34 600 000 001',
    dni: '12345678A',
    joinDate: '2010-05-15',
    attendanceRate: 95
  },
  {
    id: '2',
    name: 'María',
    surname: 'García',
    role: UserRole.ENCARGADO_VOZ,
    instrument: 'Trombón 1º',
    email: 'maria@gmail.com',
    phone: '+34 600 000 002',
    joinDate: '2018-09-20',
    attendanceRate: 88
  },
  {
    id: '3',
    name: 'Carlos',
    surname: 'Ruiz',
    role: UserRole.MUSICO,
    instrument: 'Batería',
    email: 'carlos@gmail.com',
    joinDate: '2021-02-10',
    attendanceRate: 75
  }
];

export const MOCK_SCORES: Score[] = [
  {
    id: 's1',
    title: 'Oh Bendita Cena',
    category: 'Semana Santa',
    author: 'José Manuel Mena Hervás',
    voice: 'Trompeta 1ª',
    driveLink: 'https://drive.google.com/',
    dropboxLink: 'https://www.dropbox.com/'
  },
  {
    id: 's2',
    title: 'Oh Bendita Cena',
    category: 'Semana Santa',
    author: 'José Manuel Mena Hervás',
    voice: 'Trombón 1º',
    driveLink: 'https://drive.google.com/'
  },
  {
    id: 's3',
    title: 'La Misión',
    category: 'Conciertos',
    author: 'Ennio Morricone',
    voice: 'Tuba',
    dropboxLink: 'https://www.dropbox.com/'
  },
  {
    id: 's4',
    title: 'Al Compás de tu Cena',
    category: 'Semana Santa',
    author: 'F. Javier González Ríos',
    voice: 'Cornetas',
    driveLink: 'https://drive.google.com/'
  }
];

export const SCORE_CATEGORIES = ['Semana Santa', 'Ordinario', 'Conciertos', 'Villancicos'];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Ensayo General Extraordinario',
    content: 'Se convoca a todos los miembros el próximo viernes a las 20:00 para preparar el concierto de Semana Santa.',
    date: '2024-05-20T10:00:00Z',
    author: 'Director Musical',
    category: 'Urgente'
  }
];

export const MOCK_EVENTS: BandEvent[] = [
  {
    id: 'e1',
    title: 'Ensayo Semanal',
    type: 'Ensayo',
    date: '2024-05-24T19:00:00',
    location: 'Sede de la Banda',
    description: 'Repertorio nuevo.',
    attendance: { '1': 'Asistió' }
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Trompeta Yamaha YTR-2330',
    type: 'Instrumento',
    serialNumber: 'SN99283',
    assignedTo: '1',
    status: 'Buen estado'
  }
];
