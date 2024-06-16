async function init() {
  document
    .getElementById("getPrefilledURLTrigger")
    .addEventListener("click", async () => {
      try {
        const port = await setupConection();
        port.postMessage({ action: "getPrefilledURL" });
      } catch (e) {
        document.getElementById("status").innerHTML = "Extension error";
        throw e;
      }
    });
}

async function setupConection() {
  const [tab] = await (chrome ?? browser).tabs.query({
    active: true,
    currentWindow: true,
  });

  const port = (chrome ?? browser).tabs.connect(tab.id, {
    name: "googleFormsStateToURL",
  });

  port.onMessage.addListener((msg) => {
    if (msg.action === "returnPrefilledURL") {
      navigator.clipboard.writeText(msg.url.replaceAll("&amp;", "&"));
      document.getElementById("status").innerHTML = "Copied URL";
    }
  });

  return port;
}

init();
