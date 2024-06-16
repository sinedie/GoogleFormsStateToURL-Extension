function init() {
  if (window.isGoogleFormsStateToURLActive === true) return;
  window.isGoogleFormsStateToURLActive = true;

  (browser ?? chrome).runtime.onConnect.addListener((port) => {
    if (port.name !== "googleFormsStateToURL") return;

    port.onMessage.addListener((msg) => {
      if (msg.action === "getPrefilledURL") {
        const url = GetPrefilledURL();
        port.postMessage({ action: "returnPrefilledURL", url: url.toString() });
      }
    });

    function GetPrefilledURL() {
      const inputs = document.querySelectorAll("input[type='hidden']");
      const url = new URL(window.location.href);
      inputs.forEach((input) => {
        if (!input.name.startsWith("entry.") || !input.value) return;
        url.searchParams.append(input.name, input.value);
      });
      return url;
    }
  });
}

init();
