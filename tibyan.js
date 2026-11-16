/* ============================================================================
   تِبيان — المكتبة المشتركة لجميع الصفحات
   تصميم وتطوير سور للبرمجيات
   يُحمَّل بعد مكتبة Supabase:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="tibyan.js"></script>
   ========================================================================== */
(function () {
  "use strict";

  const SUPABASE_URL = "https://tsiacidrfnbfiyyzzhwy.supabase.co";
  const SUPABASE_KEY = "sb_publishable_FX3SdWzHTYOzVdQbDD--Gg_NE-gxG0n";
  const BUCKET = "tibyan-videos";

  const client = window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
  if (!client) console.error("تعذّر تحميل مكتبة Supabase.");

  /* القيمة value هي ما يُحفظ في عمود category */
  const CATEGORIES = [
    { value: "القرآن الكريم",   label: "القرآن الكريم",        art: "c1" },
    { value: "المصحف المرتل",   label: "المصحف المرتل",        art: "c7" },
    { value: "المصحف المجود",   label: "المصحف المجود",        art: "c4" },
    { value: "تلاوات خاشعة",    label: "تلاوات خاشعة",         art: "c2" },
    { value: "تجويد",           label: "التجويد",              art: "c3" },
    { value: "الحفظ والمراجعة", label: "الحفظ والمراجعة",      art: "c5" },
    { value: "التفسير والتدبر", label: "التفسير والتدبر",      art: "c1" },
    { value: "أذكار",           label: "أذكار وأدعية",         art: "c6" },
    { value: "أخرى",            label: "أخرى",                 art: "c1" }
  ];

  const STATUS_LABELS = { draft: "مسودة", pending: "قيد المراجعة", published: "منشورة", rejected: "مرفوضة" };

  const VIDEO_COLUMNS =
    "id,title,reader_name,category,description,video_url,thumbnail_url," +
    "status,created_at,published_at,user_id,view_count,duration_seconds";

  const AYAT = [
    ["﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾", "سورة المزمل — ٤"],
    ["﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾", "سورة الرعد — ٢٨"],
    ["﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾", "سورة القمر — ١٧"],
    ["﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾", "سورة الإسراء — ٩"],
    ["﴿ وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ ﴾", "سورة الأعراف — ٢٠٤"],
    ["﴿ كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ ﴾", "سورة ص — ٢٩"]
  ];

  /* ---------------- الأيقونات ---------------- */
  const P = {
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    search: "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    subs: "M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4-6-3.27v6.53L16 16z",
    library: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z",
    history: "M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
    clock: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    like: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
    playlist: "M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z",
    save: "M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z",
    grid: "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z",
    mic: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
    people: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    fire: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z",
    upload: "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    shield: "M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z",
    user: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z",
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    doc: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
    moon: "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z",
    sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06z",
    share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 0 0 21 5a3 3 0 1 0-5.91.7L8.04 9.81A2.99 2.99 0 0 0 3 12a3 3 0 0 0 5.04 2.19l7.12 4.16c-.05.21-.08.43-.08.65A2.92 2.92 0 1 0 18 16.08z",
    close: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    play: "M8 5v14l11-7z",
    headphones: "M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h3v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-3v8h3c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z",
    check: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    studio: "M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-6-7 4V7z",
    sort: "M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z",
    reply: "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
  };
  function icon(name, cls = "") {
    return `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[name] || ""}"/></svg>`;
  }

  /* ---------------- النصوص والتنسيق ---------------- */
  const NUM_LOCALE = "ar-u-nu-latn";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }
  const esc = escapeHTML;

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFC").toLocaleLowerCase("ar")
      .replace(/[\u064B-\u0652\u0670]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
      .replace(/\s+/g, " ").trim();
  }

  function truncate(value, max) {
    const t = String(value ?? "").trim();
    return t.length > max ? t.slice(0, max).trim() + "…" : t;
  }

  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(NUM_LOCALE, { year: "numeric", month: "long", day: "numeric" }).format(d);
  }

  function timeAgo(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const s = (d.getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(NUM_LOCALE, { numeric: "auto" });
    const steps = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, sec] of steps) {
      if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), unit);
    }
    return "الآن";
  }

  function formatCount(n) {
    return new Intl.NumberFormat(NUM_LOCALE, { notation: "compact", maximumFractionDigits: 1 }).format(Number(n) || 0);
  }
  function formatViews(n) {
    n = Number(n) || 0;
    if (n === 0) return "لا مشاهدات";
    if (n === 1) return "مشاهدة واحدة";
    if (n === 2) return "مشاهدتان";
    return formatCount(n) + " مشاهدة";
  }
  function formatSubs(n) {
    n = Number(n) || 0;
    if (n === 0) return "لا مشتركين بعد";
    return formatCount(n) + " مشترك";
  }

  function formatDuration(sec) {
    sec = Math.round(Number(sec) || 0);
    if (!sec) return "";
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const pad = x => String(x).padStart(2, "0");
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  function categoryLabel(value) {
    const c = CATEGORIES.find(x => x.value === value);
    return c ? c.label : (value || "أخرى");
  }
  function categoryArt(value) {
    const c = CATEGORIES.find(x => x.value === value);
    return c ? c.art : "c1";
  }

  function fillCategorySelect(select, options = {}) {
    if (!select) return;
    const { includeAll = false, allLabel = "جميع التصنيفات", placeholder = "" } = options;
    const current = select.value;
    select.replaceChildren();
    if (placeholder) select.add(new Option(placeholder, ""));
    if (includeAll) select.add(new Option(allLabel, "all"));
    CATEGORIES.forEach(c => select.add(new Option(c.label, c.value)));
    if (current) select.value = current;
  }

  function sanitizeSearch(q) {
    return String(q || "").replace(/[,()"\\*%.:;]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  /* ---------------- الروابط والملفات ---------------- */
  function isHttpUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch { return false; }
  }

  function getYouTubeId(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value).trim());
      let id = "";
      if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
        id = url.pathname.split("/").filter(Boolean)[0] || "";
      } else if (/(^|\.)youtube(-nocookie)?\.com$/.test(url.hostname)) {
        if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
        else {
          const parts = url.pathname.split("/").filter(Boolean);
          if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1] || "";
        }
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    } catch { return ""; }
  }

  function storagePath(value) {
    if (!value) return "";
    const raw = String(value).trim();
    if (/^https?:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        const marker = "/storage/v1/object/";
        const at = url.pathname.indexOf(marker);
        if (at === -1) return "";
        const rest = url.pathname.slice(at + marker.length).replace(/^(public|sign|authenticated)\//, "");
        if (!rest.startsWith(BUCKET + "/")) return "";
        return decodeURIComponent(rest.slice(BUCKET.length + 1));
      } catch { return ""; }
    }
    let path = raw.replace(/^\/+/, "");
    if (path.startsWith(BUCKET + "/")) path = path.slice(BUCKET.length + 1);
    return path;
  }

  const signedCache = new Map();
  async function signedUrls(paths, expiresIn = 3600) {
    const map = new Map();
    const need = [];
    [...new Set(paths.filter(Boolean))].forEach(p => {
      const hit = signedCache.get(p);
      if (hit && hit.until > Date.now()) map.set(p, hit.url);
      else need.push(p);
    });
    if (!need.length || !client) return map;
    const { data, error } = await client.storage.from(BUCKET).createSignedUrls(need, expiresIn);
    if (error) {
      console.warn("تعذّر إنشاء روابط الملفات:", error.message);
      return map;
    }
    (data || []).forEach(item => {
      if (item && item.signedUrl && !item.error) {
        map.set(item.path, item.signedUrl);
        signedCache.set(item.path, { url: item.signedUrl, until: Date.now() + (expiresIn - 120) * 1000 });
      }
    });
    return map;
  }
  async function signedUrl(path, expiresIn = 3600) {
    return (await signedUrls([path], expiresIn)).get(path) || "";
  }

  /* يحوّل قيم الصور (مسار أو رابط) إلى روابط قابلة للعرض */
  async function resolveImages(values) {
    const result = new Map();
    const paths = [];
    values.filter(Boolean).forEach(v => {
      const p = storagePath(v);
      if (p) paths.push(p);
      else if (isHttpUrl(v)) result.set(v, v);
    });
    const signed = await signedUrls(paths, 60 * 60 * 6);
    values.filter(Boolean).forEach(v => {
      const p = storagePath(v);
      if (p && signed.has(p)) result.set(v, signed.get(p));
    });
    return result;
  }

  async function resolveThumbnails(videos) {
    const images = await resolveImages(videos.map(v => v.thumbnail_url));
    const out = new Map();
    videos.forEach(v => {
      const url = images.get(v.thumbnail_url);
      if (url) out.set(String(v.id), url);
      else {
        const yt = getYouTubeId(v.video_url);
        if (yt) out.set(String(v.id), "https://img.youtube.com/vi/" + yt + "/hqdefault.jpg");
      }
    });
    return out;
  }

  function cleanFileName(name) {
    const parts = String(name || "file").split(".");
    const ext = parts.length > 1 ? parts.pop().toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const base = parts.join(".").normalize("NFKD").replace(/[^\w-]+/g, "-")
      .replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";
    return ext ? base + "." + ext : base;
  }
  function randomId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  async function uploadFile(userId, folder, file) {
    const path = `${userId}/${folder}/${Date.now()}-${randomId()}-${cleanFileName(file.name)}`;
    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      upsert: false, contentType: file.type || undefined
    });
    if (error) throw error;
    return path;
  }
  async function removeFile(value) {
    const path = storagePath(value);
    if (!path) return;
    const { error } = await client.storage.from(BUCKET).remove([path]);
    if (error) console.warn("تعذّر حذف الملف:", error.message);
  }
  function isAudioPath(path) {
    const ext = (String(path || "").split("?")[0].split(".").pop() || "").toLowerCase();
    return ["mp3", "m4a", "aac", "ogg", "oga", "wav", "flac", "opus", "weba"].includes(ext);
  }

  /* يقرأ مدة ملف صوت/فيديو من المتصفح قبل الرفع */
  function readMediaDuration(file) {
    return new Promise(resolve => {
      try {
        const url = URL.createObjectURL(file);
        const el = document.createElement(file.type.startsWith("audio/") ? "audio" : "video");
        el.preload = "metadata";
        const done = v => { URL.revokeObjectURL(url); resolve(v); };
        el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? Math.round(el.duration) : null);
        el.onerror = () => done(null);
        setTimeout(() => done(null), 8000);
        el.src = url;
      } catch { resolve(null); }
    });
  }

  /* ---------------- البيانات ---------------- */
  async function fetchVideos(o = {}) {
    let q = client.from("videos").select(VIDEO_COLUMNS).eq("status", "published");
    if (o.categories && o.categories.length) q = q.in("category", o.categories);
    if (o.userIds) q = q.in("user_id", o.userIds.length ? o.userIds : ["00000000-0000-0000-0000-000000000000"]);
    if (o.ids) q = q.in("id", o.ids.length ? o.ids : [-1]);
    if (o.excludeId !== undefined && o.excludeId !== null) q = q.neq("id", o.excludeId);
    if (o.search) {
      const s = sanitizeSearch(o.search);
      if (s) {
        const like = `"*${s}*"`;
        q = q.or(`title.ilike.${like},reader_name.ilike.${like},description.ilike.${like},category.ilike.${like}`);
      }
    }
    if (o.order === "popular") q = q.order("view_count", { ascending: false }).order("created_at", { ascending: false });
    else if (o.order === "old") q = q.order("created_at", { ascending: true });
    else q = q.order("created_at", { ascending: false });
    if (o.limit) q = q.limit(o.limit);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }
  const fetchPublishedVideos = fetchVideos;

  async function channelsByUser(userIds) {
    const ids = [...new Set(userIds.filter(Boolean))];
    const map = new Map();
    if (!ids.length) return map;
    const { data, error } = await client
      .from("channels")
      .select("id,user_id,channel_name,description,avatar_url,banner_url,handle,status,created_at")
      .in("user_id", ids)
      .eq("status", "approved");
    if (error) { console.warn(error); return map; }
    const avatars = await resolveImages((data || []).map(c => c.avatar_url));
    (data || []).forEach(c => {
      c.avatar = avatars.get(c.avatar_url) || "";
      if (!map.has(c.user_id)) map.set(c.user_id, c);
    });
    return map;
  }

  async function channelStats(ids) {
    const map = new Map();
    if (!ids.length) return map;
    const { data, error } = await client.rpc("channel_stats", { p_ids: ids.map(String) });
    if (error) { console.warn(error); return map; }
    (data || []).forEach(r => map.set(String(r.channel_id), r));
    return map;
  }

  function channelUrl(ch) {
    if (!ch) return "channels.html";
    return ch.handle ? "channel.html?h=" + encodeURIComponent(ch.handle) : "channel.html?id=" + encodeURIComponent(ch.id);
  }
  function watchUrl(video, extra = "") {
    return "watch.html?v=" + encodeURIComponent(video.id) + extra;
  }

  /* ---------------- المستخدم والصلاحيات ---------------- */
  async function getUser() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session.user : null;
  }

  let rolesPromise = null;
  function getMyRoles(force = false) {
    if (!rolesPromise || force) rolesPromise = loadRoles();
    return rolesPromise;
  }
  async function loadRoles() {
    const empty = { user: null, user_id: null, is_admin: false, is_volunteer: false, has_channel: false, required_approvals: 1, setupMissing: false };
    const user = await getUser();
    if (!user) return empty;
    const { data, error } = await client.rpc("my_roles");
    if (error) {
      console.error("my_roles error:", error);
      return { ...empty, user, user_id: user.id, setupMissing: true, error };
    }
    return { ...empty, ...data, user };
  }

  function friendlyError(error) {
    const m = (error && (error.message || error.error_description)) || "";
    if (/my_roles|function .* does not exist|Could not find the function|relation .* does not exist|schema cache/i.test(m)) {
      return "لم يُشغَّل ملف إعداد قاعدة البيانات supabase-setup.sql (أو نسخته الأحدث) بعد.";
    }
    if (/row-level security|violates row-level/i.test(m)) return "لا تملك صلاحية تنفيذ هذه العملية.";
    if (/Payload too large|exceeded the maximum allowed size|413/i.test(m)) return "حجم الملف أكبر من الحد المسموح في إعدادات التخزين.";
    if (/duplicate key/i.test(m)) return "هذا العنصر موجود مسبقًا.";
    return m || "حدث خطأ غير متوقع.";
  }

  function loginUrl() {
    const next = (location.pathname.split("/").pop() || "index.html") + location.search + location.hash;
    return "login.html?next=" + encodeURIComponent(next);
  }
  function goLogin(message) {
    if (message) sessionStorage.setItem("tibyan-login-reason", message);
    location.href = loginUrl();
  }

  /* ---------------- عناصر الواجهة ---------------- */
  let toastEl = null, toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  function initial(name) {
    let t = String(name || "ت").trim()
      .replace(/^قناة\s+/, "")
      .replace(/^(الشيخ|القارئ|الدكتور|د\.)\s*/, "")
      .replace(/^ال(?=\S{2,})/, "");
    return t.charAt(0) || "ت";
  }
  function avatarHTML(name, url, size = "") {
    return `<span class="avatar ${size}">${url ? `<img src="${esc(url)}" alt="" loading="lazy">` : esc(initial(name))}</span>`;
  }

  function artHTML(video, small = false) {
    const sub = video.reader_name ? "القارئ " + video.reader_name : categoryLabel(video.category);
    return `<div class="art ${categoryArt(video.category)}">
      <div class="art-title">${esc(truncate(video.title || "تلاوة قرآنية", small ? 40 : 60))}</div>
      <div class="art-sub">${esc(sub)}</div>
    </div>`;
  }

  function thumbInner(video, url, opts = {}) {
    const audio = isAudioPath(storagePath(video.video_url) || video.video_url);
    return `${url ? `<img src="${esc(url)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
      ${url ? "" : artHTML(video, opts.small)}
      ${audio ? `<span class="badge-kind">${icon("headphones")}صوت</span>` : ""}
      ${video.duration_seconds ? `<span class="badge-time">${formatDuration(video.duration_seconds)}</span>` : ""}
      ${opts.progress ? `<span class="progress"><i style="width:${Math.min(100, opts.progress)}%"></i></span>` : ""}`;
  }

  const VERIFIED = `<span class="verified" title="قناة معتمدة">${icon("check")}</span>`;

  function cardHTML(video, ctx, layout = "grid", opts = {}) {
    const href = esc(opts.href || watchUrl(video));
    const thumb = ctx.thumbs ? ctx.thumbs.get(String(video.id)) : "";
    const ch = ctx.channels ? ctx.channels.get(video.user_id) : null;
    const chName = ch ? ch.channel_name : (video.reader_name || "تِبيان");
    const chHref = esc(ch ? channelUrl(ch) : "results.html?q=" + encodeURIComponent(video.reader_name || ""));
    const title = esc(video.title || "تلاوة قرآنية");
    const reader = video.reader_name && (!ch || video.reader_name.trim() !== ch.channel_name.trim())
      ? `<div>القارئ ${esc(video.reader_name)}</div>` : "";
    const stats = `${formatViews(video.view_count)}<span class="dot"></span>${esc(timeAgo(video.published_at || video.created_at))}`;

    if (layout === "list") {
      return `<article class="vrow">
        <a class="thumb" href="${href}">${thumbInner(video, thumb, opts)}</a>
        <div>
          <h3 class="vtitle"><a href="${href}">${title}</a></h3>
          <div class="vsub">${stats}</div>
          <a class="chan" href="${chHref}">${avatarHTML(chName, ch && ch.avatar, "xs")}${esc(chName)}${ch ? VERIFIED : ""}</a>
          ${reader ? `<div class="vsub">${reader}</div>` : ""}
          <div class="vdesc">${esc(truncate(video.description || "", 180))}</div>
          ${opts.actions || ""}
        </div>
      </article>`;
    }
    if (layout === "compact") {
      return `<article class="vcompact">
        <a class="thumb" href="${href}">${thumbInner(video, thumb, { ...opts, small: true })}</a>
        <div>
          <h3 class="vtitle"><a href="${href}">${title}</a></h3>
          <div class="vsub"><a href="${chHref}">${esc(chName)}</a>${ch ? VERIFIED : ""}<br>${stats}</div>
        </div>
      </article>`;
    }
    return `<article class="vcard">
      <a class="thumb" href="${href}">${thumbInner(video, thumb, opts)}</a>
      <div class="vmeta">
        <a href="${chHref}" aria-label="${esc(chName)}">${avatarHTML(chName, ch && ch.avatar)}</a>
        <div class="vtext">
          <h3 class="vtitle"><a href="${href}" title="${title}">${title}</a></h3>
          <div class="vsub">
            <a href="${chHref}">${esc(chName)}</a>${ch ? VERIFIED : ""}
            ${reader}
            <div>${stats}</div>
          </div>
        </div>
      </div>
    </article>`;
  }

  async function buildContext(videos) {
    const [thumbs, channels] = await Promise.all([
      resolveThumbnails(videos),
      channelsByUser(videos.map(v => v.user_id))
    ]);
    return { thumbs, channels };
  }

  function emptyHTML(title, text = "", action = "") {
    return `<div class="empty"><div class="glyph">۞</div><strong>${esc(title)}</strong><div>${esc(text)}</div>${action}</div>`;
  }

  function skeletonHTML(count = 8, layout = "grid") {
    const one = layout === "list"
      ? `<div class="vrow skeleton"><div class="thumb"></div><div><div class="line"></div><div class="line short"></div></div></div>`
      : `<div class="vcard skeleton"><div class="thumb"></div><div class="line"></div><div class="line short"></div></div>`;
    return Array.from({ length: count }, () => one).join("");
  }

  async function renderVideos(container, videos, opts = {}) {
    const layout = opts.layout || "grid";
    if (!videos.length) {
      container.innerHTML = emptyHTML(opts.emptyTitle || "لا توجد تلاوات بعد", opts.emptyText || "", opts.emptyAction || "");
      return;
    }
    const ctx = opts.ctx || await buildContext(videos);
    container.innerHTML = videos.map(v => cardHTML(v, ctx, layout, opts.cardOpts ? opts.cardOpts(v) : {})).join("");
    return ctx;
  }

  /* ---------------- المظهر ---------------- */
  function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("tibyan-theme", theme); } catch { /* تجاهل */ }
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  }

  /* ---------------- الهيكل: الشريط العلوي والجانبي ---------------- */
  const state = { roles: null, user: null, myChannel: null, subs: [] };

  function guideLink(href, iconName, label, key, active, extraHTML) {
    return `<a href="${esc(href)}" class="${key && key === active ? "active" : ""}">${extraHTML || icon(iconName)}<span>${esc(label)}</span></a>`;
  }

  function renderGuide(active) {
    const guide = document.getElementById("guide");
    if (!guide) return;
    const r = state.roles || {};
    const logged = !!state.user;

    let html = `<div class="guide-section primary">
      ${guideLink("index.html", "home", "الرئيسية", "home", active)}
      ${guideLink("index.html?sort=popular", "fire", "الأكثر استماعًا", "popular", active)}
      ${guideLink("subscriptions.html", "subs", "الاشتراكات", "subs", active)}
      ${guideLink("library.html", "library", "مكتبتي", "library", active)}
    </div>`;

    html += `<div class="guide-section">
      <div class="guide-title">أنت</div>
      ${guideLink("library.html#history", "history", "السجل", "history", active)}
      ${guideLink("library.html#later", "clock", "الاستماع لاحقًا", "later", active)}
      ${guideLink("library.html#liked", "like", "التلاوات التي أعجبتني", "liked", active)}
      ${guideLink("library.html#playlists", "playlist", "قوائم التشغيل", "playlists", active)}
      ${(r.has_channel || r.is_admin) ? guideLink("studio.html", "studio", "استوديو تِبيان", "studio", active) : ""}
    </div>`;

    if (logged && state.subs.length) {
      html += `<div class="guide-section"><div class="guide-title">الاشتراكات</div>
        ${state.subs.slice(0, 12).map(c => `<a href="${esc(channelUrl(c))}">${avatarHTML(c.channel_name, c.avatar, "xs")}<span>${esc(c.channel_name)}</span></a>`).join("")}
      </div>`;
    } else if (!logged) {
      html += `<div class="guide-section" style="padding:12px">
        <div class="muted" style="font-size:13px;margin-bottom:10px">سجّل الدخول للاشتراك في القنوات وحفظ التلاوات والتعليق.</div>
        <a class="signin-btn" href="${esc(loginUrl())}" style="display:inline-flex;height:36px;gap:6px">${icon("user", "sm")}<span>تسجيل الدخول</span></a>
      </div>`;
    }

    html += `<div class="guide-section"><div class="guide-title">استكشف</div>
      ${guideLink("categories.html", "grid", "التصنيفات", "categories", active)}
      ${guideLink("readers.html", "mic", "القرّاء", "readers", active)}
      ${guideLink("channels.html", "people", "القنوات", "channels", active)}
    </div>`;

    html += `<div class="guide-section"><div class="guide-title">تِبيان</div>
      ${(r.is_volunteer || r.is_admin) ? guideLink("review.html", "shield", "مراجعة التلاوات", "review", active) : ""}
      ${r.is_admin ? guideLink("admin.html", "settings", "لوحة الإدارة", "admin", active) : ""}
      ${guideLink("account.html", "user", "حسابي", "account", active)}
      ${guideLink("about.html", "info", "عن تِبيان", "about", active)}
      ${guideLink("policy.html", "doc", "سياسة المحتوى", "policy", active)}
    </div>
    <div class="guide-foot">
      تُراجَع كل تلاوة قبل نشرها.<br>
      © ${new Date().getFullYear()} تِبيان<br>
      تصميم وتطوير <a href="https://soursoft.om" target="_blank" rel="noopener">سور للبرمجيات</a>
    </div>`;

    guide.innerHTML = html;
  }

  function renderUserArea() {
    const holder = document.getElementById("mast-user");
    if (!holder) return;
    const r = state.roles || {};
    const themeBtn = `<button class="icon-btn" id="theme-toggle" type="button" aria-label="تبديل المظهر">${icon(currentTheme() === "dark" ? "sun" : "moon")}</button>`;

    if (!state.user) {
      holder.innerHTML = `${themeBtn}<a class="signin-btn" href="${esc(loginUrl())}">${icon("user", "sm")}<span>تسجيل الدخول</span></a>`;
    } else {
      const name = state.myChannel ? state.myChannel.channel_name : (state.user.email || "");
      const create = (r.has_channel || r.is_admin)
        ? `<a class="create-btn" href="studio.html#upload" title="رفع تلاوة">${icon("plus", "sm")}<span>إنشاء</span></a>` : "";
      holder.innerHTML = `${create}${themeBtn}
        <button class="avatar-btn" id="avatar-btn" type="button" aria-label="قائمة الحساب" aria-haspopup="true">
          ${avatarHTML(name, state.myChannel && state.myChannel.avatar, "sm")}
        </button>`;
    }
    holder.style.display = "flex";
    holder.style.alignItems = "center";
    holder.style.gap = "6px";

    document.getElementById("theme-toggle").addEventListener("click", () =>
      setTheme(currentTheme() === "dark" ? "light" : "dark"));

    const avatarBtn = document.getElementById("avatar-btn");
    if (avatarBtn) avatarBtn.addEventListener("click", e => { e.stopPropagation(); toggleUserMenu(); });
  }

  function toggleUserMenu() {
    let menu = document.getElementById("user-menu");
    if (menu) { menu.remove(); return; }
    const r = state.roles || {};
    const ch = state.myChannel;
    const name = ch ? ch.channel_name : "حسابك";
    menu = document.createElement("div");
    menu.className = "menu";
    menu.id = "user-menu";
    menu.innerHTML = `
      <div class="menu-head">${avatarHTML(name, ch && ch.avatar, "md")}
        <div><strong>${esc(name)}</strong><span>${esc(state.user.email || "")}</span>
        ${ch ? `<div><a href="${esc(channelUrl(ch))}" style="color:var(--gold-ink);font-weight:700;font-size:13px;padding:0">عرض قناتك</a></div>` : ""}</div>
      </div>
      ${(r.has_channel || r.is_admin) ? `<a href="studio.html">${icon("studio")}استوديو تِبيان</a>` : ""}
      <a href="account.html">${icon("user")}حسابي${r.has_channel ? "" : " وطلب قناة"}</a>
      <a href="library.html">${icon("library")}مكتبتي</a>
      ${(r.is_volunteer || r.is_admin) ? `<a href="review.html">${icon("shield")}مراجعة التلاوات</a>` : ""}
      ${r.is_admin ? `<a href="admin.html">${icon("settings")}لوحة الإدارة</a>` : ""}
      <hr>
      <button class="menu-item" type="button" id="menu-theme">${icon(currentTheme() === "dark" ? "sun" : "moon")}المظهر: ${currentTheme() === "dark" ? "داكن" : "فاتح"}</button>
      <button class="menu-item" type="button" id="menu-logout">${icon("logout")}تسجيل الخروج</button>`;
    document.body.appendChild(menu);
    menu.addEventListener("click", e => e.stopPropagation());
    menu.querySelector("#menu-theme").addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
      menu.remove();
    });
    menu.querySelector("#menu-logout").addEventListener("click", async () => {
      await client.auth.signOut();
      location.href = "index.html";
    });
  }

  async function loadShellUser() {
    const roles = await getMyRoles();
    state.roles = roles;
    state.user = roles.user || null;
    if (!state.user || roles.setupMissing) return;

    const [mine, subs] = await Promise.all([
      client.from("channels").select("id,user_id,channel_name,description,avatar_url,banner_url,handle,status")
        .eq("user_id", state.user.id).order("created_at").limit(1),
      client.from("subscriptions").select("channel_id,created_at").eq("user_id", state.user.id)
    ]);

    const myChannel = mine.data && mine.data[0] ? mine.data[0] : null;
    let subChannels = [];
    if (subs.data && subs.data.length) {
      const { data } = await client.from("channels")
        .select("id,user_id,channel_name,avatar_url,handle,status")
        .in("id", subs.data.map(s => s.channel_id)).eq("status", "approved");
      subChannels = data || [];
    }
    const images = await resolveImages([myChannel && myChannel.avatar_url, ...subChannels.map(c => c.avatar_url)]);
    if (myChannel) myChannel.avatar = images.get(myChannel.avatar_url) || "";
    subChannels.forEach(c => { c.avatar = images.get(c.avatar_url) || ""; });
    subChannels.sort((a, b) => a.channel_name.localeCompare(b.channel_name, "ar"));

    state.myChannel = myChannel;
    state.subs = subChannels;
  }

  async function mountShell(opts = {}) {
    const active = opts.active || "";
    const head = document.getElementById("masthead");
    if (opts.overlayGuide) document.body.classList.add("guide-overlay");
    else if (localStorage.getItem("tibyan-guide-mini") === "1") document.body.classList.add("guide-mini");

    const params = new URLSearchParams(location.search);
    head.innerHTML = `
      <div class="mast-start">
        <button class="icon-btn" id="guide-toggle" type="button" aria-label="القائمة الجانبية">${icon("menu")}</button>
        <a class="logo" href="index.html" aria-label="تِبيان — الرئيسية">
          <span class="logo-mark">ت</span>
          <span class="logo-text">تِبيان<small>منصة القرآن الكريم</small></span>
        </a>
      </div>
      <form class="search" id="search-form" role="search" action="results.html">
        <input name="q" id="search-q" type="search" placeholder="ابحث عن سورة أو قارئ أو قناة" autocomplete="off" aria-label="بحث" value="${esc(active === "results" ? params.get("q") || "" : "")}">
        <button type="submit" aria-label="بحث">${icon("search")}</button>
      </form>
      <div class="mast-end">
        <button class="icon-btn mobile-search-btn" id="mobile-search" type="button" aria-label="بحث">${icon("search")}</button>
        <span id="mast-user"></span>
      </div>`;

    if (!document.querySelector(".guide-scrim")) {
      const scrim = document.createElement("div");
      scrim.className = "guide-scrim";
      document.body.appendChild(scrim);
      scrim.addEventListener("click", () => document.body.classList.remove("guide-open"));
    }

    document.getElementById("guide-toggle").addEventListener("click", () => {
      const overlay = document.body.classList.contains("guide-overlay") || window.innerWidth <= 1000;
      if (overlay) document.body.classList.toggle("guide-open");
      else {
        const mini = document.body.classList.toggle("guide-mini");
        localStorage.setItem("tibyan-guide-mini", mini ? "1" : "0");
      }
    });
    document.getElementById("search-form").addEventListener("submit", e => {
      const q = document.getElementById("search-q").value.trim();
      if (!q) e.preventDefault();
    });
    document.getElementById("mobile-search").addEventListener("click", () => {
      head.classList.toggle("searching");
      if (head.classList.contains("searching")) document.getElementById("search-q").focus();
    });
    document.addEventListener("click", () => {
      const m = document.getElementById("user-menu");
      if (m) m.remove();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        const m = document.getElementById("user-menu");
        if (m) m.remove();
        document.body.classList.remove("guide-open");
        head.classList.remove("searching");
      }
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        document.getElementById("search-q").focus();
      }
    });

    renderGuide(active);
    renderUserArea();

    if (!client) return state;
    try {
      await loadShellUser();
    } catch (e) {
      console.warn("shell user error", e);
    }
    renderGuide(active);
    renderUserArea();
    return state;
  }

  /* ---------------- نافذة الحفظ في قائمة ---------------- */
  function modal(html) {
    const scrim = document.createElement("div");
    scrim.className = "modal-scrim";
    scrim.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(scrim);
    const close = () => scrim.remove();
    scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
    });
    const closeBtn = scrim.querySelector("[data-close]");
    if (closeBtn) closeBtn.addEventListener("click", close);
    return { root: scrim.firstElementChild, close };
  }

  async function openSaveDialog(video) {
    const user = await getUser();
    if (!user) return goLogin("سجّل الدخول لحفظ التلاوات في قوائمك.");

    const [pls, later] = await Promise.all([
      client.from("playlists").select("id,title,is_public").eq("user_id", user.id).order("created_at"),
      client.from("watch_later").select("video_id").eq("user_id", user.id).eq("video_id", video.id)
    ]);
    const playlists = pls.data || [];
    let inPlaylists = new Set();
    if (playlists.length) {
      const { data } = await client.from("playlist_items").select("playlist_id")
        .eq("video_id", video.id).in("playlist_id", playlists.map(p => p.id));
      inPlaylists = new Set((data || []).map(r => String(r.playlist_id)));
    }

    const m = modal(`
      <h2>حفظ في… <button class="icon-btn" data-close type="button" aria-label="إغلاق">${icon("close")}</button></h2>
      <label class="check"><input type="checkbox" data-later ${later.data && later.data.length ? "checked" : ""}> ${icon("clock", "sm")} الاستماع لاحقًا</label>
      <div id="pl-checks">${playlists.map(p => `
        <label class="check"><input type="checkbox" data-pl="${esc(p.id)}" ${inPlaylists.has(String(p.id)) ? "checked" : ""}>
        ${icon("playlist", "sm")} ${esc(p.title)} <span class="muted" style="font-size:12px">${p.is_public ? "عامة" : "خاصة"}</span></label>`).join("")}</div>
      <hr style="border:0;border-top:1px solid var(--line);margin:10px 0">
      <form id="new-pl">
        <input class="input" id="new-pl-title" maxlength="120" placeholder="اسم قائمة تشغيل جديدة">
        <label class="check" style="font-size:13px"><input type="checkbox" id="new-pl-public"> قائمة عامة يراها الجميع</label>
        <div class="row"><button class="btn brand" type="submit">${icon("plus")}إنشاء وإضافة</button></div>
      </form>`);

    m.root.querySelector("[data-later]").addEventListener("change", async e => {
      const q = e.target.checked
        ? client.from("watch_later").insert({ user_id: user.id, video_id: video.id })
        : client.from("watch_later").delete().eq("user_id", user.id).eq("video_id", video.id);
      const { error } = await q;
      if (error) { toast(friendlyError(error)); e.target.checked = !e.target.checked; return; }
      toast(e.target.checked ? "أُضيفت إلى «الاستماع لاحقًا»" : "أُزيلت من «الاستماع لاحقًا»");
    });

    m.root.querySelector("#pl-checks").addEventListener("change", async e => {
      const id = e.target.dataset.pl;
      if (!id) return;
      const q = e.target.checked
        ? client.from("playlist_items").insert({ playlist_id: Number(id) || id, video_id: video.id, position: Math.floor(Date.now() / 1000) })
        : client.from("playlist_items").delete().eq("playlist_id", id).eq("video_id", video.id);
      const { error } = await q;
      if (error) { toast(friendlyError(error)); e.target.checked = !e.target.checked; return; }
      toast(e.target.checked ? "أُضيفت إلى القائمة" : "أُزيلت من القائمة");
    });

    m.root.querySelector("#new-pl").addEventListener("submit", async e => {
      e.preventDefault();
      const title = m.root.querySelector("#new-pl-title").value.trim();
      if (!title) return;
      const { data, error } = await client.from("playlists")
        .insert({ user_id: user.id, title, is_public: m.root.querySelector("#new-pl-public").checked })
        .select("id").single();
      if (error) { toast(friendlyError(error)); return; }
      await client.from("playlist_items").insert({ playlist_id: data.id, video_id: video.id, position: Math.floor(Date.now() / 1000) });
      toast("أُنشئت القائمة وأُضيفت التلاوة");
      m.close();
    });
  }

  async function share(title, url) {
    url = url || location.href;
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("نُسخ الرابط");
    } catch (e) {
      if (e && e.name !== "AbortError") prompt("انسخ الرابط:", url);
    }
  }

  function randomAyah() {
    return AYAT[Math.floor(Date.now() / 86400000) % AYAT.length];
  }

  window.Tibyan = {
    client, BUCKET, CATEGORIES, STATUS_LABELS, VIDEO_COLUMNS, state,
    icon, escapeHTML, esc, normalizeText, truncate, formatDate, timeAgo, formatCount, formatViews, formatSubs,
    formatDuration, categoryLabel, categoryArt, fillCategorySelect, sanitizeSearch,
    isHttpUrl, getYouTubeId, storagePath, signedUrls, signedUrl, resolveImages, resolveThumbnails,
    cleanFileName, uploadFile, removeFile, isAudioPath, readMediaDuration,
    fetchVideos, fetchPublishedVideos, channelsByUser, channelStats, channelUrl, watchUrl,
    getUser, getMyRoles, friendlyError, loginUrl, goLogin,
    toast, avatarHTML, artHTML, thumbInner, cardHTML, buildContext, emptyHTML, skeletonHTML, renderVideos,
    setTheme, currentTheme, mountShell, modal, openSaveDialog, share, randomAyah, VERIFIED
  };
})();
