export type UserRole = 'super_admin' | 'rh' | 'colaborador';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  planId: string;
  planName: string;
  employeeCount: number;
  maxEmployees: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  userId?: string;
  name: string;
  email: string;
  cpf: string;
  role: string;
  department: string;
  admissionDate: string;
  birthDate: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  companyId: string;
  employeeId?: string;
  type: 'pgr' | 'pcmso' | 'ltcat' | 'aso' | 'ppra' | 'other';
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'expired';
  fileUrl?: string;
  createdAt: string;
  expiresAt?: string;
  signedBy?: string[];
}

export interface Training {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: string;
  duration: number; // hours
  instructor: string;
  date: string;
  expiresAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  participants: string[];
  maxParticipants: number;
}

export interface EPI {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  name: string;
  ca: string; // Certificado de Aprovação
  quantity: number;
  deliveryDate: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'returned';
  signatureUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Invite {
  id: string;
  companyId: string;
  createdBy: string;
  name: string;
  email: string;
  cpf: string;
  role: string;
  department: string;
  admissionDate: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  facePhoto: string;
  faceVerified: boolean;
  faceCapturedAt: string;
  acceptedAt: string;
  expiresAt: string;
  createdAt: string;
}
