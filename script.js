let currentAuthMode = "login";

// 1. AUTHENTICATION LOGIC
function setAuthMode(mode) {
  currentAuthMode = mode;
  document.getElementById("l-tab").classList.toggle("active", mode === "login");
  document
    .getElementById("s-tab")
    .classList.toggle("active", mode === "signup");
  document.querySelector(".action-btn").innerText =
    mode === "login" ? "Unlock Vault" : "Create Account";
}

function handleAuth() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (!u || !p) {
    alert("Please fill in both fields.");
    return;
  }

  if (currentAuthMode === "signup") {
    localStorage.setItem("stored_u", u);
    localStorage.setItem("stored_p", p);
    alert("Account created for " + u + "! You can now log in.");
    setAuthMode("login");
  } else {
    if (
      u === localStorage.getItem("stored_u") &&
      p === localStorage.getItem("stored_p")
    ) {
      document.getElementById("auth-screen").style.display = "none";
      const shell = document.getElementById("app-shell");
      shell.classList.remove("hidden");
      shell.style.display = "flex";
      initApp();
    } else {
      alert("Invalid login. Have you signed up yet?");
    }
  }
}

// 2. NAVIGATION LOGIC
function showPage(pageId) {
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.add("hidden");
    v.style.display = "none";
  });
  const target = document.getElementById(pageId);
  target.classList.remove("hidden");
  target.style.display = "block";

  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  event.currentTarget.classList.add("active");

  if (pageId === "analysis") renderChart();
}

// 3. FEATURE INITIALIZATION
function initApp() {
  // Generate Calendar
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  for (let i = 1; i <= 31; i++) {
    const d = document.createElement("div");
    d.className = "day";
    d.innerText = i;
    grid.appendChild(d);
  }
  // Load Data
  document.getElementById("disp-income").innerText =
    "$ " + (localStorage.getItem("user_income") || "0");
  document.getElementById("notes-area").value =
    localStorage.getItem("user_notes") || "";
}

function saveIncome() {
  const val = document.getElementById("income-input").value;
  localStorage.setItem("user_income", val);
  document.getElementById("disp-income").innerText = "$ " + val;
  alert("Monthly income saved!");
}

function saveNotes() {
  localStorage.setItem(
    "user_notes",
    document.getElementById("notes-area").value,
  );
}

// 4. ANALYSIS CHART
function renderChart() {
  const ctx = document.getElementById("spendingChart").getContext("2d");
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Food", "Travel", "Savings", "Misc"],
      datasets: [
        {
          data: [40, 20, 25, 15],
          backgroundColor: ["#ff7e67", "#ffb347", "#ffd6a5", "#fff1ed"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });
}
