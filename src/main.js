const STORAGE_KEY = "ideamos-google-ads-brief";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/hola@ideamos.com.ar";

const form = document.querySelector("#campaign-form");
const steps = Array.from(document.querySelectorAll(".step"));
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const submitButton = document.querySelector("#submit-button");
const submitFeedback = document.querySelector("#submit-feedback");
const reviewSummary = document.querySelector("#review-summary");
const progressLabel = document.querySelector("#progress-label");
const progressTitle = document.querySelector("#progress-title");
const progressBar = document.querySelector("#progress-bar");
const successState = document.querySelector("#success-state");
const restartButton = document.querySelector("#restart-button");

const stepCount = steps.length;
const formSteps = steps.filter((step) => step.dataset.step !== "revision");
let currentStepIndex = 0;

const summarySections = [
  {
    title: "Empresa",
    items: [
      ["Empresa", "company_name"],
      ["Sitio web", "website"],
      ["Contacto", "contact_name"],
      ["Email", "contact_email"],
      ["Telefono", "contact_phone"],
      ["Horarios", "business_hours"],
      ["Direccion o cobertura", "business_address"],
      ["Sucursales", "branches"],
    ],
  },
  {
    title: "Objetivo",
    items: [
      ["Objetivos principales", "primary_goal"],
      ["Consulta o venta ideal", "ideal_lead"],
      ["Servicios a promocionar", "promoted_services"],
      ["Prioridad", "priority_service"],
      ["Oferta a excluir", "excluded_offer"],
    ],
  },
  {
    title: "Publico",
    items: [
      ["Cliente ideal", "ideal_customer"],
      ["Tipo de cliente", "client_type"],
      ["Zonas de servicio", "service_zones"],
      ["Zonas excluidas", "excluded_zones"],
      ["Rasgos relevantes", "audience_traits"],
    ],
  },
  {
    title: "Presupuesto",
    items: [
      ["Presupuesto mensual", "monthly_budget"],
      ["Tope diario", "daily_cap"],
      ["Valor promedio", "average_sale"],
      ["Inversion por lead", "target_cpl"],
      ["Capacidad mensual", "monthly_capacity"],
    ],
  },
  {
    title: "Diferenciales",
    items: [
      ["Propuesta de valor", "value_prop"],
      ["Beneficios", "main_benefits"],
      ["Experiencia", "experience_years"],
      ["Promociones", "active_promotions"],
      ["Restricciones de copy", "copy_restrictions"],
    ],
  },
  {
    title: "Mercado",
    items: [
      ["Competidores", "competitors"],
      ["Sitios competidores", "competitor_sites"],
      ["Busquedas habituales", "search_terms"],
      ["Consultas no deseadas", "bad_leads"],
      ["Terminos a excluir", "negative_terms"],
      ["Notas legales o bloqueos", "compliance_notes"],
    ],
  },
  {
    title: "Accesos",
    items: [
      ["Telefono para anuncios", "ads_phone"],
      ["WhatsApp receptor", "lead_whatsapp"],
      ["Email receptor", "lead_email"],
      ["Landing principal", "landing_page"],
      ["Tiene Google Ads", "has_google_ads"],
      ["Email administrador", "ads_admin_email"],
      ["ID de Google Ads", "ads_account_id"],
      ["Responsable de responder", "lead_owner"],
      ["Comentarios finales", "final_notes"],
    ],
  },
];

const validators = {
  empresa: [
    ["company_name", "Decinos el nombre de la empresa."],
    ["website", "Necesitamos el sitio web o landing principal."],
    ["contact_name", "Indicá el contacto responsable."],
    ["contact_email", "Necesitamos un email de contacto valido."],
    ["contact_phone", "Compartinos un telefono o WhatsApp."],
  ],
  objetivo: [
    ["primary_goal", "Selecciona al menos un objetivo principal."],
    ["ideal_lead", "Defini la consulta o venta ideal."],
    ["promoted_services", "Contanos que queres promocionar."],
  ],
  publico: [
    ["ideal_customer", "Describi a que cliente quieren atraer."],
    ["client_type", "Elegi el tipo de cliente."],
    ["service_zones", "Indicanos donde prestan servicio."],
  ],
  presupuesto: [
    ["monthly_budget", "Necesitamos una referencia de presupuesto mensual."],
    ["average_sale", "Compartinos el valor promedio de una venta o contratacion."],
    ["target_cpl", "Defini cuanto vale para ustedes una consulta de calidad."],
    ["monthly_capacity", "Contanos cuantos clientes nuevos pueden atender por mes."],
  ],
  diferenciales: [
    ["value_prop", "Necesitamos entender por que alguien deberia elegirlos."],
    ["main_benefits", "Menciona los beneficios principales del servicio."],
  ],
  competencia: [
    ["search_terms", "Compartinos como suelen buscar sus clientes lo que ofrecen."],
  ],
  accesos: [
    ["lead_whatsapp", "Necesitamos el WhatsApp que recibira las consultas."],
    ["lead_email", "Necesitamos el email que recibira los formularios."],
    ["landing_page", "Indicanos la pagina destino principal."],
    ["lead_owner", "Defini quien responde los contactos."],
  ],
};

function sanitizeValue(value) {
  return value ? value.trim() : "";
}

function getFieldNodes(name) {
  return Array.from(form.querySelectorAll(`[name="${name}"]`));
}

function getFieldValue(name) {
  const nodes = getFieldNodes(name);

  if (!nodes.length) {
    return "";
  }

  const firstNode = nodes[0];

  if (firstNode.type === "checkbox") {
    return nodes.filter((node) => node.checked).map((node) => node.value);
  }

  if (firstNode.type === "radio") {
    const checked = nodes.find((node) => node.checked);
    return checked ? checked.value : "";
  }

  return sanitizeValue(firstNode.value);
}

function setFieldValue(name, value) {
  const nodes = getFieldNodes(name);

  if (!nodes.length || value == null) {
    return;
  }

  const firstNode = nodes[0];

  if (firstNode.type === "checkbox" && Array.isArray(value)) {
    nodes.forEach((node) => {
      node.checked = value.includes(node.value);
    });
    return;
  }

  if (firstNode.type === "radio") {
    nodes.forEach((node) => {
      node.checked = node.value === value;
    });
    return;
  }

  firstNode.value = value;
}

function clearErrors(step) {
  step.querySelectorAll(".has-error").forEach((node) => node.classList.remove("has-error"));
  step.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });
}

function findErrorContainer(name) {
  const nodes = getFieldNodes(name);
  if (nodes.length) {
    return nodes[0].closest(".field, .field-group");
  }
  return form.querySelector(`[data-group="${name}"]`);
}

function markError(name, message) {
  const container = findErrorContainer(name);
  if (!container) {
    return;
  }
  container.classList.add("has-error");
  const errorNode = container.querySelector(".field-error");
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch (_error) {
    return false;
  }
}

function validateStep(step) {
  clearErrors(step);

  const stepKey = step.dataset.step;
  const rules = validators[stepKey] || [];
  let isValid = true;

  rules.forEach(([name, message]) => {
    const value = getFieldValue(name);
    const isArray = Array.isArray(value);
    const hasValue = isArray ? value.length > 0 : value !== "";

    if (!hasValue) {
      markError(name, message);
      isValid = false;
      return;
    }

    if (name.includes("email") && !isValidEmail(String(value))) {
      markError(name, "Ingresa un email valido.");
      isValid = false;
    }

    if ((name === "website" || name === "landing_page") && !isValidUrl(String(value))) {
      markError(name, "Usa una URL completa que empiece con http:// o https://.");
      isValid = false;
    }
  });

  return isValid;
}

function saveDraft() {
  const snapshot = {};

  formSteps.forEach((step) => {
    step.querySelectorAll("[name]").forEach((node) => {
      const { name } = node;
      snapshot[name] = getFieldValue(name);
    });
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function loadDraft() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([name, value]) => {
      setFieldValue(name, value);
    });
  } catch (_error) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value || "Sin completar";
}

function buildReview() {
  reviewSummary.innerHTML = "";

  summarySections.forEach((section) => {
    const block = document.createElement("article");
    block.className = "review-block";

    const title = document.createElement("h4");
    title.textContent = section.title;
    block.appendChild(title);

    const list = document.createElement("div");
    list.className = "review-list";

    section.items.forEach(([label, name]) => {
      const value = getFieldValue(name);
      if (!value || (Array.isArray(value) && !value.length)) {
        return;
      }

      const item = document.createElement("div");
      item.className = "review-item";

      const strong = document.createElement("strong");
      strong.textContent = label;

      const span = document.createElement("span");
      span.textContent = formatValue(value);

      item.append(strong, span);
      list.appendChild(item);
    });

    if (!list.childElementCount) {
      const empty = document.createElement("div");
      empty.className = "review-item";
      const span = document.createElement("span");
      span.textContent = "Sin datos cargados.";
      empty.appendChild(span);
      list.appendChild(empty);
    }

    block.appendChild(list);
    reviewSummary.appendChild(block);
  });
}

function buildEmailBody() {
  const chunks = summarySections.map((section) => {
    const lines = section.items
      .map(([label, name]) => {
        const value = getFieldValue(name);
        if (!value || (Array.isArray(value) && !value.length)) {
          return null;
        }
        return `${label}: ${formatValue(value)}`;
      })
      .filter(Boolean);

    return [`${section.title.toUpperCase()}`, ...lines].join("\n");
  });

  return chunks.join("\n\n");
}

function buildPayload() {
  const payload = new FormData();
  const companyName = getFieldValue("company_name") || "Nuevo brief";

  payload.append("_subject", `Nuevo brief Google Ads - ${companyName}`);
  payload.append("_captcha", "false");
  payload.append("_template", "table");
  payload.append("Origen", "GitHub Pages - Ideamos Google Ads Intake");
  payload.append("Resumen", buildEmailBody());

  summarySections.forEach((section) => {
    section.items.forEach(([label, name]) => {
      const value = getFieldValue(name);
      if (!value || (Array.isArray(value) && !value.length)) {
        return;
      }
      payload.append(`${section.title} | ${label}`, formatValue(value));
    });
  });

  return payload;
}

function updateButtons() {
  const isReviewStep = currentStepIndex === stepCount - 1;

  prevButton.hidden = currentStepIndex === 0;
  nextButton.hidden = isReviewStep;
}

function updateProgress() {
  const currentStep = steps[currentStepIndex];
  const visualIndex = Math.min(currentStepIndex + 1, stepCount - 1);
  const progressPercent = ((visualIndex / (stepCount - 1)) * 100).toFixed(2);

  progressLabel.textContent = `Paso ${Math.min(currentStepIndex + 1, stepCount - 1)} de ${stepCount - 1}`;
  progressTitle.textContent = currentStep.dataset.title;
  progressBar.style.width = `${progressPercent}%`;
}

function setStep(nextIndex, pushHash = true) {
  currentStepIndex = nextIndex;

  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStepIndex);
  });

  if (steps[currentStepIndex].dataset.step === "revision") {
    buildReview();
  }

  updateProgress();
  updateButtons();

  if (pushHash) {
    const stepHash = steps[currentStepIndex].dataset.step;
    window.history.replaceState({}, "", `#${stepHash}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goNext() {
  const currentStep = steps[currentStepIndex];
  if (!validateStep(currentStep)) {
    return;
  }

  saveDraft();

  if (currentStepIndex < stepCount - 1) {
    setStep(currentStepIndex + 1);
  }
}

function goPrev() {
  if (currentStepIndex > 0) {
    setStep(currentStepIndex - 1);
  }
}

function showSubmitFeedback(message, type = "") {
  submitFeedback.textContent = message;
  submitFeedback.classList.remove("is-error", "is-success");

  if (type) {
    submitFeedback.classList.add(type);
  }
}

function openMailFallback() {
  const subject = `Nuevo brief Google Ads - ${getFieldValue("company_name") || "Ideamos"}`;
  const body = buildEmailBody();
  const mailto = `mailto:hola@ideamos.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function getFirstInvalidStepIndex() {
  for (let index = 0; index < formSteps.length; index += 1) {
    if (!validateStep(formSteps[index])) {
      return index;
    }
  }

  return -1;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (currentStepIndex !== stepCount - 1) {
    goNext();
    return;
  }

  const invalidStepIndex = getFirstInvalidStepIndex();
  if (invalidStepIndex >= 0) {
    setStep(invalidStepIndex);
    return;
  }

  submitButton.disabled = true;
  showSubmitFeedback("Enviando brief...", "");

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: buildPayload(),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("send-failed");
    }

    window.localStorage.removeItem(STORAGE_KEY);
    form.hidden = true;
    successState.hidden = false;
    showSubmitFeedback("Brief enviado correctamente.", "is-success");
  } catch (_error) {
    showSubmitFeedback(
      "No pudimos confirmar el envio automatico. Te abrimos un mail de respaldo para que no pierdas la informacion.",
      "is-error",
    );
    openMailFallback();
  } finally {
    submitButton.disabled = false;
  }
}

function hydrateFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    setStep(0, false);
    return;
  }

  const targetIndex = steps.findIndex((step) => step.dataset.step === hash);
  setStep(targetIndex >= 0 ? targetIndex : 0, false);
}

function restartFlow() {
  form.reset();
  window.localStorage.removeItem(STORAGE_KEY);
  successState.hidden = true;
  form.hidden = false;
  showSubmitFeedback("", "");
  setStep(0);
}

form.addEventListener("input", () => {
  saveDraft();
});

form.addEventListener("change", () => {
  saveDraft();
});

prevButton.addEventListener("click", goPrev);
nextButton.addEventListener("click", goNext);
form.addEventListener("submit", handleSubmit);
restartButton.addEventListener("click", restartFlow);
window.addEventListener("hashchange", hydrateFromHash);

form.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  if (event.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (event.target instanceof HTMLButtonElement) {
    return;
  }

  event.preventDefault();

  if (currentStepIndex === stepCount - 1) {
    submitButton.click();
    return;
  }

  goNext();
});

loadDraft();
hydrateFromHash();
updateButtons();
updateProgress();
