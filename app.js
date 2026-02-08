const supabaseUrl = "https://btnqmsvbzdluttswgkf.supabase.co";
const supabaseAnonKey = "sb_publishable_lwkUFRYQMlgIegEsDjJ7CQ_s-IE1...";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
const providerTable = "providers";
const categoryTable = "categories";
const topicTable = "topic_areas";
const themeTable = "themes";


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

}

.select("*")
.order("category_id");
return handleResponse(data, error, []);

async function fetchThemes() {
const { data, error } = await supabase
.from(themeTable)
.select("*")
.order("topic_area_id");
return handleResponse(data, error, []);
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
statusCell.appendChild(createStatusChip(provider.status || "o en"));
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

ff

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

}

tableBody.appendChild(row);
});

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
){
showProviderNotice("Bitte alle P ichtfelder ausfüllen.");
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

fl

form.reset();

resetProviderAssignments();
editingProvider = null;
if (providerSubmitButton) {
providerSubmitButton.textContent = "Anbieter speichern";
}
renderProviders();
renderDashboard();
});
async function refreshDashboardData() {
const providers = await fetchProviders();
const categories = await fetchCategories();
return { providers, categories };
}
async function renderDashboard() {
const { providers, categories } = await refreshDashboardData();
const counts = buildProviderCounts(providers);
renderStateChart(await aggregateStateCounts(providers));
renderCategoryBars(await aggregateCategoryStateCounts(providers));
renderCategoryTopicStateChart(await aggregateCategoryTopicStateCounts(providers));
renderCompletionGauge(await aggregateCategoryTopicStateCounts(providers));
renderTopFlopSummary(providers);
if (dashboardCategoryCounts) {
dashboardCategoryCounts.innerHTML = "";
if (!categories.length) {
dashboardCategoryCounts.appendChild(createEmpty("Noch keine Kategorien de niert."));
} else {
categories.forEach((category) => {
const categoryData = counts.categories[category.name] || 0;
const card = document.createElement("article");
card.className = "dashboard-category-card";
card.innerHTML = `<strong>${category.name}</strong><span>${categoryData} Anbieter</
span>`;
dashboardCategoryCounts.appendChild(card);
});
}
}
}

fi

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

