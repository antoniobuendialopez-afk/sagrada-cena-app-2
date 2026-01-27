
import { UserRole, Member, BandEvent, NewsItem, InventoryItem, ChatMessage, GalleryItem } from './types';

export const ADMIN_ROLES = [
  UserRole.PRESIDENTE,
  UserRole.DIRECTOR,
  UserRole.DIRECTOR_MUSICAL,
  UserRole.ENCARGADO_VOZ,
  UserRole.TESORERO,
  UserRole.SECRETARIO
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
    instrument: 'Trombón',
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
    instrument: 'Bateria',
    email: 'carlos@gmail.com',
    joinDate: '2021-02-10',
    attendanceRate: 75
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: '1', senderName: 'Juan Pérez', text: '¡Hola a todos! Mañana recordad traer el uniforme de gala.', timestamp: '2024-05-20T10:00:00Z' },
  { id: 'm2', senderId: '3', senderName: 'Carlos Ruiz', text: 'Recibido, allí estaré.', timestamp: '2024-05-20T10:05:00Z' },
  { id: 'm3', senderId: '2', senderName: 'María García', text: '¿A qué hora quedamos en la sede?', timestamp: '2024-05-20T10:15:00Z' }
];

export const MOCK_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Salida Procesional 2024', type: 'image', url: 'https://images.unsplash.com/photo-1514320298324-9b1a2717309a?auto=format&fit=crop&q=80&w=800', date: '2024-03-25' },
  { id: 'g2', title: 'Ensayo de Santa Cecilia', type: 'image', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', date: '2023-11-22' },
  { id: 'g3', title: 'Certamen de Bandas', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?auto=format&fit=crop&q=80&w=800', date: '2024-02-10' }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Ensayo General Extraordinario',
    content: 'Se convoca a todos los miembros el próximo viernes a las 20:00 para preparar el concierto de Semana Santa.',
    date: '2024-05-20T10:00:00Z',
    author: 'Director Musical',
    category: 'Urgente'
  },
  {
    id: 'n2',
    title: 'Nuevos Uniformes Disponibles',
    content: 'Ya se pueden recoger los nuevos polos de verano en el almacén durante los ensayos de esta semana.',
    date: '2024-05-18T12:00:00Z',
    author: 'Secretario',
    category: 'Aviso'
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
    attendance: { '1': 'Asistió', '2': 'Pendiente', '3': 'Falta Justificada' }
  },
  {
    id: 'e2',
    title: 'Concierto de Primavera',
    type: 'Actuación',
    date: '2024-06-02T12:00:00',
    location: 'Plaza Mayor',
    attendance: {}
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
  },
  {
    id: 'i2',
    name: 'Chaqueta de Gala Talla L',
    type: 'Uniforme',
    assignedTo: '2',
    status: 'Buen estado'
  }
];
