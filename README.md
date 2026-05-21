# Sorriso Prime Odontologia — Site Institucional

Site completo para clínica odontológica fictícia, desenvolvido como portfólio profissional. Design **Luxury Medical**, formulário de agendamento funcional com integração WhatsApp, animações premium e responsividade total.

---

## Visão Geral

**Sorriso Prime Odontologia** é um projeto de portfólio que simula um site real para uma clínica odontológica de alto padrão em Fortaleza, CE. O projeto demonstra habilidades em:

- Design UI/UX de alta conversão (Luxury Medical)
- HTML5 semântico com acessibilidade (ARIA, roles)
- CSS avançado (variáveis, grid, animações, responsive)
- JavaScript vanilla moderno (sem dependências externas)
- SEO técnico (Schema JSON-LD, meta tags, performance)

---

## Como Rodar Localmente

**Método 1 — Abrir diretamente no navegador:**
```
Abra o arquivo index.html diretamente no navegador.
Funciona sem servidor (protocolo file://).
```

**Método 2 — Servidor local (recomendado para iframes e fontes):**
```bash
# Com Python
python3 -m http.server 3000

# Com Node.js (npx)
npx serve .

# Com PHP
php -S localhost:3000
```
Então acesse: `http://localhost:3000`

---

## Estrutura de Pastas

```
sorriso-prime/
├── index.html              # Página principal completa
├── obrigado.html           # Confirmação pós-agendamento
├── 404.html                # Página de erro 404
│
├── assets/
│   ├── css/
│   │   ├── main.css        # Design system, layout, componentes
│   │   ├── animations.css  # Keyframes, scroll reveals, transições
│   │   └── responsive.css  # Breakpoints mobile-first
│   │
│   ├── js/
│   │   ├── main.js         # Cursor, header, carrossel, sliders, modais
│   │   ├── agendamento.js  # Formulário, validação, WhatsApp, disponibilidade
│   │   └── analytics.js   # Rastreamento de eventos customizado
│   │
│   └── images/
│       └── (imagens carregadas via Unsplash API)
│
├── components/
│   ├── header.html         # Referência standalone do header
│   ├── footer.html         # Referência standalone do footer
│   └── modal-agendamento.html # Referência do modal de agendamento
│
└── README.md               # Este arquivo
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica, ARIA |
| CSS3 | Design system, Grid, Flexbox, Custom Properties |
| JavaScript ES2020+ | Funcionalidades, sem frameworks |
| Google Fonts | Playfair Display + DM Sans |
| Unsplash API | Imagens de alta qualidade |
| WhatsApp API | Integração de agendamento |
| Schema.org | JSON-LD para SEO local |

---

## Seções do Site

1. **Header Fixo** — Transparente → sólido (blur) ao scrollar, menu mobile
2. **Hero** — Headline impactante, 3 contadores animados, CTAs
3. **Serviços** — 6 cards com hover dourado e modais de detalhes
4. **Sobre** — Imagem, diferenciais, badge de 15+ anos
5. **Antes e Depois** — 3 sliders comparativos arrastáveis
6. **Depoimentos** — Carrossel automático com 5 avaliações
7. **Agendamento** — Formulário completo com validação e WhatsApp
8. **Contato** — Mapa, endereço, horários, redes sociais
9. **Footer** — Links organizados, créditos, redes sociais

---

## Funcionalidades JavaScript

### main.js
- Cursor customizado dourado com follower suave
- Header sticky com scroll hide/show inteligente
- Smooth scroll para âncoras
- IntersectionObserver para scroll reveals com stagger
- CountUp animado para os números do hero
- Carrossel de depoimentos (auto-play, touch swipe, dots)
- Before/After slider arrastável (mouse + touch)
- Sistema de modais acessível (ARIA, ESC para fechar)
- Menu hamburguer com overlay

### agendamento.js
- Máscara de telefone automática
- Bloqueio de fins de semana no datepicker
- Bloqueio de feriados nacionais 2025/2026
- Disponibilidade simulada por horário (seed pela data)
- Validação real-time com feedback inline
- Mensagem WhatsApp pré-formatada
- Loading state + redirect para `obrigado.html`

### analytics.js
- Rastreamento de eventos sem dependências externas
- Track de cliques em CTAs, seções visualizadas, profundidade de scroll
- Armazenamento em localStorage (máx. 200 eventos)

---

## Como Personalizar

### 1. Alterar cores
Edite as variáveis em `assets/css/main.css`:
```css
:root {
  --color-primary: #1B4F72;    /* Azul principal */
  --color-secondary: #D4AF37;  /* Dourado */
}
```

### 2. Alterar número do WhatsApp
Em `assets/js/agendamento.js`:
```javascript
const NUMERO = '5585999990001'; // Formato: 55 + DDD + número (sem espaços)
```

### 3. Alterar textos
Edite diretamente no `index.html`. Os textos são autoexplicativos com comentários HTML.

### 4. Adicionar/remover serviços
No `index.html`, duplique ou remova um `<article class="service-card">` e o `<div class="modal-overlay">` correspondente.

### 5. Alterar horários disponíveis
Em `assets/js/agendamento.js`:
```javascript
const HORARIOS_BASE = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
```

### 6. Alterar feriados
Em `assets/js/agendamento.js`, edite o Set `FERIADOS` com datas no formato `YYYY-MM-DD`.

### 7. Alterar endereço no mapa
No `index.html`, encontre a tag `<iframe>` do Google Maps e substitua a URL `src` por um novo embed do Google Maps.

---

## SEO e Performance

- Schema markup `Dentist` (LocalBusiness) com dados estruturados
- Meta tags completas (OpenGraph, Twitter Cards)
- Fontes com `font-display: swap`
- CSS crítico inline no `<head>`
- Imagens com `loading="lazy"` e dimensões definidas
- Favicon SVG inline (sem arquivo externo)
- Sem JavaScript blocante (todos os scripts com `defer`)

---

## Screenshots

> Substituir pelas capturas reais ao finalizar o projeto

- `screenshots/01-hero.png` — Seção Hero com headline e stats
- `screenshots/02-servicos.png` — Grid de 6 serviços com hover
- `screenshots/03-sobre.png` — Seção sobre com before/after
- `screenshots/04-agendamento.png` — Formulário preenchido
- `screenshots/05-mobile.png` — Versão mobile 375px
- `screenshots/06-obrigado.png` — Página de confirmação

---

## Paleta de Cores

| Variável | Hex | Uso |
|---|---|---|
| `--color-primary` | `#1B4F72` | Azul principal — confiança |
| `--color-secondary` | `#D4AF37` | Dourado — premium |
| `--color-accent` | `#AED6F1` | Azul claro — leveza |
| `--color-bg` | `#FAFAFA` | Fundo quase branco |
| `--color-dark` | `#0D1B2A` | Texto escuro |
| `--color-success` | `#10B981` | Confirmações e checks |

---

## Tipografia

| Família | Uso |
|---|---|
| **Playfair Display** | Títulos, headlines, display |
| **DM Sans** | Corpo, labels, botões |

---

## Acessibilidade

- Estrutura semântica HTML5 (`header`, `nav`, `main`, `section`, `footer`, `article`)
- ARIA roles e labels em elementos interativos
- Navegação por teclado funcional (Tab, Esc)
- Animações desabilitadas com `prefers-reduced-motion`
- Contraste de cores adequado (WCAG AA)
- Textos alternativos em imagens

---

## Créditos

**Desenvolvido por:** [CCP NexaTech](mailto:ccpnexatech@gmail.com)

Projeto fictício desenvolvido para fins de portfólio profissional. Todos os dados, nomes, endereços e informações de contato são fictícios e criados exclusivamente para demonstração.

---

## Licença

Uso livre para fins educacionais e de portfólio. Para uso comercial, entre em contato com o desenvolvedor.
