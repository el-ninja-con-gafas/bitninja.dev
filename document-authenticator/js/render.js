const ORGANIZATION_NAME = 'BitNinja Technology';
const ORGANIZATION_DOMAIN = 'bitninja.net';

async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer();
  if (window.crypto?.subtle?.digest) {
    try {
      const hashBuffer =
        await window.crypto.subtle.digest('SHA-256', buffer);

      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      console.warn('WebCrypto failed, falling back to JS SHA-256:', e);
    }
  }

  return sha256(buffer);
}

function sha256(buffer) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const bytes = new Uint8Array(buffer);
  const bitLen = bytes.length * 8;

  const withPadding = new Uint8Array(
    Math.ceil((bytes.length + 9) / 64) * 64
  );
  withPadding.set(bytes);
  withPadding[bytes.length] = 0x80;

  new DataView(withPadding.buffer).setUint32(
    withPadding.length - 4,
    bitLen,
    false
  );

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let i = 0; i < withPadding.length; i += 64) {
    for (let j = 0; j < 16; j++) {
      w[j] =
        (withPadding[i + j * 4] << 24) |
        (withPadding[i + j * 4 + 1] << 16) |
        (withPadding[i + j * 4 + 2] << 8) |
        withPadding[i + j * 4 + 3];
    }

    for (let j = 16; j < 64; j++) {
      const s0 =
        (w[j - 15] >>> 7 | w[j - 15] << 25) ^
        (w[j - 15] >>> 18 | w[j - 15] << 14) ^
        (w[j - 15] >>> 3);
      const s1 =
        (w[j - 2] >>> 17 | w[j - 2] << 15) ^
        (w[j - 2] >>> 19 | w[j - 2] << 13) ^
        (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    let a = h0, b = h1, c = h2, d = h3;
    let e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      const S1 =
        (e >>> 6 | e << 26) ^
        (e >>> 11 | e << 21) ^
        (e >>> 25 | e << 7);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 =
        (a >>> 2 | a << 30) ^
        (a >>> 13 | a << 19) ^
        (a >>> 22 | a << 10);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g; g = f; f = e;
      e = (d + temp1) >>> 0;
      d = c; c = b; b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map(x => x.toString(16).padStart(8, '0'))
    .join('');
}

function clearError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.classList.remove('show');
  }
}

function clearSuccess() {
  const successDiv = document.getElementById('success-message');
  if (successDiv) {
    successDiv.classList.remove('show');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getLandingPageHTML() {
  return `
    <div class="landing-page">
      <div class="container">
        <h1>Document Authentication System</h1>
        <p class="subtitle">Confirm the authenticity and integrity of official documents issued by BitNinja Technology.</p>
      </div>
    </div>

    <div class="container">
      <div class="verification-card">
        <h2>Verify Your Document</h2>
        <p>Select a PDF document from your device to verify its authenticity and confirm it was issued by BitNinja Technology:</p>
        
        <div class="upload-section" id="upload-section">
          <label for="file-input">
            <div class="upload-icon">📄</div>
            <p><strong>Click to select a PDF file</strong> or drag and drop</p>
            <p style="font-size: 12px; color: #999;">Maximum file size: 100 MB</p>
          </label>
          <input type="file" id="file-input" accept=".pdf" />
        </div>

        <div class="progress-bar" id="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>

        <div class="error-message" id="error-message"></div>
        <div class="success-message" id="success-message"></div>

        <div id="verification-result" style="display: none; margin-top: var(--spacing-lg);"></div>
      </div>

      <div class="verification-card">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Upload Document</h3>
            <p>Select a PDF document from your device that you wish to verify.</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Calculate SHA256</h3>
            <p>The system calculates the SHA256 cryptographic hash of your document.</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Verify Authenticity</h3>
            <p>The hash is checked against our database to verify document authenticity.</p>
          </div>
        </div>
      </div>

      <div class="verification-card">
        <h2 class="section-title">Security & Privacy</h2>
        <div class="info-box">
          <h3>How does this work?</h3>
          <p>Your document is processed entirely on your device. The SHA256 hash is calculated locally without uploading the actual document to our servers. This ensures maximum privacy and security.</p>
          <h3>Verification Process</h3>
          <p>When you upload a document, we compute its SHA256 hash. If this hash matches a document in our authentication registry, the document is verified as authentic. Each verified document is stored in our system with its metadata including issue date and document name.</p>
        </div>
      </div>
    </div>
  `;
}

function getNotFoundResultHTML(verificationHash) {
  return `
    <div class="verification-card">
      <h2 style="color: #ef4444;">Document Not Verified ✗</h2>
      <p style="color: #991b1b; margin-bottom: var(--spacing-lg);">This document could not be found in our authentication registry.</p>
      
      <div class="error-message show" style="display: block;">
        <strong>Verification Failed</strong>
        <p>The document with verification ID <code>${escapeHtml(verificationHash)}</code> was not found in our system. This could mean:</p>
        <ul style="margin: var(--spacing-md) 0; padding-left: var(--spacing-lg);">
          <li>The document has not been authenticated by ${escapeHtml(ORGANIZATION_NAME)}</li>
          <li>The SHA256 hash does not match any verified document</li>
          <li>The document may be inauthentic or tampered with</li>
        </ul>
      </div>

      <div class="info-box">
        <h3>What should you do?</h3>
        <ol style="margin: 0; padding-left: var(--spacing-lg);">
          <li>Verify that you are using the correct document file</li>
          <li>Contact ${escapeHtml(ORGANIZATION_NAME)} to confirm document authenticity</li>
          <li>Do not rely on unverified documents for critical purposes</li>
        </ol>
      </div>

      <button class="access-button" onclick="location.reload();">Try Another Document</button>
    </div>
  `;
}

function getVerificationResultHTML(config) {
  return `
    <div class="verification-card">
      <h2>Document Verified ✓</h2>
      <p style="color: #22c55e; font-weight: 600; margin-bottom: var(--spacing-lg);">This document has been authenticated and verified as genuine.</p>
      
      <h3 style="font-size: 16px; color: var(--color-primary); margin: var(--spacing-lg) 0 var(--spacing-md) 0;">Document Details</h3>
      <div class="metadata">
        <div class="metadata-item">
          <span class="metadata-label">Reference Number:</span>
          <span class="metadata-value">${escapeHtml(config.referenceNumber)}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Issue Date:</span>
          <span class="metadata-value">${escapeHtml(config.issueDate)}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Organization:</span>
          <span class="metadata-value">${escapeHtml(config.organization.name)}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Verification ID:</span>
          <span class="metadata-value">${escapeHtml(config.verificationId)}</span>
        </div>
      </div>
  `;
}

async function handleFileSelect(file) {
  clearError();
  clearSuccess();

  if (!file) {
    return;
  }

  if (file.type !== 'application/pdf') {
    showError('Error: Please select a valid PDF file.');
    return;
  }

  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    showError('Error: File size exceeds 100 MB limit.');
    return;
  }

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.classList.add('active');
  }

  try {
    updateProgress(30);
    const sha256Hash = await calculateSHA256(file);
    updateProgress(100);

    setTimeout(() => {
      performVerification(sha256Hash);
      if (progressBar) {
        progressBar.classList.remove('active');
      }
    }, 500);
  } catch (error) {
    console.error('SHA256 calculation error:', error);
    showError('Error: Unable to calculate file hash. Please try again.');
    if (progressBar) {
      progressBar.classList.remove('active');
    }
  }
}

function loadVerificationPage() {
  document.getElementById('page-container').innerHTML = getLandingPageHTML();
  setupLandingPageListeners();
}


async function performVerification(sha256Hash) {
  const resultContainer = document.getElementById('verification-result');
  
  try {
    const configPath = `records/${sha256Hash}/config.json`;
    const response = await fetch(configPath);

    if (!response.ok) {
      resultContainer.innerHTML = getNotFoundResultHTML(sha256Hash);
      resultContainer.style.display = 'block';
      resultContainer.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const config = await response.json();
    resultContainer.innerHTML = getVerificationResultHTML(config);
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading configuration:', error);
    resultContainer.innerHTML = getNotFoundResultHTML(sha256Hash);
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
  }
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.add('show');
  }
}

function setupLandingPageListeners() {
  const uploadSection = document.getElementById('upload-section');
  const fileInput = document.getElementById('file-input');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  if (uploadSection) {
    uploadSection.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadSection.style.borderColor = 'var(--color-primary)';
      uploadSection.style.background = 'rgba(32, 33, 110, 0.08)';
    });

    uploadSection.addEventListener('dragleave', () => {
      uploadSection.style.borderColor = 'var(--color-border)';
      uploadSection.style.background = 'rgba(32, 33, 110, 0.02)';
    });

    uploadSection.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadSection.style.borderColor = 'var(--color-border)';
      uploadSection.style.background = 'rgba(32, 33, 110, 0.02)';

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
  }
}

function updateProgress(percent) {
  const fill = document.getElementById('progress-fill');
  if (fill) {
    fill.style.width = percent + '%';
  }
}

document.addEventListener('DOMContentLoaded', loadVerificationPage);
