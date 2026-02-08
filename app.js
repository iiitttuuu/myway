const supabaseUrl = "https://btnqmsvbzdluttswgkf.supabase.co";
const supabaseAnonKey = "sb_publishable_lwkUFRYQMlgIegEsDjJ7CQ_s-IE1...";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const providerTable = "providers";
const categoryTable = "categories";
const topicTable = "topic_areas";
const themeTable = "themes";
const PASSWORD_GATE_STORAGE_KEY = "waycontrolUnlocked";
const PASSWORD_GATE_SECRET = "Lina2012";

async function handleResponse(data, error, fallback) {
  if (error) {
    console.error(error);
    return fallback;
  }
  return data;
}

async function fetchProviders() {
  const { data, error } = await supabase
    .from(providerTable)
    .select("*")
    .order("created_at", { ascending: false });
  return handleResponse(data, error, []);
}

async function createProvider(payload) {
  const { data, error } = await supabase
    .from(providerTable)
    .insert(payload)
    .select();
  return handleResponse(data?.[0] || null, error, null);
}

async function updateProvider(id, payload) {
  const { data, error } = await supabase
    .from(providerTable)
    .update(payload)
    .eq("id", id)
    .select();
  return handleResponse(data?.[0] || null, error, null);
}

async function deleteProvider(id) {
  const { error } = await supabase.from(providerTable).delete().eq("id", id);
  handleResponse(null, error, null);
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from(categoryTable)
    .select("*")
    .order("name");
  return handleResponse(data, error, []);
}

async function fetchTopicAreas() {
  const { data, error } = await supabase
    .from(topicTable)
    .select("*")
    .order("category_id");
  return handleResponse(data, error, []);
}

async function fetchThemes() {
  const { data, error } = await supabase
    .from(themeTable)
    .select("*")
    .order("topic_area_id");
  return handleResponse(data, error, []);
}
function subscribeRealtime() {
  supabase
    .channel("global-sync")
    .on("postgres_changes", { schema: "public", table: providerTable, event: "*" }, () => {
      renderProviders();
      renderDashboard();
    })
    .on("postgres_changes", { schema: "public", table: categoryTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .on("postgres_changes", { schema: "public", table: topicTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .on("postgres_changes", { schema: "public", table: themeTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .subscribe();
}
subscribeRealtime();
async function renderDashboard() {
  const providers = await fetchProviders();
  const categories = await fetchCategories();
  const topicStateData = await aggregateCategoryTopicStateCounts(providers);

  renderStateChart(await aggregateStateCounts(providers));
  renderCategoryBars(await aggregateCategoryStateCounts(providers));
  renderCategoryTopicStateChart(topicStateData);
  renderCompletionGauge(topicStateData);
  renderTopFlopSummary(providers);

  if (dashboardCategoryCounts) {
    dashboardCategoryCounts.innerHTML = "";
    if (!categories.length) {
      dashboardCategoryCounts.appendChild(createEmpty("Noch keine Kategorien definiert."));
    } else {
      categories.forEach((category) => {
        const categoryData = await aggregateCategoryStateCounts(providers);
...

const countryStates = {
  "Deutschland": [
    "Baden-Württemberg",
    "Bayern",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hessen",
    "Mecklenburg-Vorpommern",
    "Niedersachsen",
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz",
    "Saarland",
    "Sachsen",
    "Sachsen-Anhalt",
    "Schleswig-Holstein",
    "Thüringen"
  ],
  "Österreich": [
    "Burgenland",
    "Kärnten",
    "Niederösterreich",
    "Oberösterreich",
    "Salzburg",
    "Steiermark",
    "Tirol",
    "Vorarlberg",
    "Wien"
  ],
  "Schweiz": [
    "Aargau",
    "Appenzell Ausserrhoden",
    "Appenzell Innerrhoden",
    "Basel-Landschaft",
    "Basel-Stadt",
    "Bern",
    "Freiburg",
    "Genf",
    "Glarus",
    "Graubünden",
    "Jura",
    "Luzern",
    "Neuenburg",
    "Nidwalden",
    "Obwalden",
    "St. Gallen",
    "Schaffhausen",
    "Solothurn",
    "Thurgau",
    "Tessin",
    "Uri",
    "Waadt",
    "Wallis",
    "Zug",
    "Zürich"
  ],
  "USA": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "Kalifornien",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ]
};

const countrySelect = document.getElementById("country-select");
const stateSelect = document.getElementById("state-select");
const form = document.getElementById("provider-form");
const heroTitleElement = document.getElementById("hero-title");
const tableBody = document.querySelector("#provider-table tbody");
const message = document.getElementById("form-message");
const categoryForm = document.getElementById("category-form");
const categoryCount = document.getElementById("category-count");
const categoryMessage = document.getElementById("category-message");
const categoryCancel = document.getElementById("category-cancel");
const navButtons = document.querySelectorAll(".sidebar-nav [data-view]");
const contentPanels = document.querySelectorAll(".content-panel");

const CATEGORY_BASE_VERSION = 1;
const CATEGORY_BASE_VERSION_KEY = "categoryBaseVersion";
const baseCategoryNames = [
  "Business & Karriere",
  "Technologie & Digitales",
  "Schule & Lernen",
  "Persönlichkeitsentwicklung",
  "Gesundheit & Wohlbefinden",
  "Sport & Bewegung",
  "Kreativität & Gestaltung",
  "Freizeit & Alltag",
  "Mobilität & Sicherheit",
  "Technik & Handwerk",
  "Familie & Erziehung",
  "Wissen & Gesellschaft"
];

const storageKey = "providers";
const categoryStorageKey = "categoryTopics";
const viewMap = {
  providers: "providers-panel",
  "provider-overview": "provider-overview-panel",
  categories: "categories-panel",
  "category-overview-page": "category-overview-panel",
  dashboard: "dashboard-panel"
};
const heroTitleMap = {
  providers: "Anbieter erfassen",
  "provider-overview": "Anbieter Übersicht",
  categories: "Kategorien & Themen verwalten",
  "category-overview-page": "Kategorien Übersicht",
  dashboard: "Dashboard"
};

const PROVIDER_TARGET_COUNT = 500;
const PASSWORD_GATE_STORAGE_KEY = "waycontrolUnlocked";
const PASSWORD_GATE_SECRET = "Lina2012";

const providerCategorySelect = document.getElementById("provider-category-select");
const providerTopicSelect = document.getElementById("provider-topic-select");
const providerThemeSelect = document.getElementById("provider-theme-select");
const providerAssocAdd = document.getElementById("provider-assoc-add");
const providerAssociations = document.getElementById("provider-associations");
let providerAssignments = [];
const providerSubmitButton = form ? form.querySelector("button[type='submit']") : null;
const providerCancelEdit = document.getElementById("provider-cancel-edit");
const newProviderButton = document.getElementById("new-provider-button");
const seedDemoButton = document.getElementById("seed-demo-data-button");
const providerExportButton = document.getElementById("provider-export-button");
const providerRefreshButton = document.getElementById("provider-refresh-button");
const overviewNewProviderButton = document.getElementById("overview-new-provider-button");
const categoryFocusButton = document.getElementById("focus-category-button");
const categoryExportButton = document.getElementById("category-export-button");
const overviewRefreshButton = document.getElementById("overview-refresh-button");
const overviewCategoryButton = document.getElementById("overview-category-button");
const dashboardCategoryCounts = document.getElementById("dashboard-category-counts");
const dashboardStateChart = document.getElementById("dashboard-state-chart");
const dashboardCategoryBars = document.getElementById("dashboard-category-bars");
const dashboardCategoryTopicStates = document.getElementById("dashboard-category-topic-states");
const dashboardCompletionGauge = document.getElementById("dashboard-completion-gauge");
const dashboardProviderTargetGauge = document.getElementById("dashboard-provider-target-gauge");
const dashboardGapTop = document.getElementById("dashboard-gap-top");
const dashboardGapAll = document.getElementById("dashboard-gap-all");
const gapTabButtons = document.querySelectorAll(".gap-tab-button");
const dashboardGapSummary = document.getElementById("dashboard-gap-summary");
const dashboardCountrySelect = document.getElementById("dashboard-country-select");
const dashboardRefreshButton = document.getElementById("dashboard-refresh-button");
const dashboardTopFlopCard = document.getElementById("dashboard-top-flop");
const providerSearchInput = document.getElementById("provider-search");
const passwordGate = document.getElementById("password-gate");
const passwordGateForm = document.getElementById("password-gate-form");
const passwordGateInput = document.getElementById("password-gate-input");
const passwordGateMessage = document.getElementById("password-gate-message");
const hierarchySearchInput = document.getElementById("hierarchy-search");
const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const dashboardPanes = document.querySelectorAll(".dashboard-pane");
const dashboardGapCategorySelect = document.getElementById("dashboard-gap-category-select");
const dashboardCategoryStateMatrix = document.getElementById("dashboard-category-state-matrix");
let providerSearchTerm = "";
let hierarchySearchTerm = "";
let editingProviderIndex = null;
let providerMessageTimer = null;

function viewFromHash(hash) {
  if (!hash) return null;
  const cleaned = hash.startsWith("#") ? hash : `#${hash}`;
  const match = Object.entries(viewMap).find(([, id]) => `#${id}` === cleaned);
  return match ? match[0] : null;
}

function updateHeroTitle(view) {
  if (!heroTitleElement) {
    return;
  }
  heroTitleElement.textContent = heroTitleMap[view] || "WAY Control";
}

function isPasswordUnlocked() {
  return localStorage.getItem(PASSWORD_GATE_STORAGE_KEY) === "1";
}

function lockPasswordGate() {
  if (!passwordGate) {
    return;
  }
  passwordGate.classList.remove("gate-hidden");
  document.body.classList.add("gate-active");
  passwordGateMessage.textContent = "";
}

function unlockPasswordGate() {
  if (!passwordGate) {
    return;
  }
  passwordGate.classList.add("gate-hidden");
  document.body.classList.remove("gate-active");
}

function handlePasswordGate(event) {
  event.preventDefault();
  const input = passwordGateInput?.value?.trim() || "";
  if (input === PASSWORD_GATE_SECRET) {
    localStorage.setItem(PASSWORD_GATE_STORAGE_KEY, "1");
    unlockPasswordGate();
    return;
  }
  if (passwordGateMessage) {
    passwordGateMessage.textContent = "Falsches Passwort, bitte erneut versuchen.";
  }
}
function subscribeRealtime() {
  supabase
    .channel("global-sync")
    .on("postgres_changes", { schema: "public", table: providerTable, event: "*" }, () => {
      renderProviders();
      renderDashboard();
    })
    .on("postgres_changes", { schema: "public", table: categoryTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .on("postgres_changes", { schema: "public", table: topicTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .on("postgres_changes", { schema: "public", table: themeTable, event: "*" }, () => {
      updateSelectors();
      renderHierarchy();
    })
    .subscribe();
}
subscribeRealtime();

function initPasswordGate() {
  if (!passwordGate) {
    return;
  }
  if (isPasswordUnlocked()) {
    unlockPasswordGate();
  } else {
    lockPasswordGate();
  }
  passwordGateForm?.addEventListener("submit", handlePasswordGate);
}

function getStoredProviders() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    console.warn("Speicher konnte nicht gelesen werden:", error);
    return [];
  }
}

function saveProviders(list) {
  localStorage.setItem(storageKey, JSON.stringify(list));
}

function populateCountryList() {
  countrySelect.innerHTML = "";
  Object.keys(countryStates).forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
  countrySelect.value = "Österreich";
  populateStateList("Österreich");
}

function populateStateList(country) {
  const states = countryStates[country] || [];
  stateSelect.innerHTML = "";

  if (!states.length) {
    const fallback = document.createElement("option");
    fallback.value = "";
    fallback.textContent = "Keine Bundesländer verfügbar";
    stateSelect.appendChild(fallback);
    stateSelect.disabled = true;
    return;
  }

  states.forEach((stateName) => {
    const option = document.createElement("option");
    option.value = stateName;
    option.textContent = stateName;
    stateSelect.appendChild(option);
  });
  stateSelect.disabled = false;
}

function updateFooterTime() {
  const footerTimeElement = document.getElementById("footer-time");
  if (!footerTimeElement) {
    return;
  }
  const now = new Date();
  const date = now.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const time = now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });
  footerTimeElement.textContent = `${date} · ${time}`;
}

function createStatusChip(status) {
  const chip = document.createElement("span");
  chip.classList.add("status-chip", status);
  chip.textContent = status === "offen" ? "Offen" : status === "erledigt" ? "Erledigt" : "In Bearbeitung";
  return chip;
}

function formatAddress(provider) {
  if (!provider) {
    return "–";
  }
  const parts = [];
  if (provider.street) {
    parts.push(provider.street);
  }
  if (provider.postal) {
    parts.push(provider.postal);
  }
  if (provider.city) {
    parts.push(provider.city);
  }
  if (!parts.length && provider.address) {
    return provider.address;
  }
  if (!parts.length) {
    return "–";
  }
  return parts.join(", ");
}

function buildProviderCounts(providers) {
  const counts = {
    categories: {},
    topics: {},
    themes: {}
  };
  providers.forEach((provider) => {
    const assignments = getProviderAssignments(provider);
    assignments.forEach((assignment) => {
      const catKey = assignment.category;
      const topicKey = `${assignment.category}|||${assignment.topic}`;
      const themeKey = `${assignment.category}|||${assignment.topic}|||${assignment.theme}`;
      counts.categories[catKey] = (counts.categories[catKey] || 0) + 1;
      counts.topics[topicKey] = (counts.topics[topicKey] || 0) + 1;
      counts.themes[themeKey] = (counts.themes[themeKey] || 0) + 1;
    });
  });
  return counts;
}

function matchesOverviewFilter(value, filter) {
  if (!filter) {
    return true;
  }
  return value.toLowerCase().includes(filter);
}

function renderCategoryOverview() {
  const categories = getStoredCategories();
  const providers = getStoredProviders();
  const counts = buildProviderCounts(providers);
  const filter = (overviewSearchInput?.value || "").trim().toLowerCase();
  if (overviewStats) {
    overviewStats.textContent = `${categories.length} Kategorien · ${providers.length} Anbieter`;
  }
  if (!overviewContainer) {
    return;
  }
  overviewContainer.innerHTML = "";
  if (!categories.length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Kategorien angelegt.";
    overviewContainer.appendChild(placeholder);
    return;
  }

  const rows = [];
  categories.forEach((category) => {
    const baseCategory = category.name;
    if (!category.topicAreas.length) {
      rows.push({
        category: baseCategory,
        topic: "–",
        theme: "–",
        tags: [],
        count: counts.categories[baseCategory] || 0,
        text: `${baseCategory}`
      });
      return;
    }
    category.topicAreas.forEach((topic) => {
      const topicCount = counts.topics[`${baseCategory}|||${topic.name}`] || 0;
      if (!topic.themes.length) {
        rows.push({
          category: baseCategory,
          topic: topic.name,
          theme: "–",
          tags: [],
          count: topicCount,
          text: `${baseCategory} ${topic.name}`
        });
        return;
      }
      topic.themes.forEach((theme) => {
        const themeKey = `${baseCategory}|||${topic.name}|||${theme.name}`;
        rows.push({
          category: baseCategory,
          topic: topic.name,
          theme: theme.name,
          tags: theme.tags,
          count: counts.themes[themeKey] || 0,
          text: `${baseCategory} ${topic.name} ${theme.name} ${theme.tags.join(" ")}`
        });
      });
    });
  });

  const filteredRows = rows.filter((row) => matchesOverviewFilter(row.text, filter));
  if (!filteredRows.length) {
    const helper = document.createElement("p");
    helper.classList.add("muted");
    helper.textContent = "Keine Treffer zur Suche.";
    overviewContainer.appendChild(helper);
    return;
  }

  const table = document.createElement("table");
  table.classList.add("overview-simple-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Kategorie", "Themenbereich", "Thema", "Tags", "Anbieter"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  filteredRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.category));
    tr.appendChild(createCell(row.topic));
    tr.appendChild(createCell(row.theme));
    tr.appendChild(createCell(row.tags.length ? row.tags.join(", ") : "–"));
    tr.appendChild(createCell(`${row.count} Anbieter`));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  overviewContainer.appendChild(table);
  renderDashboard();
}

const supportedCountries = Object.keys(countryStates);
let dashboardCountry = "Österreich";
let dashboardDisplayStates = getDisplayStatesForCountry(dashboardCountry);

function getDisplayStatesForCountry(country) {
  const baseList = countryStates[country] || [];
  const unique = Array.from(new Set(baseList));
  if (!unique.includes("Unbekannt")) {
    unique.push("Unbekannt");
  }
  return unique;
}

function populateDashboardCountryOptions() {
  if (!dashboardCountrySelect) {
    return;
  }
  dashboardCountrySelect.innerHTML = "";
  supportedCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    dashboardCountrySelect.appendChild(option);
  });
  dashboardCountrySelect.value = dashboardCountry;
}

function getStateColor(count) {
  if (count === 0) {
    return "#ef4444";
  }
  if (count === 1) {
    return "#fb923c";
  }
  if (count === 2) {
    return "#2563eb";
  }
  return "#22c55e";
}

function aggregateStateCounts(providers) {
  const counts = {};
  dashboardDisplayStates.forEach((state) => {
    counts[state] = 0;
  });
  providers.forEach((provider) => {
    const stateName = (provider.state || "").trim() || "Unbekannt";
    const resolvedState = dashboardDisplayStates.includes(stateName) ? stateName : "Unbekannt";
    counts[resolvedState] = (counts[resolvedState] || 0) + 1;
  });
  return counts;
}

function aggregateCategoryStateCounts(providers) {
  const data = {};
  providers.forEach((provider) => {
    const stateName = (provider.state || "").trim() || "Unbekannt";
    const resolvedState = dashboardDisplayStates.includes(stateName) ? stateName : "Unbekannt";
    getProviderAssignments(provider).forEach((assignment) => {
      if (!assignment.category) {
        return;
      }
      const categoryName = assignment.category;
      data[categoryName] = data[categoryName] || { total: 0, states: {} };
      data[categoryName].states[resolvedState] = (data[categoryName].states[resolvedState] || 0) + 1;
      data[categoryName].total += 1;
    });
  });
  return data;
}

function resolveProviderDisplayState(provider) {
  const stateName = (provider.state || "").trim() || "Unbekannt";
  return dashboardDisplayStates.includes(stateName) ? stateName : "Unbekannt";
}

function aggregateCategoryTopicStateCounts(providers) {
  const data = {};
  getStoredCategories().forEach((category) => {
    data[category.name] = {};
  });
  providers.forEach((provider) => {
    const stateName = resolveProviderDisplayState(provider);
    const assignments = getProviderAssignments(provider);
    if (!assignments.length) {
      return;
    }
    assignments.forEach((assignment) => {
      if (!assignment.category) {
        return;
      }
      const categoryName = assignment.category;
      const topicName = assignment.topic || "–";
      data[categoryName] = data[categoryName] || {};
      const topicBucket = data[categoryName][topicName] || {};
      topicBucket[stateName] = (topicBucket[stateName] || 0) + 1;
      data[categoryName][topicName] = topicBucket;
    });
  });
  return data;
}

function renderStateChart(stateCounts) {
  if (!dashboardStateChart) {
    return;
  }
  dashboardStateChart.innerHTML = "";
  const maxCount = Math.max(...Object.values(stateCounts), 1);
  if (!dashboardDisplayStates.length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Bundesländer nicht verfügbar.";
    dashboardStateChart.appendChild(placeholder);
    return;
  }
  dashboardDisplayStates.forEach((stateName) => {
    const count = stateCounts[stateName] || 0;
    const row = document.createElement("div");
    row.classList.add("dashboard-bar");
    const label = document.createElement("span");
    label.classList.add("dashboard-bar-label");
    label.textContent = stateName;
    const track = document.createElement("div");
    track.classList.add("dashboard-bar-track");
    const fill = document.createElement("span");
    fill.classList.add("dashboard-bar-fill");
    const widthPercent = maxCount ? Math.round((count / maxCount) * 100) : 0;
    const width = count === 0 ? 4 : Math.max(4, widthPercent);
    const safeWidth = Math.min(width, 100);
    fill.style.width = `${safeWidth}%`;
    fill.style.backgroundColor = getStateColor(count);
    track.appendChild(fill);
    const countLabel = document.createElement("span");
    countLabel.classList.add("dashboard-bar-count");
    countLabel.textContent = `${count}`;
    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(countLabel);
    dashboardStateChart.appendChild(row);
  });
}

function renderDashboard() {
  populateGapCategoryFilter();
  const providers = getStoredProviders();
  const categories = getStoredCategories();
  const stateCounts = aggregateStateCounts(providers);
  const categoryCounts = aggregateCategoryStateCounts(providers);
  const categoryTopicStateData = aggregateCategoryTopicStateCounts(providers);
  renderStateChart(stateCounts);
  renderCategoryBars(categoryCounts);
  renderCategoryTopicStateChart(categoryTopicStateData);
  renderCompletionGauge(categoryTopicStateData);
  renderProviderTargetGauge(providers);
  renderGapSummary(categoryTopicStateData);
  renderTopFlopSummary();
  if (dashboardCategoryCounts) {
    dashboardCategoryCounts.innerHTML = "";
    if (!categories.length) {
      const placeholder = document.createElement("p");
      placeholder.classList.add("empty");
      placeholder.textContent = "Noch keine Kategorien definiert.";
      dashboardCategoryCounts.appendChild(placeholder);
    } else {
      categories.forEach((category) => {
        const categoryData = categoryCounts[category.name] || { total: 0, states: {} };
        const card = document.createElement("article");
        card.classList.add("dashboard-category-card");
        const header = document.createElement("div");
        header.classList.add("dashboard-card-header");
        const title = document.createElement("strong");
        title.textContent = category.name;
        const countLabel = document.createElement("span");
        countLabel.textContent = categoryData.total ? `${categoryData.total} Anbieter` : "noch keine Anbieter";
        header.appendChild(title);
        header.appendChild(countLabel);
        card.appendChild(header);
        const stateList = document.createElement("div");
        stateList.classList.add("dashboard-chip-list");
        const states = dashboardDisplayStates.map((stateName) => [stateName, categoryData.states[stateName] || 0]);
        states.forEach(([stateName, count]) => {
          const chip = document.createElement("span");
          chip.classList.add("dashboard-chip");
          if (count === 0) {
            chip.classList.add("dashboard-chip-0");
          } else if (count === 1) {
            chip.classList.add("dashboard-chip-1");
          } else if (count === 2) {
            chip.classList.add("dashboard-chip-2");
          } else {
            chip.classList.add("dashboard-chip-3plus");
          }
          chip.textContent = `${stateName}: ${count}`;
          stateList.appendChild(chip);
        });
        card.appendChild(stateList);
        dashboardCategoryCounts.appendChild(card);
      });
    }
  }
  renderCategoryStateMatrix(categoryCounts, categories);
  renderTopFlopSummary(categories);
}

function renderTopFlopSummary() {
  if (!dashboardTopFlopCard) {
    return;
  }
  const providers = getStoredProviders();
  const totals = {};
  providers.forEach((provider) => {
    const stateName = resolveProviderDisplayState(provider);
    if (!totals[stateName]) {
      totals[stateName] = new Set();
    }
    getProviderAssignments(provider).forEach((assignment) => {
      if (!assignment.category) {
        return;
      }
      totals[stateName].add(`${assignment.category}|||${assignment.topic || "-"}`);
    });
  });
  const entries = dashboardDisplayStates.map((state) => ({
    state,
    total: totals[state]?.size || 0
  }));
  const entriesWithData = entries.filter((entry) => entry.total > 0);
  let topStates = [];
  let flopStates = [];
  if (entriesWithData.length) {
    const max = Math.max(...entriesWithData.map((entry) => entry.total));
    const min = Math.min(...entriesWithData.map((entry) => entry.total));
    topStates = entriesWithData.filter((entry) => entry.total === max);
    const zeroStates = entries.filter((entry) => entry.total === 0);
    flopStates = zeroStates.length ? zeroStates : entriesWithData.filter((entry) => entry.total === min);
  } else {
    flopStates = entries;
  }
  dashboardTopFlopCard.innerHTML = "";
  if (!topStates.length && !flopStates.length) {
    const empty = document.createElement("p");
    empty.classList.add("empty");
    empty.textContent = "Noch keine Zuordnungen.";
    dashboardTopFlopCard.appendChild(empty);
    return;
  }
  const renderBlock = (label, states, total, accent) => {
    const block = document.createElement("div");
    block.classList.add("top-flop-block");
    if (accent) {
      block.style.borderColor = accent;
    }
    const title = document.createElement("strong");
    title.textContent = label;
    const value = document.createElement("span");
    value.classList.add("top-flop-value");
    value.textContent = states.length ? states.map((entry) => entry.state).join(" / ") : "–";
    const stats = document.createElement("span");
    stats.classList.add("top-flop-stats");
    stats.textContent = `${states.length ? total : 0} Kategorien/Themen`;
    block.appendChild(title);
    block.appendChild(value);
    block.appendChild(stats);
    return block;
  };
  const topTotal = topStates[0]?.total || 0;
  const flopTotal = flopStates[0]?.total || 0;
  dashboardTopFlopCard.appendChild(renderBlock("Top Bundesland", topStates, topTotal, "#22c55e"));
  dashboardTopFlopCard.appendChild(renderBlock("Flop Bundesland", flopStates, flopTotal, "#ef4444"));
}

function renderCategoryStateMatrix(categoryCounts, categories) {
  if (!dashboardCategoryStateMatrix) {
    return;
  }
  dashboardCategoryStateMatrix.innerHTML = "";
  if (!categories.length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Kategorien definiert.";
    dashboardCategoryStateMatrix.appendChild(placeholder);
    return;
  }
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.appendChild(createMatrixHeader("Kategorie"));
  dashboardDisplayStates.forEach((stateName) => {
    headerRow.appendChild(createMatrixHeader(stateName));
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  categories.forEach((category) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.classList.add("matrix-label");
    labelCell.textContent = category.name;
    row.appendChild(labelCell);
    const categoryData = categoryCounts[category.name] || { states: {} };
    dashboardDisplayStates.forEach((stateName) => {
      const count = categoryData.states[stateName] || 0;
      const cell = document.createElement("td");
      const chip = document.createElement("span");
      chip.classList.add("matrix-chip");
      chip.textContent = `${count}`;
      cell.appendChild(chip);
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  dashboardCategoryStateMatrix.appendChild(table);
}

function createMatrixHeader(label) {
  const th = document.createElement("th");
  th.textContent = label;
  return th;
}

function activateDashboardPane(paneName) {
  dashboardPanes.forEach((pane) => {
    const isActive = pane.dataset.pane === paneName;
    pane.classList.toggle("is-active", isActive);
    pane.hidden = !isActive;
  });
  dashboardTabs.forEach((tab) => {
    const isActive = tab.dataset.dashboardPane === paneName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function populateGapCategoryFilter() {
  if (!dashboardGapCategorySelect) {
    return;
  }
  const categories = getStoredCategories();
  dashboardGapCategorySelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Alle Kategorien";
  dashboardGapCategorySelect.appendChild(allOption);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    dashboardGapCategorySelect.appendChild(option);
  });
}

function gatherTopicGaps(topicStateData) {
  const states = dashboardDisplayStates;
  const gaps = [];
  Object.entries(topicStateData).forEach(([categoryName, topics]) => {
    Object.entries(topics).forEach(([topicName, stateMap]) => {
      states.forEach((stateName) => {
        const count = stateMap[stateName] || 0;
        if (count < 3) {
          gaps.push({ categoryName, topicName, stateName, count });
        }
      });
    });
  });
  return gaps.sort((a, b) => a.count - b.count);
}

function populateGapList(container, gaps, emptyText) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  if (!gaps.length) {
    const helper = document.createElement("p");
    helper.classList.add("empty");
    helper.textContent = emptyText;
    container.appendChild(helper);
    return;
  }
  gaps.forEach((gap) => {
    const item = document.createElement("div");
    item.classList.add("dashboard-gap-item");
    const label = document.createElement("span");
    label.textContent = `${gap.categoryName} › ${gap.topicName} · ${gap.stateName}`;
    const badge = document.createElement("span");
    badge.classList.add("dashboard-gap-count");
    badge.textContent = `${gap.count} Anbieter`;
    item.appendChild(label);
    item.appendChild(badge);
    container.appendChild(item);
  });
}

function renderGapSummary(topicStateData) {
  const selectedCategory = dashboardGapCategorySelect?.value || "";
  const gaps = gatherTopicGaps(topicStateData);
  const filtered = selectedCategory
    ? gaps.filter((gap) => gap.categoryName === selectedCategory)
    : gaps;
  populateGapList(dashboardGapTop, filtered.slice(0, 6), "Keine kritischen Lücken.");
  populateGapList(dashboardGapAll, filtered, "Alle Kombinationen haben 3+ Anbieter.");
}

function setGapTab(activeTab) {
  if (!dashboardGapTop || !dashboardGapAll) {
    return;
  }
  dashboardGapTop.hidden = activeTab !== "top";
  dashboardGapAll.hidden = activeTab !== "all";
  document.querySelectorAll(".gap-tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === activeTab);
  });
}
function renderCategoryBars(categoryCounts) {
  if (!dashboardCategoryBars) {
    return;
  }
  dashboardCategoryBars.innerHTML = "";
  if (!Object.keys(categoryCounts).length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Kategorien.";
    dashboardCategoryBars.appendChild(placeholder);
    return;
  }
  const maxTotal = Math.max(...Object.values(categoryCounts).map((entry) => entry.total || 0), 1);
  Object.entries(categoryCounts)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([categoryName, meta]) => {
      const row = document.createElement("div");
      row.classList.add("dashboard-category-row");
      const label = document.createElement("span");
      label.classList.add("dashboard-category-label");
      label.textContent = categoryName;
      const barContainer = document.createElement("div");
      barContainer.classList.add("dashboard-category-bar");
      const fill = document.createElement("span");
      fill.classList.add("dashboard-category-fill");
      const percent = maxTotal ? Math.round((meta.total / maxTotal) * 100) : 0;
      fill.style.width = `${Math.max(4, Math.min(percent, 100))}%`;
      barContainer.appendChild(fill);
      const countLabel = document.createElement("span");
      countLabel.textContent = `${meta.total || 0} Anbieter`;
      row.appendChild(label);
      row.appendChild(barContainer);
      row.appendChild(countLabel);
    dashboardCategoryBars.appendChild(row);
    });
}

function buildStateChipList(counts = {}) {
  const chipList = document.createElement("div");
  chipList.classList.add("category-state-chip-list");
  const states = dashboardDisplayStates.length ? dashboardDisplayStates : Object.keys(counts);
  states.forEach((stateName) => {
    const count = counts[stateName] || 0;
    const chip = document.createElement("span");
    chip.classList.add("dashboard-chip", getTopicChipClassForCount(count));
    chip.textContent = `${stateName}: ${count}`;
    chipList.appendChild(chip);
  });
  return chipList;
}


function getTopicChipClassForCount(count) {
  if (count === 0) {
    return "dashboard-chip-0";
  }
  if (count === 1) {
    return "dashboard-chip-1";
  }
  if (count === 2) {
    return "dashboard-chip-2";
  }
  return "dashboard-chip-3plus";
}

function renderCategoryTopicStateChart(data) {
  if (!dashboardCategoryTopicStates) {
    return;
  }
  dashboardCategoryTopicStates.innerHTML = "";
  const categories = Object.keys(data);
  if (!categories.length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Kategorien definiert.";
    dashboardCategoryTopicStates.appendChild(placeholder);
    return;
  }
  categories.sort((a, b) => a.localeCompare(b));
  categories.forEach((categoryName) => {
    const topics = data[categoryName];
    const section = document.createElement("div");
    section.classList.add("dashboard-category-topic-section");
    const header = document.createElement("div");
    header.classList.add("dashboard-category-topic-header");
    const title = document.createElement("strong");
    title.textContent = categoryName;
    header.appendChild(title);
    const totalCount = Object.values(topics).reduce(
      (sum, topicEntries) =>
        sum +
        Object.values(topicEntries).reduce((sub, value) => sub + value, 0),
      0
    );
    const summary = document.createElement("span");
    summary.textContent = totalCount ? `${totalCount} Anbieter verteilt` : "Noch keine Anbieter";
    header.appendChild(summary);
    section.appendChild(header);

    if (!Object.keys(topics).length) {
      const helper = document.createElement("p");
      helper.classList.add("muted");
      helper.textContent = "Noch keine Themenbereiche.";
      section.appendChild(helper);
    } else {
      const topicList = document.createElement("div");
      topicList.classList.add("dashboard-category-topic-list");
      Object.keys(topics)
        .sort((a, b) => a.localeCompare(b))
        .forEach((topicName) => {
          const topicRow = document.createElement("div");
          topicRow.classList.add("dashboard-category-topic-row");
          const label = document.createElement("div");
          label.classList.add("dashboard-category-topic-label");
          label.textContent = topicName === "–" ? "Keine Themenzuordnung" : topicName;
          topicRow.appendChild(label);

          const chipList = document.createElement("div");
          chipList.classList.add("dashboard-chip-list", "dashboard-category-topic-chip-list");
          const stateCounts = topics[topicName];
          dashboardDisplayStates.forEach((stateName) => {
            const count = stateCounts ? stateCounts[stateName] || 0 : 0;
            const chip = document.createElement("span");
            chip.classList.add("dashboard-chip", getTopicChipClassForCount(count));
            chip.textContent = `${stateName}: ${count}`;
            chipList.appendChild(chip);
          });
          topicRow.appendChild(chipList);
          topicList.appendChild(topicRow);
        });
      section.appendChild(topicList);
    }

    dashboardCategoryTopicStates.appendChild(section);
  });
}

const DEFAULT_GAUGE_STOPS = [
  { offset: "0%", color: "#ffffff" },
  { offset: "60%", color: "#fbcfe8" },
  { offset: "100%", color: "#ec4899" }
];

function createGaugeSvg(percent, gradientStops = DEFAULT_GAUGE_STOPS) {
  const angle = -90 + (percent / 100) * 180;
  const arcLength = Math.PI * 90;
  const dashOffset = arcLength * (1 - percent / 100);
  const gauge = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  gauge.setAttribute("viewBox", "0 0 200 100");
  const arc = document.createElementNS(gauge.namespaceURI, "path");
  arc.setAttribute("class", "gauge-arc");
  arc.setAttribute("d", "M10 100 A90 90 0 0 1 190 100");
  gauge.appendChild(arc);

  const defs = document.createElementNS(gauge.namespaceURI, "defs");
  const gradient = document.createElementNS(gauge.namespaceURI, "linearGradient");
  const gradientId = `gaugeGradient-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  gradient.setAttribute("id", gradientId);
  gradient.setAttribute("x1", "0%");
  gradient.setAttribute("y1", "0%");
  gradient.setAttribute("x2", "100%");
  gradient.setAttribute("y2", "0%");
  gradientStops.forEach((stop) => {
    const stopNode = document.createElementNS(gauge.namespaceURI, "stop");
    stopNode.setAttribute("offset", stop.offset);
    stopNode.setAttribute("stop-color", stop.color);
    gradient.appendChild(stopNode);
  });
  defs.appendChild(gradient);
  gauge.appendChild(defs);

  const fill = document.createElementNS(gauge.namespaceURI, "path");
  fill.setAttribute("class", "gauge-fill");
  fill.setAttribute("d", "M10 100 A90 90 0 0 1 190 100");
  fill.setAttribute("stroke", `url(#${gradientId})`);
  fill.setAttribute("stroke-dasharray", arcLength);
  fill.setAttribute("stroke-dashoffset", dashOffset);
  fill.setAttribute("stroke-linecap", "round");
  gauge.appendChild(fill);

  const pointer = document.createElementNS(gauge.namespaceURI, "line");
  pointer.setAttribute("class", "gauge-pointer");
  pointer.setAttribute("x1", "100");
  pointer.setAttribute("y1", "100");
  pointer.setAttribute("x2", "100");
  pointer.setAttribute("y2", "24");
  const startAngle = -90;
  pointer.setAttribute("transform-origin", "100 100");
  pointer.style.transformOrigin = "100px 100px";
  pointer.style.transform = `rotate(${startAngle}deg)`;
  gauge.appendChild(pointer);

  if (pointer.animate) {
    const animation = pointer.animate(
      [
        { transform: `rotate(${startAngle}deg)` },
        { transform: `rotate(${angle}deg)` }
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "forwards"
      }
    );
    animation.onfinish = () => {
      pointer.style.transform = `rotate(${angle}deg)`;
      pointer.setAttribute("transform", `rotate(${angle} 100 100)`);
    };
  } else {
    pointer.style.transform = `rotate(${angle}deg)`;
    pointer.setAttribute("transform", `rotate(${angle} 100 100)`);
  }

  return gauge;
}

function computeTopicStateCompletion(topicStateData) {
  const states = dashboardDisplayStates;
  let totalSlots = 0;
  let achievedSlots = 0;
  Object.values(topicStateData).forEach((topics) => {
    Object.values(topics).forEach((stateMap) => {
      states.forEach((stateName) => {
        totalSlots += 1;
        if ((stateMap[stateName] || 0) >= 3) {
          achievedSlots += 1;
        }
      });
    });
  });
  const percent = totalSlots ? Math.round((achievedSlots / totalSlots) * 100) : 0;
  return { percent, totalSlots, achievedSlots };
}

function renderCompletionGauge(topicStateData) {
  if (!dashboardCompletionGauge) {
    return;
  }
  const stats = computeTopicStateCompletion(topicStateData);
  dashboardCompletionGauge.innerHTML = "";
  if (!stats.totalSlots) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Themenbereiche definiert.";
    dashboardCompletionGauge.appendChild(placeholder);
    return;
  }

  const gauge = createGaugeSvg(stats.percent);
  const label = document.createElement("p");
  label.classList.add("gauge-value");
  label.textContent = `${stats.percent}%`;

  const caption = document.createElement("p");
  caption.classList.add("gauge-caption");
  caption.textContent = `${stats.achievedSlots}/${stats.totalSlots} Kombis mit ≥3 Anbieter`;

  dashboardCompletionGauge.appendChild(gauge);
  dashboardCompletionGauge.appendChild(label);
  dashboardCompletionGauge.appendChild(caption);
}

function renderProviderTargetGauge(providers) {
  if (!dashboardProviderTargetGauge) {
    return;
  }
  dashboardProviderTargetGauge.innerHTML = "";
  const total = providers.length;
  const percent = Math.min(100, Math.round((total / PROVIDER_TARGET_COUNT) * 100));
  const gauge = createGaugeSvg(percent);
  const label = document.createElement("p");
  label.classList.add("gauge-value");
  label.textContent = `${percent}%`;
  const caption = document.createElement("p");
  caption.classList.add("gauge-caption");
  caption.textContent = `${total}/${PROVIDER_TARGET_COUNT} Anbieter`;
  dashboardProviderTargetGauge.appendChild(gauge);
  dashboardProviderTargetGauge.appendChild(label);
  dashboardProviderTargetGauge.appendChild(caption);
}

async function renderProviders() {
  const providers = await fetchProviders();
  tableBody.innerHTML = "";

  if (!providers.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.setAttribute("colspan", "8");
    emptyCell.classList.add("empty");
    emptyCell.textContent = "Noch keine Anbieter angelegt.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  providers.forEach((provider) => {
    const row = document.createElement("tr");
    row.classList.add("provider-row");
    row.dataset.providerId = provider.id;

    row.appendChild(createCell(provider.name));
    row.appendChild(createCell(formatAddress(provider)));
    row.appendChild(createCell(provider.country));
    row.appendChild(createCell(provider.state));

    const statusCell = document.createElement("td");
    statusCell.appendChild(createStatusChip(provider.status || "offen"));
    row.appendChild(statusCell);

    const assignmentCell = createAssignmentCell(provider);
    row.appendChild(assignmentCell);

    const websiteCell = document.createElement("td");
    if (provider.website) {
      const link = document.createElement("a");
      link.href = provider.website;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = provider.website;
      websiteCell.appendChild(link);
    } else {
      websiteCell.textContent = "–";
    }
    row.appendChild(websiteCell);

    const actionCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.classList.add("table-actions");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("ghost", "ghost-small");
    editButton.textContent = "Bearbeiten";
    editButton.addEventListener("click", () => startProviderEdit(provider));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-button", "tiny");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", () => {
      deleteProvider(provider.id).then(() => renderProviders());
    });
    actionGroup.appendChild(editButton);
    actionGroup.appendChild(deleteButton);
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

  if (!filteredProviders.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.setAttribute("colspan", "8");
    emptyCell.classList.add("empty");
    emptyCell.textContent = allProviders.length ? "Keine Treffer für die Suche." : "Noch keine Anbieter angelegt.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  filteredProviders.forEach(({ provider, index }) => {
    const row = document.createElement("tr");
    row.classList.add("provider-row");
    row.dataset.providerIndex = index;
    row.addEventListener("click", (event) => {
      if (
        event.target.closest(".table-actions") ||
        event.target.closest("button") ||
        event.target.closest("a") ||
        event.target.closest(".chip-remove")
      ) {
        return;
      }
      startProviderEdit(index);
    });

    row.appendChild(createCell(provider.name));
    row.appendChild(createCell(formatAddress(provider)));
    row.appendChild(createCell(provider.country));
    row.appendChild(createCell(provider.state));

    const statusCell = document.createElement("td");
    statusCell.appendChild(createStatusChip(provider.status));
    row.appendChild(statusCell);

    const assignmentCell = createAssignmentCell(provider);
    row.appendChild(assignmentCell);

    const websiteCell = document.createElement("td");
    if (provider.website) {
      const link = document.createElement("a");
      link.href = provider.website;
      let label = provider.website;
      try {
        label = new URL(provider.website).hostname;
      } catch (error) {
        // leave raw value
      }
      link.textContent = label;
      link.target = "_blank";
      link.rel = "noreferrer";
      websiteCell.appendChild(link);
    } else {
      websiteCell.textContent = "–";
    }
    row.appendChild(websiteCell);

    const actionCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.classList.add("table-actions");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("ghost", "ghost-small");
    editButton.textContent = "Bearbeiten";
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      startProviderEdit(index);
    });
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button", "tiny");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      removeProvider(index);
    });
    actionGroup.appendChild(editButton);
    actionGroup.appendChild(deleteButton);
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
  renderCategoryOverview();
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text || "–";
  return cell;
}

function createAssignmentCell(provider) {
  const assignments = getProviderAssignments(provider);

  const cell = document.createElement("td");
  if (!assignments.length) {
    cell.textContent = "–";
    return cell;
  }

  const wrapper = document.createElement("div");
  wrapper.classList.add("assignment-chip-list");
  assignments.forEach((assignment) => {
    const chip = document.createElement("span");
    chip.classList.add("assignment-chip");
    chip.textContent = formatAssignmentLabel(assignment);
    wrapper.appendChild(chip);
  });
  cell.appendChild(wrapper);
  return cell;
}

function removeProvider(index) {
  const providers = getStoredProviders();
  providers.splice(index, 1);
  saveProviders(providers);
  if (editingProviderIndex === index) {
    endProviderEdit();
  }
  renderProviders();
  renderCategoryOverview();
}

const hierarchyContainer = document.getElementById("category-hierarchy");
const topicForm = document.getElementById("topic-form");
const topicCancel = document.getElementById("topic-cancel");
const themeForm = document.getElementById("theme-form");
const topicCategorySelect = document.getElementById("topic-category-select");
const themeTopicSelect = document.getElementById("theme-topic-select");
const themeCategoryDisplay = document.getElementById("theme-category-display");
const topicMessage = document.getElementById("topic-message");
const themeMessage = document.getElementById("theme-message");
const themeCancel = document.getElementById("theme-cancel");
const themeSubmitButton = themeForm ? themeForm.querySelector("button[type='submit']") : null;
const overviewSearchInput = document.getElementById("overview-search");
const overviewContainer = document.getElementById("category-overview");
const overviewStats = document.getElementById("overview-stats");

const messageTimers = {};
let editingCategoryIndex = null;
let editingTopic = null;
let editingTheme = null;

function getStoredCategories() {
  try {
    return JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
  } catch (error) {
    console.warn("Kategorien konnten nicht geladen werden:", error);
    return [];
  }
}

function saveCategories(list) {
  localStorage.setItem(categoryStorageKey, JSON.stringify(list));
}

function ensureBaseCategories(forceReset = false) {
  const storedVersion = Number(localStorage.getItem(CATEGORY_BASE_VERSION_KEY) || 0);
  if (!forceReset && storedVersion >= CATEGORY_BASE_VERSION) {
    return;
  }
  const baseEntries = baseCategoryNames.map((name) => ({ name, topicAreas: [] }));
  saveCategories(baseEntries);
  localStorage.setItem(CATEGORY_BASE_VERSION_KEY, CATEGORY_BASE_VERSION.toString());
}

function seedDemoData(force = false) {
  ensureBaseCategories(force);
  const providers = getStoredProviders();
  if (!force && providers.length) {
    return;
  }
  const sampleProviders = baseCategoryNames.map((categoryName, index) => {
    const statuses = ["offen", "inbearbeitung", "erledigt"];
    return {
      name: `Demo Anbieter ${index + 1}`,
      street: `Demo Straße ${index + 1}`,
      postal: `10${(index + 10).toString().slice(-3)}`,
      city: "Wien",
      country: "Österreich",
      state: "Wien",
      website: `https://demo-${index + 1}.example`,
      status: statuses[index % statuses.length],
      assignments: [
        {
          category: categoryName,
          topic: "",
          theme: ""
        }
      ]
    };
  });
  saveProviders(sampleProviders);
  refreshAfterSeed();
}

function showMessage(element, text) {
  if (!element) {
    return;
  }
  clearTimeout(messageTimers[element.id]);
  element.textContent = text;
  if (!text) {
    return;
  }
  messageTimers[element.id] = setTimeout(() => {
    if (element.textContent === text) {
      element.textContent = "";
    }
  }, 2500);
}

function showProviderNotice(text, duration = 2500) {
  if (!message) {
    return;
  }
  clearTimeout(providerMessageTimer);
  message.textContent = text;
  if (!text) {
    return;
  }
  providerMessageTimer = setTimeout(() => {
    if (message.textContent === text) {
      message.textContent = "";
    }
  }, duration);
}

async function copyToClipboard(text, label) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn("Clipboard write failed:", error);
    }
  }
  const fallback = window.prompt(`${label} kopieren`, text);
  return fallback !== null;
}

function formatAssignmentLabel(entry) {
  const parts = [entry.category];
  if (entry.topic) {
    parts.push(entry.topic);
  }
  if (entry.theme) {
    parts.push(entry.theme);
  }
  return parts.join(" › ");
}

function getProviderAssignments(provider) {
  if (!provider) {
    return [];
  }
  if (Array.isArray(provider.assignments) && provider.assignments.length) {
    return provider.assignments;
  }
  if (provider.category && provider.topicArea && provider.theme) {
    return [
      {
        category: provider.category,
        topic: provider.topicArea,
        theme: provider.theme
      }
    ];
  }
  return [];
}

function matchesProviderSearchTerm(provider) {
  if (!providerSearchTerm) {
    return true;
  }
  const term = providerSearchTerm.trim().toLowerCase();
  if (!term) {
    return true;
  }
  const searchParts = [
    provider.name,
    provider.street,
    provider.postal,
    provider.city,
    provider.address,
    provider.country,
    provider.state,
    provider.status,
    provider.website
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const assignmentText = getProviderAssignments(provider)
    .map((assignment) => formatAssignmentLabel(assignment))
    .join(" ")
    .toLowerCase();
  return `${searchParts} ${assignmentText}`.includes(term);
}

function handleProviderSearchInput(event) {
  providerSearchTerm = event.target?.value || "";
  renderProviders();
}

function resetProviderSearch() {
  providerSearchTerm = "";
  if (providerSearchInput) {
    providerSearchInput.value = "";
  }
  renderProviders();
}

function renderProviderAssignments() {
  if (!providerAssociations) {
    return;
  }
  providerAssociations.innerHTML = "";
  if (!providerAssignments.length) {
    const helper = document.createElement("p");
    helper.classList.add("muted");
    helper.textContent = "Keine Zuordnung";
    providerAssociations.appendChild(helper);
    return;
  }
  const list = document.createElement("div");
  list.className = "assignment-chip-list";
  providerAssignments.forEach((assignment, index) => {
    const chip = document.createElement("span");
    chip.classList.add("assignment-chip");

    const label = document.createElement("span");
    label.textContent = formatAssignmentLabel(assignment);
    chip.appendChild(label);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.classList.add("chip-remove");
    remove.setAttribute("aria-label", `Zuordnung entfernen: ${formatAssignmentLabel(assignment)}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeProviderAssignment(index));

    chip.appendChild(remove);
    list.appendChild(chip);
  });
  providerAssociations.appendChild(list);
}

function addProviderAssignment() {
  const categoryName = providerCategorySelect?.value || "";
  const topicName = providerTopicSelect?.value || "";
  const themeName = providerThemeSelect?.value || "";

  if (!categoryName) {
    showProviderNotice("Bitte mindestens eine Kategorie wählen.");
    return;
  }

  const duplicate = providerAssignments.some(
    (assignment) =>
      assignment.category === categoryName &&
      assignment.topic === topicName &&
      assignment.theme === themeName
  );

  if (duplicate) {
    showProviderNotice("Diese Zuordnung existiert bereits.");
    return;
  }

  providerAssignments.push({
    category: categoryName,
    topic: topicName || "",
    theme: themeName || ""
  });
  renderProviderAssignments();
  showProviderNotice("Zuordnung hinzugefügt.");
  if (providerTopicSelect) {
    providerTopicSelect.value = "";
  }
  if (providerThemeSelect) {
    providerThemeSelect.value = "";
    providerThemeSelect.disabled = true;
  }
}

function removeProviderAssignment(index) {
  providerAssignments.splice(index, 1);
  renderProviderAssignments();
  showProviderNotice("Zuordnung entfernt.");
}

function resetProviderAssignments() {
  providerAssignments = [];
  renderProviderAssignments();
  if (providerCategorySelect) {
    providerCategorySelect.value = "";
  }
  updateProviderTopicOptions();
  updateProviderThemeOptions();
}

function populateProviderFormForEditing(provider) {
  if (!form || !provider) {
    return;
  }
  form.elements.name.value = provider.name || "";
  form.elements.website.value = provider.website || "";
  form.elements.status.value = provider.status || "offen";
  if (form.elements.street) {
    form.elements.street.value = provider.street || provider.address || "";
  }
  if (form.elements.postal) {
    form.elements.postal.value = provider.postal || "";
  }
  if (form.elements.city) {
    form.elements.city.value = provider.city || "";
  }
  if (provider.country) {
    countrySelect.value = provider.country;
    populateStateList(provider.country);
  }
  if (provider.state) {
    stateSelect.value = provider.state;
  }
}

function startProviderEdit(index) {
  switchView("providers");
  const providers = getStoredProviders();
  const provider = providers[index];
  if (!provider) {
    return;
  }
  editingProviderIndex = index;
  if (providerSubmitButton) {
    providerSubmitButton.textContent = "Änderung speichern";
  }
  if (providerCancelEdit) {
    providerCancelEdit.hidden = false;
  }
  populateProviderFormForEditing(provider);
  providerAssignments = getProviderAssignments(provider).map((assignment) => ({ ...assignment }));
  renderProviderAssignments();
  const primaryAssignment = providerAssignments[0];
  if (primaryAssignment && providerCategorySelect) {
    providerCategorySelect.value = primaryAssignment.category;
    updateProviderTopicOptions(primaryAssignment.category, primaryAssignment.topic);
    if (providerTopicSelect) {
      providerTopicSelect.value = primaryAssignment.topic;
    }
    updateProviderThemeOptions(primaryAssignment.topic, primaryAssignment.category);
    if (providerThemeSelect) {
      providerThemeSelect.value = primaryAssignment.theme;
    }
  } else {
    if (providerCategorySelect) {
      providerCategorySelect.value = "";
    }
    updateProviderTopicOptions();
    updateProviderThemeOptions();
  }
  showProviderNotice("Anbieter bearbeiten.");
}

function endProviderEdit(options = {}) {
  editingProviderIndex = null;
  if (providerSubmitButton) {
    providerSubmitButton.textContent = "Anbieter speichern";
  }
  if (providerCancelEdit) {
    providerCancelEdit.hidden = true;
  }
  form.reset();
  resetProviderAssignments();
  populateStateList(countrySelect.value);
  updateProviderSelectors();
  if (!options.keepNotice) {
    showProviderNotice("");
  }
}

function updateThemeCategoryDisplay() {
  if (!themeTopicSelect || !themeCategoryDisplay) {
    return;
  }
  const selectedOption = themeTopicSelect.selectedOptions[0];
  const categoryName = selectedOption && selectedOption.dataset.category ? selectedOption.dataset.category : "";
  themeCategoryDisplay.textContent = categoryName ? `Kategorie: ${categoryName}` : "Kategorie: –";
}

function updateSelectOptions(select, items, key, emptyText) {
  if (!select) {
    return;
  }
  const current = select.value;
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = emptyText;
  select.appendChild(placeholder);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[key];
    option.textContent = item[key];
    select.appendChild(option);
  });
  if (items.some((item) => item[key] === current)) {
    select.value = current;
  }
}

function updateTopicOptions() {
  if (!themeTopicSelect) {
    return;
  }
  const categories = getStoredCategories();
  themeTopicSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Themenbereich wählen";
  themeTopicSelect.appendChild(placeholder);
  let hasAny = false;
  categories.forEach((category) => {
    if (!category.topicAreas.length) {
      return;
    }
    const optgroup = document.createElement("optgroup");
    optgroup.label = category.name;
    category.topicAreas.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.name;
      option.textContent = topic.name;
      option.dataset.category = category.name;
      optgroup.appendChild(option);
      hasAny = true;
    });
    themeTopicSelect.appendChild(optgroup);
  });
  themeTopicSelect.disabled = !hasAny;
  if (!hasAny) {
    themeTopicSelect.value = "";
  }
  updateThemeCategoryDisplay();
}

function updateSelectors() {
  const categories = getStoredCategories();
  updateSelectOptions(topicCategorySelect, categories, "name", "Kategorie wählen");
  updateTopicOptions();
  updateProviderSelectors();
}

function updateProviderTopicOptions(categoryName = providerCategorySelect?.value, preferredTopic = "") {
  if (!providerTopicSelect || !providerThemeSelect) {
    return;
  }
  const categories = getStoredCategories();
  providerTopicSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Themenbereich wählen";
  providerTopicSelect.appendChild(placeholder);
  providerTopicSelect.disabled = true;

  providerThemeSelect.innerHTML = "";
  const themePlaceholder = document.createElement("option");
  themePlaceholder.value = "";
  themePlaceholder.textContent = "Thema wählen";
  providerThemeSelect.appendChild(themePlaceholder);
  providerThemeSelect.disabled = true;

  if (!categoryName) {
    return;
  }
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category || !category.topicAreas.length) {
    return;
  }
  category.topicAreas.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.name;
    option.textContent = topic.name;
    providerTopicSelect.appendChild(option);
  });
  providerTopicSelect.disabled = false;
  providerTopicSelect.value = preferredTopic && category.topicAreas.some((topic) => topic.name === preferredTopic) ? preferredTopic : "";
  if (providerTopicSelect.value) {
    updateProviderThemeOptions(providerTopicSelect.value, categoryName);
  }
}

function updateProviderThemeOptions(topicName = providerTopicSelect?.value, categoryName = providerCategorySelect?.value) {
  if (!providerThemeSelect) {
    return;
  }
  providerThemeSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Thema wählen";
  providerThemeSelect.appendChild(placeholder);
  providerThemeSelect.disabled = true;

  if (!topicName || !categoryName) {
    return;
  }
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    return;
  }
  const topic = category.topicAreas.find((entry) => entry.name === topicName);
  if (!topic || !topic.themes.length) {
    return;
  }
  topic.themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.name;
    option.textContent = theme.name;
    providerThemeSelect.appendChild(option);
  });
  providerThemeSelect.disabled = false;
}

function updateProviderSelectors() {
  const categories = getStoredCategories();
  if (providerCategorySelect) {
    updateSelectOptions(providerCategorySelect, categories, "name", "Kategorie wählen");
  }
  updateProviderTopicOptions();
}

function startCategoryEdit(index, name) {
  editingCategoryIndex = index;
  if (categoryForm) {
    categoryForm.elements.category.value = name;
  }
  if (categoryCancel) {
    categoryCancel.hidden = false;
  }
  showMessage(categoryMessage, "Kategorie bearbeiten");
}

function endCategoryEdit() {
  editingCategoryIndex = null;
  if (categoryForm) {
    categoryForm.reset();
  }
  if (categoryCancel) {
    categoryCancel.hidden = true;
  }
  showMessage(categoryMessage, "");
}

function startTopicEdit(categoryName, topicName) {
  editingTopic = { category: categoryName, topic: topicName };
  if (topicForm) {
    topicForm.elements.topicArea.value = topicName;
  }
  if (topicCategorySelect) {
    topicCategorySelect.value = categoryName;
  }
  if (topicCancel) {
    topicCancel.hidden = false;
  }
  showMessage(topicMessage, "Themenbereich bearbeiten");
}

function endTopicEdit() {
  editingTopic = null;
  if (topicForm) {
    topicForm.reset();
  }
  if (topicCancel) {
    topicCancel.hidden = true;
  }
  showMessage(topicMessage, "");
}

function startThemeEdit(categoryName, topicName, themeName, tags = []) {
  editingTheme = { category: categoryName, topic: topicName, theme: themeName };
  updateTopicOptions();
  if (themeTopicSelect) {
    themeTopicSelect.value = topicName;
  }
  updateThemeCategoryDisplay();
  if (themeForm) {
    themeForm.elements.theme.value = themeName;
    themeForm.elements.tags.value = tags.join(", ");
  }
  if (themeSubmitButton) {
    themeSubmitButton.textContent = "Aktualisieren";
  }
  if (themeCancel) {
    themeCancel.hidden = false;
  }
}

function endThemeEdit() {
  editingTheme = null;
  if (themeForm) {
    themeForm.reset();
  }
  updateThemeCategoryDisplay();
  if (themeSubmitButton) {
    themeSubmitButton.textContent = "Thema speichern";
  }
  if (themeCancel) {
    themeCancel.hidden = true;
  }
}

function addTagToTheme(categoryName, topicName, themeName, tagValue) {
  const value = tagValue.trim();
  if (!value) {
    showMessage(themeMessage, "Bitte ein Tag angeben.");
    return;
  }
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    showMessage(themeMessage, "Kategorie nicht gefunden.");
    return;
  }
  const topic = category.topicAreas.find((entry) => entry.name === topicName);
  if (!topic) {
    showMessage(themeMessage, "Themenbereich nicht gefunden.");
    return;
  }
  const themeEntry = topic.themes.find((entry) => entry.name === themeName);
  if (!themeEntry) {
    showMessage(themeMessage, "Thema nicht gefunden.");
    return;
  }
  if (themeEntry.tags.includes(value)) {
    showMessage(themeMessage, "Tag besteht bereits.");
    return;
  }
  themeEntry.tags.push(value);
  saveCategories(categories);
  showMessage(themeMessage, "Tag hinzugefügt.");
  renderHierarchy();
}

function removeTagFromTheme(categoryName, topicName, themeName, tagValue) {
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    return;
  }
  const topic = category.topicAreas.find((entry) => entry.name === topicName);
  if (!topic) {
    return;
  }
  const themeEntry = topic.themes.find((entry) => entry.name === themeName);
  if (!themeEntry) {
    return;
  }
  themeEntry.tags = themeEntry.tags.filter((tag) => tag !== tagValue);
  saveCategories(categories);
  showMessage(themeMessage, "Tag entfernt.");
  renderHierarchy();
}

function addCategoryEntry(name) {
  const value = name.trim();
  if (!value) {
    showMessage(categoryMessage, "Bitte einen Kategorienamen eingeben.");
    return false;
  }
  const categories = getStoredCategories();
  const existingIndex = categories.findIndex((entry) => entry.name.toLowerCase() === value.toLowerCase());

  if (editingCategoryIndex !== null) {
    if (existingIndex !== -1 && existingIndex !== editingCategoryIndex) {
      showMessage(categoryMessage, "Kategorie besteht bereits.");
      return false;
    }
    categories[editingCategoryIndex].name = value;
    saveCategories(categories);
    showMessage(categoryMessage, "Kategorie aktualisiert.");
    renderHierarchy();
    updateSelectors();
    endCategoryEdit();
    return true;
  }

  if (existingIndex !== -1) {
    showMessage(categoryMessage, "Kategorie besteht bereits.");
    return false;
  }

  categories.unshift({ name: value, topicAreas: [] });
  saveCategories(categories);
  showMessage(categoryMessage, "Kategorie gespeichert.");
  renderHierarchy();
  updateSelectors();
  return true;
}

function addTopicEntry(categoryName, topicName) {
  const value = topicName.trim();
  if (!categoryName) {
    showMessage(topicMessage, "Bitte eine Kategorie wählen.");
    return false;
  }
  if (!value) {
    showMessage(topicMessage, "Bitte einen Themenbereich angeben.");
    return false;
  }
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    showMessage(topicMessage, "Kategorie nicht gefunden.");
    return false;
  }

  if (editingTopic) {
    const topicIndex = category.topicAreas.findIndex((topic) => topic.name === editingTopic.topic);
    if (topicIndex === -1) {
      showMessage(topicMessage, "Themenbereich nicht gefunden.");
      return false;
    }
    if (
      category.topicAreas.some(
        (topic, idx) => topic.name.toLowerCase() === value.toLowerCase() && idx !== topicIndex
      )
    ) {
      showMessage(topicMessage, "Themenbereich existiert bereits.");
      return false;
    }
    category.topicAreas[topicIndex].name = value;
    saveCategories(categories);
    showMessage(topicMessage, "Themenbereich aktualisiert.");
    renderHierarchy();
    updateSelectors();
    endTopicEdit();
    return true;
  }

  if (category.topicAreas.some((topic) => topic.name.toLowerCase() === value.toLowerCase())) {
    showMessage(topicMessage, "Themenbereich existiert bereits.");
    return false;
  }
  category.topicAreas.push({ name: value, themes: [] });
  saveCategories(categories);
  showMessage(topicMessage, "Themenbereich gespeichert.");
  renderHierarchy();
  updateSelectors();
  return true;
}

function addThemeEntry(categoryName, topicName, themeName, tags, options = {}) {
  const value = (themeName || "").trim();
  if (!categoryName) {
    showMessage(themeMessage, "Bitte eine Kategorie wählen.");
    return false;
  }
  if (!topicName) {
    showMessage(themeMessage, "Bitte einen Themenbereich wählen.");
    return false;
  }
  if (!value) {
    showMessage(themeMessage, "Bitte ein Thema angeben.");
    return false;
  }
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    showMessage(themeMessage, "Kategorie nicht gefunden.");
    return false;
  }
  const topicEntry = category.topicAreas.find((topic) => topic.name === topicName);
  if (!topicEntry) {
    showMessage(themeMessage, "Themenbereich nicht gefunden.");
    return false;
  }
  if (!options.allowReplace && topicEntry.themes.some((theme) => theme.name.toLowerCase() === value.toLowerCase())) {
    showMessage(themeMessage, "Thema bereits vorhanden.");
    return false;
  }
  const tagsList = (tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  topicEntry.themes.push({ name: value, tags: tagsList });
  saveCategories(categories);
  if (!options.skipRender) {
    renderHierarchy();
  }
  updateSelectors();
  showMessage(themeMessage, options.successMessage || "Thema gespeichert.");
  return true;
}

function removeCategory(name) {
  const categories = getStoredCategories().filter((entry) => entry.name !== name);
  saveCategories(categories);
  renderHierarchy();
  updateSelectors();
}

function removeTopic(categoryName, topicName) {
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    return;
  }
  category.topicAreas = category.topicAreas.filter((topic) => topic.name !== topicName);
  saveCategories(categories);
  renderHierarchy();
  updateSelectors();
}

function removeTheme(categoryName, topicName, themeName, options = {}) {
  const categories = getStoredCategories();
  const category = categories.find((entry) => entry.name === categoryName);
  if (!category) {
    return;
  }
  const topic = category.topicAreas.find((entry) => entry.name === topicName);
  if (!topic) {
    return;
  }
  topic.themes = topic.themes.filter((theme) => theme.name !== themeName);
  saveCategories(categories);
  if (!options.skipRender) {
    renderHierarchy();
    updateSelectors();
  }
}

function matchesTopicHierarchy(topic, filterTerm) {
  if (!filterTerm) {
    return true;
  }
  if (!topic) {
    return false;
  }
  if ((topic.name || "").toLowerCase().includes(filterTerm)) {
    return true;
  }
  if (!Array.isArray(topic.themes)) {
    return false;
  }
  return topic.themes.some((theme) => {
    if ((theme.name || "").toLowerCase().includes(filterTerm)) {
      return true;
    }
    if (Array.isArray(theme.tags)) {
      return theme.tags.some((tag) => (tag || "").toLowerCase().includes(filterTerm));
    }
    return false;
  });
}

function matchesHierarchyFilter(category, filterTerm) {
  if (!filterTerm) {
    return true;
  }
  if ((category.name || "").toLowerCase().includes(filterTerm)) {
    return true;
  }
  return category.topicAreas.some((topic) => matchesTopicHierarchy(topic, filterTerm));
}

function renderHierarchy() {
  const categories = getStoredCategories();
  if (!hierarchyContainer) {
    return;
  }
  hierarchyContainer.innerHTML = "";
  const filterTerm = (hierarchySearchTerm || "").trim().toLowerCase();
  const categoriesWithIndex = categories.map((category, index) => ({ category, index }));
  const visibleCategories = filterTerm
    ? categoriesWithIndex.filter(({ category }) => matchesHierarchyFilter(category, filterTerm))
    : categoriesWithIndex;

  if (!categories.length) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("empty");
    placeholder.textContent = "Noch keine Kategorien angelegt.";
    hierarchyContainer.appendChild(placeholder);
  } else if (!visibleCategories.length) {
    const helper = document.createElement("p");
    helper.classList.add("muted");
    helper.textContent = "Keine Treffer zur Suche.";
    hierarchyContainer.appendChild(helper);
  } else {
    visibleCategories.forEach(({ category, index: catIndex }) => {
      const card = document.createElement("article");
      card.classList.add("hierarchy-card");

      const header = document.createElement("div");
      header.classList.add("hierarchy-header");

      const title = document.createElement("h4");
      title.textContent = category.name;
      header.appendChild(title);

      const actions = document.createElement("div");
      actions.classList.add("hierarchy-actions");
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.classList.add("ghost", "ghost-small");
      editButton.textContent = "Bearbeiten";
      editButton.addEventListener("click", () => startCategoryEdit(catIndex, category.name));
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button", "tiny");
      deleteButton.textContent = "Kategorie löschen";
      deleteButton.addEventListener("click", () => removeCategory(category.name));
      actions.appendChild(editButton);
      actions.appendChild(deleteButton);
      header.appendChild(actions);

      card.appendChild(header);

      const details = document.createElement("div");
      details.classList.add("hierarchy-details");

      const topicAreas = Array.isArray(category.topicAreas) ? category.topicAreas : [];
      const showAllTopics = !filterTerm || (category.name || "").toLowerCase().includes(filterTerm);
      const topicsToDisplay = showAllTopics
        ? topicAreas
        : topicAreas.filter((topic) => matchesTopicHierarchy(topic, filterTerm));

      if (!topicsToDisplay.length) {
        const helper = document.createElement("p");
        helper.classList.add("muted");
        helper.textContent = filterTerm
          ? "Keine Treffer im aktuellen Filter."
          : "Keine Themenbereiche definiert.";
        details.appendChild(helper);
      } else {
        topicsToDisplay.forEach((topic) => {
          const topicRow = document.createElement("div");
          topicRow.classList.add("hierarchy-topic");

          const topicHeader = document.createElement("div");
          topicHeader.classList.add("hierarchy-topic-header");
          const topicTitle = document.createElement("strong");
          topicTitle.textContent = topic.name;
          topicHeader.appendChild(topicTitle);

          const topicActions = document.createElement("div");
          topicActions.classList.add("hierarchy-actions");
          const editTopicButton = document.createElement("button");
          editTopicButton.type = "button";
          editTopicButton.classList.add("ghost", "ghost-small");
          editTopicButton.textContent = "Bearbeiten";
          editTopicButton.addEventListener("click", () => startTopicEdit(category.name, topic.name));
          const deleteTopicButton = document.createElement("button");
          deleteTopicButton.classList.add("ghost", "ghost-small");
          deleteTopicButton.textContent = "Bereich entfernen";
          deleteTopicButton.addEventListener("click", () => removeTopic(category.name, topic.name));
          topicActions.appendChild(editTopicButton);
          topicActions.appendChild(deleteTopicButton);
          topicHeader.appendChild(topicActions);

          topicRow.appendChild(topicHeader);

          const themeList = document.createElement("div");
          themeList.classList.add("hierarchy-theme-list");
          const themeEntries = Array.isArray(topic.themes) ? topic.themes : [];

          if (!themeEntries.length) {
            const helper = document.createElement("p");
            helper.classList.add("muted");
            helper.textContent = "Noch keine Themen angelegt.";
            themeList.appendChild(helper);
          } else {
            themeEntries.forEach((theme) => {
              if (!Array.isArray(theme.tags)) {
                theme.tags = [];
              }
              const themeItem = document.createElement("div");
              themeItem.classList.add("hierarchy-theme");

              const themeHead = document.createElement("div");
              themeHead.classList.add("hierarchy-theme-head");
              const themeTitle = document.createElement("span");
              themeTitle.textContent = theme.name;
              themeHead.appendChild(themeTitle);

              const themeActions = document.createElement("div");
              themeActions.classList.add("hierarchy-actions");
              const editThemeButton = document.createElement("button");
              editThemeButton.type = "button";
              editThemeButton.classList.add("ghost", "ghost-small");
              editThemeButton.textContent = "Bearbeiten";
              editThemeButton.addEventListener("click", () =>
                startThemeEdit(category.name, topic.name, theme.name, theme.tags)
              );
              const deleteThemeButton = document.createElement("button");
              deleteThemeButton.type = "button";
              deleteThemeButton.classList.add("ghost", "ghost-small");
              deleteThemeButton.textContent = "Thema entfernen";
              deleteThemeButton.addEventListener("click", () =>
                removeTheme(category.name, topic.name, theme.name)
              );
              themeActions.appendChild(editThemeButton);
              themeActions.appendChild(deleteThemeButton);
              themeHead.appendChild(themeActions);

              themeItem.appendChild(themeHead);

              const tagRow = document.createElement("div");
              tagRow.classList.add("hierarchy-tags");
              if (!theme.tags.length) {
                const helper = document.createElement("p");
                helper.classList.add("muted");
                helper.textContent = "Keine Tags definiert.";
                tagRow.appendChild(helper);
              } else {
                theme.tags.forEach((tag) => {
                  const chip = document.createElement("span");
                  chip.classList.add("tag-chip");
                  chip.textContent = tag;
                  const removeBtn = document.createElement("button");
                  removeBtn.type = "button";
                  removeBtn.classList.add("tag-remove");
                  removeBtn.setAttribute("aria-label", `Tag ${tag} entfernen`);
                  removeBtn.textContent = "×";
                  removeBtn.addEventListener("click", () =>
                    removeTagFromTheme(category.name, topic.name, theme.name, tag)
                  );
                  chip.appendChild(removeBtn);
                  tagRow.appendChild(chip);
                });
              }
              themeItem.appendChild(tagRow);

              const tagEditor = document.createElement("div");
              tagEditor.classList.add("hierarchy-tag-editor");
              const tagInput = document.createElement("input");
              tagInput.type = "text";
              tagInput.placeholder = "Tag hinzufügen";
              const tagButton = document.createElement("button");
              tagButton.type = "button";
              tagButton.classList.add("ghost", "ghost-small");
              tagButton.textContent = "Tag hinzufügen";
              tagButton.addEventListener("click", () => {
                const value = (tagInput.value || "").trim();
                if (!value) {
                  showMessage(themeMessage, "Bitte ein Tag eingeben.");
                  return;
                }
                addTagToTheme(category.name, topic.name, theme.name, value);
                tagInput.value = "";
              });
              tagEditor.appendChild(tagInput);
              tagEditor.appendChild(tagButton);
              themeItem.appendChild(tagEditor);

              themeList.appendChild(themeItem);
            });
          }

          topicRow.appendChild(themeList);
          details.appendChild(topicRow);
        });
      }

      card.appendChild(details);
      hierarchyContainer.appendChild(card);
    });
  }

  if (categoryCount) {
    const totalText = categories.length === 1 ? "1 Kategorie" : `${categories.length} Kategorien`;
    if (filterTerm) {
      const resultText =
        visibleCategories.length === 1 ? "1 Treffer" : `${visibleCategories.length} Treffer`;
      categoryCount.textContent = `${totalText} · ${resultText}`;
    } else {
      categoryCount.textContent = totalText;
    }
  }
  renderCategoryOverview();
  renderDashboard();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: (data.get("name") || "").trim(),
    street: (data.get("street") || "").trim(),
    postal: (data.get("postal") || "").trim(),
    city: (data.get("city") || "").trim(),
    country: data.get("country"),
    state: (data.get("state") || "").trim(),
    website: (data.get("website") || "").trim(),
    status: data.get("status"),
    assignments: providerAssignments.map((assignment) => ({ ...assignment }))
  };

  if (
    !payload.name ||
    !payload.country ||
    !payload.state ||
    !payload.street ||
    !payload.postal ||
    !payload.city
  ) {
    showProviderNotice("Bitte alle Pflichtfelder ausfüllen.");
    return;
  }

  if (!providerAssignments.length) {
    showProviderNotice("Bitte mindestens eine Themenzuordnung anlegen.");
    return;
  }

  if (editingProvider?.id) {
    await updateProvider(editingProvider.id, payload);
  } else {
    await createProvider(payload);
  }

  form.reset();
  resetProviderAssignments();
  editingProvider = null;
  providerSubmitButton.textContent = "Anbieter speichern";
  renderProviders();
  renderDashboard();
});

  if (
    !provider.name ||
    !provider.country ||
    (!provider.state && !stateSelect.disabled) ||
    !street ||
    !postal ||
    !city
  ) {
    showProviderNotice("Bitte alle Pflichtfelder ausfüllen.");
    return;
  }

  provider.address = formatAddress(provider);

  if (!providerAssignments.length) {
    showProviderNotice("Bitte mindestens eine Themenzuordnung anlegen.");
    return;
  }

  provider.assignments = providerAssignments.map((assignment) => ({ ...assignment }));
  const providers = getStoredProviders();
  const primaryAssignment = provider.assignments[0];
  if (primaryAssignment) {
    provider.category = primaryAssignment.category;
    provider.topicArea = primaryAssignment.topic;
    provider.theme = primaryAssignment.theme;
  } else {
    provider.category = "";
    provider.topicArea = "";
    provider.theme = "";
  }

  if (editingProviderIndex !== null && typeof providers[editingProviderIndex] !== "undefined") {
    providers[editingProviderIndex] = provider;
    saveProviders(providers);
    renderProviders();
    updateProviderSelectors();
    endProviderEdit({ keepNotice: true });
    showProviderNotice("Anbieter aktualisiert.");
    return;
  }

  providers.unshift(provider);
  saveProviders(providers);
  form.reset();
  resetProviderAssignments();
  populateStateList(countrySelect.value);
  showProviderNotice("Anbieter gespeichert.");
  renderProviders();
  updateProviderSelectors();
});

countrySelect.addEventListener("change", () => {
  populateStateList(countrySelect.value);
});

initPasswordGate();
seedDemoData();
populateCountryList();
populateDashboardCountryOptions();
renderProviders();
updateSelectors();
renderHierarchy();
renderProviderAssignments();
endProviderEdit();
updateFooterTime();
setInterval(updateFooterTime, 60 * 1000);
renderDashboard();
setGapTab("top");

if (categoryForm) {
  categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = categoryForm.elements.category.value || "";
    const success = addCategoryEntry(value);
    if (success) {
      categoryForm.reset();
    }
  });
  if (categoryCancel) {
    categoryCancel.addEventListener("click", () => {
      endCategoryEdit();
    });
  }
}

if (topicForm) {
  topicForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(topicForm);
    addTopicEntry(data.get("category"), data.get("topicArea"));
    topicForm.reset();
  });
  if (topicCancel) {
    topicCancel.addEventListener("click", () => {
      endTopicEdit();
    });
  }
}

if (themeForm) {
  themeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(themeForm);
    const topicSelect = themeTopicSelect;
    const selectedOption = topicSelect ? topicSelect.selectedOptions[0] : null;
    const categoryName = selectedOption && selectedOption.dataset.category ? selectedOption.dataset.category : "";
    const topicValue = topicSelect ? topicSelect.value : "";
    const themeValue = data.get("theme");
    const tagsValue = data.get("tags");
    let success = false;

    if (editingTheme) {
      removeTheme(editingTheme.category, editingTheme.topic, editingTheme.theme, { skipRender: true });
      success = addThemeEntry(categoryName, topicValue, themeValue, tagsValue, {
        successMessage: "Thema aktualisiert."
      });
    } else {
      success = addThemeEntry(categoryName, topicValue, themeValue, tagsValue);
    }

    if (success) {
      themeForm.reset();
      updateTopicOptions();
      updateThemeCategoryDisplay();
      endThemeEdit();
    }
  });
  if (themeTopicSelect) {
    themeTopicSelect.addEventListener("change", () => {
      updateThemeCategoryDisplay();
    });
  }
  if (themeCancel) {
    themeCancel.addEventListener("click", () => {
      endThemeEdit();
      themeForm.reset();
      updateTopicOptions();
    });
  }
}

if (providerCategorySelect) {
  providerCategorySelect.addEventListener("change", () => {
    updateProviderTopicOptions(providerCategorySelect.value);
  });
}

if (providerTopicSelect) {
  providerTopicSelect.addEventListener("change", () => {
    updateProviderThemeOptions(providerTopicSelect.value, providerCategorySelect?.value);
  });
}

if (providerAssocAdd) {
  providerAssocAdd.addEventListener("click", addProviderAssignment);
}

if (providerCancelEdit) {
  providerCancelEdit.addEventListener("click", endProviderEdit);
}

if (newProviderButton) {
  newProviderButton.addEventListener("click", () => {
    endProviderEdit();
    showProviderNotice("Bereit für neuen Anbieter.");
  });
}

if (providerExportButton) {
  providerExportButton.addEventListener("click", async () => {
    const payload = JSON.stringify(getStoredProviders(), null, 2);
    const success = await copyToClipboard(payload, "Anbieterliste");
    showProviderNotice(success ? "Anbieterliste kopiert." : "Kopie abgebrochen.");
  });
}

if (providerRefreshButton) {
  providerRefreshButton.addEventListener("click", () => {
    renderProviders();
    showProviderNotice("Liste aktualisiert.");
  });
}

if (seedDemoButton) {
  seedDemoButton.addEventListener("click", () => {
    seedDemoData(true);
    showProviderNotice("Demo-Daten geladen.");
  });
}

if (overviewNewProviderButton) {
  overviewNewProviderButton.addEventListener("click", () => {
    switchView("providers");
    endProviderEdit();
    showProviderNotice("Formular bereit.");
  });
}

if (providerSearchInput) {
  providerSearchInput.addEventListener("input", handleProviderSearchInput);
  providerSearchInput.addEventListener("search", handleProviderSearchInput);
  providerSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      resetProviderSearch();
    }
  });
}


if (gapTabButtons.length) {
  gapTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setGapTab(button.dataset.tab);
    });
  });
}

if (dashboardTabs.length) {
  dashboardTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateDashboardPane(tab.dataset.dashboardPane);
    });
  });
  activateDashboardPane("overview");
}

if (dashboardGapCategorySelect) {
  dashboardGapCategorySelect.addEventListener("change", () => {
    renderGapSummary(aggregateCategoryTopicStateCounts(getStoredProviders()));
  });
}

if (overviewSearchInput) {
  overviewSearchInput.addEventListener("input", renderCategoryOverview);
  overviewSearchInput.addEventListener("search", renderCategoryOverview);
}

if (hierarchySearchInput) {
  const handleHierarchySearchInput = (event) => {
    hierarchySearchTerm = event.target?.value || "";
    renderHierarchy();
  };
  hierarchySearchInput.addEventListener("input", handleHierarchySearchInput);
  hierarchySearchInput.addEventListener("search", handleHierarchySearchInput);
  hierarchySearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hierarchySearchInput.value = "";
      hierarchySearchTerm = "";
      renderHierarchy();
    }
  });
}

function focusCategoryInputField() {
  categoryForm?.elements.category?.focus();
  showMessage(categoryMessage, "Bereit für neue Kategorie.");
}

if (categoryFocusButton) {
  categoryFocusButton.addEventListener("click", focusCategoryInputField);
}


if (categoryExportButton) {
  categoryExportButton.addEventListener("click", async () => {
    const payload = JSON.stringify(getStoredCategories(), null, 2);
    const success = await copyToClipboard(payload, "Kategorien");
    showMessage(categoryMessage, success ? "Kategorien kopiert." : "Kopie abgebrochen.");
  });
}

if (overviewRefreshButton) {
  overviewRefreshButton.addEventListener("click", () => {
    renderCategoryOverview();
    showMessage(categoryMessage, "Übersicht aktualisiert.");
  });
}

if (overviewCategoryButton) {
  overviewCategoryButton.addEventListener("click", () => {
    switchView("categories");
    showMessage(categoryMessage, "Kategorien-Modul geöffnet.");
  });
}

if (dashboardRefreshButton) {
  dashboardRefreshButton.addEventListener("click", () => {
    renderDashboard();
    showProviderNotice("Dashboard aktualisiert.");
  });
}

if (dashboardCountrySelect) {
  dashboardCountrySelect.addEventListener("change", (event) => {
    dashboardCountry = event.target.value;
    dashboardDisplayStates = getDisplayStatesForCountry(dashboardCountry);
    renderDashboard();
    showProviderNotice(`Dashboard-Land auf ${dashboardCountry} gesetzt.`);
  });
}

function switchView(view, options = {}) {
  if (!view || !(view in viewMap)) {
    return;
  }
  updateHeroTitle(view);
  contentPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.view === view);
  });
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
    button.setAttribute("aria-selected", button.dataset.view === view ? "true" : "false");
  });
  if (!options.skipHash) {
    try {
      window.location.hash = `#${viewMap[view]}`;
    } catch {
      // fail silently (e.g., file:// restrictions)
    }
  }
}

if (navButtons.length) {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });
  });
  const resolvedHashView = viewFromHash(window.location.hash);
  switchView(resolvedHashView || "providers", { skipHash: Boolean(resolvedHashView) });
}

window.addEventListener("hashchange", () => {
  const resolved = viewFromHash(window.location.hash);
  if (resolved) {
    switchView(resolved, { skipHash: true });
  }
});
