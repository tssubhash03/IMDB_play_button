(() => {
  const BUTTON_ID = "imdb-play-button-floating";
  const STYLE_ID = "imdb-play-button-style";

  function isTitlePage() {
    const { pathname } = window.location;
    return /^\/title\/tt\d+\/?$/.test(pathname);
  }

  function buildPlayUrl() {
    const url = new URL(window.location.href);
    url.hostname = "www.playimdb.com";
    return url.toString();
  }

  function removeButton() {
    const existingButton = document.getElementById(BUTTON_ID);
    if (existingButton) {
      existingButton.remove();
    }
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 60px;
        height: 60px;
        border: 0;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #f5c518 0%, #ffda4d 100%);
        color: #111;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
        cursor: pointer;
        z-index: 2147483647;
        transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
      }

      #${BUTTON_ID}:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
      }

      #${BUTTON_ID}:active {
        transform: translateY(0) scale(0.98);
      }

      #${BUTTON_ID} svg {
        width: 26px;
        height: 26px;
        margin-left: 3px;
        pointer-events: none;
      }

      @media (max-width: 640px) {
        #${BUTTON_ID} {
          right: 16px;
          bottom: 16px;
          width: 54px;
          height: 54px;
        }
      }
    `;
    document.documentElement.appendChild(style);
  }

  function createButton() {
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    ensureStyles();

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.setAttribute("aria-label", "Open movie streaming page");
    button.title = "Open streaming page";
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M8 5v14l11-7z"></path>
      </svg>
    `;

    button.addEventListener("click", () => {
      window.location.href = buildPlayUrl();
    });

    document.body.appendChild(button);
  }

  function syncButton() {
    if (!document.body) {
      return;
    }

    if (isTitlePage()) {
      createButton();
    } else {
      removeButton();
    }
  }

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("imdb-play-urlchange"));
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("imdb-play-urlchange"));
    return result;
  };

  window.addEventListener("popstate", syncButton);
  window.addEventListener("imdb-play-urlchange", syncButton);
  window.addEventListener("hashchange", syncButton);

  const observer = new MutationObserver(() => syncButton());

  function start() {
    syncButton();
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
