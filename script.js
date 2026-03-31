const categories = [];
let comparisons = [];
let currentComparisonIndex = 0;
let weights = {};

const singleCategoryInput = document.getElementById("single-category");
const categoryList = document.getElementById("category-list");
const setupMessage = document.getElementById("setup-message");
const setupPanel = document.getElementById("setup-panel");
const gamePanel = document.getElementById("game-panel");
const resultsPanel = document.getElementById("results-panel");
const questionText = document.getElementById("question-text");
const progressText = document.getElementById("progress-text");
const resultsTableWrap = document.getElementById("results-table-wrap");

document.getElementById("add-category-btn").addEventListener("click", () => {
  addCategory(singleCategoryInput.value);
  singleCategoryInput.value = "";
  singleCategoryInput.focus();
});

document.getElementById("clear-categories-btn").addEventListener("click", () => {
  categories.length = 0;
  renderCategories();
  setupMessage.textContent = "Cleared all categories.";
});

document.getElementById("start-game-btn").addEventListener("click", () => {
  if (categories.length < 2) {
    setupMessage.textContent = "Add at least two categories before starting.";
    return;
  }

  startGame();
});

document.getElementById("restart-btn").addEventListener("click", () => {
  categories.length = 0;
  comparisons = [];
  currentComparisonIndex = 0;
  weights = {};
  renderCategories();
  singleCategoryInput.value = "";
  setupMessage.textContent = "Start with a fresh set of categories.";
  setupPanel.classList.remove("hidden");
  gamePanel.classList.add("hidden");
  resultsPanel.classList.add("hidden");
});

document.getElementById("answer-buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-factor]");
  if (!button) {
    return;
  }

  const factor = Number(button.dataset.factor);
  applyAnswer(factor);
});

singleCategoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("add-category-btn").click();
  }
});

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove-index]");
  if (!button) {
    return;
  }

  const index = Number(button.dataset.removeIndex);
  const [removed] = categories.splice(index, 1);
  renderCategories();
  setupMessage.textContent = `Removed "${removed}".`;
});

function addCategory(value, render = true) {
  const cleaned = value.trim();
  if (!cleaned) {
    if (render) {
      setupMessage.textContent = "Enter a category name first.";
    }
    return false;
  }

  if (categories.some((existing) => existing.toLowerCase() === cleaned.toLowerCase())) {
    if (render) {
      setupMessage.textContent = `"${cleaned}" is already in the list.`;
    }
    return false;
  }

  categories.push(cleaned);

  if (render) {
    renderCategories();
    setupMessage.textContent = `Added "${cleaned}".`;
  }

  return true;
}

function renderCategories() {
  categoryList.innerHTML = "";

  categories.forEach((category, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span>${escapeHtml(category)}</span>
      <button type="button" class="remove-btn" data-remove-index="${index}">Remove</button>
    `;
    categoryList.appendChild(item);
  });

  if (categories.length === 0) {
    categoryList.innerHTML = "<li>No categories yet.</li>";
  }
}

function startGame() {
  weights = Object.fromEntries(categories.map((category) => [category, 1]));
  comparisons = buildComparisons(categories);
  currentComparisonIndex = 0;

  setupPanel.classList.add("hidden");
  resultsPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");

  renderComparison();
}

function buildComparisons(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      pairs.push([items[i], items[j]]);
    }
  }
  return shuffle(pairs);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderComparison() {
  const [left, right] = comparisons[currentComparisonIndex];
  questionText.textContent = `I care about ${left} __ than ${right}?`;
  progressText.textContent = `${currentComparisonIndex + 1} / ${comparisons.length}`;
}

function applyAnswer(factor) {
  const [left, right] = comparisons[currentComparisonIndex];

  weights[left] *= factor;
  weights[right] /= factor;

  currentComparisonIndex += 1;

  if (currentComparisonIndex >= comparisons.length) {
    showResults();
    return;
  }

  renderComparison();
}

function showResults() {
  gamePanel.classList.add("hidden");
  resultsPanel.classList.remove("hidden");

  const ordered = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  const copyableText = ordered
    .map(([name, value]) => `${name}\t${value.toFixed(3)}`)
    .join("\n");

  resultsTableWrap.innerHTML = `
    <label for="results-output">Copy and paste into a spreadsheet</label>
    <textarea id="results-output" rows="${Math.max(ordered.length + 1, 6)}" readonly>${escapeHtml(copyableText)}</textarea>
  `;

  const resultsOutput = document.getElementById("results-output");
  resultsOutput.focus();
  resultsOutput.select();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

renderCategories();
