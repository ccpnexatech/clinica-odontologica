/* ============================================================
   SORRISO PRIME ODONTOLOGIA — AGENDAMENTO.JS
   Formulário de agendamento — validação, disponibilidade, WhatsApp
   ============================================================ */

'use strict';

/* ── Feriados nacionais 2025/2026 (YYYY-MM-DD) ── */
const FERIADOS = new Set([
  '2025-01-01','2025-04-18','2025-04-19','2025-04-20','2025-04-21',
  '2025-05-01','2025-06-19','2025-09-07','2025-10-12','2025-11-02',
  '2025-11-15','2025-11-20','2025-12-25','2025-12-31',
  '2026-01-01','2026-04-03','2026-04-04','2026-04-05','2026-04-21',
  '2026-05-01','2026-06-04','2026-09-07','2026-10-12','2026-11-02',
  '2026-11-15','2026-11-20','2026-12-25','2026-12-31',
]);

/* ── Horários disponíveis ── */
const HORARIOS_BASE = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

/* ── Disponibilidade simulada com seed pela data ── */
const getDisponibilidade = (dateStr) => {
  const seed = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const indisponivel = new Set();
  HORARIOS_BASE.forEach((h, i) => {
    // Pseudo-random baseado em seed — determinístico para a mesma data
    if (((seed * (i + 7)) % 11) < 3) indisponivel.add(h);
  });
  return indisponivel;
};

/* ── Validadores ── */
const validators = {
  nome: (v) => v.trim().length >= 3 ? '' : 'Informe seu nome completo.',
  telefone: (v) => /^\(\d{2}\) \d{5}-\d{4}$/.test(v) ? '' : 'Telefone inválido. Ex: (85) 99999-0001',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'E-mail inválido.',
  servico: (v) => v !== '' ? '' : 'Selecione um serviço.',
  data: (v) => {
    if (!v) return 'Selecione uma data.';
    const d = new Date(v + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    if (d < today) return 'A data não pode ser no passado.';
    if (d.getDay() === 0 || d.getDay() === 6) return 'Não atendemos nos fins de semana.';
    if (FERIADOS.has(v)) return 'Esta data é feriado. Escolha outra data.';
    return '';
  },
  horario: (v) => v !== '' ? '' : 'Selecione um horário.',
};

/* ── Máscara de telefone ── */
const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2)  return `(${digits}`;
  if (digits.length <= 7)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  return value;
};

/* ── Data mínima: hoje ── */
const setDateMin = (input) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth() + 1).padStart(2, '0');
  const dd   = String(today.getDate()).padStart(2, '0');
  input.min = `${yyyy}-${mm}-${dd}`;
  input.max = `${yyyy + 1}-12-31`;
};

/* ── Impede weekends e feriados no input[date] ── */
const isDateBlocked = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() === 0 || d.getDay() === 6 || FERIADOS.has(dateStr);
};

/* ── Atualiza select de horários com disponibilidade ── */
const updateHorarios = (dateStr, selectEl) => {
  const currentVal = selectEl.value;
  const indisponivel = dateStr ? getDisponibilidade(dateStr) : new Set();

  selectEl.innerHTML = '<option value="">Selecione um horário</option>';
  HORARIOS_BASE.forEach(h => {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = indisponivel.has(h) ? `${h} — Indisponível` : h;
    if (indisponivel.has(h)) {
      opt.disabled = true;
      opt.classList.add('time-unavailable');
    }
    selectEl.appendChild(opt);
  });

  if (currentVal && !indisponivel.has(currentVal)) selectEl.value = currentVal;
};

/* ── Exibe erro inline ── */
const showError = (fieldEl, message) => {
  fieldEl.classList.remove('valid');
  fieldEl.classList.add('error');
  const err = fieldEl.closest('.form-group')?.querySelector('.field-error');
  if (err) { err.textContent = message; err.classList.add('visible'); }
};

/* ── Limpa erro ── */
const clearError = (fieldEl) => {
  fieldEl.classList.remove('error');
  const err = fieldEl.closest('.form-group')?.querySelector('.field-error');
  if (err) { err.textContent = ''; err.classList.remove('visible'); }
};

/* ── Marca campo válido ── */
const markValid = (fieldEl) => {
  fieldEl.classList.remove('error');
  fieldEl.classList.add('valid');
  clearError(fieldEl);
};

/* ── Valida campo individual ── */
const validateField = (name, fieldEl) => {
  const validator = validators[name];
  if (!validator) return true;
  const msg = validator(fieldEl.value);
  if (msg) { showError(fieldEl, msg); return false; }
  markValid(fieldEl);
  return true;
};

/* ── Monta mensagem WhatsApp ── */
const buildWhatsAppMsg = (data) => {
  const servicoLabel = {
    clareamento: 'Clareamento Dental',
    ortodontia:  'Ortodontia (Aparelho Invisível)',
    implante:    'Implante Dental',
    lente:       'Lente de Contato Dental',
    canal:       'Tratamento de Canal',
    limpeza:     'Limpeza e Prevenção',
  };

  const dataFormatada = data.data
    ? new Date(data.data + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      })
    : data.data;

  return encodeURIComponent(
`Olá! Gostaria de agendar uma consulta na Sorriso Prime. 😊

*Nome:* ${data.nome}
*Telefone:* ${data.telefone}
*E-mail:* ${data.email}
*Serviço:* ${servicoLabel[data.servico] || data.servico}
*Data:* ${dataFormatada}
*Horário:* ${data.horario}
*Primeira consulta:* ${data.primeiraConsulta ? 'Sim' : 'Não'}
${data.mensagem ? `*Observação:* ${data.mensagem}` : ''}

Aguardo confirmação. 🦷`
  );
};

/* ── Salva resumo do agendamento no sessionStorage ── */
const saveAgendamento = (data) => {
  sessionStorage.setItem('sp_agendamento', JSON.stringify(data));
};

/* ── Init formulário ── */
const initAgendamento = () => {
  const form = document.getElementById('form-agendamento');
  if (!form) return;

  const campos = {
    nome:     form.querySelector('#campo-nome'),
    telefone: form.querySelector('#campo-telefone'),
    email:    form.querySelector('#campo-email'),
    servico:  form.querySelector('#campo-servico'),
    data:     form.querySelector('#campo-data'),
    horario:  form.querySelector('#campo-horario'),
    mensagem: form.querySelector('#campo-mensagem'),
  };

  const checkPrimeira = form.querySelector('#campo-primeira');
  const btnSubmit = form.querySelector('.form-submit');

  // Data min
  if (campos.data) setDateMin(campos.data);

  // Máscara telefone
  campos.telefone?.addEventListener('input', (e) => {
    const pos = e.target.selectionStart;
    const prev = e.target.value;
    e.target.value = maskPhone(e.target.value);
    // Maintain caret position approximately
    if (e.target.value.length >= prev.length) {
      e.target.setSelectionRange(pos + 1, pos + 1);
    }
  });

  // Validação blur para cada campo
  Object.entries(campos).forEach(([name, el]) => {
    if (!el || name === 'mensagem') return;
    el.addEventListener('blur', () => validateField(name, el));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(name, el);
    });
  });

  // Ao mudar data, bloquear feriados e atualizar horários
  campos.data?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (isDateBlocked(val)) {
      showError(campos.data, validators.data(val));
      e.target.value = '';
      updateHorarios('', campos.horario);
    } else {
      clearError(campos.data);
      markValid(campos.data);
      updateHorarios(val, campos.horario);
    }
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valida todos
    let valid = true;
    Object.entries(campos).forEach(([name, el]) => {
      if (!el || name === 'mensagem') return;
      if (!validateField(name, el)) valid = false;
    });

    if (!valid) {
      const firstError = form.querySelector('.form-input.error, .form-select.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Coleta dados
    const data = {
      nome:            campos.nome.value.trim(),
      telefone:        campos.telefone.value.trim(),
      email:           campos.email.value.trim(),
      servico:         campos.servico.value,
      data:            campos.data.value,
      horario:         campos.horario.value,
      mensagem:        campos.mensagem?.value.trim() || '',
      primeiraConsulta: checkPrimeira?.checked || false,
    };

    // Salva para página de obrigado
    saveAgendamento(data);

    // Loading state
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="spinner"></span>
        Processando...
      `;
    }

    // Simula envio (1.5s)
    await new Promise(r => setTimeout(r, 1500));

    // Abre WhatsApp
    const NUMERO = '5585999990001';
    const msg = buildWhatsAppMsg(data);
    const waUrl = `https://wa.me/${NUMERO}?text=${msg}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Redireciona para obrigado
    window.location.href = 'obrigado.html';
  });
};

/* ── Init modal agendamento ── */
const initModalAgendamento = () => {
  const modalForm = document.getElementById('form-agendamento-modal');
  if (!modalForm) return;

  const dataInput = modalForm.querySelector('#modal-campo-data');
  const telefoneInput = modalForm.querySelector('#modal-campo-telefone');
  const horarioSelect = modalForm.querySelector('#modal-campo-horario');

  if (dataInput) setDateMin(dataInput);

  telefoneInput?.addEventListener('input', (e) => {
    e.target.value = maskPhone(e.target.value);
  });

  dataInput?.addEventListener('change', (e) => {
    if (!isDateBlocked(e.target.value)) {
      updateHorarios(e.target.value, horarioSelect);
    } else {
      e.target.value = '';
    }
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Transfere para o formulário principal e faz o mesmo fluxo
    const mainForm = document.getElementById('form-agendamento');
    if (mainForm) {
      const modalId = document.getElementById('modal-agendamento');
      modalId?.classList.remove('active');
      document.body.classList.remove('modal-open');
      mainForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initAgendamento();
  initModalAgendamento();
});
