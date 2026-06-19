# Análise do Frontend — Stock.io (grupo04-cjr-front)

> **Data:** 18/06/2026
> **Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Axios + lucide-react

---

## Sumário

1. [Estrutura do Projeto](#1-estrutura-do-projeto)
2. [Rotas (Next.js App Router)](#2-rotas-nextjs-app-router)
3. [Componentes](#3-componentes)
4. [Camada de API](#4-camada-de-api)
5. [Gerenciamento de Estado](#5-gerenciamento-de-estado)
6. [Fluxo de Autenticação](#6-fluxo-de-autenticação)
7. [Status de Implementação](#7-status-de-implementação)
8. [Páginas Ausentes](#8-páginas-ausentes)
9. [Páginas com Dados Mockados](#9-páginas-com-dados-mockados)
10. [Componentes sem Integração com API](#10-componentes-sem-integração-com-api)
11. [Componentes Duplicados / Não Utilizados](#11-componentes-duplicados--não-utilizados)
12. [Funcionalidades do Backend sem Frontend](#12-funcionalidades-do-backend-sem-frontend)
13. [Melhorias Arquiteturais](#13-melhorias-arquiteturais)

---

## 1. Estrutura do Projeto

```
grupo04-cjr-front/
├── .env.local                    # NEXT_PUBLIC_API_URL=http://localhost:3001
├── next.config.ts                # Imagens unoptimized + remotePatterns
├── package.json
├── tsconfig.json                 # Path alias @/* → ./*
├── postcss.config.mjs
├── eslint.config.mjs
│
├── app/
│   ├── globals.css               # Tailwind + scrollbar-hide
│   ├── layout.tsx                # Layout root (fonte League Spartan)
│   ├── page.tsx                  # Home page
│   │
│   ├── services/
│   │   └── api.ts                # Axios client + registerUser()
│   │
│   ├── components/
│   │   ├── navbar.tsx            # Navbar (login/logout/perfil/carrinho)
│   │   ├── searchbar.tsx         # Busca de produtos com dropdown
│   │   ├── CardProdutos.tsx      # Card de produto
│   │   ├── CardAvaliacoes.tsx    # Card de avaliação
│   │   ├── ModalCriarProduto.tsx     # Criar produto
│   │   ├── ModalEditarProduto.tsx    # Editar produto — ⚠️ NÃO INTEGRADO
│   │   ├── ModalCriarAvaliacao.tsx   # Criar avaliação de produto
│   │   ├── ModalEditarAvaliacao.tsx  # Editar/excluir avaliação
│   │   ├── ModalAvaliarLoja.tsx      # Criar avaliação de loja
│   │   ├── ModalAdicionarLoja.tsx    # Criar loja
│   │   ├── ModalEditarLoja.tsx       # Editar loja — ⚠️ NÃO INTEGRADO
│   │   ├── ModalAlterarSenha.tsx     # Alterar senha — 🗑️ NÃO UTILIZADO
│   │   └── ModalEditarPerfil.tsx     # Editar perfil — 🗑️ NÃO UTILIZADO
│   │
│   ├── cadastro/
│   │   └── page.tsx              # Registro de usuário
│   ├── login/
│   │   └── page.tsx              # Login
│   ├── carrinho/
│   │   └── page.tsx              # Carrinho de compras
│   ├── categoria/
│   │   └── [id]/
│   │       └── page.tsx          # Página de categoria — ⚠️ DADOS MOCKADOS
│   ├── produto-especifico/
│   │   └── [id]/
│   │       └── page.tsx          # Detalhe do produto
│   ├── avaliacao/
│   │   └── [id]/
│   │       └── page.tsx          # Avaliação + comentários
│   ├── lojas/
│   │   └── [id]/
│   │       └── page.tsx          # Detalhe da loja
│   └── perfil/
│       └── [id]/
│           └── page.tsx          # Perfil do usuário
│
├── public/
│   └── images/                   # Assets estáticos
```

---

## 2. Rotas (Next.js App Router)

| Rota | Arquivo | Propósito | Auth Necessária |
|------|---------|-----------|:---:|
| `/` | `app/page.tsx` | Home (hero, categorias, produtos, lojas) | ❌ |
| `/login` | `app/login/page.tsx` | Login | ❌ |
| `/cadastro` | `app/cadastro/page.tsx` | Registro | ❌ |
| `/carrinho` | `app/carrinho/page.tsx` | Carrinho | ✅ |
| `/categoria/[id]` | `app/categoria/[id]/page.tsx` | Produtos por categoria | ❌ |
| `/produto-especifico/[id]` | `app/produto-especifico/[id]/page.tsx` | Detalhe do produto | ❌ |
| `/avaliacao/[id]` | `app/avaliacao/[id]/page.tsx` | Avaliação + comentários | ❌ |
| `/lojas/[id]` | `app/lojas/[id]/page.tsx` | Detalhe da loja | ❌ |
| `/perfil/[id]` | `app/perfil/[id]/page.tsx` | Perfil do usuário | ✅ |

### Rotas Referenciadas mas Inexistentes

| Rota | Referenciada em | Backend |
|------|----------------|---------|
| `/recuperar-senha` | Link no formulário de login | `POST /auth/forgot-password` |
| `/resetar-senha` | Sequência do forgot | `POST /auth/reset-password` |
| `/checkout` | Botão "Finalizar" no carrinho | `POST /carrinho/finalizar` |

---

## 3. Componentes

### Navbar (`navbar.tsx`)

- Logo, links de navegação
- Botão condicional: "Login/Cadastro" se não logado, "Perfil/Carrinho/Logout" se logado
- Lê token do `localStorage`

### SearchBar (`searchbar.tsx`)

- Input de busca com dropdown de resultados
- Chamada: `GET /produtos?busca=...`
- Loading state e redirecionamento ao clicar

### CardProdutos (`CardProdutos.tsx`)

- Exibe imagem, nome, preço, estoque, avaliação
- Link para `/produto-especifico/[id]`

### CardAvaliacoes (`CardAvaliacoes.tsx`)

- Exibe nota (estrelas), comentário, nome do usuário, data
- Botões de editar/excluir (se for o dono)

### ModalCriarProduto (`ModalCriarProduto.tsx`)

- Formulário: nome, categoria (select da API), descrição, preço, estoque, imagens
- Chamadas: `POST /produtos` + `POST /produtos/:id/imagens`
- ✅ **Aparentemente funcional** — revisar integração

### ModalEditarProduto (`ModalEditarProduto.tsx`)

- ⚠️ **NÃO INTEGRADO** — valores hardcoded (Brownie), sem handler de salvar
- Botão "Excluir Produto" sem chamada API

### ModalCriarAvaliacao (`ModalCriarAvaliacao.tsx`)

- Formulário: estrelas + comentário
- Chamada: `POST /aval-produto/:produtoId`
- ✅ **Funcional**

### ModalEditarAvaliacao (`ModalEditarAvaliacao.tsx`)

- Editar nota/comentário + excluir
- Chamadas: `PATCH /aval-produto/:id`, `DELETE /aval-produto/:id`
- ✅ **Funcional**

### ModalAvaliarLoja (`ModalAvaliarLoja.tsx`)

- Formulário: estrelas + comentário
- Chamada: `POST /aval-loja/:lojaId`
- ✅ **Funcional**

### ModalAdicionarLoja (`ModalAdicionarLoja.tsx`)

- Formulário: nome, banner, logo, foto
- Chamada: `POST /lojas`
- ✅ **Aparentemente funcional** — revisar integração

### ModalEditarLoja (`ModalEditarLoja.tsx`)

- ⚠️ **NÃO INTEGRADO** — botões Salvar/Excluir sem chamada API

### ModalAlterarSenha (`ModalAlterarSenha.tsx`)

- 🗑️ **NÃO UTILIZADO** — não importado em nenhuma página
- Perfil tem lógica inline equivalente

### ModalEditarPerfil (`ModalEditarPerfil.tsx`)

- 🗑️ **NÃO UTILIZADO** — não importado em nenhuma página
- Perfil tem lógica inline equivalente

---

## 4. Camada de API

### Axios Client (`app/services/api.ts`)

```typescript
// Configuração existente:
const api = axios.create({ baseURL: 'http://localhost:3001/' });
export const registerUser = (userData) => api.post('/user/register', userData);
```

**Problema:** Apenas 1 função exportada. Todo o resto usa `fetch()` direto.

### Chamadas `fetch()` Diretas (espalhadas pelo app)

| Endpoint | Método | Usado Em |
|----------|--------|----------|
| `/auth/login` | POST | Login |
| `/user/:id` | GET | Perfil |
| `/user/:id` | PATCH | Perfil (multipart) |
| `/user/:id` | DELETE | Perfil |
| `/category` | GET | Home, ModalCriarProduto |
| `/produtos` | GET | Home (listar/buscar) |
| `/produtos/:id` | GET | Produto específico |
| `/produtos` | POST | ModalCriarProduto |
| `/produtos/:id/imagens` | POST | ModalCriarProduto |
| `/lojas` | GET | Home |
| `/lojas` | POST | ModalAdicionarLoja |
| `/lojas/:id` | GET | Loja detalhe |
| `/carrinho` | GET | Carrinho |
| `/carrinho` | POST | Produto específico (add ao carrinho) |
| `/carrinho/:id` | PATCH | Carrinho |
| `/carrinho/:id` | DELETE | Carrinho |
| `/aval-produto/:produtoId` | POST | ModalCriarAvaliacao |
| `/aval-produto/:id` | PATCH | ModalEditarAvaliacao |
| `/aval-produto/:id` | DELETE | ModalEditarAvaliacao |
| `/aval-produto/produto/:produtoId` | GET | Produto específico |
| `/aval-produto/:id` | GET | Avaliação detalhe |
| `/aval-produto/:id/comentario` | POST | Avaliação detalhe |
| `/aval-produto/comentario/:comentarioId` | PATCH | Avaliação detalhe |
| `/aval-loja/:lojaId` | POST | ModalAvaliarLoja |
| `/aval-loja/:id` | PATCH | Loja detalhe |

---

## 5. Gerenciamento de Estado

**Nenhuma biblioteca de estado global** (sem Redux, Zustand, Context API).

- **Autenticação:** `localStorage` lido diretamente em cada página/componente
- **Carrinho:** Fetch da API a cada carregamento da página
- **Modais:** `useState` local para controle de abertura/fechamento
- **Dados:** `useEffect` + `fetch()` em cada página

---

## 6. Fluxo de Autenticação

1. Login → `POST /auth/login` → `{ access_token }`
2. Token salvo: `localStorage.setItem("@StockIO:token", token)`
3. Token decodificado: `JSON.parse(atob(token.split(".")[1]))` → extrai `sub` (user ID)
4. Chamadas protegidas: `Authorization: Bearer ${token}`
5. Logout: `localStorage.removeItem("@StockIO:token")` → redirect `/login`
6. Navbar: verifica presença do token no `localStorage`
7. **Sem route guards** — páginas protegidas mostram fallback "faça login"

---

## 7. Status de Implementação

### ✅ Funcionalidades Completas

- [x] Registro de usuário (formulário + POST `/user/register`)
- [x] Login (formulário + POST `/auth/login` + localStorage)
- [x] Home page (hero, categorias via API, produtos via API, lojas via API)
- [x] Busca de produtos (searchbar com dropdown)
- [x] Detalhe do produto (imagens, preço, descrição, estoque, avaliações)
- [x] Carrinho (listar, adicionar, remover, atualizar quantidade, total)
- [x] Detalhe da loja (banner, nome, descrição, produtos, avaliações)
- [x] Criar avaliação de produto (modal com estrelas + comentário)
- [x] Editar/excluir avaliação de produto
- [x] Comentários em avaliação de produto (criar, editar)
- [x] Criar avaliação de loja
- [x] Criar produto (modal com campos + upload imagens)
- [x] Criar loja (modal com upload banner/logo/foto)
- [x] Perfil do usuário (foto, dados, editar, alterar senha, excluir conta)
- [x] Logout (limpa token, redireciona)

### ⚠️ Parcialmente Implementado

- [x] Editar produto (ModalEditarProduto) — **UI existe, sem chamada API**
- [x] Editar loja (ModalEditarLoja) — **UI existe, sem chamada API**
- [x] Editar avaliação de loja — **callback vazio, não atualiza lista**
- [x] Página de categoria (`/categoria/[id]`) — **dados mockados, sem API**

### ❌ Não Implementado

- [ ] Recuperação de senha (`/recuperar-senha`)
- [ ] Redefinição de senha (`/resetar-senha`)
- [ ] Checkout / finalizar compra (`/checkout`)
- [ ] Histórico de pedidos
- [ ] Deletar produto (chamada DELETE)
- [ ] Deletar loja (chamada DELETE)
- [ ] Comentários em avaliação de loja
- [ ] Excluir avaliação de loja

---

## 8. Páginas Ausentes

Páginas que **não existem** mas são referenciadas ou têm suporte total no backend.

| Página | Rota Esperada | Origem do Link | Backend |
|--------|---------------|----------------|---------|
| **Recuperar senha** | `/recuperar-senha` | Link no login | `POST /auth/forgot-password` |
| **Redefinir senha** | `/resetar-senha` | Sequência do forgot | `POST /auth/reset-password` |
| **Checkout** | `/checkout` | Botão "Finalizar Compra" no carrinho | `POST /carrinho/finalizar` |
| **Histórico de pedidos** | `/pedidos` | — | Modelos `Pedido` + `ItemPedido` |

### 8.1 Recuperar / Redefinir Senha

**O que implementar:**
- Página `/recuperar-senha` com formulário de email
- Página `/resetar-senha?token=XXX` com formulário de nova senha
- Validações e feedback de sucesso/erro
- Redirecionamento para login após sucesso

### 8.2 Checkout

**O que implementar:**
- Página `/checkout` com resumo do pedido
- Chamada `POST /carrinho/finalizar` (autenticada)
- Tela de confirmação pós-compra
- Redirecionamento após finalizar

### 8.3 Histórico de Pedidos

**O que implementar:**
- Endpoint no backend (`GET /pedidos?usuario_id=X`)
- Página `/pedidos` ou `/perfil/[id]/pedidos` para listar pedidos

---

## 9. Páginas com Dados Mockados

### 9.1 `/categoria/[id]`

**Localização:** `app/categoria/[id]/page.tsx`

**Problemas:**
- Produtos, lojas, populares e recentes são **dados mockados hardcoded**
- Paginação (botões 1-5) é visual apenas
- Filtro "ordenar por" não funcional
- Input de busca não wireado

**O que integrar:**
- `GET /category/:id` para nome e ícone da categoria
- `GET /produtos` (com filtro por nome ou categoria)
- `GET /lojas` para listar lojas relacionadas
- Wirear ordenação, paginação e busca

---

## 10. Componentes sem Integração com API

### 10.1 `ModalEditarProduto.tsx`

**Problemas:**
- Valores hardcoded (Brownie Meio Amargo, R$ 18)
- Botão "Salvar" sem handler
- Botão "Excluir Produto" sem chamada API

**O que integrar:**
- Receber `id` do produto → `GET /produtos/:id` para preencher formulário
- `PATCH /produtos/:id` no botão Salvar
- `DELETE /produtos/:id` no botão Excluir (com confirmação)

### 10.2 `ModalEditarLoja.tsx`

**Problemas:**
- Botões "Salvar" e "Excluir" sem chamada API

**O que integrar:**
- `PATCH /lojas/:id` no botão Salvar
- `DELETE /lojas/:id` no botão Excluir (com confirmação)

### 10.3 `ModalCriarProduto.tsx`

**Status:** ✅ **Aparentemente funcional** — revisar integração de upload de imagens e categoria.

### 10.4 `ModalAdicionarLoja.tsx`

**Status:** ✅ **Aparentemente funcional** — revisar upload de banner/logo/foto e extração do `id_dono` do token.

---

## 11. Componentes Duplicados / Não Utilizados

### 11.1 `ModalAlterarSenha.tsx`

- **Não importado** em nenhuma página
- A página de perfil tem lógica de alteração de senha inline
- **Ação:** Remover ou refatorar perfil para usá-lo

### 11.2 `ModalEditarPerfil.tsx`

- **Não importado** em nenhuma página
- A página de perfil tem lógica de edição inline
- **Ação:** Remover ou refatorar perfil para usá-lo

---

## 12. Funcionalidades do Backend sem Frontend

Funcionalidades que o backend **já implementa** mas o frontend **não consome**.

| Funcionalidade | Endpoint(s) Backend | Status Frontend |
|---------------|---------------------|:---------------:|
| Comentários em avaliações de loja | `GET /coment-aval/loja/:id` + `POST /coment-aval` | ❌ Não implementado |
| Deletar produto | `DELETE /produtos/:id` | ❌ Modal sem wire |
| Deletar loja | `DELETE /lojas/:id` | ❌ Modal sem wire |
| Finalizar compra (checkout) | `POST /carrinho/finalizar` | ❌ Página não existe |
| Editar avaliação de loja | `PATCH /aval-loja/:id` | ⚠️ Callback vazio |
| Excluir avaliação de loja | `DELETE /aval-loja/:id` | ❌ Não wireado |
| Flag isDonoLoja em comentários | Campo disponível na resposta | ❌ Não exibido |

---

## 13. Melhorias Arquiteturais

### 13.1 Ausência de Camada de API Centralizada 🔴

**Problema:**
- `fetch()` direto com URLs hardcoded em cada página
- Apenas `registerUser` usa Axios
- Sem interceptador para token JWT
- Sem tratamento centralizado de erros HTTP

**Solução:** Expandir `api.ts` com funções para todos os endpoints, interceptador `Authorization`, interceptador 401 → redirect login.

### 13.2 Sem Contexto de Autenticação 🔴

**Problema:**
- `localStorage.getItem("@StockIO:token")` em cada página
- Decodificação manual do JWT com `atob()` replicada
- Sem provider global — UI não reage a login/logout sem refresh

**Solução:** Criar `AuthContext` + `AuthProvider` no layout root.

### 13.3 Sem Route Guards 🟡

**Problema:**
- Páginas protegidas mostram fallback "faça login" mas não redirecionam
- Sem middleware Next.js

**Solução:** Componente `ProtectedRoute` ou middleware para redirecionar ao `/login`.

### 13.4 Tratamento de Erros Minimalista 🟡

**Problema:**
- `alert()` generalizado para erros
- Nenhum sistema de notificações (toast/snackbar)

**Solução:** Componente `Toast` + hook `useToast`.

### 13.5 Sem Estados de Loading 🟢

**Problema:**
- "Carregando..." texto puro na maioria das páginas
- Sem skeletons/spinners

**Solução:** Componentes `Skeleton` e `Spinner` reutilizáveis.

### 13.6 Carrinho depende de backend mockado 🟡

**Problema:**
- Backend usa `MOCK_USER_ID = 1` no controller do carrinho
- Frontend envia user ID real, mas backend ignora

**Solução:** Integrar `AuthGuard` no controller do carrinho no backend.

---

## Resumo das Ações por Prioridade

| Prioridade | Ação | Esforço |
|:----------:|------|:-------:|
| 🔴 Alta | Integrar dados reais na página `/categoria/[id]` | Médio |
| 🔴 Alta | Criar páginas de recuperação/redefinição de senha | Médio |
| 🔴 Alta | Criar página de checkout + chamar finalizar compra | Médio |
| 🟡 Média | Wirear ModalEditarProduto com PATCH/DELETE | Pequeno |
| 🟡 Média | Wirear ModalEditarLoja com PATCH/DELETE | Pequeno |
| 🟡 Média | Remover ou refatorar componentes não utilizados | Pequeno |
| 🟡 Média | Wirear comentários em avaliação de loja | Pequeno |
| 🟡 Média | Corrigir callback vazio de avaliação de loja | Pequeno |
| 🟢 Baixa | Criar AuthContext (provider global) | Médio |
| 🟢 Baixa | Centralizar camada de API com Axios/interceptors | Médio |
| 🟢 Baixa | Adicionar route guards | Pequeno |
| 🟢 Baixa | Implementar sistema de notificações (toast) | Médio |
| 🟢 Baixa | Adicionar estados de loading (skeletons) | Médio |
| 🟢 Baixa | Criar página de histórico de pedidos | Grande |
| 🟢 Baixa | Integrar JWT real no controller do carrinho (backend) | Pequeno |
