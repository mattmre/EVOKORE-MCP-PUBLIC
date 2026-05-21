/* EVOKORE-MCP Presentations — Small helper
   Marks the current nav link active based on filename. */
(function () {
  function activateNav() {
    var path = (window.location.pathname || "").split("/").pop() || "index.html";
    var links = document.querySelectorAll(".site-nav a[data-nav]");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-nav") === path) {
        links[i].classList.add("current");
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activateNav);
  } else {
    activateNav();
  }
})();
