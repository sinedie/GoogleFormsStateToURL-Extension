async function init() {
  let [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const port = browser.tabs.connect(tab.id, {
    name: "googleFormsStateToURL",
  });

  port.onMessage.addListener((msg) => {
    if (msg.action === "returnPrefilledURL") {
      navigator.clipboard.writeText(msg.url.replaceAll("&amp;", "&"));
      document.getElementById("status").innerHTML = "Copied URL";
    }
  });

  const prefilledURLTrigger = document.getElementById("getPrefilledURLTrigger");
  prefilledURLTrigger.addEventListener("click", () => {
    port.postMessage({ action: "getPrefilledURL" });
  });
}

init();
