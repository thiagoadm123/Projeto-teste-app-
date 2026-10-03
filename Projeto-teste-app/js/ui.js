const ICONS = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3V4Z"/><path d="M8 20V7a3 3 0 0 1 3-3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .1.1-1.7 3-2-.8a7.8 7.8 0 0 1-1.8 1l-.3 2.1h-3.4L10 18.3a7.8 7.8 0 0 1-1.8-1l-2 .8-1.7-3 .1-.1 1.6-1.4a7.5 7.5 0 0 1 0-2.1L4.6 10l-.1-.1 1.7-3 2 .8a7.8 7.8 0 0 1 1.8-1L10.3 4h3.4l.3 2.7a7.8 7.8 0 0 1 1.8 1l2-.8 1.7 3-.1.1-1.6 1.4a7.5 7.5 0 0 1 0 2.1l1.6 1.5Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 14h10l1-14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.5-8.8 10.5-8.8 10.5S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 8a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/></svg>',
  logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/></svg>',
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m5 17 4-4 3 3 2-2 5 4"/></svg>',
  filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-8H6"/><circle cx="10" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/></svg>',
  scale: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 20 4"/><path d="M7 4H4v3M17 20h3v-3M8 8l2 2M12 4l2 2M14 14l2 2M18 10l2 2"/></svg>',
  timer: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M9 3h6M12 13V9M12 5V3"/></svg>',
  chef: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21h12M8 21v-4h8v4M7 17h10l1-7H6l1 7Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
  coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10c0-1 1-2 2.5-2s2.5.7 2.5 2-1 1.7-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-1 2.5-2"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>'
};

export function icon(name) { return ICONS[name] || ""; }

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  const value = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
  if (!Number.isFinite(value)) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function toast(message, type = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.innerHTML = `${icon(type === "error" ? "close" : "check")}<span>${escapeHtml(message)}</span>`;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 250); }, 3200);
}

export function setBusy(button, busy, label = "Salvando…") {
  if (!button) return;
  if (busy) {
    button.dataset.originalLabel = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span>${label}`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalLabel || button.innerHTML;
  }
}

export function friendlyError(error) {
  const code = error?.code || error?.message || "";
  const map = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "auth/network-request-failed": "Falha de conexão. Verifique a internet e tente novamente.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/operation-not-allowed": "O login por e-mail e senha não está ativado no Firebase. Ative Authentication → Sign-in method → Email/Password.",
    "auth/unauthorized-domain": "Este domínio do Netlify não está autorizado no Firebase Authentication.",
    "database/permission-denied": "O Firebase bloqueou o acesso ao banco. Publique o arquivo database.rules.json no Realtime Database.",
    "storage/unauthorized": "O Firebase Storage bloqueou o acesso. Publique o arquivo storage.rules no Storage.",
    "storage/unauthenticated": "Faça login novamente para acessar as fotos.",
    "storage/unknown": "Ocorreu um erro no Firebase Storage. Verifique se o Storage foi ativado e se as regras do Storage foram publicadas.",
    "storage/bucket-not-found": "O Firebase Storage ainda não foi ativado ou o bucket configurado não existe. Abra Firebase → Storage → Começar e publique as regras.",
    "storage/retry-limit-exceeded": "O envio da foto demorou demais. Verifique sua internet e tente novamente.",
    "storage/canceled": "O envio da foto foi cancelado.",
    "storage/invalid-argument": "A imagem enviada não é válida para o Firebase Storage.",
    "storage/quota-exceeded": "O limite de armazenamento do Firebase foi atingido.",
    "CONFIGURE_FIREBASE": "O Firebase ainda não está configurado. Verifique firebase-config.js."
  };

  if (map[code]) return map[code];
  if (typeof code === "string" && code.includes("PERMISSION_DENIED")) {
    return "Permissão negada pelo Firebase. Verifique as Security Rules do Realtime Database.";
  }
  if (typeof code === "string" && code.includes("storage/")) {
    return `Firebase Storage: ${code.replace("storage/", "")}. Verifique as regras do Storage.`;
  }
  return "Não foi possível concluir a operação. Abra o console do navegador (F12) para ver o erro detalhado do Firebase.";
}
