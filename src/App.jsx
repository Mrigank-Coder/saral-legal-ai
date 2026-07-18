import React, { useState, useEffect, useRef } from "react";
import {
  Scale, FileText, Search, Loader2, Copy, Download, AlertTriangle, CheckCircle2,
  BookOpen, Check, Folder, X, Languages, Sparkles, Clock, ChevronDown, Command, Library,
  ShieldCheck, GitBranch, MessageSquareQuote, Trash2, ArrowRight, ScanLine, Camera, FileWarning, Upload,
} from "lucide-react";

// ---------------------------------------------------------------------------
// CORPUS — paraphrased summaries for prototyping. Replace with verbatim text
// from indiacode.nic.in before any real use. Flat array, one entry per section.
// ---------------------------------------------------------------------------
const CORPUS = [
  { act: "RTI Act, 2005", section: "6", title: "Request for obtaining information", text: "A citizen who wants information must submit a written or electronic request to the Public Information Officer, along with the prescribed fee. The applicant is not required to give any reason for the request." },
  { act: "RTI Act, 2005", section: "7", title: "Disposal of request", text: "The Public Information Officer must respond within 30 days of receiving the request. If the information concerns the life or liberty of a person, the response must be given within 48 hours. If rejected, reasons must be given in writing, along with details of the appeal process." },
  { act: "RTI Act, 2005", section: "8", title: "Exemption from disclosure", text: "Certain categories of information are exempt from disclosure, including information affecting national security, breach of parliamentary privilege, commercial confidence or trade secrets, and information held in a fiduciary relationship." },
  { act: "RTI Act, 2005", section: "19", title: "Appeal", text: "If a request is refused or not answered in time, the applicant may file a first appeal with a designated senior officer within the same public authority within 30 days. If still unsatisfied, a second appeal may be filed with the State or Central Information Commission." },
  { act: "Consumer Protection Act, 2019", section: "2(9)", title: "Consumer rights", text: "Consumer rights include the right to be protected against hazardous goods and services, the right to be informed about quality and price, the right to access a variety of goods at competitive prices, the right to be heard, the right to seek redressal, and the right to consumer education." },
  { act: "Consumer Protection Act, 2019", section: "35", title: "Filing a complaint before District Commission", text: "A complaint can be filed by the affected consumer, a recognized consumer association, or the government, before the District Consumer Disputes Redressal Commission, for defective goods, deficient services, unfair trade practices, or overcharging." },
  { act: "Consumer Protection Act, 2019", section: "39", title: "Reliefs available", text: "The Commission can order removal of defects, replacement of goods, refund of the price paid, compensation for loss or injury, discontinuation of unfair practices, and payment of costs." },
  { act: "Consumer Protection Act, 2019", section: "69", title: "Limitation period", text: "A complaint must generally be filed within two years from the date the cause of action arose, though the Commission may allow a delayed complaint for sufficient cause." },
  { act: "Code on Wages, 2019", section: "17", title: "Time limit for payment of wages", text: "Wages paid daily must be settled the same day; weekly, within the following working day; fortnightly, within two days of the fortnight ending; and monthly, within seven days of the month ending. If an employee is removed, dismissed, retrenched, or resigns, wages due must be paid within two working days. This replaced the Payment of Wages Act, 1936, which was repealed when the four labour codes took effect on 21 November 2025." },
  { act: "Code on Wages, 2019", section: "45", title: "Claims for unpaid or delayed wages", text: "An employee whose wages are delayed, underpaid, or unlawfully deducted can apply to the designated claims authority, which may award the amount due plus compensation. The application must generally be filed within three years of the claim arising." },
  { act: "Constitution of India", section: "14", title: "Equality before law", text: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. This applies to citizens and non-citizens alike, and bars arbitrary or discriminatory State action." },
  { act: "Constitution of India", section: "19", title: "Protection of certain freedoms", text: "All citizens have the right to freedom of speech and expression, to assemble peaceably, to form associations or unions, to move freely and reside in any part of India, and to practise any profession or carry on any occupation, trade, or business — each subject to reasonable restrictions the State may impose by law (such as public order, decency, or security)." },
  { act: "Constitution of India", section: "21", title: "Protection of life and personal liberty", text: "No person shall be deprived of their life or personal liberty except according to a procedure established by law. Courts have read this broadly over the years to cover related rights such as privacy, livelihood, a clean environment, and human dignity, not just physical freedom from detention." },
  { act: "Constitution of India", section: "21A", title: "Right to education", text: "The State must provide free and compulsory education to all children between the ages of six and fourteen, in a manner the State may by law determine." },
  { act: "Constitution of India", section: "32", title: "Right to constitutional remedies", text: "A person may move the Supreme Court directly to enforce the fundamental rights guaranteed under Part III of the Constitution, and the Court may issue directions or writs (such as habeas corpus or mandamus) for that purpose. Dr. B.R. Ambedkar called this 'the heart and soul' of the Constitution." },
  { act: "Model Tenancy Act, 2021", section: "4", title: "Tenancy agreement and security deposit", text: "Landlord and tenant must sign a written agreement stating the rent, tenancy period, and terms for rent revision and security deposit, and must inform the Rent Authority within two months of signing. The security deposit cannot exceed two months' rent for residential premises or six months' rent for non-residential premises. This Act only applies in states/UTs that have adopted it or a similar state law — most states still run their own older Rent Control Act." },
  { act: "Model Tenancy Act, 2021", section: "21", title: "Grounds for eviction", text: "A landlord seeking eviction must apply to the Rent Authority, which can order eviction for reasons including: refusal to pay the agreed rent, failure to pay rent for more than two consecutive months, occupying part or all of the premises without the landlord's written consent, misuse of the premises after a written notice to stop, or unauthorised structural changes." },
  { act: "Model Tenancy Act, 2021", section: "23", title: "Liability for overstaying after tenancy ends", text: "A tenant who doesn't vacate after the tenancy period ends (and isn't renewed), or after an eviction order, must pay twice the monthly rent for the first two months of overstay, and four times the monthly rent for every month after that until they vacate." },
  { act: "Bharatiya Nyaya Sanhita, 2023", section: "318", title: "Cheating", text: "Whoever deceives a person and thereby dishonestly induces them to deliver property, or to do or not do something they wouldn't otherwise have done, commits cheating. General cheating carries imprisonment up to 3 years or a fine or both; cheating by someone bound by law or contract to protect the victim's interests carries up to 5 years. This replaced Sections 415, 417, and 420 of the Indian Penal Code when the BNS came into force on 1 July 2024." },
  { act: "Bharatiya Nyaya Sanhita, 2023", section: "351", title: "Criminal intimidation", text: "Threatening someone with injury to their person, reputation, or property (or to someone they care about), with intent to cause alarm or to make them act or refrain from acting against their will, is criminal intimidation. It is punishable with imprisonment up to 2 years, or a fine, or both; threats of death or grievous hurt carry a higher punishment. This replaced Section 506 of the Indian Penal Code." },
  { act: "Bharatiya Nyaya Sanhita, 2023", section: "80", title: "Dowry death", text: "If a married woman dies from burns, bodily injury, or otherwise than under normal circumstances within seven years of marriage, and it's shown she was subjected to cruelty or harassment for dowry by her husband or his relatives shortly before her death, that death is treated as a dowry death, and the husband or relative is deemed to have caused it — punishable with a minimum of 7 years' imprisonment, up to life. This replaced Section 304B of the Indian Penal Code." },
  { act: "Bharatiya Nyaya Sanhita, 2023", section: "85", title: "Cruelty by husband or his relatives", text: "A husband or his relative who subjects a married woman to cruelty — wilful conduct likely to drive her to suicide or cause grave injury, or harassment to coerce her or her family into meeting an unlawful demand for property — is punishable with imprisonment up to 3 years and a fine. This replaced Section 498A of the Indian Penal Code." },
  { act: "Protection of Women from Domestic Violence Act, 2005", section: "12", title: "Applying for relief", text: "An aggrieved woman (or a Protection Officer or another person on her behalf) can apply to a Magistrate for relief under the Act, including protection orders, residence orders, monetary relief, custody orders, or compensation. The Magistrate is expected to fix the first hearing within three days of the application being filed." },
  { act: "Protection of Women from Domestic Violence Act, 2005", section: "17", title: "Right to reside in a shared household", text: "Every woman in a domestic relationship has the right to live in the shared household, regardless of whether she has any ownership or title in it. She cannot be evicted or excluded from it except through the procedure established by law." },
  { act: "Motor Vehicles Act, 1988", section: "164", title: "Compensation without proof of fault", text: "In case of death or grievous injury from a motor vehicle accident, the victim or their legal heirs can claim fixed compensation from the vehicle owner/insurer without having to prove anyone's fault or negligence. If a larger amount is later awarded under another provision or law, this amount is adjusted against it." },
  { act: "Motor Vehicles Act, 1988", section: "166", title: "Application for compensation", text: "A person injured, the owner of damaged property, or the legal representatives of someone killed in a motor accident can apply for compensation to the Motor Accident Claims Tribunal with jurisdiction over the place of the accident, where the claimant resides, or where the vehicle owner resides. Since a 2019 amendment, applications should generally be filed within six months of the accident, though the Tribunal can condone delay for sufficient cause." },
  { act: "Maternity Benefit Act, 1961", section: "5", title: "Right to maternity benefit", text: "A woman who has worked at least 80 days in the 12 months before her expected delivery date is entitled to paid maternity leave: 26 weeks for her first two children (up to 8 weeks before the expected date), and 12 weeks for the third child onward. Commissioning and adopting mothers are entitled to 12 weeks from the date the child is handed over." },
];

const TEMPLATES = {
  rti_application: {
    label: "RTI Application",
    text: `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer,
{{department_name}}
{{department_address}}

Date: {{date}}

Subject: Request for information under Section 6(1) of the RTI Act, 2005

Sir/Madam,

I, {{applicant_name}}, residing at {{applicant_address}}, wish to seek the following information under the Right to Information Act, 2005:

1. {{information_request_1}}
2. {{information_request_2}}

I am enclosing the prescribed fee of Rs. {{fee_amount}} by {{fee_mode}}.

If any part of the information sought is held by another public authority, kindly transfer this application under Section 6(3) of the Act.

Kindly provide the requested information within the statutory period of 30 days as prescribed under Section 7 of the Act.

Thanking you.

Yours faithfully,
{{applicant_name}}
Contact: {{applicant_contact}}`,
  },
  legal_notice: {
    label: "Legal Notice",
    text: `LEGAL NOTICE

Date: {{date}}

To,
{{recipient_name}}
{{recipient_address}}

From,
{{sender_name}}
{{sender_address}}

Subject: {{subject_line}}

Sir/Madam,

Under instructions from my client, {{sender_name}}, I hereby serve upon you the following notice:

1. That {{fact_paragraph_1}}

2. That {{fact_paragraph_2}}

3. {{legal_basis_paragraph}}

You are hereby called upon to {{demand}} within {{timeframe}} days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings, entirely at your risk and cost.

Yours faithfully,
{{sender_name}}`,
  },
};

const EXPLAIN_EXAMPLES = [
  "I filed an RTI 45 days ago and got no reply",
  "Shopkeeper won't refund a defective product",
  "My employer hasn't paid my full salary this month",
  "My landlord is keeping my full deposit after I moved out",
  "I was in a road accident and want to know what compensation I can claim",
];

const GENERATE_EXAMPLES = [
  "I am Ramesh Kumar in Bengaluru, want road repair spending records from BBMP for 2025",
  "My landlord in Pune, Mr. Suresh Patil, hasn't returned my Rs. 50,000 deposit after I vacated",
];

const HOW_IT_WORKS = [
  { icon: Search, title: "Search the corpus", text: "Your situation is matched against statute sections by keyword, not vibes — every retrieval is traceable." },
  { icon: MessageSquareQuote, title: "Ask, with a leash", text: "Saral answers using only the retrieved sections. It's instructed to say so explicitly if nothing fits, rather than guess." },
  { icon: ShieldCheck, title: "Get a cited answer", text: "Every claim carries an Act and Section reference, so you can verify it yourself before acting on it." },
];

const CASE_FILE_STORAGE_KEY = "saral.caseFile.v1";

// ---------------------------------------------------------------------------
// Lightweight keyword retrieval (swap for embeddings once corpus grows)
// ---------------------------------------------------------------------------
const STOPWORDS = new Set(["the","a","an","and","or","of","to","in","for","is","was","my","me","i","it","on","with","that","this","by","from","at","as","be","has","have","not","got","no"]);

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function wordCount(str) {
  return (str || "").trim().split(/\s+/).filter(Boolean).length;
}

function retrieve(query, k = 4) {
  const qWords = tokenize(query);
  const scored = CORPUS.map((sec) => {
    const hay = (sec.title + " " + sec.text).toLowerCase();
    let score = 0;
    qWords.forEach((w) => {
      if (hay.includes(w)) score += hay.includes(sec.title.toLowerCase()) && sec.title.toLowerCase().includes(w) ? 2 : 1;
    });
    return { ...sec, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}

function formatContext(results) {
  return results.map((r) => `[${r.act} — Section ${r.section}: ${r.title}]\n${r.text}`).join("\n\n");
}

// ---------------------------------------------------------------------------
// AI call — routed through our own backend (/api/ai) so the
// API key stays server-side. See api/ai.js.
// ---------------------------------------------------------------------------
async function callAI(system, userPrompt, opts = {}) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userPrompt, images: opts.images, maxTokens: opts.maxTokens }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  const data = await res.json();
  return data.text || "";
}

// ---------------------------------------------------------------------------
// Scanned document handling — turns an uploaded image or PDF into base64
// data URLs the vision model can read, downscaling large images so we stay
// under the provider's per-request size limit.
// ---------------------------------------------------------------------------
const MAX_OCR_PAGES = 5; // matches the vision model's per-request image cap

async function downscaleImage(dataUrl, maxDim = 1800, quality = 0.85) {
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

async function pdfToImages(file, maxPages = MAX_OCR_PAGES) {
  const pdfjsLib = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const pageCount = Math.min(pdf.numPages, maxPages);
  const images = [];
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    images.push(canvas.toDataURL("image/jpeg", 0.85));
  }
  return { images, truncated: pdf.numPages > maxPages, totalPages: pdf.numPages };
}

async function fileToOcrImages(file) {
  if (file.type === "application/pdf") {
    return pdfToImages(file);
  }
  if (file.type.startsWith("image/")) {
    const raw = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const downscaled = await downscaleImage(raw);
    return { images: [downscaled], truncated: false, totalPages: 1 };
  }
  throw new Error("Please upload an image (JPG, PNG, WEBP) or a PDF.");
}

const EXPLAIN_SYSTEM = `You are a legal explainer for Indian citizens with no legal background.
Rules:
1. Only use the LEGAL CONTEXT provided. Do not rely on any other knowledge of Indian law, since it may be outdated or incomplete.
2. Every legal claim must cite the Act and Section it comes from, like (Act name, Section X).
3. If the context doesn't clearly cover the situation, say so explicitly rather than guessing.
4. Plain, simple English. Briefly explain any unavoidable legal term.
5. Structure: "What this means" (2-3 sentences), "Relevant law" (bullets with citations), "Suggested next steps" (bullets).
6. End with exactly: "This is general information, not legal advice. For anything with real stakes, please consult a lawyer."`;

// ---------------------------------------------------------------------------
// Languages — 22 languages: English + the languages listed in the Eighth
// Schedule to the Constitution that use a distinct everyday script.
// ---------------------------------------------------------------------------
const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "mai", label: "Maithili", native: "मैथिली" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "ks", label: "Kashmiri", native: "کٲشُر" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "sd", label: "Sindhi", native: "سنڌي" },
  { code: "kok", label: "Konkani", native: "कोंकणी" },
  { code: "doi", label: "Dogri", native: "डोगरी" },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্" },
  { code: "brx", label: "Bodo", native: "बड़ो" },
];

function translateSystemFor(language) {
  return `Translate the given plain-language legal explanation into simple, everyday ${language.label} (written the way a person with basic literacy would read it, in its normal everyday script).
Keep Act names and Section numbers unchanged exactly as written (e.g. "RTI Act, Section 6" stays as is, do not translate it).
Keep the same structure (headings, bullet points, line breaks).
Output ONLY the translated text, nothing else — no preamble.`;
}

const OCR_SYSTEM = `You transcribe scanned or photographed documents (often Indian legal, government, or official paperwork) into clean plain text.
Rules:
1. Transcribe every word you can read, preserving the original language and script exactly as written — do not translate anything.
2. Keep the reading order and rough layout: headings, numbered clauses, and paragraph breaks should stay separated by line breaks.
3. If a word or section is illegible, write [illegible] in its place rather than guessing.
4. Ignore watermarks, stamps' decorative borders, and page furniture (page numbers, letterhead logos) unless they contain the only copy of important text (e.g. a stamp date or seal text).
5. Output ONLY the transcribed text, nothing else — no preamble, no commentary, no markdown fences.`;

const EXTRACT_SYSTEM = `You extract structured field values from a user's plain-language description, to fill a legal document template.
Rules:
1. Output ONLY valid JSON, nothing else — no preamble, no markdown fences.
2. Output a flat JSON object mapping each given placeholder name to a value.
3. If there isn't enough information for a placeholder, set it to null. Never invent facts, names, dates, or amounts.
4. Keep values concise, in formal document register where appropriate.`;

const SIMPLIFY_SYSTEM = `You help ordinary people understand long legal documents, contracts, or terms & conditions BEFORE they agree to them — the kind of document people usually scroll past and click "I agree" on.
Rules:
1. Base your analysis only on the document text provided. Do not assume facts not in the text.
2. Write in plain, simple English. Briefly explain any unavoidable legal term the first time it appears.
3. Structure your response using exactly these five headings, in this order:

Quick summary
(2-3 sentences: what is this document, and what is the person about to agree to)

What you're agreeing to
(bulleted list of the concrete obligations, commitments, and rights the person gives up or gains)

Red flags to watch for
(bulleted list of clauses that are unusual, one-sided, risky, or costly — e.g. auto-renewal, hidden fees, broad data sharing, liability waivers, mandatory arbitration, unilateral changes, penalty clauses. If the document is genuinely clean, say so plainly instead of inventing risks.)

Cancellation, refunds & fees
(bulleted list of what it costs to get out, refund conditions, and any recurring charges. Say "Not specified in the document" if it truly isn't covered.)

Questions worth asking before you sign
(2-4 bulleted questions a sensible person would want answered)

4. End with exactly this line on its own: "This is a plain-language summary to help you notice what matters. It is not legal advice — please read the full document and consult a lawyer for anything with real stakes."`;

function extractPlaceholders(templateText) {
  const matches = templateText.match(/{{(.*?)}}/g) || [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

function fillTemplate(templateText, values) {
  let out = templateText;
  Object.entries(values).forEach(([k, v]) => {
    out = out.split(`{{${k}}}`).join(v ? v : `[MISSING: ${k}]`);
  });
  return out;
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  function push(message, tone = "ok") {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }
  return { toasts, push };
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 items-end" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-toast-in font-body text-[13px] px-4 py-2.5 flex items-center gap-2 shadow-lg"
          style={{
            background: t.tone === "err" ? "#A13D2C" : "#14213D",
            color: "#EDE6D6",
            borderRadius: 6,
          }}
        >
          {t.tone === "err" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// UI pieces
// ---------------------------------------------------------------------------
function Seal({ count }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: "#2F5233", color: "#2F5233" }}>
        <CheckCircle2 size={20} strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#2F5233" }}>Grounded</div>
        <div className="font-mono text-[11px]" style={{ color: "#5a5342" }}>{count} section{count !== 1 ? "s" : ""} cited</div>
      </div>
    </div>
  );
}

function SourceChip({ s }) {
  return (
    <div className="source-chip border px-3 py-2 text-[12px] font-mono" style={{ borderColor: "#c9bfa0", background: "#f4efe1", color: "#3a3424" }}>
      <span className="font-semibold">{s.act}</span> — Sec. {s.section}
      <div className="mt-0.5" style={{ color: "#8a8062" }}>{s.title}</div>
    </div>
  );
}

function LanguageDropdown({ current, onSelect, open, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="lang-toggle font-mono text-[11px] px-3 py-1.5 flex items-center gap-1.5"
        style={{ borderRadius: 20, background: "#14213D", color: "#EDE6D6" }}
      >
        <Languages size={11} />
        {LANGUAGES.find((l) => l.code === current)?.native || "English"}
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1.5 py-1.5 z-20 anim-fade-in"
          style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 8, minWidth: 168, maxHeight: 280, overflowY: "auto", boxShadow: "0 16px 40px -14px rgba(0,0,0,0.4)" }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelect(l.code)}
              className="w-full text-left font-body text-[13px] px-3 py-1.5 flex items-baseline justify-between gap-2"
              style={{ background: current === l.code ? "#e2d9bd" : "transparent", color: "#2a2618" }}
            >
              <span>{l.native}</span>
              <span className="font-mono text-[10px] opacity-50">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stepper({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mt-4 mb-1 flex-wrap" role="status" aria-live="polite">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: i < current ? "#2F5233" : i === current ? "#A13D2C" : "transparent",
                border: i >= current ? "1.5px solid #a99f83" : "none",
                transition: "background-color 300ms ease",
              }}
            >
              {i < current && <Check size={10} color="#EDE6D6" strokeWidth={3} />}
              {i === current && <span className="dot" style={{ width: 5, height: 5, background: "#EDE6D6" }} />}
            </div>
            <span className="font-mono text-[10.5px]" style={{ color: i <= current ? "#5a5342" : "#a99f83" }}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-5 h-px mx-1.5" style={{ background: i < current ? "#2F5233" : "#c9bfa0" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ComplexityStat({ legalWords, answerWords, sectionCount }) {
  const max = Math.max(legalWords, answerWords, 1);
  return (
    <div className="mb-6 p-4" style={{ background: "#f4efe1", border: "1px solid #c9bfa0", borderRadius: 4 }}>
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={13} style={{ color: "#A13D2C" }} />
        <span className="font-mono text-[10.5px] uppercase tracking-wider" style={{ color: "#A13D2C" }}>Complexity, resolved</span>
      </div>
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between font-mono text-[11px] mb-1" style={{ color: "#5a5342" }}>
            <span>Statute text searched ({sectionCount} section{sectionCount !== 1 ? "s" : ""})</span><span>{legalWords} words</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e2d9bd" }}>
            <div className="h-full anim-bar-grow" style={{ width: `${(legalWords / max) * 100}%`, background: "#8A6D3B" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[11px] mb-1" style={{ color: "#5a5342" }}>
            <span>What you actually need to read</span><span>{answerWords} words</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#e2d9bd" }}>
            <div className="h-full anim-bar-grow" style={{ width: `${(answerWords / max) * 100}%`, background: "#2F5233", animationDelay: "150ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseFileDrawer({ open, onClose, entries, onLoad, onDelete, onClear }) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(20,33,61,0.5)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 260ms ease" }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full z-50 w-full max-w-sm flex flex-col"
        style={{ background: "#EDE6D6", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 320ms cubic-bezier(0.16,1,0.3,1)", boxShadow: "-10px 0 40px rgba(0,0,0,0.3)" }}
        role="dialog"
        aria-label="Case file"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #c9bfa0" }}>
          <div className="flex items-center gap-2">
            <Folder size={16} style={{ color: "#14213D" }} />
            <span className="font-body text-[14px] font-semibold" style={{ color: "#14213D" }}>Case file</span>
          </div>
          <div className="flex items-center gap-1">
            {entries.length > 0 && (
              <button onClick={onClear} className="btn-lift font-mono text-[10.5px] px-2 py-1.5" style={{ color: "#A13D2C", borderRadius: 4 }}>
                Clear all
              </button>
            )}
            <button onClick={onClose} className="btn-lift p-1.5" style={{ borderRadius: 4 }} aria-label="Close case file">
              <X size={16} style={{ color: "#5a5342" }} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {entries.length === 0 ? (
            <div className="font-body text-[13px] text-center mt-10" style={{ color: "#8a8062" }}>
              Nothing here yet. Explanations and drafts you generate are saved here — even across visits — so you can find them again.
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="group relative">
                  <button
                    onClick={() => onLoad(e)}
                    className="w-full text-left p-3 btn-lift"
                    style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4 }}
                  >
                    <div className="flex items-center gap-1.5 mb-1 pr-6">
                      {e.type === "explain" ? <Search size={11} style={{ color: "#A13D2C" }} /> : e.type === "simplify" ? <FileWarning size={11} style={{ color: "#A13D2C" }} /> : <FileText size={11} style={{ color: "#A13D2C" }} />}
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#A13D2C" }}>{e.type === "explain" ? "Explained" : e.type === "simplify" ? "Simplified" : `Drafted · ${TEMPLATES[e.templateKey]?.label}`}</span>
                      <span className="font-mono text-[10px] ml-auto flex items-center gap-1" style={{ color: "#a99f83" }}><Clock size={10} />{timeAgo(e.ts)}</span>
                    </div>
                    <div className="font-body text-[13px] line-clamp-2" style={{ color: "#2a2618" }}>{e.type === "simplify" ? (e.result?.fileName || e.input || "Pasted document") : e.input}</div>
                  </button>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); onDelete(e.id); }}
                    className="absolute top-2.5 right-2.5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#a99f83" }}
                    aria-label="Delete entry"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LibraryTab() {
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? CORPUS.filter((s) => (s.title + " " + s.text + " " + s.act).toLowerCase().includes(q))
    : CORPUS;
  const byAct = filtered.reduce((acc, s) => {
    (acc[s.act] = acc[s.act] || []).push(s);
    return acc;
  }, {});
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Library size={15} style={{ color: "#14213D" }} />
        <span className="font-body text-[14px] font-semibold" style={{ color: "#14213D" }}>What Saral currently knows</span>
      </div>
      <p className="font-body text-[13px] mb-4" style={{ color: "#5a5342" }}>
        A prototype library — every answer is grounded only in these sections. Nothing is invented outside this list.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sections, e.g. 'refund' or 'wages'"
        className="w-full font-body text-[13px] px-3.5 py-2.5 outline-none field-focus mb-5"
        style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618" }}
      />
      {Object.keys(byAct).length === 0 ? (
        <div className="font-body text-[13px] text-center py-8" style={{ color: "#8a8062" }}>
          No sections match "{query}".
        </div>
      ) : (
        <div className="space-y-2 stagger">
          {Object.entries(byAct).map(([act, sections]) => (
            <div key={act} style={{ border: "1px solid #c9bfa0", borderRadius: 4, background: "#faf7ee" }}>
              <button
                onClick={() => setExpanded((p) => ({ ...p, [act]: !p[act] }))}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <span className="font-body text-[13.5px] font-medium" style={{ color: "#2a2618" }}>{act}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px]" style={{ color: "#8a8062" }}>{sections.length} section{sections.length !== 1 ? "s" : ""}</span>
                  <ChevronDown size={14} style={{ color: "#8a8062", transform: expanded[act] || q ? "rotate(180deg)" : "none", transition: "transform 220ms ease" }} />
                </div>
              </button>
              {(expanded[act] || q) && (
                <div className="px-4 pb-3 space-y-2 anim-fade-in">
                  {sections.map((s) => (
                    <div key={s.section} className="pl-3 py-1.5" style={{ borderLeft: "2px solid #c9bfa0" }}>
                      <div className="font-mono text-[11.5px] font-medium" style={{ color: "#A13D2C" }}>Section {s.section} — {s.title}</div>
                      <div className="font-body text-[12.5px] mt-0.5" style={{ color: "#5a5342" }}>{s.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 mb-10">
      <div className="grid sm:grid-cols-3 gap-3 stagger">
        {HOW_IT_WORKS.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="how-card p-4"
            style={{ background: "rgba(237,230,214,0.06)", border: "1px solid rgba(237,230,214,0.16)", borderRadius: 6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px]" style={{ color: "#A89B7A" }}>0{i + 1}</span>
              <Icon size={15} style={{ color: "#EDE6D6" }} />
            </div>
            <div className="font-body text-[13.5px] font-semibold mb-1" style={{ color: "#EDE6D6" }}>{title}</div>
            <div className="font-body text-[12.5px] leading-relaxed" style={{ color: "#9aa1ba" }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 md:px-12 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop: "1px solid rgba(237,230,214,0.14)" }}>
        <div className="flex items-center gap-2">
          <Scale size={13} style={{ color: "#8a92ab" }} />
          <span className="font-mono text-[11px]" style={{ color: "#8a92ab" }}>Saral · a grounded-answer prototype</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "#6b7290" }}>
          <GitBranch size={11} />
          <span>Sample corpus: RTI Act · Consumer Protection Act · Payment of Wages Act</span>
        </div>
      </div>
      <p className="font-mono text-[10.5px] text-center mt-4" style={{ color: "#5a6280" }}>
        Not legal advice. For anything with real stakes, please consult a lawyer.
      </p>
    </footer>
  );
}

// ---------------------------------------------------------------------------
export default function App() {
  const [tab, setTab] = useState("explain");
  const [caseFile, setCaseFile] = useState(() => {
    try {
      const raw = localStorage.getItem(CASE_FILE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toasts, push: pushToast } = useToasts();

  useEffect(() => {
    try {
      localStorage.setItem(CASE_FILE_STORAGE_KEY, JSON.stringify(caseFile));
    } catch {
      // storage may be unavailable (private browsing, quota) — fail silently
    }
  }, [caseFile]);

  // explain state
  const [explainInput, setExplainInput] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainStage, setExplainStage] = useState(0);
  const [explainResult, setExplainResult] = useState(null);
  const [explainError, setExplainError] = useState(null);
  const [explainVersion, setExplainVersion] = useState(0);
  const [explainLang, setExplainLang] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // scanned document upload state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [ocrNotice, setOcrNotice] = useState(null);
  const fileInputRef = useRef(null);

  // generate state
  const [templateKey, setTemplateKey] = useState("rti_application");
  const [genInput, setGenInput] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [genValues, setGenValues] = useState(null);
  const [missingKeys, setMissingKeys] = useState([]);
  const [genError, setGenError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);

  // simplify state (bulky documents / terms & conditions)
  const [simplifyInput, setSimplifyInput] = useState("");
  const [simplifyFileName, setSimplifyFileName] = useState(null);
  const [simplifyLoading, setSimplifyLoading] = useState(false);
  const [simplifyStage, setSimplifyStage] = useState(0);
  const [simplifyResult, setSimplifyResult] = useState(null);
  const [simplifyError, setSimplifyError] = useState(null);
  const [simplifyVersion, setSimplifyVersion] = useState(0);
  const [simplifyLang, setSimplifyLang] = useState("en");
  const [simplifyTranslating, setSimplifyTranslating] = useState(false);
  const [simplifyLangMenuOpen, setSimplifyLangMenuOpen] = useState(false);

  async function handleExplain() {
    if (!explainInput.trim()) return;
    setExplainLoading(true);
    setExplainError(null);
    setExplainResult(null);
    setExplainLang("en");
    setExplainStage(0);
    try {
      const sources = retrieve(explainInput, 4);
      if (sources.length === 0) {
        const fallback = {
          answer: "This prototype's sample database (RTI Act, Consumer Protection Act, Code on Wages, Constitution of India, Model Tenancy Act, Bharatiya Nyaya Sanhita, Domestic Violence Act, Motor Vehicles Act, Maternity Benefit Act) doesn't clearly cover this situation. This is general information, not legal advice. For anything with real stakes, please consult a lawyer.",
          sources: [],
          translations: {},
        };
        setExplainResult(fallback);
        setExplainVersion((v) => v + 1);
        setCaseFile((prev) => [{ id: Date.now(), type: "explain", ts: Date.now(), input: explainInput, result: fallback }, ...prev].slice(0, 25));
        setExplainLoading(false);
        return;
      }
      setExplainStage(1);
      const context = formatContext(sources);
      const prompt = `LEGAL CONTEXT:\n${context}\n\nUSER'S SITUATION:\n${explainInput}\n\nExplain this to the user following the rules above.`;
      setExplainStage(2);
      const answer = await callAI(EXPLAIN_SYSTEM, prompt);
      setExplainStage(3);
      const result = { answer, sources, translations: {} };
      setExplainResult(result);
      setExplainVersion((v) => v + 1);
      setCaseFile((prev) => [{ id: Date.now(), type: "explain", ts: Date.now(), input: explainInput, result }, ...prev].slice(0, 25));
    } catch (e) {
      setExplainError(e.message || "Something went wrong reaching the AI. Try again.");
    } finally {
      setExplainLoading(false);
    }
  }

  async function toggleLang(code) {
    setExplainLang(code);
    if (code !== "en" && explainResult && !explainResult.translations?.[code]) {
      const language = LANGUAGES.find((l) => l.code === code);
      if (!language) return;
      setTranslating(true);
      try {
        const translated = await callAI(translateSystemFor(language), explainResult.answer);
        setExplainResult((prev) => ({ ...prev, translations: { ...(prev.translations || {}), [code]: translated } }));
      } catch (e) {
        setExplainLang("en");
        pushToast(`Couldn't translate into ${language.label} right now.`, "err");
      } finally {
        setTranslating(false);
      }
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-picking the same file
    if (!file) return;
    setOcrError(null);
    setOcrNotice(null);
    setOcrLoading(true);
    try {
      const { images, truncated, totalPages } = await fileToOcrImages(file);
      const text = await callAI(OCR_SYSTEM, "Transcribe this document.", { images, maxTokens: 3500 });
      if (!text.trim()) {
        setOcrError("Couldn't make out any text in that file. Try a clearer photo or a higher-resolution scan.");
      } else {
        setExplainInput((prev) => (prev.trim() ? `${prev.trim()}\n\n${text.trim()}` : text.trim()));
        setOcrNotice(
          truncated
            ? `Read the first ${images.length} of ${totalPages} pages — only that much fits in one request. Review the text below before submitting.`
            : "Document text extracted below — please skim it for OCR mistakes before submitting."
        );
      }
    } catch (err) {
      setOcrError(err.message || "Couldn't read that file. Try a clearer photo, or paste the text directly.");
    } finally {
      setOcrLoading(false);
    }
  }

  async function handleGenerate() {
    if (!genInput.trim()) return;
    setGenLoading(true);
    setGenError(null);
    setGenValues(null);
    setGenStage(0);
    try {
      const template = TEMPLATES[templateKey].text;
      const placeholders = extractPlaceholders(template);
      setGenStage(1);
      const sources = retrieve(genInput, 3);
      const context = formatContext(sources);
      setGenStage(2);
      const prompt = `PLACEHOLDERS TO FILL: ${JSON.stringify(placeholders)}\n\nRELEVANT LAW (only cite from here, never invent citations):\n${context || "(none retrieved)"}\n\nUSER'S DESCRIPTION:\n${genInput}\n\nReturn a JSON object with every placeholder as a key.`;
      let raw = await callAI(EXTRACT_SYSTEM, prompt);
      setGenStage(3);
      raw = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
      const values = JSON.parse(raw);
      setGenValues(values);
      setMissingKeys(Object.entries(values).filter(([, v]) => !v).map(([k]) => k));
      setResultVersion((v) => v + 1);
      setCaseFile((prev) => [{ id: Date.now(), type: "generate", ts: Date.now(), input: genInput, templateKey, values }, ...prev].slice(0, 25));
    } catch (e) {
      setGenError(
        e instanceof SyntaxError
          ? "Couldn't parse the AI's response. Try rephrasing your description with more specific details."
          : e.message || "Something went wrong reaching the AI. Try again."
      );
    } finally {
      setGenLoading(false);
    }
  }

  function updateField(key, val) {
    setGenValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSimplify() {
    if (!simplifyInput.trim()) return;
    setSimplifyLoading(true);
    setSimplifyError(null);
    setSimplifyResult(null);
    setSimplifyLang("en");
    setSimplifyStage(0);
    try {
      setSimplifyStage(1);
      const prompt = `DOCUMENT TEXT:\n${simplifyInput}\n\nAnalyze this document following the rules above.`;
      setSimplifyStage(2);
      const answer = await callAI(SIMPLIFY_SYSTEM, prompt, { maxTokens: 1800 });
      setSimplifyStage(3);
      const result = { answer, translations: {}, fileName: simplifyFileName };
      setSimplifyResult(result);
      setSimplifyVersion((v) => v + 1);
      setCaseFile((prev) => [{ id: Date.now(), type: "simplify", ts: Date.now(), input: simplifyInput, result }, ...prev].slice(0, 25));
    } catch (e) {
      setSimplifyError(e.message || "Something went wrong reaching the AI. Try again.");
    } finally {
      setSimplifyLoading(false);
    }
  }

  async function toggleSimplifyLang(code) {
    setSimplifyLang(code);
    if (code !== "en" && simplifyResult && !simplifyResult.translations?.[code]) {
      const language = LANGUAGES.find((l) => l.code === code);
      if (!language) return;
      setSimplifyTranslating(true);
      try {
        const translated = await callAI(translateSystemFor(language), simplifyResult.answer);
        setSimplifyResult((prev) => ({ ...prev, translations: { ...(prev.translations || {}), [code]: translated } }));
      } catch (e) {
        setSimplifyLang("en");
        pushToast(`Couldn't translate into ${language.label} right now.`, "err");
      } finally {
        setSimplifyTranslating(false);
      }
    }
  }

  function handleSimplifyFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      pushToast("Please upload a .txt file, or paste the text directly.", "err");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSimplifyInput(String(reader.result || ""));
      setSimplifyFileName(file.name);
      pushToast(`Loaded ${file.name}`);
    };
    reader.onerror = () => pushToast("Couldn't read that file.", "err");
    reader.readAsText(file);
    e.target.value = "";
  }

  function copyDoc(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    pushToast("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadDoc(text, name) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Downloaded");
  }

  function loadCaseEntry(entry) {
    setDrawerOpen(false);
    if (entry.type === "explain") {
      setTab("explain");
      setExplainInput(entry.input);
      setExplainResult(entry.result);
      setExplainLang("en");
      setExplainVersion((v) => v + 1);
    } else if (entry.type === "simplify") {
      setTab("simplify");
      setSimplifyInput(entry.input);
      setSimplifyResult(entry.result);
      setSimplifyFileName(entry.result?.fileName || null);
      setSimplifyLang("en");
      setSimplifyVersion((v) => v + 1);
    } else {
      setTab("generate");
      setTemplateKey(entry.templateKey);
      setGenInput(entry.input);
      setGenValues(entry.values);
      setMissingKeys(Object.entries(entry.values).filter(([, v]) => !v).map(([k]) => k));
      setResultVersion((v) => v + 1);
    }
  }

  function deleteCaseEntry(id) {
    setCaseFile((prev) => prev.filter((e) => e.id !== id));
  }

  function clearCaseFile() {
    setCaseFile([]);
    pushToast("Case file cleared");
  }

  function onKeyDownSubmit(e, fn) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      fn();
    }
  }

  const filledDoc = genValues ? fillTemplate(TEMPLATES[templateKey].text, genValues) : null;
  const missingFields = missingKeys;
  const explainLegalWords = explainResult ? explainResult.sources.reduce((s, r) => s + wordCount(r.text), 0) : 0;
  const explainAnswerWords = explainResult ? wordCount(explainResult.answer) : 0;

  return (
    <div className="min-h-screen w-full" style={{ background: "radial-gradient(ellipse 900px 500px at 20% 0%, #1c2c4f 0%, #14213D 60%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Zilla Slab', serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .thread { background-image: repeating-linear-gradient(90deg, #A13D2C 0 10px, transparent 10px 16px); height: 2px; background-size: 16px 2px; animation: threadDraw 900ms ease-out both; animation-delay: 200ms; }

        @keyframes threadDraw { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes stampDown {
          0%   { transform: scale(2.4) rotate(-10deg); opacity: 0; }
          55%  { transform: scale(0.9) rotate(-6deg); opacity: 1; }
          75%  { transform: scale(1.08) rotate(-6deg); }
          100% { transform: scale(1) rotate(-6deg); opacity: 1; }
        }
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); } 40% { opacity: 1; transform: scale(1); } }
        @keyframes underlineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes barGrow { from { width: 0; } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

        .anim-fade-up { animation: fadeSlideUp 560ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-fade-in { animation: fadeIn 400ms ease-out both; }
        .anim-stamp { animation: stampDown 640ms cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
        .anim-pop { animation: popIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .anim-bar-grow { animation: barGrow 700ms cubic-bezier(0.16,1,0.3,1) both; }
        .anim-toast-in { animation: toastIn 260ms cubic-bezier(0.16,1,0.3,1) both; }
        .stagger > * { opacity: 0; animation: fadeSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .stagger > *:nth-child(1) { animation-delay: 40ms; }
        .stagger > *:nth-child(2) { animation-delay: 100ms; }
        .stagger > *:nth-child(3) { animation-delay: 160ms; }
        .stagger > *:nth-child(4) { animation-delay: 220ms; }
        .stagger > *:nth-child(5) { animation-delay: 280ms; }
        .stagger > *:nth-child(6) { animation-delay: 340ms; }
        .stagger > *:nth-child(n+7) { animation-delay: 380ms; }

        .btn-lift { transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease; }
        .btn-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(20,33,61,0.25); }
        .btn-lift:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        .btn-lift:focus-visible { outline: 2px solid #A13D2C; outline-offset: 2px; }

        .field-focus { transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease; }
        .field-focus:focus { border-color: #14213D !important; box-shadow: 0 0 0 3px rgba(20,33,61,0.10); background: #fffdf6 !important; }

        .tab-btn { transition: background-color 260ms ease, color 260ms ease, transform 200ms ease; }
        .tab-btn:hover:not(.tab-active) { transform: translateY(-1px); }
        .tab-btn:focus-visible { outline: 2px solid #A13D2C; outline-offset: -2px; }

        .chip-btn { transition: all 180ms ease; }
        .chip-btn:hover { background: #14213D !important; color: #EDE6D6 !important; border-color: #14213D !important; }

        .how-card { transition: transform 220ms ease, background-color 220ms ease, border-color 220ms ease; }
        .how-card:hover { transform: translateY(-3px); background: rgba(237,230,214,0.1) !important; border-color: rgba(237,230,214,0.3) !important; }

        .dot { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: currentColor; animation: dotPulse 1.1s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }

        .source-chip { transition: transform 180ms ease, box-shadow 180ms ease; }
        .source-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(58,52,36,0.15); }

        .lang-toggle { transition: background-color 180ms ease, color 180ms ease; }

        .tabs-scroll { overflow-x: auto; scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <ToastStack toasts={toasts} />
      <CaseFileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entries={caseFile}
        onLoad={loadCaseEntry}
        onDelete={deleteCaseEntry}
        onClear={clearCaseFile}
      />

      {/* Header */}
      <header className="px-6 md:px-12 pt-10 pb-8 max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 stagger">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Scale size={22} style={{ color: "#EDE6D6", animation: "bob 3.5s ease-in-out infinite" }} strokeWidth={2} />
              <span className="font-mono text-[12px] tracking-[0.2em] uppercase" style={{ color: "#A89B7A" }}>Case file · Prototype</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-3" style={{ color: "#EDE6D6" }}>
              Sa<span style={{ color: "#A13D2C" }}>ral</span>
            </h1>
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: "#8a92ab" }}>सरल · simple, by design</p>
            <p className="font-body mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: "#B9AF95" }}>
              Every clause has an answer buried in it somewhere. You shouldn't need a law degree to find it —
              you should need a search engine that cites its sources. Explain a document, or draft one, grounded in the actual text of the law.
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="btn-lift shrink-0 font-body text-[13px] px-4 py-2.5 flex items-center gap-2"
            style={{ background: "#1c2c4f", color: "#EDE6D6", border: "1px solid #37456b", borderRadius: 4 }}
          >
            <Folder size={14} /> Case file {caseFile.length > 0 && <span className="font-mono text-[11px]" style={{ color: "#A89B7A" }}>({caseFile.length})</span>}
          </button>
        </div>
      </header>

      <HowItWorks />

      {/* Folder tabs */}
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex gap-1 tabs-scroll" role="tablist" aria-label="Saral tools">
          {[
            { key: "explain", label: "Explain", icon: Search },
            { key: "generate", label: "Draft a document", icon: FileText },
            { key: "simplify", label: "Simplify a document", icon: FileWarning },
            { key: "library", label: "Library", icon: Library },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`tab-btn font-body text-[14px] px-5 py-3 flex items-center gap-2 relative shrink-0 ${tab === key ? "tab-active" : ""}`}
              style={{
                background: tab === key ? "#EDE6D6" : "#1c2c4f",
                color: tab === key ? "#14213D" : "#8a92ab",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                fontWeight: tab === key ? 600 : 400,
              }}
            >
              <Icon size={15} /> {label}
              {tab === key && (
                <span
                  className="absolute left-0 right-0 bottom-0 h-[2px]"
                  style={{ background: "#A13D2C", transformOrigin: "left", animation: "underlineGrow 320ms cubic-bezier(0.16,1,0.3,1) both" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content card */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-12">
        <div key={tab} className="p-6 md:p-9 anim-fade-up" style={{ background: "#EDE6D6", borderRadius: "0 6px 6px 6px", boxShadow: "0 20px 50px -20px rgba(0,0,0,0.45)" }}>
          <div className="thread mb-7" />

          {tab === "explain" && (
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label htmlFor="explain-input" className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#5a5342" }}>
                  Describe your situation, or paste a document
                </label>
                <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: "#a99f83" }}>
                  <Command size={10} />+Enter to submit
                </span>
              </div>
              <textarea
                id="explain-input"
                value={explainInput}
                onChange={(e) => setExplainInput(e.target.value)}
                onKeyDown={(e) => onKeyDownSubmit(e, handleExplain)}
                placeholder="e.g. I filed an RTI request 45 days ago and haven't heard back. What can I do?"
                className="w-full font-body text-[14px] p-4 outline-none resize-none field-focus"
                style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, minHeight: 110, color: "#2a2618" }}
              />

              <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="explain-file-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrLoading}
                  className="chip-btn font-body text-[11.5px] px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-60"
                  style={{ border: "1px dashed #a99f83", borderRadius: 20, color: "#5a5342", background: "transparent" }}
                >
                  {ocrLoading ? <Loader2 size={12} className="animate-spin" /> : <ScanLine size={12} />}
                  {ocrLoading ? "Reading document…" : "Upload a photo or scan"}
                </button>
                <span className="font-mono text-[10px]" style={{ color: "#a99f83" }}>JPG, PNG, or PDF · up to {MAX_OCR_PAGES} pages read at once</span>
              </div>

              {ocrError && (
                <div className="mt-2 flex items-center gap-2 font-body text-[13px]" style={{ color: "#A13D2C" }}>
                  <AlertTriangle size={14} /> {ocrError}
                </div>
              )}
              {ocrNotice && !ocrError && (
                <div className="mt-2 flex items-center gap-2 font-body text-[12.5px]" style={{ color: "#5a5342" }}>
                  <Camera size={13} /> {ocrNotice}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {EXPLAIN_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExplainInput(ex)}
                    className="chip-btn font-body text-[11.5px] px-3 py-1.5"
                    style={{ border: "1px solid #c9bfa0", borderRadius: 20, color: "#5a5342", background: "transparent" }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExplain}
                disabled={explainLoading || !explainInput.trim()}
                className="btn-lift font-body text-[14px] font-medium mt-4 px-5 py-2.5 flex items-center gap-2 disabled:opacity-50"
                style={{ background: "#14213D", color: "#EDE6D6", borderRadius: 4 }}
              >
                {explainLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                {explainLoading ? "Working" : "Explain this"}
                {explainLoading && <span className="flex gap-0.5"><span className="dot" /><span className="dot" /><span className="dot" /></span>}
              </button>
              {explainLoading && <Stepper steps={["Searching corpus", "Consulting Saral", "Formatting"]} current={explainStage} />}

              {explainError && (
                <div className="mt-5 flex items-center gap-2 font-body text-[13px]" style={{ color: "#A13D2C" }}>
                  <AlertTriangle size={15} /> {explainError}
                </div>
              )}

              {explainResult && (
                <div key={explainVersion} className="mt-7 pt-6 anim-fade-up" style={{ borderTop: "1px solid #c9bfa0" }}>
                  <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
                    <div className="anim-stamp"><Seal count={explainResult.sources.length} /></div>
                    {explainResult.sources.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setLangMenuOpen((v) => !v)}
                          className="lang-toggle font-mono text-[11px] px-3 py-1.5 flex items-center gap-1.5"
                          style={{ borderRadius: 20, background: "#14213D", color: "#EDE6D6" }}
                        >
                          <Languages size={11} />
                          {LANGUAGES.find((l) => l.code === explainLang)?.native || "English"}
                          <ChevronDown size={12} style={{ transform: langMenuOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }} />
                        </button>
                        {langMenuOpen && (
                          <div
                            className="absolute right-0 mt-1.5 py-1.5 z-20 anim-fade-in"
                            style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 8, minWidth: 168, maxHeight: 280, overflowY: "auto", boxShadow: "0 16px 40px -14px rgba(0,0,0,0.4)" }}
                          >
                            {LANGUAGES.map((l) => (
                              <button
                                key={l.code}
                                onClick={() => { toggleLang(l.code); setLangMenuOpen(false); }}
                                className="w-full text-left font-body text-[13px] px-3 py-1.5 flex items-baseline justify-between gap-2"
                                style={{ background: explainLang === l.code ? "#e2d9bd" : "transparent", color: "#2a2618" }}
                              >
                                <span>{l.native}</span>
                                <span className="font-mono text-[10px] opacity-50">{l.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {explainResult.sources.length > 0 && (
                    <ComplexityStat legalWords={explainLegalWords} answerWords={explainAnswerWords} sectionCount={explainResult.sources.length} />
                  )}

                  {translating ? (
                    <div className="flex items-center gap-2 font-body text-[13px]" style={{ color: "#5a5342" }}>
                      <Loader2 size={14} className="animate-spin" /> Translating…
                    </div>
                  ) : (
                    <div className="font-body text-[14.5px] leading-relaxed whitespace-pre-wrap anim-fade-in" style={{ color: "#2a2618", animationDelay: "150ms" }}>
                      {explainLang !== "en" && explainResult.translations?.[explainLang] ? explainResult.translations[explainLang] : explainResult.answer}
                    </div>
                  )}

                  {explainResult.sources.length > 0 && (
                    <div className="mt-6">
                      <div className="font-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "#5a5342" }}>Sources used</div>
                      <div className="grid sm:grid-cols-2 gap-2 stagger">
                        {explainResult.sources.map((s, i) => <SourceChip key={i} s={s} />)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "generate" && (
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider block mb-2" style={{ color: "#5a5342" }}>
                Document type
              </label>
              <div className="flex gap-2 mb-5 stagger flex-wrap">
                {Object.entries(TEMPLATES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => { setTemplateKey(key); setGenValues(null); setMissingKeys([]); }}
                    className="btn-lift font-body text-[13px] px-4 py-2 flex items-center gap-2"
                    style={{
                      background: templateKey === key ? "#14213D" : "#faf7ee",
                      color: templateKey === key ? "#EDE6D6" : "#5a5342",
                      border: "1px solid #c9bfa0",
                      borderRadius: 4,
                    }}
                  >
                    <BookOpen size={13} /> {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label htmlFor="generate-input" className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#5a5342" }}>
                  Describe your situation in your own words
                </label>
                <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: "#a99f83" }}>
                  <Command size={10} />+Enter to submit
                </span>
              </div>
              <textarea
                id="generate-input"
                value={genInput}
                onChange={(e) => setGenInput(e.target.value)}
                onKeyDown={(e) => onKeyDownSubmit(e, handleGenerate)}
                placeholder="e.g. I am Ramesh Kumar, living in Bengaluru. I want to ask BBMP for details of road repair spending on my street in 2025."
                className="w-full font-body text-[14px] p-4 outline-none resize-none field-focus"
                style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, minHeight: 110, color: "#2a2618" }}
              />
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {GENERATE_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setGenInput(ex)}
                    className="chip-btn font-body text-[11.5px] px-3 py-1.5"
                    style={{ border: "1px solid #c9bfa0", borderRadius: 20, color: "#5a5342", background: "transparent" }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                disabled={genLoading || !genInput.trim()}
                className="btn-lift font-body text-[14px] font-medium mt-4 px-5 py-2.5 flex items-center gap-2 disabled:opacity-50"
                style={{ background: "#14213D", color: "#EDE6D6", borderRadius: 4 }}
              >
                {genLoading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
                {genLoading ? "Working" : "Draft document"}
                {genLoading && <span className="flex gap-0.5"><span className="dot" /><span className="dot" /><span className="dot" /></span>}
              </button>
              {genLoading && <Stepper steps={["Searching corpus", "Consulting AI", "Filling template"]} current={genStage} />}

              {genError && (
                <div className="mt-5 flex items-center gap-2 font-body text-[13px]" style={{ color: "#A13D2C" }}>
                  <AlertTriangle size={15} /> {genError}
                </div>
              )}

              {genValues && filledDoc && (
                <div key={resultVersion} className="mt-7 pt-6 anim-fade-up" style={{ borderTop: "1px solid #c9bfa0" }}>
                  {missingFields.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 font-body text-[13px] mb-3" style={{ color: "#A13D2C" }}>
                        <AlertTriangle size={14} /> A few details weren't in what you wrote — fill them in below
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 stagger">
                        {missingFields.map((f) => (
                          <div key={f}>
                            <label className="font-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#8a8062" }}>{f.replace(/_/g, " ")}</label>
                            <input
                              value={genValues[f] || ""}
                              onChange={(e) => updateField(f, e.target.value)}
                              className="w-full font-body text-[13px] px-3 py-2 outline-none field-focus"
                              style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                    <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#5a5342" }}>Draft</div>
                    <div className="flex gap-2">
                      <button onClick={() => copyDoc(filledDoc)} className="btn-lift font-body text-[12px] px-3 py-1.5 flex items-center gap-1.5" style={{ border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618", background: "#faf7ee" }}>
                        <span className={copied ? "anim-pop" : ""} key={copied ? "c1" : "c0"}>
                          {copied ? <Check size={13} /> : <Copy size={13} />}
                        </span>
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => downloadDoc(filledDoc, `${templateKey}.txt`)} className="btn-lift font-body text-[12px] px-3 py-1.5 flex items-center gap-1.5" style={{ border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618", background: "#faf7ee" }}>
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>
                  <pre className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap p-5 anim-fade-in" style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618", animationDelay: "120ms" }}>
                    {filledDoc}
                  </pre>
                </div>
              )}
            </div>
          )}

          {tab === "simplify" && (
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label htmlFor="simplify-input" className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#5a5342" }}>
                  Paste the bulky document, contract, or terms &amp; conditions
                </label>
                <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: "#a99f83" }}>
                  <Command size={10} />+Enter to submit
                </span>
              </div>
              <textarea
                id="simplify-input"
                value={simplifyInput}
                onChange={(e) => { setSimplifyInput(e.target.value); setSimplifyFileName(null); }}
                onKeyDown={(e) => onKeyDownSubmit(e, handleSimplify)}
                placeholder="Paste the full text of the terms & conditions, rental agreement, loan contract, employment offer, app privacy policy — anything you're about to click 'I agree' on."
                className="w-full font-body text-[13.5px] p-4 outline-none resize-none field-focus"
                style={{ background: "#faf7ee", border: "1px solid #c9bfa0", borderRadius: 4, minHeight: 180, color: "#2a2618" }}
              />
              <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2">
                <label
                  htmlFor="simplify-file"
                  className="btn-lift font-body text-[12px] px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
                  style={{ border: "1px solid #c9bfa0", borderRadius: 4, color: "#5a5342", background: "transparent" }}
                >
                  <Upload size={12} /> Upload a .txt file instead
                </label>
                <input id="simplify-file" type="file" accept=".txt,.md" onChange={handleSimplifyFile} className="hidden" />
                {simplifyFileName && (
                  <span className="font-mono text-[11px]" style={{ color: "#8a8062" }}>Loaded: {simplifyFileName}</span>
                )}
                <span className="font-mono text-[10.5px] ml-auto" style={{ color: "#a99f83" }}>{wordCount(simplifyInput)} words</span>
              </div>
              <button
                onClick={handleSimplify}
                disabled={simplifyLoading || !simplifyInput.trim()}
                className="btn-lift font-body text-[14px] font-medium mt-4 px-5 py-2.5 flex items-center gap-2 disabled:opacity-50"
                style={{ background: "#14213D", color: "#EDE6D6", borderRadius: 4 }}
              >
                {simplifyLoading ? <Loader2 size={15} className="animate-spin" /> : <FileWarning size={15} />}
                {simplifyLoading ? "Working" : "Break it down"}
                {simplifyLoading && <span className="flex gap-0.5"><span className="dot" /><span className="dot" /><span className="dot" /></span>}
              </button>
              {simplifyLoading && <Stepper steps={["Reading document", "Consulting Saral", "Formatting"]} current={simplifyStage} />}

              {simplifyError && (
                <div className="mt-5 flex items-center gap-2 font-body text-[13px]" style={{ color: "#A13D2C" }}>
                  <AlertTriangle size={15} /> {simplifyError}
                </div>
              )}

              {simplifyResult && (
                <div key={simplifyVersion} className="mt-7 pt-6 anim-fade-up" style={{ borderTop: "1px solid #c9bfa0" }}>
                  <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
                    <div className="flex items-center gap-2 anim-stamp">
                      <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: "#A13D2C", color: "#A13D2C" }}>
                        <FileWarning size={19} strokeWidth={2.5} />
                      </div>
                      <div className="leading-tight">
                        <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "#A13D2C" }}>Document, broken down</div>
                        <div className="font-mono text-[11px]" style={{ color: "#5a5342" }}>What matters, before you agree</div>
                      </div>
                    </div>
                    <LanguageDropdown
                      current={simplifyLang}
                      onSelect={(code) => { toggleSimplifyLang(code); setSimplifyLangMenuOpen(false); }}
                      open={simplifyLangMenuOpen}
                      onToggle={() => setSimplifyLangMenuOpen((v) => !v)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mb-4">
                    <button onClick={() => copyDoc(simplifyLang !== "en" && simplifyResult.translations?.[simplifyLang] ? simplifyResult.translations[simplifyLang] : simplifyResult.answer)} className="btn-lift font-body text-[12px] px-3 py-1.5 flex items-center gap-1.5" style={{ border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618", background: "#faf7ee" }}>
                      <Copy size={13} /> Copy
                    </button>
                    <button onClick={() => downloadDoc(simplifyLang !== "en" && simplifyResult.translations?.[simplifyLang] ? simplifyResult.translations[simplifyLang] : simplifyResult.answer, "document-breakdown.txt")} className="btn-lift font-body text-[12px] px-3 py-1.5 flex items-center gap-1.5" style={{ border: "1px solid #c9bfa0", borderRadius: 4, color: "#2a2618", background: "#faf7ee" }}>
                      <Download size={13} /> Download
                    </button>
                  </div>

                  {simplifyTranslating ? (
                    <div className="flex items-center gap-2 font-body text-[13px]" style={{ color: "#5a5342" }}>
                      <Loader2 size={14} className="animate-spin" /> Translating…
                    </div>
                  ) : (
                    <div className="font-body text-[14.5px] leading-relaxed whitespace-pre-wrap anim-fade-in" style={{ color: "#2a2618", animationDelay: "150ms" }}>
                      {simplifyLang !== "en" && simplifyResult.translations?.[simplifyLang] ? simplifyResult.translations[simplifyLang] : simplifyResult.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "library" && <LibraryTab />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
