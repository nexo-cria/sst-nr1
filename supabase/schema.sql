-- =====================================================
-- NEXO-SST · Schema Completo (versão segura)
-- Cole e execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1) EMPRESAS
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  plan_id TEXT DEFAULT 'starter',
  plan_name TEXT DEFAULT 'Starter',
  employee_count INT DEFAULT 0,
  max_employees INT DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '1 year')
);

-- 2) PERFIS
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'colaborador' CHECK (role IN ('super_admin','rh','colaborador')),
  avatar TEXT DEFAULT '',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  company_name TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  admission_date DATE NOT NULL,
  birth_date DATE,
  phone TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) DOCUMENTOS
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','pending','approved','expired')),
  expires_at TIMESTAMPTZ,
  signed_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5) TREINAMENTOS
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL,
  duration INT NOT NULL,
  instructor TEXT NOT NULL,
  date DATE NOT NULL,
  expires_at DATE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
  participants TEXT[] DEFAULT '{}',
  max_participants INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6) EPIs
CREATE TABLE IF NOT EXISTS epis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name TEXT DEFAULT '',
  name TEXT NOT NULL,
  ca TEXT NOT NULL,
  quantity INT DEFAULT 1,
  delivery_date DATE NOT NULL,
  expires_at DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expired','returned')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7) CHECK-INS DIÁRIOS
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name TEXT DEFAULT '',
  date DATE NOT NULL,
  time TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'completo' CHECK (status IN ('completo','pendente','alerta')),
  alert_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- 8) CONVITES
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  admission_date DATE,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','cancelled')),
  face_photo TEXT DEFAULT '',
  face_verified BOOLEAN DEFAULT false,
  face_captured_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- RLS: Remove políticas antigas e recria todas
-- =====================================================

-- Companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_companies" ON companies;
CREATE POLICY "allow_all_companies" ON companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_profiles" ON profiles;
CREATE POLICY "allow_all_profiles" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_employees" ON employees;
CREATE POLICY "allow_all_employees" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_documents" ON documents;
CREATE POLICY "allow_all_documents" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trainings
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_trainings" ON trainings;
CREATE POLICY "allow_all_trainings" ON trainings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EPIs
ALTER TABLE epis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_epis" ON epis;
CREATE POLICY "allow_all_epis" ON epis FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Check-ins
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_checkins" ON daily_checkins;
CREATE POLICY "allow_all_checkins" ON daily_checkins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Invites
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_invites" ON invites;
CREATE POLICY "allow_all_invites" ON invites FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "allow_public_read_invites" ON invites;
CREATE POLICY "allow_public_read_invites" ON invites FOR SELECT USING (true);
