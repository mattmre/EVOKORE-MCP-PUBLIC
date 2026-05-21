/* EVOKORE-MCP Wiki — pure client-side search/filter. No dependencies. */

(function () {
  "use strict";

  // -----------------------------------------------------------------
  // tiny helpers
  // -----------------------------------------------------------------

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural || singular + "s";
  }

  function debounce(fn, delay) {
    var t = null;
    return function () {
      var args = arguments;
      var self = this;
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    };
  }

  function readMetaBaseUrl() {
    var meta = document.querySelector('meta[name="evokore-source-base"]');
    if (!meta) return null;
    var v = (meta.getAttribute("content") || "").trim();
    if (!v) return null;
    return v.replace(/\/+$/, "");
  }

  function loadJson(path) {
    return fetch(path, { cache: "no-cache" }).then(function (resp) {
      if (!resp.ok) {
        throw new Error("Failed to load " + path + " (" + resp.status + ")");
      }
      return resp.json();
    });
  }

  // -----------------------------------------------------------------
  // skill index rendering
  // -----------------------------------------------------------------

  function initSkillsIndex(root) {
    if (!root) return;

    var input = $(".search-input", root);
    var categorySelect = $(".filter-select[data-filter=category]", root);
    var tagSelect = $(".filter-select[data-filter=tag]", root);
    var listEl = $(".card-list", root);
    var resultCount = $(".result-count", root);
    var emptyState = $(".empty-state", root);
    var sourceBase = readMetaBaseUrl();

    if (!listEl) return;

    var skills = [];

    function render(filteredList) {
      listEl.innerHTML = "";
      if (filteredList.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
      } else {
        if (emptyState) emptyState.classList.add("hidden");
      }
      var frag = document.createDocumentFragment();
      filteredList.forEach(function (skill) {
        var card = document.createElement("article");
        card.className = "card";

        var nameLine =
          '<div class="card-row">' +
          '<div class="name">' + escapeHtml(skill.name) + "</div>" +
          (skill.category ? '<span class="badge">' + escapeHtml(skill.category) + "</span>" : "") +
          "</div>";

        var descLine = skill.description
          ? '<p class="description">' + escapeHtml(skill.description) + "</p>"
          : "";

        var bodyLine =
          skill.firstParagraph &&
          (!skill.description ||
            skill.firstParagraph !== skill.description)
            ? '<p class="description full muted">' + escapeHtml(skill.firstParagraph) + "</p>"
            : "";

        var tagsHtml = "";
        if (skill.tags && skill.tags.length) {
          tagsHtml = '<div class="meta">';
          skill.tags.forEach(function (t) {
            tagsHtml += '<span class="chip">' + escapeHtml(t) + "</span>";
          });
          tagsHtml += "</div>";
        }

        var pathLine = skill.relativePath
          ? '<div class="path">' + escapeHtml(skill.relativePath) + "</div>"
          : "";

        var sourceLine = "";
        if (skill.relativePath && sourceBase) {
          sourceLine =
            '<div class="meta"><a href="' +
            escapeHtml(sourceBase + "/" + skill.relativePath) +
            '" target="_blank" rel="noopener noreferrer">View source</a></div>';
        }

        var upstreamLine = "";
        if (skill.upstream) {
          upstreamLine =
            '<div class="upstream-note">Adapter of ' +
            escapeHtml(skill.upstream) +
            (skill.upstreamPath ? " · " + escapeHtml(skill.upstreamPath) : "") +
            (skill.upstreamSha ? " · sha " + escapeHtml(String(skill.upstreamSha).slice(0, 12)) : "") +
            "</div>";
        }

        card.innerHTML =
          nameLine + descLine + bodyLine + tagsHtml + pathLine + upstreamLine + sourceLine;
        frag.appendChild(card);
      });
      listEl.appendChild(frag);
      if (resultCount) {
        resultCount.textContent =
          filteredList.length + " " + pluralize(filteredList.length, "skill");
      }
    }

    function buildHaystack(skill) {
      var bits = [];
      if (skill.name) bits.push(skill.name);
      if (skill.description) bits.push(skill.description);
      if (skill.category) bits.push(skill.category);
      if (skill.firstParagraph) bits.push(skill.firstParagraph);
      if (skill.tags) bits.push(skill.tags.join(" "));
      if (skill.aliases) bits.push(skill.aliases.join(" "));
      return bits.join(" \n ").toLowerCase();
    }

    function applyFilters() {
      var q = (input && input.value ? input.value : "").trim().toLowerCase();
      var cat = (categorySelect && categorySelect.value) || "";
      var tag = (tagSelect && tagSelect.value) || "";
      var out = skills.filter(function (skill) {
        if (cat && skill.category !== cat) return false;
        if (tag && (!skill.tags || skill.tags.indexOf(tag) === -1)) return false;
        if (!q) return true;
        var haystack = skill._haystack;
        return haystack.indexOf(q) !== -1;
      });
      render(out);
    }

    function populateFilters() {
      if (!categorySelect && !tagSelect) return;
      var cats = {};
      var tags = {};
      skills.forEach(function (skill) {
        if (skill.category) cats[skill.category] = true;
        if (skill.tags) {
          skill.tags.forEach(function (t) {
            tags[t] = true;
          });
        }
      });
      if (categorySelect) {
        var catKeys = Object.keys(cats).sort();
        catKeys.forEach(function (c) {
          var opt = document.createElement("option");
          opt.value = c;
          opt.textContent = c;
          categorySelect.appendChild(opt);
        });
      }
      if (tagSelect) {
        var tagKeys = Object.keys(tags).sort();
        tagKeys.forEach(function (t) {
          var opt = document.createElement("option");
          opt.value = t;
          opt.textContent = t;
          tagSelect.appendChild(opt);
        });
      }
    }

    var dataPath = root.getAttribute("data-source") || "./data/skills.json";
    loadJson(dataPath)
      .then(function (payload) {
        skills = (payload && payload.skills) || [];
        skills.forEach(function (s) {
          s._haystack = buildHaystack(s);
        });
        populateFilters();
        render(skills);
        if (input) input.addEventListener("input", debounce(applyFilters, 80));
        if (categorySelect) categorySelect.addEventListener("change", applyFilters);
        if (tagSelect) tagSelect.addEventListener("change", applyFilters);
      })
      .catch(function (err) {
        listEl.innerHTML =
          '<div class="empty-state">Could not load skill index: ' +
          escapeHtml(err.message) +
          '. If you opened this page via the file:// scheme, try running <code>python -m http.server</code> in the wiki/ folder.</div>';
      });
  }

  // -----------------------------------------------------------------
  // tools index rendering
  // -----------------------------------------------------------------

  function initToolsIndex(root) {
    if (!root) return;
    var input = $(".search-input", root);
    var managerSelect = $(".filter-select[data-filter=manager]", root);
    var listEl = $(".card-list", root);
    var resultCount = $(".result-count", root);
    var emptyState = $(".empty-state", root);
    if (!listEl) return;

    var tools = [];

    function render(list) {
      listEl.innerHTML = "";
      if (list.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
      } else {
        if (emptyState) emptyState.classList.add("hidden");
      }
      var frag = document.createDocumentFragment();
      list.forEach(function (tool) {
        var card = document.createElement("article");
        card.className = "card";
        var badges = "";
        if (tool.readOnly) {
          badges += '<span class="badge read">read-only</span>';
        }
        if (tool.destructive) {
          badges += '<span class="badge destructive">destructive</span>';
        }
        card.innerHTML =
          '<div class="card-row">' +
          '<div class="name"><code>' +
          escapeHtml(tool.name) +
          "</code></div>" +
          '<span class="badge muted">' + escapeHtml(tool.manager) + "</span>" +
          "</div>" +
          (tool.title ? '<p class="muted" style="margin:.2rem 0 0; font-size:.85rem;">' + escapeHtml(tool.title) + "</p>" : "") +
          '<p class="description full">' + escapeHtml(tool.purpose) + "</p>" +
          (badges ? '<div class="meta">' + badges + "</div>" : "");
        frag.appendChild(card);
      });
      listEl.appendChild(frag);
      if (resultCount) {
        resultCount.textContent =
          list.length + " " + pluralize(list.length, "tool");
      }
    }

    function applyFilters() {
      var q = (input && input.value ? input.value : "").trim().toLowerCase();
      var mgr = (managerSelect && managerSelect.value) || "";
      var out = tools.filter(function (tool) {
        if (mgr && tool.manager !== mgr) return false;
        if (!q) return true;
        return (
          tool.name.toLowerCase().indexOf(q) !== -1 ||
          (tool.purpose || "").toLowerCase().indexOf(q) !== -1 ||
          (tool.title || "").toLowerCase().indexOf(q) !== -1 ||
          (tool.manager || "").toLowerCase().indexOf(q) !== -1
        );
      });
      render(out);
    }

    function populateFilters() {
      if (!managerSelect) return;
      var mgrs = {};
      tools.forEach(function (t) {
        mgrs[t.manager] = true;
      });
      Object.keys(mgrs).sort().forEach(function (m) {
        var opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        managerSelect.appendChild(opt);
      });
    }

    var dataPath = root.getAttribute("data-source") || "./data/tools.json";
    loadJson(dataPath)
      .then(function (payload) {
        tools = (payload && payload.tools) || [];
        populateFilters();
        render(tools);
        if (input) input.addEventListener("input", debounce(applyFilters, 80));
        if (managerSelect) managerSelect.addEventListener("change", applyFilters);
      })
      .catch(function (err) {
        listEl.innerHTML =
          '<div class="empty-state">Could not load tool index: ' +
          escapeHtml(err.message) +
          "</div>";
      });
  }

  // -----------------------------------------------------------------
  // env-var rendering
  // -----------------------------------------------------------------

  function initEnvIndex(root) {
    if (!root) return;
    var input = $(".search-input", root);
    var groupSelect = $(".filter-select[data-filter=group]", root);
    var listEl = $(".card-list", root);
    var resultCount = $(".result-count", root);
    var emptyState = $(".empty-state", root);
    if (!listEl) return;

    var vars = [];

    function render(list) {
      listEl.innerHTML = "";
      if (list.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
      } else {
        if (emptyState) emptyState.classList.add("hidden");
      }
      var frag = document.createDocumentFragment();
      list.forEach(function (v) {
        var card = document.createElement("article");
        card.className = "card";
        var requirementBadge = v.required
          ? '<span class="badge destructive">required</span>'
          : '<span class="badge muted">optional</span>';
        card.innerHTML =
          '<div class="card-row">' +
          '<div class="name"><code>' + escapeHtml(v.name) + "</code></div>" +
          requirementBadge +
          "</div>" +
          (v.example
            ? '<p class="path">default: <code>' + escapeHtml(v.example) + "</code></p>"
            : "") +
          (v.comment
            ? '<p class="description full">' + escapeHtml(v.comment) + "</p>"
            : "");
        frag.appendChild(card);
      });
      listEl.appendChild(frag);
      if (resultCount) {
        resultCount.textContent =
          list.length + " " + pluralize(list.length, "variable") ;
      }
    }

    function applyFilters() {
      var q = (input && input.value ? input.value : "").trim().toLowerCase();
      var group = (groupSelect && groupSelect.value) || "";
      var out = vars.filter(function (v) {
        if (group === "required" && !v.required) return false;
        if (group === "optional" && v.required) return false;
        if (!q) return true;
        return (
          v.name.toLowerCase().indexOf(q) !== -1 ||
          (v.comment || "").toLowerCase().indexOf(q) !== -1
        );
      });
      render(out);
    }

    var dataPath = root.getAttribute("data-source") || "./data/env.json";
    loadJson(dataPath)
      .then(function (payload) {
        vars = (payload && payload.vars) || [];
        render(vars);
        if (input) input.addEventListener("input", debounce(applyFilters, 80));
        if (groupSelect) groupSelect.addEventListener("change", applyFilters);
      })
      .catch(function (err) {
        listEl.innerHTML =
          '<div class="empty-state">Could not load env index: ' +
          escapeHtml(err.message) +
          "</div>";
      });
  }

  // -----------------------------------------------------------------
  // wire up on DOM ready
  // -----------------------------------------------------------------

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initSkillsIndex($("[data-wiki-skills]"));
    initToolsIndex($("[data-wiki-tools]"));
    initEnvIndex($("[data-wiki-env]"));
  });
})();
