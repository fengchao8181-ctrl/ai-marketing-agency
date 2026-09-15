/*!
 * 智营 AI · 全站脚本
 * 职责：移动端导航折叠 / 当前页高亮 / 平滑滚动 / 留资表单转 mailto
 * 约束：零外部依赖，原生 JS，无 JS 时页面仍可完整浏览
 */
(function () {
  "use strict";

  /** 读取浏览器的"减少动态效果"偏好。 */
  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /** 取当前页面文件名，用于导航高亮。 */
  function currentPageName() {
    var path = window.location.pathname || "";
    var name = path.substring(path.lastIndexOf("/") + 1);
    if (!name || name.indexOf(".") === -1) {
      return "index.html";
    }
    return name.toLowerCase();
  }

  /** 移动端导航：开合、Esc 关闭、点击链接后关闭、点击外部关闭。 */
  function initNavToggle() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) {
      return;
    }

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) {
        return;
      }
      if (nav.contains(event.target) || toggle.contains(event.target)) {
        return;
      }
      setOpen(false);
    });
  }

  /** 当前页导航高亮（标注 aria-current，便于读屏与爬虫理解）。 */
  function initCurrentNav() {
    var current = currentPageName();
    var links = document.querySelectorAll('#site-nav a[href], .foot-links a[href]');
    Array.prototype.forEach.call(links, function (link) {
      var href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href && href === current) {
        link.classList.add("is-current");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /** 站内锚点平滑滚动（无 JS 时浏览器原生跳转仍可用）。 */
  function initSmoothScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }
      var target = document.querySelector(hash);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
      if (window.history && typeof window.history.pushState === "function") {
        window.history.pushState(null, "", hash);
      }
    });
  }

  /**
   * 留资表单：纯前端。把填写内容拼成邮件草稿交给本机邮件客户端，
   * 不向任何服务器发送数据。无 JS 时浏览器原生 mailto 提交兜底。
   */
  function initContactForm() {
    var form = document.getElementById("lead-form");
    if (!form) {
      return;
    }

    var mailto = (form.getAttribute("data-mailto") || "").trim();
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    /**
     * 拦截尚未配置完成的联系方式（占位串 / 缺少 @ / 中性占位「待补充」），
     * 避免访客提交后静默丢单。
     */
    function isPlaceholder(value) {
      return (
        !value ||
        value.indexOf("@") === -1 ||
        value.indexOf("待补充") !== -1 ||
        value.indexOf("REPLACE") !== -1 ||
        value.indexOf("example.com") !== -1
      );
    }

    form.addEventListener("submit", function (event) {
      if (isPlaceholder(mailto)) {
        if (status) {
          status.textContent =
            "联系方式尚未配置，暂时无法通过表单提交。请稍后再试，或直接通过页面上的微信 / 邮箱与我们联系。";
        }
        event.preventDefault();
        return;
      }

      var data = new FormData(form);
      var field = function (key) {
        var value = data.get(key);
        return value === null || value === undefined ? "" : String(value).trim();
      };
      var name = field("name");
      if (!name) {
        event.preventDefault();
        if (status) {
          status.textContent = "请填写称呼，方便我们回信时称呼你。";
        }
        return;
      }

      var lines = [
        "称呼：" + name,
        "行业/品类：" + field("industry"),
        "联系方式：" + field("contact"),
        "月预算区间：" + field("budget"),
        "主要想解决的问题：",
        field("message")
      ];
      var subject = "【智营 AI 官网留资】" + name + " · AI 营销代运营咨询";
      var href =
        "mailto:" +
        encodeURIComponent(mailto) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      event.preventDefault();
      if (status) {
        status.textContent =
          "已收到，我们会尽快通过你填写的联系方式与你联系。（若已打开邮件客户端，请确认后发送）";
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "已提交";
      }
      window.location.href = href;
    });
  }

  /** FAQ：给每条问答加 id 锚点支持（若标记了 data-anchor）。 */
  function initFaqAnchors() {
    var items = document.querySelectorAll(".faq details[data-anchor]");
    Array.prototype.forEach.call(items, function (item) {
      var id = item.getAttribute("data-anchor");
      if (id && !item.id) {
        item.id = id;
      }
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initNavToggle();
    initCurrentNav();
    initSmoothScroll();
    initContactForm();
    initFaqAnchors();
  });
})();
