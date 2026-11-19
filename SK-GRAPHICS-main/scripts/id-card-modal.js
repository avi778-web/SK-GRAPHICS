// id-card-modal.js
// Handles the custom ID Card + Lanyard options modal
// Attach this script in index.ejs (or include it via a <script src="/scripts/id-card-modal.js" defer></script>)

// Data for ID Card options (adjust pricing as needed)
const idCardOptions = {
  cardTypes: [
    { label: "Standard ID Card", price: 150 },
    { label: "Premium ID Card (Glossy)", price: 250 }
  ],
  quantities: [
    { label: "10 pcs", multiplier: 1 },
    { label: "25 pcs", multiplier: 2.2 },
    { label: "50 pcs", multiplier: 4 },
    { label: "100 pcs", multiplier: 7.5 }
  ],
  lanyards: [
    { label: "No Lanyard", price: 0 },
    { label: "Black Lanyard", price: 30 },
    { label: "Blue Lanyard", price: 30 },
    { label: "Red Lanyard", price: 30 }
  ]
};

// State holder for the currently selected options
let currentIDSelection = {
  cardType: null,
  quantity: null,
  lanyard: null,
  customFont: "",
  customText: "",
  designProvided: false,
  extraLogo: false,
  logoFile: null
};

function openProductOptions(productName) {
  if (productName === "ID Card") {
    // Build modal HTML dynamically for ID Card
    const body = document.getElementById("optionsBody");
    body.innerHTML = `
      <div class="option-group">
        <label for="idCardType">Card Type</label>
        <select id="idCardType" class="option-select" onchange="onIDCardTypeChange(this)">
          <option value="" disabled selected>Select type</option>
          ${idCardOptions.cardTypes.map((t,i)=>`<option value="${i}">${t.label}</option>`).join('')}
        </select>
      </div>
      <div class="option-group">
        <label for="idQuantity">Quantity</label>
        <select id="idQuantity" class="option-select" onchange="onIDQuantityChange(this)">
          <option value="" disabled selected>Select quantity</option>
          ${idCardOptions.quantities.map((q,i)=>`<option value="${i}">${q.label}</option>`).join('')}
        </select>
      </div>
      <div class="option-group">
        <label for="idLanyard">Lanyard</label>
        <select id="idLanyard" class="option-select" onchange="onIDLanyardChange(this)">
          <option value="" disabled selected>Select lanyard</option>
          ${idCardOptions.lanyards.map((l,i)=>`<option value="${i}">${l.label}</option>`).join('')}
        </select>
      </div>
      <div class="custom-fields">
        <div class="custom-check">
          <input type="checkbox" id="designProvided" onchange="onDesignProvidedChange(this)">
          <label for="designProvided">Already Have Your Design?</label>
        </div>
        <div class="custom-check">
          <input type="checkbox" id="extraLogo" onchange="onExtraLogoChange(this)">
          <label for="extraLogo">Add Extra Photo or Logo?</label>
        </div>
        <div id="logoUploadZone" class="upload-zone" style="display:none;">Click or drag to upload logo</div>
        <div class="custom-check">
          <label for="fontSelect">Font Style</label>
          <select id="fontSelect" class="option-select" onchange="onFontSelect(this)">
            <option value="" disabled selected>Select font</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Roboto">Roboto</option>
          </select>
        </div>
        <div class="custom-check">
          <label for="customTextArea">Details to Print</label>
          <textarea id="customTextArea" placeholder="Name, designation, company…" rows="3"></textarea>
        </div>
      </div>`;
    document.getElementById("optionsTitle").innerText = "Customize ID Card & Lanyard";
    // Reset price display
    document.getElementById("optionsPrice").innerText = "₹0";
    // Open overlay
    document.getElementById("optionsOverlay").classList.add("open");
    // Reset selection state
    currentIDSelection = {
      cardType: null,
      quantity: null,
      lanyard: null,
      customFont: "",
      customText: "",
      designProvided: false,
      extraLogo: false,
      logoFile: null
    };
  } else {
    // Existing generic handling – leave untouched (original code should be unchanged)
    // You may call the original function via a different name if needed.
    console.warn("openProductOptions fallback for", productName);
  }
}

function onIDCardTypeChange(select) {
  const idx = parseInt(select.value);
  currentIDSelection.cardType = idCardOptions.cardTypes[idx];
  updateIDPrice();
}
function onIDQuantityChange(select) {
  const idx = parseInt(select.value);
  currentIDSelection.quantity = idCardOptions.quantities[idx];
  updateIDPrice();
}
function onIDLanyardChange(select) {
  const idx = parseInt(select.value);
  currentIDSelection.lanyard = idCardOptions.lanyards[idx];
  updateIDPrice();
}
function onDesignProvidedChange(cb) {
  currentIDSelection.designProvided = cb.checked;
}
function onExtraLogoChange(cb) {
  currentIDSelection.extraLogo = cb.checked;
  const zone = document.getElementById("logoUploadZone");
  zone.style.display = cb.checked ? "block" : "none";
  if (!cb.checked) {
    currentIDSelection.logoFile = null;
    zone.innerHTML = "Click or drag to upload logo";
  }
}
function onFontSelect(select) {
  currentIDSelection.customFont = select.value;
}
function updateIDPrice() {
  if (!currentIDSelection.cardType || !currentIDSelection.quantity) {
    document.getElementById("optionsPrice").innerText = "₹0";
    return;
  }
  const base = currentIDSelection.cardType.price;
  const qtyMultiplier = currentIDSelection.quantity.multiplier;
  const lanyardPrice = currentIDSelection.lanyard ? currentIDSelection.lanyard.price : 0;
  const total = Math.round((base * qtyMultiplier) + lanyardPrice);
  document.getElementById("optionsPrice").innerText = `₹${total}`;
}

function confirmProductOption() {
  // Build description for cart entry
  const descParts = [];
  if (currentIDSelection.cardType) descParts.push(currentIDSelection.cardType.label);
  if (currentIDSelection.quantity) descParts.push(currentIDSelection.quantity.label);
  if (currentIDSelection.lanyard && currentIDSelection.lanyard.price > 0) descParts.push(currentIDSelection.lanyard.label);
  const description = descParts.join(" – ");
  // Customization object for later use (e.g., order API)
  const customization = {
    font: currentIDSelection.customFont,
    text: document.getElementById("customTextArea").value.trim(),
    designProvided: currentIDSelection.designProvided,
    extraLogo: currentIDSelection.extraLogo,
    logoFile: currentIDSelection.logoFile // may be null
  };
  // Simple cart push – assumes a global `addToCart` helper exists
  if (typeof addToCart === "function") {
    addToCart(description, parseInt(document.getElementById("optionsPrice").innerText.replace(/[^0-9]/g, "")));
  }
  closeProductOptions();
}

function closeProductOptions() {
  document.getElementById("optionsOverlay").classList.remove("open");
}

// File upload handling for logo (re‑uses existing utility functions if present)
const logoZone = document.getElementById("logoUploadZone");
if (logoZone) {
  logoZone.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        currentIDSelection.logoFile = file;
        const reader = new FileReader();
        reader.onload = ev => {
          logoZone.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;max-height:80px;"/>`;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  });
}

// Export for debugging (optional)
if (typeof module !== "undefined") {
  module.exports = {
    openProductOptions,
    confirmProductOption,
    currentIDSelection
  };
}
