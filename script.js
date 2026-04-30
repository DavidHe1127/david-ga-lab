const form = document.getElementById("testForm");
const status = document.getElementById("status");
const previewBtn = document.getElementById("previewBtn");
const clearStatusBtn = document.getElementById("clearStatusBtn");
const tabLinks = Array.from(document.querySelectorAll(".tab-link"));
const pages = Array.from(document.querySelectorAll(".page"));
const basePath = "/david-ga-lab";

const routeMap = {
  home: `${basePath}/`,
  form: `${basePath}/form`,
  qna: `${basePath}/qna`,
};

function normalizeRoute(pathname) {
  if (!pathname || pathname === "/" || pathname === basePath || pathname === `${basePath}/`) {
    return "home";
  }

  if (pathname === routeMap.form) {
    return "form";
  }

  if (pathname.toLowerCase() === routeMap.qna.toLowerCase()) {
    return "qna";
  }

  return "home";
}

function setActivePageByRoute(route) {
  const pageName = normalizeRoute(route);
  const targetPath = routeMap[pageName];

  tabLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === pageName);
  });

  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  if (window.location.pathname !== targetPath) {
    window.history.replaceState({}, "", targetPath);
  }
}

function getSelectedAddons() {
  return Array.from(document.querySelectorAll("input[name='addons']:checked")).map(
    (item) => item.value
  );
}

function renderPreview() {
  const formData = new FormData(form);
  const preview = {
    name: formData.get("name") || "(no name)",
    email: formData.get("email") || "(no email)",
    plan: formData.get("plan"),
    country: formData.get("country"),
    billingCycle: formData.get("billingCycle"),
    addons: getSelectedAddons(),
  };

  const addonsText = preview.addons.length ? preview.addons.join(", ") : "none";
  status.textContent = `Preview -> Name: ${preview.name}, Email: ${preview.email}, Plan: ${preview.plan}, Country: ${preview.country}, Billing: ${preview.billingCycle}, Add-ons: ${addonsText}`;
}

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageName = link.dataset.route;
    const targetPath = routeMap[pageName] || routeMap.home;
    window.history.pushState({}, "", targetPath);
    setActivePageByRoute(targetPath);
  });
});

window.addEventListener("popstate", () => {
  setActivePageByRoute(window.location.pathname);
});

setActivePageByRoute(window.location.pathname);

previewBtn.addEventListener("click", renderPreview);

clearStatusBtn.addEventListener("click", () => {
  status.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderPreview();
  if (typeof gtag === "function") {
    gtag("event", "form_submit", {
      form_name: "testForm",
      plan: new FormData(form).get("plan") || "unknown",
    });
  }
  status.textContent = `${status.textContent} | Form submitted successfully.`;
});
