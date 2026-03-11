(function () {
  var storageKey = "newpop-theme";
  var root = document.documentElement;

  function normalizeTheme(themeValue) {
    return themeValue === "light" ? "light" : "dark";
  }

  function applyTheme(themeValue, persist) {
    var normalizedTheme = normalizeTheme(themeValue);
    root.setAttribute("data-theme", normalizedTheme);
    root.setAttribute("data-resolved-theme", normalizedTheme);

    if (persist) {
      try {
        localStorage.setItem(storageKey, normalizedTheme);
      } catch (error) {
        /* Ignore storage failures in private browsing contexts. */
      }
    }

    return normalizedTheme;
  }

  function updateToggle(toggleButton, themeValue) {
    var nextTheme = themeValue === "dark" ? "light" : "dark";
    var label = "Switch to " + nextTheme + " mode";
    toggleButton.setAttribute("aria-label", label);
    toggleButton.setAttribute("title", label);
  }

  function initThemeToggle() {
    var toggleButton = document.getElementById("theme-toggle");
    if (!toggleButton) {
      return;
    }

    var currentTheme = applyTheme(root.getAttribute("data-theme"), false);
    updateToggle(toggleButton, currentTheme);

    toggleButton.addEventListener("click", function () {
      var nextTheme = currentTheme === "dark" ? "light" : "dark";
      currentTheme = applyTheme(nextTheme, true);
      updateToggle(toggleButton, currentTheme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
