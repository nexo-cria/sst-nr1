# 📋 NEXO-SST — LOG DO PROJETO

> **INSTRUÇÃO PARA A IA:** Ao iniciar uma nova conversa, peça ao usuário para compartilhar este arquivo.
> Com ele você entende todo o sistema, o que foi feito, o que falta, e continua de onde parou.

---

## 🔗 LINKS DO PROJETO

| O que | Link |
|-------|------|
| **Site online (Vercel)** | https://nexo-sst-seven.vercel.app/ |
| **Repositório (GitHub)** | https://github.com/SEU-USUARIO/nexo-sst |
| **Banco de dados (Supabase)** | https://supabase.com (login com GitHub) |
| **Login Admin** | admin@nexo-sst.com.br / admin123 |

---

## 🏗️ STACK TECNOLÓGICA

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2.6 | Frontend |
| Vite | 7.3.2 | Build tool |
| TypeScript | 5.9.3 | Tipagem |
| Tailwind CSS | 4.1.17 | Estilos |
| React Router DOM | 7.16+ | Rotas (HashRouter) |
| Lucide React | 1.17+ | Ícones |
| Supabase JS | 2.106+ | Backend/Auth/Database |
| Vercel | - | Hosting |

---

## 📁 ESTRUTURA DO PROJETO

```
nexo-sst/
├── index.html                    # HTML principal
├── package.json                  # Dependências
├── vite.config.ts                # Config do Vite (NÃO EDITAR)
├── tsconfig.json                 # Config TypeScript
├── .gitignore                    # Arquivos ignorados pelo Git
├── .env.example                  # Modelo de variáveis de ambiente
├── README.md                     # Documentação geral
├── SETUP.md                      # Guia de setup
├── GUIA-COMPLETO.md              # Guia para leigos
├── PROJECT-LOG.md                # ⭐ ESTE ARQUIVO — Log do projeto
├── CHANGELOG.md                  # Histórico de mudanças
│
├── supabase/
│   └── schema.sql                # SQL das tabelas do banco
│
└── src/
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Rotas principais (HashRouter)
    ├── index.css                 # Estilos globais + Tailwind
    ├── vite-env.d.ts             # Tipos do Vite
    │
    ├── lib/
    │   ├── supabase.ts           # Client Supabase (lazy init)
    │   └── storage.ts            # ⭐ ENGINE PRINCIPAL — dual mode (Supabase/localStorage)
    │
    ├── context/
    │   ├── AuthContext.tsx        # Autenticação (login/logout/sessão)
    │   └── CartContext.tsx        # Carrinho da landing page
    │
    ├── types/
    │   ├── auth.ts               # Tipos de auth (legado, não usado diretamente)
    │   ├── checkin.ts            # Perguntas do check-in NR-1
    │   ├── database.ts           # Tipos do Supabase (legado)
    │   └── index.ts              # Tipos gerais
    │
    ├── hooks/
    │   └── useScrollAnimation.ts # Hook de animação no scroll
    │
    ├── data/
    │   ├── mockData.ts           # Dados mock (legado, não usado mais)
    │   ├── plans.ts              # Planos de preço da landing page
    │   ├── testimonials.ts       # Depoimentos da landing page
    │   └── faqs.ts               # Perguntas frequentes da landing page
    │
    ├── components/
    │   ├── Header.tsx            # Header da landing page
    │   ├── Hero.tsx              # Seção hero
    │   ├── Companies.tsx         # Logos de empresas
    │   ├── Features.tsx          # Funcionalidades
    │   ├── Compliance.tsx        # Seção NR-1
    │   ├── HowItWorks.tsx        # Como funciona
    │   ├── Pricing.tsx           # Planos e preços
    │   ├── Testimonials.tsx      # Depoimentos
    │   ├── FAQ.tsx               # Perguntas frequentes
    │   ├── CTA.tsx               # Call to action
    │   ├── Contact.tsx           # Formulário de contato
    │   ├── Footer.tsx            # Rodapé
    │   ├── CartDrawer.tsx        # Drawer do carrinho
    │   ├── WhatsAppButton.tsx    # Botão WhatsApp flutuante
    │   ├── ProtectedRoute.tsx    # Proteção de rotas por role
    │   │
    │   └── dashboard/
    │       ├── DashboardLayout.tsx  # Layout (sidebar + topbar + outlet)
    │       ├── Sidebar.tsx          # Menu lateral (muda por role)
    │       └── TopBar.tsx           # Barra superior
    │
    └── pages/
        ├── Login.tsx                # Tela de login
        │
        └── dashboard/
            ├── Dashboard.tsx            # Roteador de dashboard por role
            ├── SuperAdminDashboard.tsx   # Dashboard do admin
            ├── RHDashboard.tsx          # Dashboard do RH
            ├── ColaboradorDashboard.tsx  # Dashboard do colaborador
            ├── Empresas.tsx             # CRUD empresas (admin)
            ├── GestaoUsuarios.tsx       # CRUD usuários RH (admin)
            ├── Funcionarios.tsx         # CRUD funcionários (RH)
            ├── Documentos.tsx           # Gestão documentos (RH)
            ├── Treinamentos.tsx         # Gestão treinamentos (RH)
            ├── EPIs.tsx                 # Gestão EPIs (RH)
            ├── GestaoCheckins.tsx       # Monitorar check-ins (RH/admin)
            ├── CheckinDiario.tsx        # Check-in NR-1 (colaborador)
            └── PlaceholderPage.tsx      # Página genérica "em construção"
```

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### Fluxo de cadastro:
```
Super Admin (pré-cadastrado no Supabase)
  └── Cadastra EMPRESAS (menu Empresas)
  └── Cadastra USUÁRIOS RH (menu Usuários) ← cria login com e-mail e senha
        └── RH faz login e cadastra COLABORADORES (menu Funcionários)
              └── Colaborador faz login e faz CHECK-IN DIÁRIO NR-1
```

### Credenciais atuais:
| Role | E-mail | Senha | Como foi criado |
|------|--------|-------|-----------------|
| super_admin | admin@nexo-sst.com.br | admin123 | Manualmente no Supabase Auth |

### Modo dual (arquivo `src/lib/storage.ts`):
- **Com Supabase configurado** (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`) → usa banco real
- **Sem Supabase** → usa localStorage (modo offline/demo)
- A detecção é automática via `isSupabaseConfigured()`

---

## 🗄️ BANCO DE DADOS (Supabase)

### Tabelas:
| Tabela | Descrição | Campos principais |
|--------|-----------|-------------------|
| `profiles` | Usuários do sistema (linked ao auth.users) | id, email, name, role, company_id, company_name |
| `companies` | Empresas clientes | id, name, cnpj, email, plan_id, plan_name, employee_count |
| `employees` | Funcionários das empresas | id, company_id, user_id, name, cpf, role, department |
| `documents` | Documentos SST | id, company_id, type, title, status |
| `trainings` | Treinamentos | id, company_id, title, type, duration, status |
| `epis` | EPIs | id, company_id, employee_id, name, ca, status |
| `daily_checkins` | Check-ins NR-1 | id, company_id, employee_id, date, responses, status, alert_count |

### Trigger automático:
- `handle_new_user()` → ao criar user no auth.users, cria automaticamente perfil em profiles

### RLS (Row Level Security):
- Habilitado em todas as tabelas
- Políticas permissivas para facilitar desenvolvimento
- companies_insert exige role = 'super_admin'

---

## 🛣️ ROTAS DO SISTEMA

### Públicas:
| Rota | Componente | Descrição |
|------|-----------|-----------|
| `#/` | LandingPage | Site institucional |
| `#/login` | Login | Tela de login |

### Protegidas (dashboard):
| Rota | Role | Componente |
|------|------|-----------|
| `#/dashboard` | todos | Dashboard (redireciona por role) |
| `#/dashboard/empresas` | super_admin | CRUD Empresas |
| `#/dashboard/usuarios` | super_admin | CRUD Usuários RH |
| `#/dashboard/checkins-geral` | super_admin | Ver check-ins |
| `#/dashboard/assinaturas` | super_admin | Placeholder |
| `#/dashboard/gestao-checkins` | rh | Monitorar check-ins da equipe |
| `#/dashboard/funcionarios` | rh | CRUD Funcionários |
| `#/dashboard/documentos` | rh | Gestão documentos |
| `#/dashboard/treinamentos` | rh | Gestão treinamentos |
| `#/dashboard/epis` | rh | Gestão EPIs |
| `#/dashboard/checkin-diario` | colaborador | Fazer check-in NR-1 |
| `#/dashboard/meus-dados` | colaborador | Placeholder |
| `#/dashboard/meus-documentos` | colaborador | Placeholder |
| `#/dashboard/meus-treinamentos` | colaborador | Placeholder |
| `#/dashboard/meus-epis` | colaborador | Placeholder |
| `#/dashboard/relatorios` | admin, rh | Placeholder |
| `#/dashboard/configuracoes` | admin, rh | Placeholder |

---

## ✅ FUNCIONALIDADES PRONTAS

- [x] Landing page completa (hero, features, pricing, testimonials, FAQ, contato)
- [x] Botão "Entrar" levando ao login
- [x] Sistema de login com e-mail e senha
- [x] Dashboard do Super Admin (métricas, empresas, fluxo)
- [x] Dashboard do RH (métricas, alertas, funcionários)
- [x] Dashboard do Colaborador (check-in, histórico)
- [x] CRUD Empresas (admin cria, edita, ativa/desativa, exclui)
- [x] CRUD Usuários RH (admin cria com e-mail + senha, vincula à empresa)
- [x] CRUD Funcionários (RH cria com opção de criar login)
- [x] Gestão de Documentos (criar, aprovar, filtrar por tipo)
- [x] Gestão de Treinamentos (criar, agendar, concluir)
- [x] Gestão de EPIs (registrar entrega, controle validade, devolver)
- [x] Check-in Diário NR-1 (11 perguntas, 4 categorias, alertas)
- [x] Gestão de Check-ins pelo RH (tabela, filtros, detalhes)
- [x] Carrinho de compras na landing page
- [x] Botão WhatsApp flutuante
- [x] Modo dual (Supabase / localStorage)
- [x] Deploy na Vercel funcionando
- [x] Supabase configurado com tabelas e admin

## ❌ FUNCIONALIDADES PENDENTES (Placeholders)

- [ ] Página "Meus Dados" do colaborador
- [ ] Página "Meus Documentos" do colaborador
- [ ] Página "Meus Treinamentos" do colaborador
- [ ] Página "Meus EPIs" do colaborador
- [ ] Página "Relatórios" (admin e RH)
- [ ] Página "Configurações" (admin e RH)
- [ ] Página "Assinaturas" (admin)
- [ ] Recuperação de senha
- [ ] Notificações
- [ ] Exportação de relatórios em PDF
- [ ] Upload real de arquivos (documentos)

---

## 🐛 BUGS CONHECIDOS

| # | Descrição | Status |
|---|-----------|--------|
| 1 | Supabase crashava com strings vazias na importação | ✅ Corrigido (lazy init com Proxy) |
| 2 | BrowserRouter não funcionava com single-file build | ✅ Corrigido (trocado para HashRouter) |
| 3 | ProtectedRoute tinha typo no redirect | ✅ Corrigido |
| 4 | Tabelas profiles não existia ao criar admin | ✅ Corrigido (SQL dividido em partes) |

---

## 📝 NOTAS PARA PRÓXIMA SESSÃO

- O sistema está 100% funcional e online
- Admin consegue logar, criar empresas e RHs
- RH consegue logar e criar colaboradores
- Colaboradores conseguem logar e fazer check-in
- Próximos passos seriam: configurações internas, relatórios, etc
- Qualquer mudança no código: fazer aqui → commit no GitHub → Vercel atualiza automático
