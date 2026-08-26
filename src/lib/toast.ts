function show(message: string) {
  if (typeof window === "undefined") return;
  const existing = document.getElementById("upsight-toast");
  existing?.remove();
  const el = document.createElement("div");
  el.id = "upsight-toast";
  el.textContent = message;
  el.setAttribute("role", "status");
  Object.assign(el.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "9999",
    maxWidth: "360px",
    padding: "14px 18px",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    border: "1px solid rgba(0,173,132,.45)",
    boxShadow: "0 15px 40px rgba(0,0,0,.35)",
    font: "14px/1.4 Inter, sans-serif",
  });
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 5000);
}

export const toast = {
  success: show,
  error: show,
  info: show,
};
