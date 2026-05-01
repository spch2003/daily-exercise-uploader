(function () {
  function setMessage(el, text, type) {
    if (!el) return;
    el.textContent = text || "";
    el.className = ("message " + (type || "")).trim();
  }

  async function bootFallback() {
    if (window.__PORTAL_JS_OK__) return;

    const schoolNote = document.getElementById("school-note");
    const authMessage = document.getElementById("auth-message");
    const loginForm = document.getElementById("login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");

    if (schoolNote && !schoolNote.textContent.trim()) {
      schoolNote.textContent = "Fallback login mode is active.";
    }
    if (authMessage && Array.isArray(window.__portalBootErrors) && window.__portalBootErrors.length) {
      setMessage(authMessage, "Portal boot error: " + window.__portalBootErrors[0], "error");
    }
    if (!loginForm || !loginEmail || !loginPassword) return;
    if (loginForm.dataset.fallbackBound === "1") return;
    loginForm.dataset.fallbackBound = "1";

    let cfg = null;
    try {
      const r = await fetch("/api/client-config");
      cfg = await r.json();
    } catch (_e) {
      setMessage(authMessage, "Fallback login failed: cannot load /api/client-config", "error");
      return;
    }

    const createClient = window.supabase && window.supabase.createClient;
    if (typeof createClient !== "function") {
      setMessage(authMessage, "Fallback login failed: Supabase SDK not loaded.", "error");
      return;
    }
    const supabase = createClient(cfg.supabase_url, cfg.supabase_anon_key);

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = String(loginEmail.value || "").trim().toLowerCase();
      const password = String(loginPassword.value || "");
      if (!email || !password) {
        setMessage(authMessage, "Email and password are required.", "error");
        return;
      }
      setMessage(authMessage, "Logging in...");
      try {
        const result = await supabase.auth.signInWithPassword({ email: email, password: password });
        if (result.error) {
          setMessage(authMessage, result.error.message || "Login failed.", "error");
          return;
        }
        localStorage.setItem("student_force_profile_once", "1");
        setMessage(authMessage, "Login successful. Reloading...", "success");
        window.location.reload();
      } catch (err) {
        setMessage(authMessage, "Login failed: " + (err && err.message ? err.message : "unknown"), "error");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(bootFallback, 600);
    });
  } else {
    setTimeout(bootFallback, 600);
  }
})();
