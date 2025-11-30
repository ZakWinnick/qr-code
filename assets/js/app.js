const state = { activeTab: 'url', qrData: '', logo: null, logoSize: 25 };
const $ = id => document.getElementById(id);
const tabs = document.querySelectorAll('.tab');
const canvas = $('qrCanvas');
const ctx = canvas.getContext('2d');

const titles = { url: 'Enter URL', text: 'Enter Text', contact: 'Contact Information' };

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const tabId = tab.dataset.tab;
    $(tabId + 'Tab').classList.add('active');
    state.activeTab = tabId;
    $('sectionTitle').textContent = titles[tabId];
    generateQR();
  });
});

const inputs = ['urlInput', 'textInput', 'firstName', 'lastName', 'phone', 'email', 'organization', 'contactUrl'];
inputs.forEach(id => $(id).addEventListener('input', generateQR));

$('uploadArea').addEventListener('click', () => $('fileInput').click());
$('uploadArea').addEventListener('dragover', e => e.preventDefault());
$('uploadArea').addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
});
$('fileInput').addEventListener('change', e => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(file) {
  if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    state.logo = e.target.result;
    $('logoImg').src = state.logo;
    $('uploadArea').classList.add('hidden');
    $('logoPreview').classList.remove('hidden');
    $('sliderContainer').classList.remove('hidden');
    generateQR();
  };
  reader.readAsDataURL(file);
}

$('removeLogo').addEventListener('click', () => {
  state.logo = null;
  $('fileInput').value = '';
  $('uploadArea').classList.remove('hidden');
  $('logoPreview').classList.add('hidden');
  $('sliderContainer').classList.add('hidden');
  generateQR();
});

$('logoSize').addEventListener('input', e => {
  state.logoSize = parseInt(e.target.value);
  $('sizeValue').textContent = state.logoSize + '%';
  generateQR();
});

$('clearBtn').addEventListener('click', () => {
  inputs.forEach(id => $(id).value = '');
  state.logo = null;
  state.qrData = '';
  $('fileInput').value = '';
  $('uploadArea').classList.remove('hidden');
  $('logoPreview').classList.add('hidden');
  $('sliderContainer').classList.add('hidden');
  $('qrPlaceholder').classList.remove('hidden');
  $('qrDisplay').classList.add('hidden');
  $('btnGroup').classList.add('hidden');
  $('dataPreview').classList.add('hidden');
});

$('downloadBtn').addEventListener('click', () => {
  if (!state.qrData) return;
  const link = document.createElement('a');
  link.download = `qr-code-${state.activeTab}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

$('copyBtn').addEventListener('click', async () => {
  if (!state.qrData) return;
  try {
    await navigator.clipboard.writeText(state.qrData);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = state.qrData;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  $('copyText').textContent = 'Copied!';
  setTimeout(() => $('copyText').textContent = 'Copy Data', 2000);
});

function generateQR() {
  let data = '';
  if (state.activeTab === 'url') {
    const url = $('urlInput').value.trim();
    data = url ? (url.startsWith('http') ? url : 'https://' + url) : '';
  } else if (state.activeTab === 'text') {
    data = $('textInput').value;
  } else {
    const fn = $('firstName').value, ln = $('lastName').value, ph = $('phone').value, em = $('email').value, org = $('organization').value, url = $('contactUrl').value;
    if (fn || ln || ph || em) {
      data = `BEGIN:VCARD\nVERSION:3.0\nFN:${fn} ${ln}\nN:${ln};${fn};;;\nORG:${org}\nTEL:${ph}\nEMAIL:${em}\nURL:${url}\nEND:VCARD`;
    }
  }
  state.qrData = data;

  if (!data) {
    $('qrPlaceholder').classList.remove('hidden');
    $('qrDisplay').classList.add('hidden');
    $('btnGroup').classList.add('hidden');
    $('dataPreview').classList.add('hidden');
    return;
  }

  $('qrPlaceholder').classList.add('hidden');
  $('qrDisplay').classList.remove('hidden');
  $('btnGroup').classList.remove('hidden');
  $('dataPreview').classList.remove('hidden');
  $('qrDataText').textContent = data;

  new QRious({ element: canvas, value: data, size: 300, background: 'white', foreground: 'black', level: 'H' });

  if (state.logo) {
    const img = new Image();
    img.onload = () => {
      const size = (300 * state.logoSize) / 100, x = (300 - size) / 2, y = (300 - size) / 2, pad = 8;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.roundRect(x - pad, y - pad, size + pad * 2, size + pad * 2, 8);
      ctx.fill();
      ctx.drawImage(img, x, y, size, size);
    };
    img.src = state.logo;
  }
}