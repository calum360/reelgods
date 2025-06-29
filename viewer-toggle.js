document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openViewerBtn");
  const closeBtn = document.getElementById("desktopCloseBtn");
  const mobileCloseBtn = document.getElementById("mobileCloseBtn");
  const viewer = document.getElementById("domainViewer");
  
  

  if (!viewer) return;

  function openViewer() {
    viewer.classList.add("visible");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    viewer.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeViewer() {
    viewer.classList.remove("visible");
    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
  }

  if (openBtn) openBtn.addEventListener("click", openViewer);
  if (closeBtn) closeBtn.addEventListener("click", closeViewer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeViewer);
});
