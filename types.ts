
export enum UserRole {
  PRESIDENTE = 'Presidente',
  DIRECTOR = 'Director',
  DIRECTOR_MUSICAL = 'Director Musical',
  ENCARGADO_VOZ = 'Encargado de Voz',
  TESORERO = 'Tesorero',
  SECRETARIO = 'Secretario',
  MUSICO = 'Músico'
}

export type InstrumentType = 
  | 'Trompeta 1ª' 
  | 'Trompeta 2ª' 
  | 'Trompeta 3ª' 
  | 'Trombón' 
  | 'Bombardino' 
  | 'Tuba' 
  | 'Corneta' 
  | 'Bateria';

export interface Member {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
  instrument: InstrumentType;
  email: string;
  phone?: string;
  dni?: string;
  birthDate?: string;
  joinDate: string;
  attendanceRate: number;
}

export type AttendanceStatus = 'Asistió' | 'Falta Justificada' | 'Falta Injustificada' | 'Pendiente';

export interface BandEvent {
  id: string;
  title: string;
  type: 'Ensayo' | 'Actuación' | 'Reunión';
  date: string;
  location: string;
  description?: string;
  attendance: Record<string, AttendanceStatus>; // memberId -> status
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'Aviso' | 'Noticia' | 'Urgente';
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Instrumento' | 'Uniforme' | 'Accesorio';
  serialNumber?: string;
  assignedTo?: string; // memberId
  status: 'Buen estado' | 'Reparación' | 'Extraviado';
  lastReview?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  date: string;
}

export interface UserContextType {
  user: Member | null;
  isAdmin: boolean;
}
