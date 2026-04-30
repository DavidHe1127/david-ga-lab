const form = document.getElementById("testForm");
const status = document.getElementById("status");
const previewBtn = document.getElementById("previewBtn");
const clearStatusBtn = document.getElementById("clearStatusBtn");
const tabLinks = Array.from(document.querySelectorAll(".tab-link"));
const pages = Array.from(document.querySelectorAll(".page"));

function normalizeRoute(pathname) {
  if (!pathname || pathname === "/") {
    return "/home";
  }
  const knownRoutes = ["/home", "/form", "/qna"];
  return knownRoutes.includes(pathname) ? pathname : "/home";
}

function setActivePageByRoute(route) {
  const activeRoute = normalizeRoute(route);
  const pageName = activeRoute.slice(1);

  tabLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === activeRoute);
  });

  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  if (window.location.pathname !== activeRoute) {
    window.history.replaceState({}, "", activeRoute);
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
    const route = normalizeRoute(link.dataset.route);
    window.history.pushState({}, "", route);
    setActivePageByRoute(route);
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
