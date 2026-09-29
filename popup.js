const $ = (id) => document.getElementById(id);
const DEFAULTS = { filters: { exclude_genres: ["求人"] } };

async function getSettings() {
  return new Promise((resolve) => chrome.storage.sync.get(DEFAULTS, resolve));
}

async function saveSettings(settings) {
  return new Promise((resolve) => chrome.storage.sync.set(settings, resolve));
}

async function getPageContext() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { title: "", selection: "" };
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        title: document.title || "",
        selection: window.getSelection()?.toString().trim() || ""
      })
    });
    return result?.[0]?.result || { title: tab.title || "", selection: "" };
  } catch {
    return { title: tab.title || "", selection: "" };
  }
}

function search(q) {
  const value = q.trim();
  if (!value) return;
  chrome.tabs.create({
    url: "https://furipe.net/search/?q=" + encodeURIComponent(value)
  });
  window.close();
}

(async () => {
  const ctx = await getPageContext();
  const settings = await getSettings();

  $("page-title").textContent = ctx.title || "タイトルなし";
  $("selection").textContent = ctx.selection ? "選択：" + ctx.selection.slice(0, 100) : "";
  $("exclude-jobs").checked = settings.filters.exclude_genres.includes("求人");

  $("exclude-jobs").addEventListener("change", async (event) => {
    const next = {
      filters: {
        ...settings.filters,
        exclude_genres: event.target.checked
          ? [...new Set([...settings.filters.exclude_genres, "求人"])]
          : settings.filters.exclude_genres.filter((genre) => genre !== "求人")
      }
    };
    settings.filters = next.filters;
    await saveSettings(next);
  });

  $("search").onclick = () => search($("query").value);
  $("current").onclick = () => search(ctx.selection || ctx.title);
  document.querySelectorAll("[data-q]").forEach((button) => {
    button.onclick = () => search(button.dataset.q);
  });
  $("query").addEventListener("keydown", (event) => {
    if (event.key === "Enter") search($("query").value);
  });
  if (ctx.selection) $("query").value = ctx.selection.slice(0, 80);
})();