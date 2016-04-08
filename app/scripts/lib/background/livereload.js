// Use for page reloads

if (LIVERELOAD) {
  const LIVERELOAD_HOST = "localhost";
  const LIVERELOAD_PORT = 35729;
  const connection = new WebSocket(`ws://${LIVERELOAD_HOST}:${LIVERELOAD_PORT}/livereload`);

  connection.onerror = (error) => {
    console.error("reload connection got error:", error);
  };

  connection.onmessage = (e) => {
    if (e.data) {
      const data = JSON.parse(e.data);
      if (data && data.command === "reload") {
        // chrome.runtime.reload();

        // Using Extensions Reloader
        // https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
        const reloadUrl = "http://reload.extensions/";
        chrome.tabs.query({ url: reloadUrl }, (tabs) => {
          if (tabs.length === 0) {
            chrome.tabs.create({ url: reloadUrl, active: false });
          }
        });
      }
    }
  };

  console.log("%cLivereload: enabled", "color: gray");
}
