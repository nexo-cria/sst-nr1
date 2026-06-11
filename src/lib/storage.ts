import { getSupabase, isSupabaseConfigured } from './supabase';

const supabase = new Proxy({} as ReturnType<typeof getSupabase>, {
  get(_, prop) { return (getSupabase() as any)[prop]; },
});

export type UserRole = 'super_admin' | 'rh' | 'colaborador';

export interface StoredUser {
  id: string; email: string; password: string; name: string; role: UserRole;
  avatar: string; companyId: string | null; companyName: string | null;
  isActive: boolean; createdAt: string; createdBy: string | null;
}
export interface StoredCompany {
  id: string; name: string; cnpj: string; email: string; phone: string;
  address: string; city: string; state: string; planId: string; planName: string;
  employeeCount: number; maxEmployees: number; isActive: boolean;
  createdAt: string; expiresAt: string;
}
export interface StoredEmployee {
  id: string; companyId: string; userId: string | null; name: string; email: string;
  cpf: string; role: string; department: string; admissionDate: string;
  birthDate: string; phone: string; isActive: boolean; createdAt: string;
}
export interface StoredDocument {
  id: string; companyId: string; employeeId: string | null; type: string; title: string;
  description: string; status: 'draft' | 'pending' | 'approved' | 'expired';
  createdAt: string; expiresAt: string | null; signedBy: string[];
}
export interface StoredTraining {
  id: string; companyId: string; title: string; description: string; type: string;
  duration: number; instructor: string; date: string; expiresAt: string;
  status: 'scheduled' | 'completed' | 'cancelled'; participants: string[]; maxParticipants: number;
}
export interface StoredEPI {
  id: string; companyId: string; employeeId: string; employeeName: string;
  name: string; ca: string; quantity: number; deliveryDate: string;
  expiresAt: string; status: 'active' | 'expired' | 'returned';
}
export interface StoredCheckin {
  id: string; date: string; time: string; employeeId: string; employeeName: string;
  companyId: string; responses: { questionId: string; answer: string; observation?: string }[];
  status: 'completo' | 'pendente' | 'alerta'; alertCount: number; createdAt: string;
}
export interface StoredInvite {
  id: string; companyId: string; createdBy: string; name: string; email: string;
  cpf: string; role: string; department: string; admissionDate: string; birthDate: string; phone: string;
  token: string; status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  facePhoto: string; faceVerified: boolean; faceCapturedAt: string;
  acceptedAt: string; expiresAt: string; createdAt: string;
}

// ===== LOCAL HELPERS =====
const P = 'nexo_';
function lGet<T>(k: string): T | null { try { const r = localStorage.getItem(P + k); return r ? JSON.parse(r) : null; } catch { return null; } }
function lSet<T>(k: string, v: T) { localStorage.setItem(P + k, JSON.stringify(v)); }
function lRm(k: string) { localStorage.removeItem(P + k); }
function gid() { return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; }

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const K = { users: 'u', companies: 'c', employees: 'e', documents: 'd', trainings: 't', epis: 'p', checkins: 'k', session: 's', init: 'i', invites: 'v' };

const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-001', email: 'admin@nexo-sst.com.br', password: 'admin123',
  name: 'Administrador Sistema', role: 'super_admin', avatar: 'AS',
  companyId: null, companyName: null, isActive: true,
  createdAt: new Date().toISOString(), createdBy: null,
};

const isSB = () => isSupabaseConfigured();

export function initializeDatabase() {
  if (lGet<boolean>(K.init)) return;
  const users = lGet<StoredUser[]>(K.users) || [];
  if (!users.some(u => u.role === 'super_admin')) users.push(DEFAULT_ADMIN);
  lSet(K.users, users);
  for (const k of [K.companies, K.employees, K.documents, K.trainings, K.epis, K.checkins, K.invites]) if (!lGet(k)) lSet(k, []);
  lSet(K.init, true);
}

// ===== MAP functions =====
const mc = (r: any): StoredCompany => ({ id: r.id, name: r.name, cnpj: r.cnpj, email: r.email, phone: r.phone||'', address: r.address||'', city: r.city||'', state: r.state||'', planId: r.plan_id, planName: r.plan_name, employeeCount: r.employee_count, maxEmployees: r.max_employees, isActive: r.is_active, createdAt: r.created_at, expiresAt: r.expires_at });
const me = (r: any): StoredEmployee => ({ id: r.id, companyId: r.company_id, userId: r.user_id, name: r.name||'', email: r.email, cpf: r.cpf, role: r.role, department: r.department, admissionDate: r.admission_date, birthDate: r.birth_date||'', phone: r.phone||'', isActive: r.is_active, createdAt: r.created_at });
const md = (r: any): StoredDocument => ({ id: r.id, companyId: r.company_id, employeeId: r.employee_id, type: r.type, title: r.title, description: r.description||'', status: r.status, createdAt: r.created_at, expiresAt: r.expires_at, signedBy: r.signed_by||[] });
const mt = (r: any): StoredTraining => ({ id: r.id, companyId: r.company_id, title: r.title, description: r.description||'', type: r.type, duration: r.duration, instructor: r.instructor, date: r.date, expiresAt: r.expires_at, status: r.status, participants: r.participants||[], maxParticipants: r.max_participants });
const mepi = (r: any): StoredEPI => ({ id: r.id, companyId: r.company_id, employeeId: r.employee_id, employeeName: r.employee_name||'', name: r.name, ca: r.ca, quantity: r.quantity, deliveryDate: r.delivery_date, expiresAt: r.expires_at, status: r.status });
const mck = (r: any): StoredCheckin => ({ id: r.id, date: r.date, time: r.time, employeeId: r.employee_id, employeeName: r.employee_name||'', companyId: r.company_id, responses: r.responses||[], status: r.status, alertCount: r.alert_count, createdAt: r.created_at });
const mp = (r: any): StoredUser => ({ id: r.id, email: r.email, password: '', name: r.name||'', role: r.role as UserRole, avatar: r.avatar||'', companyId: r.company_id, companyName: r.company_name||'', isActive: r.is_active, createdAt: r.created_at, createdBy: r.created_by });
const mi = (r: any): StoredInvite => ({ id: r.id, companyId: r.company_id, createdBy: r.created_by, name: r.name||'', email: r.email, cpf: r.cpf||'', role: r.role||'', department: r.department||'', admissionDate: r.admission_date||'', birthDate: r.birth_date||'', phone: r.phone||'', token: r.token, status: r.status, facePhoto: r.face_photo||'', faceVerified: r.face_verified||false, faceCapturedAt: r.face_captured_at||'', acceptedAt: r.accepted_at||'', expiresAt: r.expires_at, createdAt: r.created_at });

// ===== HELPERS =====
// Tenta Supabase para SELECT, se falhar ou vier vazio, usa localStorage
async function sbOrLocal<T>(table: string, localKey: string, mapper: (r: any) => T, orderBy?: string): Promise<T[]> {
  if (isSB()) {
    try {
      let q = supabase.from(table).select('*');
      if (orderBy) q = q.order(orderBy, { ascending: false } as any);
      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapper);
        lSet(localKey, mapped); // cache local
        return mapped;
      }
    } catch (e) { /* fallback */ }
  }
  return lGet<T[]>(localKey) || [];
}

// Para INSERT: tenta Supabase, se falhar salva local
async function insertFallback<T extends { id: string }>(table: string, localKey: string, sbData: any, mapper: (r: any) => T, localItem: T): Promise<T> {
  if (isSB()) {
    try {
      console.log('[insertFallback] inserting into', table, sbData);
      const { data, error } = await supabase.from(table).insert(sbData).select().single();
      if (error) { console.error('[insertFallback] Supabase error:', error.message, error.details, error.hint); }
      if (!error && data) {
        const mapped = mapper(data);
        console.log('[insertFallback] Supabase success:', mapped);
        const list = lGet<T[]>(localKey) || [];
        list.unshift(mapped);
        lSet(localKey, list);
        return mapped;
      }
    } catch (e) { console.error('[insertFallback] exception:', e); }
  }
  console.log('[insertFallback] falling back to localStorage for', table);
  const list = lGet<T[]>(localKey) || [];
  list.unshift(localItem);
  lSet(localKey, list);
  return localItem;
}

// (updateFallback removido)

// Para DELETE: tenta Supabase, se falhar deleta local
async function deleteFallback(table: string, localKey: string, id: string): Promise<boolean> {
  if (isSB()) {
    try { await supabase.from(table).delete().eq('id', id); } catch (e) { /* fallback */ }
  }
  lSet(localKey, (lGet<any[]>(localKey) || []).filter((x: any) => x.id !== id));
  return true;
}

// ===== DATABASE API =====
export const db = {
  // -------- AUTH (localStorage primário, Supabase secundário) --------
  async login(email: string, password: string): Promise<StoredUser | null> {
    // PRIMEIRO: tenta localStorage (sempre funciona e é mais rápido)
    const users = lGet<StoredUser[]>(K.users) || [];
    const localUser = users.find(x => x.email === email && x.password === password && x.isActive);
    if (localUser) {
      const { password: _, ...s } = localUser;
      lSet(K.session, s);
      // Em background, tenta sync com Supabase se configurado
      if (isSB()) {
        try {
          const { data } = await supabase.auth.signInWithPassword({ email, password });
          if (data?.user) {
            await supabase.from('profiles').update({ name: localUser.name, company_id: localUser.companyId } as never).eq('id', data.user.id);
          }
        } catch {}
      }
      return localUser;
    }
    // SEGUNDO: tenta Supabase (se não achou local)
    if (isSB()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            const mapped = mp(profile);
            // Salvar localmente para próximas vezes
            const userList = lGet<StoredUser[]>(K.users) || [];
            if (!userList.find(u => u.email === email)) {
              userList.push({ ...mapped, password });
              lSet(K.users, userList);
            }
            const { password: _, ...s } = mapped;
            lSet(K.session, s);
            return mapped;
          }
        }
      } catch {}
    }
    return null;
  },

  async logout(): Promise<void> {
    if (isSB()) { try { await supabase.auth.signOut(); } catch {} }
    lRm(K.session);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const session = lGet<any>(K.session);
    if (!session?.email) return { success: false, error: 'Sessão não encontrada' };

    if (isSB()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e?.message || 'Erro ao alterar senha' };
      }
    }

    const users = lGet<StoredUser[]>(K.users) || [];
    const idx = users.findIndex(u => u.email === session.email);
    if (idx === -1) return { success: false, error: 'Usuário não encontrado' };
    if (users[idx].password !== currentPassword) return { success: false, error: 'Senha atual incorreta' };
    users[idx].password = newPassword;
    lSet(K.users, users);
    return { success: true };
  },

  async getSession(): Promise<any> {
    // Sempre tenta localStorage primeiro (mais rápido e confiável)
    const localSession = lGet(K.session);
    if (localSession) return localSession;
    // Fallback para Supabase
    if (isSB()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) { const m = mp(profile); lSet(K.session, m); return m; }
        }
      } catch {}
    }
    return null;
  },

  // -------- USERS --------
  async getUsers(): Promise<StoredUser[]> {
    if (isSB()) {
      try {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false } as any);
        if (data && data.length > 0) { const m = data.map(mp); lSet(K.users, m); return m; }
      } catch {}
    }
    return lGet<StoredUser[]>(K.users) || [];
  },

  async createUser(data: Omit<StoredUser, 'id' | 'createdAt'>): Promise<{ user: StoredUser | null; error: string | null }> {
    const newUser: StoredUser = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };

    if (isSB()) {
      const s = lGet<{ email?: string }>(K.session);
      try {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email, password: data.password,
          options: { data: { name: data.name, role: data.role } },
        });

        if (signUpError) {
          console.error('[createUser] signUp error:', signUpError.message);
          if (signUpError.message?.includes('already') || signUpError.message?.includes('registered')) {
            console.log('[createUser] User exists, trying signIn...');
            const { data: signInData } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
            if (signInData?.user) {
              newUser.id = signInData.user.id;
            }
          }
        } else if (authData?.user) {
          newUser.id = authData.user.id;
          await supabase.from('profiles').update({
            company_id: data.companyId || null, company_name: data.companyName,
            avatar: data.avatar, created_by: data.createdBy, role: data.role,
          } as never).eq('id', authData.user.id);
        }

        if (s?.email && s.email !== data.email) {
          try {
            const u = lGet<StoredUser[]>(K.users)?.find(x => x.email === s.email);
            if (u) await supabase.auth.signInWithPassword({ email: u.email, password: u.password });
          } catch {}
        }
      } catch (e) { console.error('[createUser] supabase exception:', e); }
    }

    const users = lGet<StoredUser[]>(K.users) || [];
    if (users.some(u => u.email === data.email)) {
      const idx = users.findIndex(u => u.email === data.email);
      users[idx].id = newUser.id;
      lSet(K.users, users);
    } else {
      users.push(newUser);
      lSet(K.users, users);
    }

    return { user: newUser, error: null };
  },

  async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    if (isSB()) {
      try {
        const sb: any = {};
        if (updates.name) sb.name = updates.name;
        if (updates.email) sb.email = updates.email;
        if (updates.avatar) sb.avatar = updates.avatar;
        if (updates.companyId !== undefined) sb.company_id = updates.companyId;
        if (updates.companyName !== undefined) sb.company_name = updates.companyName;
        if (updates.isActive !== undefined) sb.is_active = updates.isActive;
        if (updates.role) sb.role = updates.role;
        await supabase.from('profiles').update(sb as never).eq('id', id);
      } catch {}
    }
    const users = lGet<StoredUser[]>(K.users) || [];
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return null;
    users[i] = { ...users[i], ...updates }; lSet(K.users, users);
    const session = lGet<{ id: string }>(K.session);
    if (session?.id === id) { const { password: _, ...s } = users[i]; lSet(K.session, s); }
    return users[i];
  },

  async deleteUser(id: string): Promise<boolean> { return deleteFallback('profiles', K.users, id); },

  // -------- COMPANIES --------
  async getCompanies(): Promise<StoredCompany[]> { return sbOrLocal('companies', K.companies, mc, 'created_at'); },

  getCompany(id: string): StoredCompany | null { return (lGet<StoredCompany[]>(K.companies) || []).find(c => c.id === id) || null; },

  async createCompany(data: Omit<StoredCompany, 'id' | 'createdAt' | 'employeeCount'>): Promise<StoredCompany> {
    const localItem: StoredCompany = { ...data, id: gid(), employeeCount: 0, createdAt: new Date().toISOString() };
    const sbData = { name: data.name, cnpj: data.cnpj, email: data.email, phone: data.phone, address: data.address, city: data.city, state: data.state, plan_id: data.planId, plan_name: data.planName, max_employees: data.maxEmployees, is_active: data.isActive, expires_at: data.expiresAt };
    return insertFallback('companies', K.companies, sbData, mc, localItem);
  },

  async updateCompany(id: string, updates: Partial<StoredCompany>): Promise<StoredCompany | null> {
    if (isSB()) {
      try {
        const sb: any = {};
        if (updates.name) sb.name = updates.name; if (updates.cnpj) sb.cnpj = updates.cnpj; if (updates.email) sb.email = updates.email;
        if (updates.phone !== undefined) sb.phone = updates.phone; if (updates.address !== undefined) sb.address = updates.address;
        if (updates.city !== undefined) sb.city = updates.city; if (updates.state !== undefined) sb.state = updates.state;
        if (updates.planId) { sb.plan_id = updates.planId; sb.plan_name = updates.planName; }
        if (updates.maxEmployees !== undefined) sb.max_employees = updates.maxEmployees;
        if (updates.isActive !== undefined) sb.is_active = updates.isActive;
        if (updates.employeeCount !== undefined) sb.employee_count = updates.employeeCount;
        await supabase.from('companies').update(sb as never).eq('id', id);
      } catch {}
    }
    const list = lGet<StoredCompany[]>(K.companies) || [];
    const i = list.findIndex(c => c.id === id); if (i === -1) return null;
    list[i] = { ...list[i], ...updates }; lSet(K.companies, list); return list[i];
  },

  async deleteCompany(id: string): Promise<boolean> {
    if (isSB()) { try { await supabase.from('companies').delete().eq('id', id); } catch {} }
    lSet(K.companies, (lGet<StoredCompany[]>(K.companies) || []).filter(c => c.id !== id));
    lSet(K.users, (lGet<StoredUser[]>(K.users) || []).filter(u => u.companyId !== id));
    lSet(K.employees, (lGet<StoredEmployee[]>(K.employees) || []).filter(e => e.companyId !== id));
    return true;
  },

  // -------- EMPLOYEES --------
  async getEmployeesByCompany(companyId: string): Promise<StoredEmployee[]> {
    if (isSB()) {
      try {
        let query = supabase.from('employees').select('*');
        if (companyId) query = query.eq('company_id', companyId);
        const { data } = await query.order('name' as any);
        if (data && data.length > 0) { const m = data.map(me); lSet(K.employees, m); return m; }
      } catch {}
    }
    if (companyId) return (lGet<StoredEmployee[]>(K.employees) || []).filter(e => e.companyId === companyId);
    return lGet<StoredEmployee[]>(K.employees) || [];
  },

  async getEmployeeByUserId(userId: string): Promise<StoredEmployee | null> {
    if (isSB()) {
      try { const { data } = await supabase.from('employees').select('*').eq('user_id', userId).single(); if (data) return me(data); } catch {}
    }
    return (lGet<StoredEmployee[]>(K.employees) || []).find(e => e.userId === userId) || null;
  },

  async createEmployee(data: Omit<StoredEmployee, 'id' | 'createdAt'>): Promise<StoredEmployee> {
    const localItem: StoredEmployee = { ...data, id: gid(), createdAt: new Date().toISOString() };
    const sbData = { company_id: data.companyId || null, user_id: data.userId || null, name: data.name, email: data.email, cpf: data.cpf, role: data.role, department: data.department, admission_date: data.admissionDate, birth_date: data.birthDate || null, phone: data.phone, is_active: data.isActive };
    const result = await insertFallback('employees', K.employees, sbData, me, localItem);
    // Atualizar contagem
    const cl = lGet<StoredCompany[]>(K.companies) || [];
    const ci = cl.findIndex(c => c.id === data.companyId);
    if (ci >= 0) { cl[ci].employeeCount += 1; lSet(K.companies, cl); }
    return result;
  },

  async updateEmployee(id: string, updates: Partial<StoredEmployee>): Promise<StoredEmployee | null> {
    if (isSB()) {
      try {
        const sb: any = {};
        if (updates.name) sb.name = updates.name; if (updates.email) sb.email = updates.email; if (updates.cpf) sb.cpf = updates.cpf;
        if (updates.role) sb.role = updates.role; if (updates.department) sb.department = updates.department;
        if (updates.admissionDate) sb.admission_date = updates.admissionDate;
        if (updates.birthDate !== undefined) sb.birth_date = updates.birthDate || null;
        if (updates.phone !== undefined) sb.phone = updates.phone;
        if (updates.isActive !== undefined) sb.is_active = updates.isActive;
        await supabase.from('employees').update(sb as never).eq('id', id);
      } catch {}
    }
    const list = lGet<StoredEmployee[]>(K.employees) || [];
    const i = list.findIndex(e => e.id === id); if (i === -1) return null;
    list[i] = { ...list[i], ...updates }; lSet(K.employees, list); return list[i];
  },

  async deleteEmployee(id: string): Promise<boolean> {
    if (isSB()) { try { await supabase.from('employees').delete().eq('id', id); } catch {} }
    const emp = (lGet<StoredEmployee[]>(K.employees) || []).find(e => e.id === id);
    lSet(K.employees, (lGet<StoredEmployee[]>(K.employees) || []).filter(e => e.id !== id));
    if (emp?.userId) lSet(K.users, (lGet<StoredUser[]>(K.users) || []).filter(u => u.id !== emp.userId));
    if (emp) {
      const cl = lGet<StoredCompany[]>(K.companies) || [];
      const ci = cl.findIndex(c => c.id === emp.companyId);
      if (ci >= 0) { cl[ci].employeeCount = Math.max(0, cl[ci].employeeCount - 1); lSet(K.companies, cl); }
    }
    return true;
  },

  // -------- DOCUMENTS --------
  async getDocumentsByCompany(companyId: string): Promise<StoredDocument[]> {
    if (isSB()) {
      try {
        let query = supabase.from('documents').select('*');
        if (companyId) query = query.eq('company_id', companyId);
        const { data } = await query.order('created_at', { ascending: false } as any);
        if (data && data.length > 0) { const m = data.map(md); lSet(K.documents, m); return m; }
      } catch {}
    }
    if (companyId) return (lGet<StoredDocument[]>(K.documents) || []).filter(d => d.companyId === companyId);
    return lGet<StoredDocument[]>(K.documents) || [];
  },
  async createDocument(data: Omit<StoredDocument, 'id' | 'createdAt'>): Promise<StoredDocument> {
    const localItem: StoredDocument = { ...data, id: gid(), createdAt: new Date().toISOString() };
    const sbData = { company_id: data.companyId || null, employee_id: data.employeeId, type: data.type, title: data.title, description: data.description, status: data.status, expires_at: data.expiresAt, signed_by: data.signedBy };
    return insertFallback('documents', K.documents, sbData, md, localItem);
  },
  async updateDocument(id: string, updates: Partial<StoredDocument>): Promise<StoredDocument | null> {
    if (isSB()) { try { const sb: any = {}; if (updates.status) sb.status = updates.status; if (updates.title) sb.title = updates.title; await supabase.from('documents').update(sb as never).eq('id', id); } catch {} }
    const list = lGet<StoredDocument[]>(K.documents) || []; const i = list.findIndex(d => d.id === id); if (i === -1) return null;
    list[i] = { ...list[i], ...updates }; lSet(K.documents, list); return list[i];
  },

  // -------- TRAININGS --------
  async getTrainingsByCompany(companyId: string): Promise<StoredTraining[]> {
    if (isSB()) {
      try {
        let query = supabase.from('trainings').select('*');
        if (companyId) query = query.eq('company_id', companyId);
        const { data } = await query.order('date', { ascending: false } as any);
        if (data && data.length > 0) { const m = data.map(mt); lSet(K.trainings, m); return m; }
      } catch {}
    }
    if (companyId) return (lGet<StoredTraining[]>(K.trainings) || []).filter(t => t.companyId === companyId);
    return lGet<StoredTraining[]>(K.trainings) || [];
  },
  async createTraining(data: Omit<StoredTraining, 'id'>): Promise<StoredTraining> {
    const localItem: StoredTraining = { ...data, id: gid() };
    const sbData = { company_id: data.companyId || null, title: data.title, description: data.description, type: data.type, duration: data.duration, instructor: data.instructor, date: data.date, expires_at: data.expiresAt, status: data.status, participants: data.participants, max_participants: data.maxParticipants };
    return insertFallback('trainings', K.trainings, sbData, mt, localItem);
  },
  async updateTraining(id: string, updates: Partial<StoredTraining>): Promise<StoredTraining | null> {
    if (isSB()) { try { const sb: any = {}; if (updates.status) sb.status = updates.status; await supabase.from('trainings').update(sb as never).eq('id', id); } catch {} }
    const list = lGet<StoredTraining[]>(K.trainings) || []; const i = list.findIndex(t => t.id === id); if (i === -1) return null;
    list[i] = { ...list[i], ...updates }; lSet(K.trainings, list); return list[i];
  },

  // -------- EPIS --------
  async getEPIsByCompany(companyId: string): Promise<StoredEPI[]> {
    if (isSB()) {
      try {
        let query = supabase.from('epis').select('*');
        if (companyId) query = query.eq('company_id', companyId);
        const { data } = await query.order('created_at', { ascending: false } as any);
        if (data && data.length > 0) { const m = data.map(mepi); lSet(K.epis, m); return m; }
      } catch {}
    }
    if (companyId) return (lGet<StoredEPI[]>(K.epis) || []).filter(e => e.companyId === companyId);
    return lGet<StoredEPI[]>(K.epis) || [];
  },
  async getEPIsByEmployee(employeeId: string): Promise<StoredEPI[]> {
    if (isSB()) { try { const { data } = await supabase.from('epis').select('*').eq('employee_id', employeeId); if (data && data.length > 0) return data.map(mepi); } catch {} }
    return (lGet<StoredEPI[]>(K.epis) || []).filter(e => e.employeeId === employeeId);
  },
  async createEPI(data: Omit<StoredEPI, 'id'>): Promise<StoredEPI> {
    const localItem: StoredEPI = { ...data, id: gid() };
    const sbData = { company_id: data.companyId || null, employee_id: data.employeeId, employee_name: data.employeeName, name: data.name, ca: data.ca, quantity: data.quantity, delivery_date: data.deliveryDate, expires_at: data.expiresAt, status: data.status };
    return insertFallback('epis', K.epis, sbData, mepi, localItem);
  },
  async updateEPI(id: string, updates: Partial<StoredEPI>): Promise<StoredEPI | null> {
    if (isSB()) { try { const sb: any = {}; if (updates.status) sb.status = updates.status; await supabase.from('epis').update(sb as never).eq('id', id); } catch {} }
    const list = lGet<StoredEPI[]>(K.epis) || []; const i = list.findIndex(e => e.id === id); if (i === -1) return null;
    list[i] = { ...list[i], ...updates }; lSet(K.epis, list); return list[i];
  },

  // -------- CHECKINS --------
  async getCheckinsByCompany(companyId: string): Promise<StoredCheckin[]> {
    if (isSB()) {
      try {
        let query = supabase.from('daily_checkins').select('*');
        if (companyId) query = query.eq('company_id', companyId);
        const { data, error } = await query.order('created_at', { ascending: false } as any);
        if (error) console.error('[getCheckinsByCompany] error:', error.message);
        if (data && data.length > 0) { const m = data.map(mck); lSet(K.checkins, m); return m; }
      } catch (e) { console.error('[getCheckinsByCompany] exception:', e); }
    }
    if (companyId) return (lGet<StoredCheckin[]>(K.checkins) || []).filter(c => c.companyId === companyId);
    return lGet<StoredCheckin[]>(K.checkins) || [];
  },
  async getCheckinsByEmployee(employeeId: string): Promise<StoredCheckin[]> {
    if (isSB()) { try { const { data } = await supabase.from('daily_checkins').select('*').eq('employee_id', employeeId).order('date', { ascending: false } as any); if (data && data.length > 0) { const m = data.map(mck); lSet(K.checkins, m); return m; } } catch {} }
    return (lGet<StoredCheckin[]>(K.checkins) || []).filter(c => c.employeeId === employeeId);
  },
  async getTodayCheckin(employeeId: string): Promise<StoredCheckin | null> {
    const today = new Date().toISOString().split('T')[0];
    if (isSB()) { try { const { data } = await supabase.from('daily_checkins').select('*').eq('employee_id', employeeId).eq('date', today).maybeSingle(); if (data) return mck(data); } catch {} }
    return (lGet<StoredCheckin[]>(K.checkins) || []).find(c => c.employeeId === employeeId && c.date === today) || null;
  },
  async createCheckin(data: Omit<StoredCheckin, 'id' | 'createdAt'>): Promise<StoredCheckin> {
    const localItem: StoredCheckin = { ...data, id: gid(), createdAt: new Date().toISOString() };
    const sbData = { company_id: data.companyId || null, employee_id: data.employeeId, employee_name: data.employeeName, date: data.date, time: data.time, responses: data.responses as any, status: data.status, alert_count: data.alertCount };
    return insertFallback('daily_checkins', K.checkins, sbData, mck, localItem);
  },

  getEmployees(): StoredEmployee[] { return lGet<StoredEmployee[]>(K.employees) || []; },

  // -------- INVITES --------
  async getInvitesByCompany(companyId: string): Promise<StoredInvite[]> {
    if (isSB()) {
      try {
        let query = supabase.from('invites').select('*');
        if (companyId) {
          query = query.eq('company_id', companyId);
        }
        const { data, error } = await query.order('created_at', { ascending: false } as any);
        if (error) console.error('[getInvitesByCompany] error:', error.message);
        if (data && data.length > 0) { const m = data.map(mi); lSet(K.invites, m); return m; }
      } catch (e) { console.error('[getInvitesByCompany] exception:', e); }
    }
    if (companyId) {
      return (lGet<StoredInvite[]>(K.invites) || []).filter(i => i.companyId === companyId);
    }
    return lGet<StoredInvite[]>(K.invites) || [];
  },

  async getInviteByToken(token: string): Promise<StoredInvite | null> {
    if (isSB()) {
      try {
        console.log('[getInviteByToken] querying Supabase for token:', token);
        const { data, error } = await supabase.from('invites').select('*').eq('token', token).maybeSingle();
        if (error) {
          console.error('[getInviteByToken] Supabase error:', error.message, error.details, error.hint);
        }
        if (data) {
          console.log('[getInviteByToken] found invite:', data.id, data.name);
          return mi(data);
        }
        console.log('[getInviteByToken] no invite found in Supabase for token:', token);
      } catch (e) { console.error('[getInviteByToken] exception:', e); }
    }
    return (lGet<StoredInvite[]>(K.invites) || []).find(i => i.token === token) || null;
  },

  async createInvite(data: Omit<StoredInvite, 'id' | 'createdAt'>): Promise<StoredInvite> {
    const localItem: StoredInvite = { ...data, id: gid(), createdAt: new Date().toISOString() };
    const sbData = {
      company_id: data.companyId || null, created_by: data.createdBy || null, name: data.name, email: data.email,
      cpf: data.cpf, role: data.role, department: data.department, admission_date: data.admissionDate || null,
      token: data.token, status: data.status, face_photo: data.facePhoto, face_verified: data.faceVerified,
      face_captured_at: data.faceCapturedAt || null, accepted_at: data.acceptedAt || null, expires_at: data.expiresAt,
    };

    if (isSB()) {
      try {
        console.log('[createInvite] Inserting into Supabase:', sbData);
        const { data: inserted, error } = await supabase.from('invites').insert(sbData).select().single();
        if (error) {
          console.error('[createInvite] Supabase INSERT error:', error.message, error.details, error.hint);
          throw new Error('Erro ao salvar convite no servidor: ' + error.message);
        }
        if (inserted) {
          console.log('[createInvite] Supabase INSERT success:', inserted);
          const mapped = mi(inserted);
          const list = lGet<StoredInvite[]>(K.invites) || [];
          list.unshift(mapped);
          lSet(K.invites, list);
          return mapped;
        }
      } catch (e: any) {
        console.error('[createInvite] Supabase exception:', e);
        throw e;
      }
    }

    console.warn('[createInvite] FALLBACK to localStorage');
    const list = lGet<StoredInvite[]>(K.invites) || [];
    list.unshift(localItem);
    lSet(K.invites, list);
    return localItem;
  },

  async updateInvite(id: string, updates: Partial<StoredInvite>): Promise<StoredInvite | null> {
    if (isSB()) {
      try {
        const sb: any = {};
        if (updates.status) sb.status = updates.status;
        if (updates.facePhoto !== undefined) sb.face_photo = updates.facePhoto;
        if (updates.faceVerified !== undefined) sb.face_verified = updates.faceVerified;
        if (updates.faceCapturedAt !== undefined) sb.face_captured_at = updates.faceCapturedAt || null;
        if (updates.acceptedAt !== undefined) sb.accepted_at = updates.acceptedAt || null;
        await supabase.from('invites').update(sb as never).eq('id', id);
      } catch {}
    }
    const list = lGet<StoredInvite[]>(K.invites) || [];
    const i = list.findIndex(inv => inv.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...updates };
    lSet(K.invites, list);
    return list[i];
  },

  async deleteInvite(id: string): Promise<boolean> {
    return deleteFallback('invites', K.invites, id);
  },

  async registerFromInvite(params: {
    inviteId: string; email: string; password: string; name: string;
    companyId: string | null; role: string; department: string;
    admissionDate: string; birthDate: string; phone: string; cpf: string;
    facePhoto: string; createdBy: string;
  }): Promise<{ success: boolean; error: string }> {
    if (!isSB()) return { success: false, error: 'Supabase não configurado' };

    let userId: string | null = null;

    // 1) Try signUp
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: { data: { name: params.name, role: 'colaborador' } },
      });
      if (signUpError) {
        console.error('[registerFromInvite] signUp error:', signUpError.message);
        if (signUpError.message?.includes('already') || signUpError.message?.includes('registered')) {
          const { data: signInData } = await supabase.auth.signInWithPassword({ email: params.email, password: params.password });
          if (signInData?.user) userId = signInData.user.id;
        }
      } else if (authData?.user) {
        userId = authData.user.id;
      }
    } catch (e) { console.error('[registerFromInvite] auth exception:', e); }

    if (!userId) userId = uuidv4();
    console.log('[registerFromInvite] userId:', userId);

    // 2) Insert employee
    const empData = {
      id: uuidv4(),
      company_id: params.companyId || null,
      user_id: userId,
      name: params.name,
      email: params.email,
      cpf: params.cpf,
      role: params.role || 'Colaborador',
      department: params.department || 'Geral',
      admission_date: params.admissionDate || null,
      birth_date: params.birthDate || null,
      phone: params.phone || '',
      is_active: true,
    };

    const { error: empError } = await supabase.from('employees').insert(empData).select().single();
    if (empError) {
      console.error('[registerFromInvite] employee insert error:', empError.message, empError.details, empError.hint);
      return { success: false, error: 'Erro ao salvar funcionário: ' + empError.message };
    }
    console.log('[registerFromInvite] employee created:', empData.id);

    // 3) Update invite
    const { error: invError } = await supabase.from('invites').update({
      status: 'accepted',
      face_photo: params.facePhoto,
      face_verified: true,
      face_captured_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
    }).eq('id', params.inviteId);
    if (invError) console.error('[registerFromInvite] invite update error:', invError.message);

    // 4) Restore admin session
    try {
      const s = lGet<{ email?: string }>(K.session);
      if (s?.email && s.email !== params.email) {
        const u = lGet<StoredUser[]>(K.users)?.find(x => x.email === s.email);
        if (u) await supabase.auth.signInWithPassword({ email: u.email, password: u.password });
      }
    } catch {}

    return { success: true, error: '' };
  },
};
