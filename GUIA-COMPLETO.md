# PASSO A PASSO COMPLETO

Siga na ordem. Não pule nenhum passo.

---

## PASSO 1 — Abrir o GitHub e criar conta

1. No navegador, vá para: github.com
2. Se já tem conta, clique "Sign in" e faça login. Pule para o PASSO 2.
3. Se não tem conta, clique "Sign up"
4. Preencha e-mail, senha e nome de usuário
5. Confirme o e-mail que chegar na sua caixa de entrada

---

## PASSO 2 — Criar repositório no GitHub

1. No GitHub, clique no "+" no canto superior direito da tela
2. Clique em "New repository"
3. Em "Repository name" escreva: nexo-sst
4. Em "Description" escreva: Sistema SST
5. Deixe marcado "Public"
6. NÃO marque "Add a README file"
7. Clique "Create repository"
8. IMPORTANTE: Vai aparecer uma página com comandos. Copie o link que aparece, algo como:
   https://github.com/SEUUSUARIO/nexo-sst.git
9. Guarde esse link num bloco de notas

---

## PASSO 3 — Abrir o Supabase e criar conta

1. Em outra aba, vá para: supabase.com
2. Clique "Start your project"
3. Clique "Continue with GitHub"
4. Clique "Authorize supabase" na tela que aparecer
5. Pronto, conta criada

---

## PASSO 4 — Criar projeto no Supabase

1. No Supabase, clique "New Project"
2. Se pedir organização, escreva seu nome e clique "Create organization"
3. Na tela do projeto:
   - Name: nexo-sst
   - Database Password: clique "Generate a password" (não precisa anotar essa)
   - Region: South America (São Paulo)
4. Clique "Create new project"
5. ESPERE 2 MINUTOS até terminar

---

## PASSO 5 — Copiar URL e Key do Supabase

Essa é a parte mais importante. Preste atenção.

1. No menu do lado ESQUERDO, clique em "Settings" (ícone de engrenagem ⚙️, lá embaixo)
2. Depois clique em "API"
3. Você vai ver "Project URL". COPIE esse link todo e cole no bloco de notas
   Exemplo: https://xyzabc123.supabase.co
4. Logo abaixo tem "Project API keys". Na linha "anon public", clique no botão de copiar
5. Cole no bloco de notas também
   Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6...

Agora no bloco de notas você tem:
```
URL: https://xyzabc123.supabase.co
KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## PASSO 6 — Criar as tabelas no banco de dados

1. No menu esquerdo do Supabase, clique em "SQL Editor"
2. Clique "New query"
3. APAGUE tudo que estiver no editor
4. Copie TODO o texto abaixo (de CREATE até o último ponto e vírgula) e cole no editor:

```sql
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

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE epis ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin')
);
CREATE POLICY "companies_select" ON companies FOR SELECT USING (true);
CREATE POLICY "companies_insert" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "companies_update" ON companies FOR UPDATE USING (true);
CREATE POLICY "companies_delete" ON companies FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin')
);
CREATE POLICY "employees_all" ON employees FOR ALL USING (true);
CREATE POLICY "documents_all" ON documents FOR ALL USING (true);
CREATE POLICY "trainings_all" ON trainings FOR ALL USING (true);
CREATE POLICY "epis_all" ON epis FOR ALL USING (true);
CREATE POLICY "checkins_all" ON daily_checkins FOR ALL USING (true);
```

5. Clique no botão "Run" (ou aperte Ctrl+Enter)
6. Deve aparecer "Success. No rows returned"
7. Para confirmar: clique em "Table Editor" no menu esquerdo. Deve ter 7 tabelas

---

## PASSO 7 — Desligar confirmação de e-mail

1. No menu esquerdo, clique em "Authentication"
2. Clique na aba "Providers" (em cima)
3. Clique em "Email" para expandir
4. DESMARQUE a opção "Confirm email" (o botão fica cinza)
5. Clique "Save"

---

## PASSO 8 — Criar o usuário administrador

1. Ainda em Authentication, clique na aba "Users"
2. Clique "Add user" e depois "Create new user"
3. Preencha:
   - Email: admin@nexo-sst.com.br
   - Password: admin123
   - Marque "Auto Confirm User"
4. Clique "Create user"
5. Agora vá em "SQL Editor" no menu esquerdo
6. Clique "New query"
7. Cole esse texto e clique Run:

```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@nexo-sst.com.br';
```

8. Deve aparecer "Success"

---

## PASSO 9 — Criar conta na Vercel

1. Em outra aba, vá para: vercel.com
2. Clique "Sign Up"
3. Clique "Continue with GitHub"
4. Autorize clicando "Authorize Vercel"

---

## PASSO 10 — Importar o projeto na Vercel

1. Na Vercel, clique "Add New..." e depois "Project"
2. Procure "nexo-sst" na lista de repositórios
3. Clique "Import"

SE NÃO ENCONTRAR O REPOSITÓRIO:
- Clique "Adjust GitHub App Permissions"
- Selecione "All repositories"
- Clique "Save"
- Volte e tente novamente

---

## PASSO 11 — Adicionar as variáveis de ambiente na Vercel

ANTES de clicar Deploy, faça isso:

1. Na tela de configuração, role para baixo até "Environment Variables"
2. No campo "Name" escreva EXATAMENTE: VITE_SUPABASE_URL
3. No campo "Value" cole a URL que anotou (ex: https://xyzabc123.supabase.co)
4. Clique "Add"
5. No campo "Name" escreva EXATAMENTE: VITE_SUPABASE_ANON_KEY
6. No campo "Value" cole a KEY que anotou (a chave longa)
7. Clique "Add"
8. Confira que as duas variáveis aparecem na lista

---

## PASSO 12 — Fazer o Deploy

1. Clique no botão "Deploy"
2. Espere 1-2 minutos
3. Vai aparecer "Congratulations!" com confetes
4. Clique no link do seu site (algo como nexo-sst-xxxx.vercel.app)

---

## PASSO 13 — Testar

1. No site, clique "Entrar"
2. E-mail: admin@nexo-sst.com.br
3. Senha: admin123
4. Clique "Entrar"
5. Você deve ver o painel do administrador!

Agora teste criar:
- Empresa (menu Empresas → Nova Empresa)
- Usuário RH (menu Usuários → Novo Usuário RH)
- Saia e entre com o RH
- Crie um colaborador (menu Funcionários → Novo Colaborador)
- Saia e entre com o colaborador
- Faça o check-in diário NR-1

---

## SE DER ERRO

Problema: "E-mail ou senha incorretos"
→ No Supabase, vá em Authentication > Users e veja se o admin aparece
→ Se não aparece, crie novamente (Passo 8)
→ Se aparece, execute o SQL do Passo 8 novamente

Problema: Tela branca
→ Na Vercel, vá em Settings > Environment Variables
→ Confira se as duas variáveis estão corretas
→ Se corrigiu algo, vá em Deployments, clique "..." no último deploy, "Redeploy"

Problema: Empresa não salva
→ No Supabase, vá em Table Editor e confira se as 7 tabelas existem
→ Se não existem, execute o SQL do Passo 6 novamente
