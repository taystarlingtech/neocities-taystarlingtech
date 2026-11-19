(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealOnScroll() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function makeFeatureCardsClickable() {
    document.querySelectorAll(".feature-card").forEach(function (card) {
      var link = card.querySelector("h3 a");
      if (!link) return;

      card.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        window.location.href = link.href;
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = link.href;
        }
      });

      if (!card.hasAttribute("tabindex")) {
        card.setAttribute("tabindex", "0");
      }
      if (!card.hasAttribute("role")) {
        card.setAttribute("role", "link");
      }
    });
  }

  function markExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      try {
        var url = new URL(link.href);
        if (url.hostname !== window.location.hostname) {
          if (!link.hasAttribute("target")) {
            link.setAttribute("target", "_blank");
          }
          if (!link.hasAttribute("rel")) {
            link.setAttribute("rel", "noopener noreferrer");
          }
        }
      } catch (err) {
        /* ignore invalid URLs */
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    revealOnScroll();
    makeFeatureCardsClickable();
    markExternalLinks();
  });
})();
