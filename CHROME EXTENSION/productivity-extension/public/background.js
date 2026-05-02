let currentTab = "";
let startTime = Date.now();

function saveTime(domain, timeSpent) {
  chrome.storage.local.get(["timeData"], (res) => {
    let data = res.timeData || {};
    data[domain] = (data[domain] || 0) + timeSpent;
    chrome.storage.local.set({ timeData: data });
  });
}

function track(url) {
  if (!url) return;

  const domain = new URL(url).hostname;

  if (currentTab) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    saveTime(currentTab, timeSpent);
  }

  currentTab = domain;
  startTime = Date.now();
}

chrome.tabs.onActivated.addListener(async (info) => {
  const tab = await chrome.tabs.get(info.tabId);
  track(tab.url);
});

chrome.tabs.onUpdated.addListener((id, change, tab) => {
  if (change.status === "complete") {
    track(tab.url);
  }
});