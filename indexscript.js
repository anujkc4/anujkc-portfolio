// page load
const iframe = document.getElementById("rightFrame");

// this change the right part when icons are clicked
function loadPage(page) {
  document.getElementById("rightFrame").src = page;
}

document.getElementById("homeIcon").addEventListener("click", () => {
  const currentPage = iframe.src.split("/").pop();
  if (currentPage !== "index.html") {
    loadPage("main.html");
  }
});
document.getElementById("anoutmeIcon").addEventListener("click", () => {
  loadPage("aboutme.html");
});
document.getElementById("projectIcon").addEventListener("click", () => {
  loadPage("project.html");
});
document.getElementById("resumeIcon").addEventListener("click", () => {
  return 0;
});

// dark and light mode part

const navicons = document.querySelectorAll("i");
const rightside = document.querySelector(".right");
const lefttside = document.querySelector(".left");

const darkmodebtn = document.querySelector("#mode");
darkmodebtn.addEventListener("click", () => {
  let btnicon = document.querySelector(".footer-item i");

  if (btnicon.classList.contains("fa-moon")) {
    changemodetowhite(btnicon);
  } else {
    changemodetodark(btnicon);
  }
});

// light mode

function changemodetowhite(btnicon) {
  btnicon.className = "fa-solid fa-lightbulb";

  rightside.style.backgroundColor = "#ffff";
  lefttside.style.backgroundColor = "#e5d4d4ff";

  navicons.forEach((icon) => {
    icon.style.color = "#000000";
  });
  // iframe.contentWindow.postMessage({ theme: "light" }, "*");
}

// dark mode

function changemodetodark(btnicon) {
  btnicon.className = "fa-solid fa-moon";

  rightside.style.backgroundColor = "#000019";
  lefttside.style.backgroundColor = "#000000";

  navicons.forEach((icon) => {
    icon.style.color = "#fff";
  });
  // iframe.contentWindow.postMessage({ theme: "dark" }, "*");
}

// hover effect on darkmode

navicons.forEach((icon) => {
  icon.addEventListener("mouseover", () => {
    icon.style.color = "#00c2ff";
  });
  icon.addEventListener("mouseout", () => {
    let btnicon = document.querySelector(".footer-item i");

    if (btnicon.classList.contains("fa-moon")) {
      icon.style.color = "#fff";
    } else {
      icon.style.color = "#000";
    }
  });
});

// ---------- THEME SYNC GLUE (non-invasive) ----------
/*
  Purpose: persist the user's choice and resend it whenever the iframe loads a new page.
  This does NOT alter your existing functions or logic; it only listens/reads state
  and resends the appropriate postMessage after iframe navigation.
*/

(function () {
  // small helper to read current theme from your footer icon (keeps your logic intact)
  function readThemeFromFooterIcon() {
    const btnicon = document.querySelector(".footer-item i");
    // you use fa-moon for dark; fa-lightbulb (or other) for light — same check as your code
    return btnicon && btnicon.classList.contains("fa-moon") ? "dark" : "light";
  }

  // Persist theme so new pages know what to apply even after reloads/navigation
  // We update localStorage whenever the user clicks (listen for clicks on the footer icon).
  // This does not replace your functions; it only stores the user's selection.
  const footerIcon = document.querySelector(".footer-item i");
  if (footerIcon) {
    footerIcon.addEventListener("click", () => {
      // small delay to let your changemodetodark / changemodetowhite run and update the class
      setTimeout(() => {
        const theme = readThemeFromFooterIcon();
        localStorage.setItem("theme", theme);
        // immediately send to currently loaded iframe page as you already do
        try {
          iframe.contentWindow.postMessage({ theme }, "*");
        } catch (e) {}
      }, 40); // 30-80ms is fine
    });
  }

  // On parent load: if a theme is saved in localStorage, send it to iframe once
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      // small timeout to let iframe be available
      setTimeout(() => {
        try {
          iframe.contentWindow.postMessage({ theme: saved }, "*");
        } catch (e) {}
      }, 120);
    }
  });

  // Every time the iframe navigates/loads, resend the saved theme (or read from footer if none)
  iframe.addEventListener("load", () => {
    const saved = localStorage.getItem("theme");
    const themeToSend = saved || readThemeFromFooterIcon() || "light";
    // short delay gives the child page time to attach its message listener
    setTimeout(() => {
      try {
        iframe.contentWindow.postMessage({ theme: themeToSend }, "*");
        console.log("Parent -> resent theme on iframe load:", themeToSend);
      } catch (e) {
        console.warn("Parent: failed to post theme on iframe load:", e);
      }
    }, 60);
  });
})();
// ---------- end theme sync glue ----------

// ---------- Restore theme on load (keeps your existing logic intact) ----------
(function restoreThemeOnLoad() {
  // read previously saved theme (we used localStorage in the glue)
  const saved = localStorage.getItem("theme"); // "dark" or "light" or null
  if (!saved) return; // nothing to restore

  const btnicon = document.querySelector(".footer-item i");
  if (!btnicon) return;

  // Apply the same visual changes your functions use so the UI and logic match
  if (saved === "dark") {
    // make footer icon show moon as your changemodetodark does
    btnicon.className = "fa-solid fa-moon";

    // apply same colors you use for dark
    try {
      rightside.style.backgroundColor = "#000019";
      lefttside.style.backgroundColor = "#000000";
      navicons.forEach((icon) => {
        icon.style.color = "#fff";
      });
    } catch (e) {}
  } else {
    // light mode visual state
    btnicon.className = "fa-solid fa-lightbulb";

    try {
      rightside.style.backgroundColor = "#ffff";
      lefttside.style.backgroundColor = "#e5d4d4ff";
      navicons.forEach((icon) => {
        icon.style.color = "#000000";
      });
    } catch (e) {}
  }

  // keep in-memory state (if you use a currentTheme var elsewhere)
  try {
    currentTheme = saved;
  } catch (e) {}

  // finally send the saved theme to whatever page is currently loaded in the iframe
  // short timeout to ensure iframe.contentWindow is ready
  setTimeout(() => {
    try {
      iframe.contentWindow.postMessage({ theme: saved }, "*");
      console.log("Parent: restored theme on load ->", saved);
    } catch (e) {
      console.warn("Parent: failed to send restored theme:", e);
    }
  }, 80);
})();
// ---------- end restore ----------
