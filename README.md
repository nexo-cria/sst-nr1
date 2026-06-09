# Nexo-SST - Sistema de Gestão de SST (NR-1)

Sistema completo para gestão de Segurança e Saúde no Trabalho, em conformidade com a NR-1.

## 🚀 Funcionalidades

- **Super Admin**: Gerenciamento completo do sistema, empresas e usuários
- **RH**: Gestão de funcionários, documentos, treinamentos, EPIs e check-ins
- **Colaborador**: Check-in diário NR-1, visualização de documentos e EPIs

## 📋 Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [GitHub](https://github.com)

## 🔧 Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha um nome e senha para o banco de dados
4. Selecione a região mais próxima (São Paulo recomendado)
5. Aguarde a criação do projeto (~2 minutos)

### 2. Configurar o banco de dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em "Run" para executar
5. Verifique se todas as tabelas foram criadas em **Table Editor**

### 3. Obter as credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (em API Keys)

### 4. Configurar variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Criar usuários de teste

No Supabase Dashboard:

1. Vá em **Authentication** > **Users**
2. Clique em "Add User" > "Create new user"
3. Crie os seguintes usuários:

| Email | Senha | Role |
|-------|-------|------|
| admin@nexo-sst.com.br | admin123 | super_admin |
| rh@techbrasil.com.br | rh123 | rh |
| joao@techbrasil.com.br | colab123 | colaborador |

4. Após criar os usuários, execute no **SQL Editor**:

```sql
-- Atualizar roles dos usuários
UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@nexo-sst.com.br';
UPDATE profiles SET role = 'rh', company_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' WHERE email = 'rh@techbrasil.com.br';
UPDATE profiles SET role = 'colaborador', company_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' WHERE email = 'joao@techbrasil.com.br';

-- Criar funcionário para o colaborador
INSERT INTO employees (company_id, user_id, name, email, cpf, role, department, admission_date)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  id,
  'João Santos',
  'joao@techbrasil.com.br',
  '123.456.789-00',
  'Desenvolvedor',
  'TI',
  '2023-03-15'
FROM profiles WHERE email = 'joao@techbrasil.com.br';
```

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🚀 Deploy na Vercel

### 1. Criar repositório no GitHub

```bash
# Inicializar git (se ainda não fez)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - Nexo-SST"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/nexo-sst.git
git branch -M main
git push -u origin main
```

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New" > "Project"
3. Importe o repositório `nexo-sst`
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em "Deploy"

### 3. Configurar domínio personalizado (opcional)

1. Em **Settings** > **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções da Vercel

## 📱 Credenciais de Acesso (Demo)

| Perfil | Email | Senha |
|--------|-------|-------|
| Super Admin | admin@nexo-sst.com.br | admin123 |
| RH | rh@techbrasil.com.br | rh123 |
| Colaborador | joao@techbrasil.com.br | colab123 |

## 🗂️ Estrutura do Projeto

```
src/
├── components/       # Componentes React
│   ├── dashboard/    # Componentes do dashboard
│   └── ...
├── context/          # Context API (Auth, Cart)
├── data/             # Dados mock
├── hooks/            # Custom hooks
├── lib/              # Configuração Supabase
├── pages/            # Páginas da aplicação
│   ├── dashboard/    # Páginas do dashboard
│   └── Login.tsx
├── services/         # Serviços de API
├── types/            # TypeScript types
└── App.tsx           # Componente principal

supabase/
└── schema.sql        # Schema do banco de dados
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Autenticação via Supabase Auth
- Políticas de acesso por role (super_admin, rh, colaborador)
- Sessões persistentes e refresh automático de tokens

## 📄 Licença

MIT License - © 2024 Nexo-SST
