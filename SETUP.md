# 🚀 Guia de Deploy — Nexo-SST no Supabase + Vercel

O sistema funciona em **dois modos**:
- **Offline**: Sem configurar nada → usa localStorage (já funciona agora!)
- **Online**: Com Supabase + Vercel → dados na nuvem, acessível por qualquer dispositivo

---

## Passo 1 · Criar Projeto no Supabase

1. Acesse **[supabase.com](https://supabase.com)** e crie conta
2. Clique **"New Project"**
3. Preencha: Nome = `nexo-sst`, Região = `South America (São Paulo)`
4. Defina uma senha forte e clique **"Create new project"**
5. Aguarde ~2 min

---

## Passo 2 · Criar Tabelas no Banco

1. No Supabase, clique em **SQL Editor** (menu lateral)
2. Clique **"New Query"**
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole e clique **"Run"**
5. Deve aparecer ✅ "Success"

---

## Passo 3 · Desabilitar confirmação de email

1. Vá em **Authentication** > **Providers** > **Email**
2. **Desmarque** "Confirm email" (para teste)
3. Clique **Save**

---

## Passo 4 · Obter Credenciais da API

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

---

## Passo 5 · Criar Admin no Supabase Auth

1. Vá em **Authentication** > **Users**
2. Clique **"Add User"** > **"Create new user"**
3. Crie: `admin@nexo-sst.com.br` / senha: `admin123`
4. Vá em **SQL Editor** e execute:

```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@nexo-sst.com.br';
```

**Pronto!** Todos os outros usuários (RH, colaboradores) serão criados pelo admin dentro do sistema.

---

## Passo 6 · Subir no GitHub

```bash
git init
git add .
git commit -m "Nexo-SST - initial commit"
git remote add origin https://github.com/SEU_USUARIO/nexo-sst.git
git branch -M main
git push -u origin main
```

---

## Passo 7 · Deploy na Vercel

1. Acesse **[vercel.com](https://vercel.com)** e faça login com GitHub
2. Clique **"Add New"** > **"Project"**
3. Selecione o repositório `nexo-sst`
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGci...`
5. Clique **"Deploy"**
6. Aguarde ~1 min

---

## ✅ Pronto!

Acesse a URL da Vercel e faça login:
- **E-mail**: admin@nexo-sst.com.br
- **Senha**: admin123

Depois:
1. **Admin** cria empresas em "Empresas"
2. **Admin** cria usuários RH em "Usuários"  
3. **RH** faz login e cadastra colaboradores em "Funcionários"
4. **Colaborador** faz login e preenche o check-in diário NR-1
