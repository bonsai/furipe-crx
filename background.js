chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "furipe-search-selection",
    title: "FURIPEで「%s」を探す",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "furipe-search-selection" || !info.selectionText) return;
  const q = info.selectionText.trim().slice(0, 80);
  if (!q) return;
  chrome.tabs.create({
    url: "https://furipe.net/search/?q=" + encodeURIComponent(q)
  });
});