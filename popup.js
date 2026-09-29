const $ = (id) => document.getElementById(id);

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
  $("page-title").textContent = ctx.title || "タイトルなし";
  $("selection").textContent = ctx.selection ? "選択：" + ctx.selection.slice(0, 100) : "";

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