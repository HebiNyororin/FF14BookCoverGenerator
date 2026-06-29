// FF14 Book Cover Card Generator - app.js

// --- Data Definitions ---
const dcData = {
  "Mana": ["Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandaemonium", "Titan"],
  "Gaia": ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
  "Elemental": ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
  "Meteor": ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"]
};

const jobs = [
  { id: "pld", name: "Paladin",    abbr: "PLD", category: "TANK" },
  { id: "war", name: "Warrior",    abbr: "WAR", category: "TANK" },
  { id: "drk", name: "Dark Knight",abbr: "DRK", category: "TANK" },
  { id: "gnb", name: "Gunbreaker", abbr: "GNB", category: "TANK" },

  { id: "drg", name: "Dragoon",    abbr: "DRG", category: "MELEE DPS" },
  { id: "rpr", name: "Reaper",     abbr: "RPR", category: "MELEE DPS" },
  { id: "mnk", name: "Monk",       abbr: "MNK", category: "MELEE DPS" },
  { id: "sam", name: "Samurai",    abbr: "SAM", category: "MELEE DPS" },
  { id: "nin", name: "Ninja",      abbr: "NIN", category: "MELEE DPS" },
  { id: "vpr", name: "Viper",      abbr: "VPR", category: "MELEE DPS" },

  { id: "brd", name: "Bard",       abbr: "BRD", category: "PHYSICAL RANGED" },
  { id: "mch", name: "Machinist",  abbr: "MCH", category: "PHYSICAL RANGED" },
  { id: "dnc", name: "Dancer",     abbr: "DNC", category: "PHYSICAL RANGED" },

  { id: "blm", name: "Black Mage", abbr: "BLM", category: "MAGICAL RANGED" },
  { id: "smn", name: "Summoner",   abbr: "SMN", category: "MAGICAL RANGED" },
  { id: "rdm", name: "Red Mage",   abbr: "RDM", category: "MAGICAL RANGED" },
  { id: "pct", name: "Pictomancer",abbr: "PCT", category: "MAGICAL RANGED" },

  { id: "whm", name: "White Mage", abbr: "WHM", category: "HEALER" },
  { id: "sch", name: "Scholar",    abbr: "SCH", category: "HEALER" },
  { id: "ast", name: "Astrologian",abbr: "AST", category: "HEALER" },
  { id: "sge", name: "Sage",       abbr: "SGE", category: "HEALER" }
];

const playstyles = [
  { id: "main-scenario", name: "メインシナリオ" },
  { id: "dungeons",      name: "ダンジョン" },
  { id: "extreme",       name: "極" },
  { id: "savage",        name: "零式" },
  { id: "ultimate",      name: "絶" },
  { id: "casual",        name: "カジュアル" },
  { id: "gpose",         name: "GPose/SS" },
  { id: "housing",       name: "ハウジング" },
  { id: "glamour",       name: "おしゃれ/ミラプリ" },
  { id: "gather-craft",  name: "ギャザクラ" },
  { id: "gold-saucer",   name: "ゴールドソーサー" },
  { id: "roleplay",      name: "ロールプレイ" },
  { id: "chatting",      name: "おしゃべり" },
  { id: "pvp",           name: "PvP" }
];

// Design presets
const presets = {
  literary: {
    coverBg:     "#f5ede0",
    obiBg:       "#ffffff",
    titleColor:  "#1a1a2e",
    obiText:     "#1a1a2e",
    accent:      "#8b4513",
    catchcopy:   "#c0392b"
  },
  dark: {
    coverBg:     "#0d0d1a",
    obiBg:       "#1a1a2e",
    titleColor:  "#e8e0d0",
    obiText:     "#e8e0d0",
    accent:      "#8b7355",
    catchcopy:   "#c9a84c"
  },
  elegant: {
    coverBg:     "#1a1a2e",
    obiBg:       "#f0eef5",
    titleColor:  "#f0eef5",
    obiText:     "#2d2040",
    accent:      "#7b5ea7",
    catchcopy:   "#7b5ea7"
  },
  fantasy: {
    coverBg:     "#0a1628",
    obiBg:       "#e8f4f8",
    titleColor:  "#c9e8f5",
    obiText:     "#0a1628",
    accent:      "#2980b9",
    catchcopy:   "#1a6fa5"
  },
  minimal: {
    coverBg:     "#f9f9f7",
    obiBg:       "#f0f0ef",
    titleColor:  "#111111",
    obiText:     "#111111",
    accent:      "#555555",
    catchcopy:   "#111111"
  }
};

// --- State ---
let selectedJobs = [];
let mainJobId = null;
let selectedPlaystyles = [];

let imageState = {
  src: "",
  scale: 1.0,
  x: 0,
  y: 0,
  isDragging: false,
  startX: 0,
  startY: 0
};

// --- DOM Elements ---
const selectDc        = document.getElementById("select-dc");
const selectWorld     = document.getElementById("select-world");
const inputName       = document.getElementById("input-name");
const inputSubtitle   = document.getElementById("input-subtitle");
const inputAuthorLabel = document.getElementById("input-author-label");
const inputCatchcopy  = document.getElementById("input-catchcopy");
const inputCatchcopy2 = document.getElementById("input-catchcopy2");
const inputBlurb      = document.getElementById("input-blurb");

const cardDcWorld     = document.getElementById("card-dc-world");
const cardTitleMain   = document.getElementById("card-title-main");
const cardTitleSub    = document.getElementById("card-title-sub");
const cardAuthorLabel = document.getElementById("card-author-label");
const cardCatchcopy   = document.getElementById("card-catchcopy");
const cardCatchcopy2  = document.getElementById("card-catchcopy2");
const cardBlurb       = document.getElementById("card-blurb");
const cardJobsObi     = document.getElementById("card-jobs-obi");
const cardPlaystylesObi = document.getElementById("card-playstyles-obi");
const cardTimeObi     = document.getElementById("card-time-obi");

const jobsContainer         = document.getElementById("jobs-container");
const playstylesContainer   = document.getElementById("playstyles-container");

const inputTimeStart  = document.getElementById("input-time-start");
const inputTimeEnd    = document.getElementById("input-time-end");

const colorCoverBg    = document.getElementById("color-cover-bg");
const colorObiBg      = document.getElementById("color-obi-bg");
const colorTitle      = document.getElementById("color-title");
const colorObiText    = document.getElementById("color-obi-text");
const colorAccent     = document.getElementById("color-accent");
const colorCatchcopy  = document.getElementById("color-catchcopy");

const inputImage      = document.getElementById("input-image");
const cardImage       = document.getElementById("card-image");
const cardImageContainer = document.getElementById("card-image-container");
const imagePlaceholder   = document.getElementById("image-placeholder");
const sliderZoom      = document.getElementById("slider-zoom");
const sliderTitleSize = document.getElementById("slider-title-size");
const titleSizeVal    = document.getElementById("title-size-val");
const sliderObiHeight = document.getElementById("slider-obi-height");
const obiHeightVal    = document.getElementById("obi-height-val");
const sliderCatchcopySize = document.getElementById("slider-catchcopy-size");
const catchcopySizeVal    = document.getElementById("catchcopy-size-val");
const toggleShadow    = document.getElementById("toggle-shadow");
const toggleTextShadow = document.getElementById("toggle-text-shadow");
const toggleBorder    = document.getElementById("toggle-border");

const btnDownload     = document.getElementById("btn-download");
const btnShareX       = document.getElementById("btn-share-x");
const shareModal      = document.getElementById("share-modal");
const modalBtnOpenX   = document.getElementById("modal-btn-open-x");
const modalBtnClose   = document.getElementById("modal-btn-close");
const bookComposition = document.getElementById("book-composition");
const bookCover       = document.getElementById("book-cover");
const coverTitleBlock = document.getElementById("cover-title-block");

// --- Initialization ---
function initSelectors() {
  // DC
  selectDc.innerHTML = "";
  Object.keys(dcData).forEach(dc => {
    const opt = document.createElement("option");
    opt.value = dc; opt.textContent = dc;
    selectDc.appendChild(opt);
  });
  updateWorldOptions(selectDc.value);

  // Time
  for (let h = 0; h < 24; h++) {
    const label = String(h).padStart(2, '0') + ':00';
    const optS = document.createElement('option'); optS.value = h; optS.textContent = label;
    const optE = document.createElement('option'); optE.value = h; optE.textContent = label;
    inputTimeStart.appendChild(optS);
    inputTimeEnd.appendChild(optE);
  }
  inputTimeStart.value = 20;
  inputTimeEnd.value = 0;
  updateCardTimeDisplay();
}

function updateWorldOptions(dc) {
  selectWorld.innerHTML = "";
  (dcData[dc] || []).forEach(world => {
    const opt = document.createElement("option");
    opt.value = world; opt.textContent = world;
    selectWorld.appendChild(opt);
  });
  updateCardDcWorld();
}

function updateCardDcWorld() {
  cardDcWorld.textContent = `${selectDc.value} / ${selectWorld.value}`;
}

function updateCardTimeDisplay() {
  const s = String(inputTimeStart.value).padStart(2, '0') + ':00';
  const e = String(inputTimeEnd.value).padStart(2, '0') + ':00';
  cardTimeObi.textContent = `活動 ${s}〜${e}`;
}

function initJobsSelector() {
  const categories = {};
  jobs.forEach(job => {
    if (!categories[job.category]) categories[job.category] = [];
    categories[job.category].push(job);
  });

  jobsContainer.innerHTML = "";
  Object.keys(categories).forEach(catName => {
    const catTitle = document.createElement("div");
    catTitle.className = "job-category-title";
    catTitle.textContent = catName;
    jobsContainer.appendChild(catTitle);

    const grid = document.createElement("div");
    grid.className = "jobs-grid";
    categories[catName].forEach(job => {
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = `job-check-${job.id}`; cb.value = job.id;
      const lbl = document.createElement("label");
      lbl.htmlFor = `job-check-${job.id}`; lbl.className = "job-label";
      lbl.innerHTML = `
        <div class="job-icon-placeholder"><img src="icons/${job.id}.png" alt="${job.id}" width="28" height="28" style="display:block"></div>
        <div class="job-name">${job.abbr}</div>
      `;
      cb.addEventListener("change", (e) => handleJobSelection(job.id, e.target.checked));
      grid.appendChild(cb); grid.appendChild(lbl);
    });
    jobsContainer.appendChild(grid);
  });
}

function initPlaystylesSelector() {
  playstylesContainer.innerHTML = "";
  playstyles.forEach(style => {
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.id = `playstyle-check-${style.id}`; cb.value = style.id;
    const lbl = document.createElement("label");
    lbl.htmlFor = `playstyle-check-${style.id}`; lbl.className = "playstyle-label";
    lbl.textContent = style.name;
    cb.addEventListener("change", (e) => handlePlaystyleSelection(style.id, e.target.checked));
    playstylesContainer.appendChild(cb); playstylesContainer.appendChild(lbl);
  });
}

// --- Text Inputs ---
inputName.addEventListener("input", e => { cardTitleMain.textContent = e.target.value || "Warrior of Light"; });
inputAuthorLabel.addEventListener("input", e => { cardAuthorLabel.textContent = e.target.value; });
inputCatchcopy.addEventListener("input", e => { cardCatchcopy.textContent = e.target.value || "誰かのために"; });
inputCatchcopy2.addEventListener("input", e => { cardCatchcopy2.textContent = e.target.value; });
inputBlurb.addEventListener("input", e => { cardBlurb.textContent = e.target.value; });

selectDc.addEventListener("change", e => updateWorldOptions(e.target.value));
selectWorld.addEventListener("change", updateCardDcWorld);
inputTimeStart.addEventListener("change", updateCardTimeDisplay);
inputTimeEnd.addEventListener("change", updateCardTimeDisplay);

// --- Colors ---
function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : "0,0,0";
}

function updateColors() {
  const root = document.documentElement;
  root.style.setProperty('--cover-bg', colorCoverBg.value);
  root.style.setProperty('--obi-bg', colorObiBg.value);
  root.style.setProperty('--title-color', colorTitle.value);
  root.style.setProperty('--obi-text-color', colorObiText.value);
  root.style.setProperty('--accent-color', colorAccent.value);
  root.style.setProperty('--catchcopy-color', colorCatchcopy.value);
}

colorCoverBg.addEventListener("input", updateColors);
colorObiBg.addEventListener("input", updateColors);
colorTitle.addEventListener("input", updateColors);
colorObiText.addEventListener("input", updateColors);
colorAccent.addEventListener("input", updateColors);
colorCatchcopy.addEventListener("input", updateColors);

// --- Design Presets ---
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyPreset(btn.dataset.preset);
  });
});

function applyPreset(name) {
  const p = presets[name];
  if (!p) return;
  colorCoverBg.value   = p.coverBg;
  colorObiBg.value     = p.obiBg;
  colorTitle.value     = p.titleColor;
  colorObiText.value   = p.obiText;
  colorAccent.value    = p.accent;
  colorCatchcopy.value = p.catchcopy;
  updateColors();
}

// --- Title Size Slider ---
sliderTitleSize.addEventListener("input", e => {
  const val = e.target.value;
  titleSizeVal.textContent = val;
  document.documentElement.style.setProperty('--title-size', `${val}px`);
});

// --- Obi Height Slider ---
sliderObiHeight.addEventListener("input", e => {
  const val = e.target.value;
  obiHeightVal.textContent = val;
  document.documentElement.style.setProperty('--obi-height', `${val}%`);
});

// --- Catchcopy Size Slider ---
sliderCatchcopySize.addEventListener("input", e => {
  const val = e.target.value;
  catchcopySizeVal.textContent = val;
  document.documentElement.style.setProperty('--catchcopy-size', `${val}px`);
});

// --- Writing Mode ---
document.querySelectorAll('input[name="writing-mode"]').forEach(radio => {
  radio.addEventListener("change", e => {
    if (e.target.value === "vertical") {
      coverTitleBlock.classList.add("is-vertical");
    } else {
      coverTitleBlock.classList.remove("is-vertical");
    }
  });
});
// Default: vertical
coverTitleBlock.classList.add("is-vertical");

// --- Title Position (3x3 Grid) ---
document.querySelectorAll(".grid-pos-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".grid-pos-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    // Remove existing pos-* classes
    coverTitleBlock.className = coverTitleBlock.className.replace(/\bpos-[\w-]+\b/g, "").trim();
    // Add new position
    const pos = btn.dataset.pos;
    coverTitleBlock.classList.add(`pos-${pos}`);
  });
});
coverTitleBlock.classList.add("pos-top-right");


// --- Shadow Toggles ---
toggleShadow.addEventListener("change", e => {
  bookComposition.classList.toggle("show-shadow", e.target.checked);
});
toggleTextShadow.addEventListener("change", e => {
  bookComposition.classList.toggle("show-text-shadow", e.target.checked);
});
if (toggleTextShadow.checked) bookComposition.classList.add("show-text-shadow");

// --- Border Toggle ---
toggleBorder.addEventListener("change", e => {
  bookCover.classList.toggle("has-border", e.target.checked);
});
if (toggleBorder.checked) bookCover.classList.add("has-border");

// --- Fonts ---
document.querySelectorAll('input[name="font"]').forEach(radio => {
  radio.addEventListener("change", e => {
    bookComposition.className = bookComposition.className.replace(/\bfont-[\w-]+/g, "").trim();
    if (e.target.value) bookComposition.classList.add(e.target.value);
  });
});

// --- Jobs ---
function handleJobSelection(jobId, isChecked) {
  if (isChecked) {
    if (!selectedJobs.includes(jobId)) selectedJobs.push(jobId);
    if (!mainJobId) mainJobId = jobId;
  } else {
    selectedJobs = selectedJobs.filter(id => id !== jobId);
    if (mainJobId === jobId) mainJobId = selectedJobs.length > 0 ? selectedJobs[0] : null;
  }
  updateObiJobsPreview();
}

function updateObiJobsPreview() {
  cardJobsObi.innerHTML = "";
  const ordered = [...selectedJobs].sort((a, b) => a === mainJobId ? -1 : b === mainJobId ? 1 : 0);
  ordered.forEach(jobId => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const badge = document.createElement("div");
    badge.className = `obi-job-badge ${jobId === mainJobId ? 'is-main' : ''}`;
    badge.title = "クリックでメインジョブに設定";
    badge.style.cursor = "pointer";
    badge.innerHTML = `${jobId === mainJobId ? '★ ' : ''}<img src="icons/${job.id}.png" width="12" height="12" alt="${job.id}"><span>${job.abbr}</span>`;
    badge.addEventListener("click", () => {
      mainJobId = jobId;
      updateObiJobsPreview();
    });
    cardJobsObi.appendChild(badge);
  });
}

// --- Playstyles ---
function handlePlaystyleSelection(styleId, isChecked) {
  if (isChecked && !selectedPlaystyles.includes(styleId)) selectedPlaystyles.push(styleId);
  else if (!isChecked) selectedPlaystyles = selectedPlaystyles.filter(id => id !== styleId);
  updateObiPlaystylesPreview();
}

function updateObiPlaystylesPreview() {
  cardPlaystylesObi.innerHTML = "";
  selectedPlaystyles.forEach(styleId => {
    const style = playstyles.find(p => p.id === styleId);
    if (!style) return;
    const badge = document.createElement("div");
    badge.className = "obi-playstyle-badge";
    badge.textContent = style.name;
    cardPlaystylesObi.appendChild(badge);
  });
}

// --- Image Handling ---
function applyImageTransform() {
  cardImage.style.transform = `translate(${imageState.x}px, ${imageState.y}px) scale(${imageState.scale})`;
}

inputImage.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    imageState.src = event.target.result;
    cardImage.src = event.target.result;
    cardImage.style.display = "block";
    imagePlaceholder.style.display = "none";
    cardImage.onload = () => resetImagePosition();
  };
  reader.readAsDataURL(file);
});

function resetImagePosition() {
  const cw = cardImageContainer.clientWidth;
  const ch = cardImageContainer.clientHeight;
  const iw = cardImage.naturalWidth;
  const ih = cardImage.naturalHeight;
  const scaleX = cw / iw;
  const scaleY = ch / ih;
  const s = Math.max(scaleX, scaleY);
  imageState.scale = Math.round(s * 10) / 10;
  imageState.x = (cw - iw * imageState.scale) / 2;
  imageState.y = (ch - ih * imageState.scale) / 2;
  sliderZoom.value = imageState.scale;
  applyImageTransform();
}

sliderZoom.addEventListener("input", e => {
  if (!imageState.src) return;
  imageState.scale = parseFloat(e.target.value);
  applyImageTransform();
});

// Drag
function startDrag(e) {
  if (!imageState.src) return;
  e.preventDefault();
  imageState.isDragging = true;
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  imageState.startX = cx - imageState.x;
  imageState.startY = cy - imageState.y;
}
function doDrag(e) {
  if (!imageState.isDragging) return;
  e.preventDefault();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  imageState.x = cx - imageState.startX;
  imageState.y = cy - imageState.startY;
  applyImageTransform();
}
function endDrag() { imageState.isDragging = false; }

cardImageContainer.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", doDrag);
window.addEventListener("mouseup", endDrag);
cardImageContainer.addEventListener("touchstart", startDrag, { passive: false });
window.addEventListener("touchmove", doDrag, { passive: false });
window.addEventListener("touchend", endDrag);

cardImageContainer.addEventListener("wheel", e => {
  if (!imageState.src) return;
  e.preventDefault();
  const step = 0.05;
  if (e.deltaY < 0) imageState.scale = Math.min(imageState.scale + step, 3.0);
  else imageState.scale = Math.max(imageState.scale - step, 0.1);
  sliderZoom.value = imageState.scale;
  applyImageTransform();
}, { passive: false });

// --- Export ---
btnDownload.addEventListener("click", async () => {
  const origText = btnDownload.innerHTML;
  btnDownload.disabled = true;
  btnDownload.textContent = "生成中...";

  const isMobile = window.innerWidth <= 1000 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let newTab = null;
  if (isMobile) {
    newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(`
        <html><head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>生成中...</title>
        </head><body style="background:#111; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0;">
          <h3>画像を生成中... しばらくお待ちください</h3>
        </body></html>
      `);
    }
  }

  const scaleWrapper = document.querySelector('.preview-scale-wrapper');
  const origTransform = scaleWrapper ? scaleWrapper.style.transform : '';
  if (scaleWrapper) scaleWrapper.style.transform = 'none';

  try { await document.fonts.ready; } catch(e) {}

  modernScreenshot.domToPng(bookComposition, {
    scale: 2,
    width: 600,
    height: 900
  }).then(dataUrl => {
    if (scaleWrapper) scaleWrapper.style.transform = origTransform;
    const charName = inputName.value.trim() || "ff14-character";
    if (isMobile && newTab) {
      newTab.document.body.innerHTML = `
        <style>
          body { margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; background:#111; color:#fff; font-family:sans-serif; text-align:center; }
          img { max-width:95vw; max-height:80vh; border-radius:4px; box-shadow:0 10px 30px rgba(0,0,0,0.8); object-fit:contain; }
          p { padding:15px; margin:0 0 15px 0; font-size:15px; font-weight:bold; width:100%; box-sizing:border-box; background:rgba(255,255,255,0.8); color:#111; }
        </style>
        <p>👇 画像を長押しして「写真に追加」または「保存」を選択してください 👇</p>
        <img src="${dataUrl}" alt="Book Cover Card">
      `;
      newTab.document.title = "カードを保存";
    } else {
      const link = document.createElement("a");
      link.download = `${charName}_book_cover.png`;
      link.href = dataUrl;
      link.click();
    }
    btnDownload.disabled = false;
    btnDownload.innerHTML = origText;
  }).catch(err => {
    if (scaleWrapper) scaleWrapper.style.transform = origTransform;
    console.error("Failed to generate image:", err);
    if (newTab) newTab.close();
    alert("生成に失敗しました。再試行してください。");
    btnDownload.disabled = false;
    btnDownload.innerHTML = origText;
  });
});

// --- Fluid Scale ---
function updateFluidScale() {
  const isMobile = window.innerWidth <= 1000;
  let scale;
  if (isMobile) {
    scale = (window.innerWidth - 50) / 600;
  } else {
    scale = (window.innerWidth - 450) / 600;
  }
  scale = Math.min(1, Math.max(0.2, scale));
  document.documentElement.style.setProperty('--preview-scale', scale);
}
window.addEventListener("resize", updateFluidScale);

// --- Share to X (Twitter) ---
if (btnShareX) {
  // Modal buttons
  if (modalBtnClose) {
    modalBtnClose.addEventListener("click", () => {
      shareModal.style.display = "none";
    });
  }
  if (modalBtnOpenX) {
    modalBtnOpenX.addEventListener("click", () => {
      const shareText = "「FF14BookCoverGenerator」で本の表紙風キャラクターカードを作成しました！\n";
      const hashtags = "FF14BookCoverGenerator,FF14キャラクターカード";
      const pageUrl = "https://hebinyororin.github.io/FF14BookCoverGenerator/";
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
      window.open(shareUrl, "_blank");
      shareModal.style.display = "none"; // Close modal after opening X
    });
  }

  btnShareX.addEventListener("click", () => {
    const origText = btnShareX.innerHTML;
    btnShareX.disabled = true;
    btnShareX.innerHTML = "画像コピー中...";

    const scaleWrapper = bookComposition.querySelector(".card-scale-wrapper");
    const origTransform = scaleWrapper ? scaleWrapper.style.transform : "";
    if (scaleWrapper) scaleWrapper.style.transform = "none";

    window.modernScreenshot.domToBlob(bookComposition, {
      width: 600,
      height: 900,
      style: {
        transform: "none",
        margin: "0",
        padding: "0"
      }
    }).then(blob => {
      if (scaleWrapper) scaleWrapper.style.transform = origTransform;

      // Copy image to clipboard so user can simply paste it on X
      navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]).then(() => {
        // Show modal overlays (contains user instructions) instead of alert dialog
        shareModal.style.display = "flex";
      }).catch(err => {
        console.error("Clipboard copy failed:", err);
        shareModal.style.display = "flex";
      });
    }).catch(err => {
      if (scaleWrapper) scaleWrapper.style.transform = origTransform;
      console.error("Failed to generate image for share:", err);
      shareModal.style.display = "flex";
    }).finally(() => {
      btnShareX.disabled = false;
      btnShareX.innerHTML = origText;
    });
  });
}

// --- Init ---
window.addEventListener("DOMContentLoaded", () => {
  initSelectors();
  initJobsSelector();
  initPlaystylesSelector();
  updateColors();
  updateFluidScale();
  // Apply default preset
  applyPreset("literary");
  initMobileActionsBar();
});

// --- Mobile Actions Bar ---
function initMobileActionsBar() {
  const mobileBar = document.getElementById("mobile-actions-bar");
  const btnDownloadMobile = document.getElementById("btn-download-mobile");
  const btnShareXMobile = document.getElementById("btn-share-x-mobile");
  const btnDownload = document.getElementById("btn-download");
  const btnShareX = document.getElementById("btn-share-x");
  if (!mobileBar) return;

  // Show/hide the mobile bar based on screen width
  function updateMobileBarVisibility() {
    if (window.innerWidth <= 1000) {
      mobileBar.style.display = "flex";
    } else {
      mobileBar.style.display = "none";
    }
  }
  updateMobileBarVisibility();
  window.addEventListener("resize", updateMobileBarVisibility);

  // Wire mobile download button to the same handler as desktop
  if (btnDownloadMobile && btnDownload) {
    btnDownloadMobile.addEventListener("click", () => {
      btnDownload.click();
    });
  }

  // Wire mobile share button to the same handler as desktop
  if (btnShareXMobile && btnShareX) {
    btnShareXMobile.addEventListener("click", () => {
      btnShareX.click();
    });
  }
}
