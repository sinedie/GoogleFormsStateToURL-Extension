function init() {
  if (window.isGoogleFormsStateToURLActive === true) return;
  window.isGoogleFormsStateToURLActive = true;

  (chrome ?? browser).runtime.onConnect.addListener((port) => {
    if (port.name !== "googleFormsStateToURL") return;

    port.onMessage.addListener((msg) => {
      if (msg.action === "getPrefilledURL") {
        port.postMessage({
          action: "returnPrefilledURL",
          url: GetPrefilledURL(),
        });
      }
    });

    function GetPrefilledURL() {
      const url = new URL(window.location.href);
      document.querySelectorAll("input[type='hidden']").forEach((input) => {
        if (!input.name.startsWith("entry.") || !input.value) return;
        url.searchParams.append(input.name, input.value);
      });
      return url.toString();
    }
  });
}

init();
