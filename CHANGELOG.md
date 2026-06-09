# 📝 CHANGELOG — Nexo-SST

Todas as mudanças do projeto são documentadas aqui.
A IA deve atualizar este arquivo ao final de cada sessão de trabalho.

---

## [1.0.0] — 2025-01-XX — Lançamento Inicial

### ✅ Criado
- Landing page completa (hero, features, pricing, testimonials, FAQ, contato, footer)
- Sistema de autenticação com 3 perfis (super_admin, rh, colaborador)
- Tela de login com e-mail e senha
- Dashboard diferente para cada perfil
- CRUD de Empresas (admin)
- CRUD de Usuários RH (admin cria login para o RH)
- CRUD de Funcionários (RH cria com opção de login para colaborador)
- Gestão de Documentos SST (PGR, PCMSO, LTCAT, ASO, PPRA)
- Gestão de Treinamentos
- Gestão de EPIs
- Check-in Diário NR-1 (11 perguntas, 4 categorias)
- Monitoramento de check-ins pelo RH
- Carrinho de compras na landing page
- Botão WhatsApp flutuante
- Engine de dados dual mode (Supabase online / localStorage offline)
- Schema SQL completo para Supabase (7 tabelas, trigger, RLS)
- Deploy na Vercel: https://nexo-sst-seven.vercel.app/
- Banco configurado no Supabase com admin criado

### 🐛 Corrigido
- Supabase crashava ao inicializar com variáveis vazias (lazy init com Proxy)
- BrowserRouter trocado por HashRouter para compatibilidade com single-file build
- Typo no ProtectedRoute (barra invertida no redirect)
- SQL dividido em partes para evitar erro de tabela não existente

---

## [1.1.0] — Correções Check-in e Login

### 🐛 Corrigido
- GestaoCheckins.tsx reescrito — antes usava dados mock, agora usa dados reais do `db`
- RH agora vê os check-ins que os colaboradores preencheram em tempo real
- Adicionado botão "Atualizar" (🔄) na tela de Gestão de Check-ins
- Corrigido bug: ao criar usuário via Supabase, a sessão do RH/Admin era perdida (agora salva e restaura)
- Adicionado loading e mensagem de erro no formulário de cadastro de colaborador
- Mensagem de sucesso mostra login e senha do colaborador criado

### 🗑️ Removido
- Removidas credenciais do admin da tela de login (bloco "Primeiro acesso")

### ✏️ Alterado
- Filtro de data na Gestão de Check-ins agora começa em "Todo Período" em vez de "Hoje"
- Dashboard RH atualiza dados dos check-ins automaticamente

---

## [Próxima versão] — Pendente

### 🔜 Planejado
- Páginas do colaborador (meus dados, documentos, treinamentos, EPIs)
- Relatórios para admin e RH
- Configurações do sistema
- Recuperação de senha
- Notificações
- Upload de arquivos
- Exportação PDF
```

---

> **INSTRUÇÃO PARA A IA:** Ao fazer mudanças no projeto, adicione uma nova seção
> neste arquivo com a data, o que foi criado/alterado/corrigido.
