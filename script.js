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

function updateDashboard() {
  const income = parseFloat(localStorage.getItem("user_income")) || 0;
  const spent = 12.5; // Replace with dynamic logic later

  // Simple logic: Savings = Income - Spent (for MVP)
  const savings = income - spent;

  document.getElementById("disp-income").innerText = "$" + income;
  document.getElementById("disp-savings").innerText =
    "$" + (savings > 0 ? savings : 0);
}

// Call this inside your saveIncome() function after saving to localStorage

function addExpense() {
  const name = document.getElementById("exp-name").value;
  const amount = parseFloat(document.getElementById("exp-amount").value);
  const category = document.getElementById("exp-category").value;

  if (!name || isNaN(amount)) {
    alert("Please enter what you bought and the amount!");
    return;
  }

  // 1. Get existing total spend or start at 0
  let currentTotal = parseFloat(localStorage.getItem("total_spent")) || 0;

  // 2. Add new expense
  currentTotal += amount;

  // 3. Save back to LocalStorage (Privacy & Offline Access) [cite: 9, 34, 43]
  localStorage.setItem("total_spent", currentTotal);

  // 4. Update the Dashboard display
  alert(`Logged: ${name} ($${amount}) in ${category}`);

  // Reset inputs
  document.getElementById("exp-name").value = "";
  document.getElementById("exp-amount").value = "";

  // Sync Dashboard immediately
  refreshDashboard();
}

function refreshDashboard() {
  // 1. Get Values
  const totalIncome = parseFloat(localStorage.getItem("user_income")) || 0;
  const totalSpent = parseFloat(localStorage.getItem("total_spent")) || 0;

  // 2. Calculate Totals
  const remainingBudget = totalIncome - totalSpent;

  // 3. Calculate Daily Allowance
  // (Assuming a 30-day month; in a real app, you'd calculate days left)
  const daysInMonth = 31;
  const dailyAllowance = remainingBudget / daysInMonth;

  // 4. Update the Display
  document.getElementById("disp-income").innerText =
    "$" + totalIncome.toFixed(2);
  document.getElementById("disp-total-spent").innerText =
    "$" + totalSpent.toFixed(2);
  document.getElementById("disp-savings").innerText =
    "$" + (remainingBudget > 0 ? remainingBudget.toFixed(2) : "0.00");

  // Update the Saving Block (Daily Allowance)
  const dailyElem = document.getElementById("disp-daily-left");
  dailyElem.innerText =
    "$" + (dailyAllowance > 0 ? dailyAllowance.toFixed(2) : "0.00");
}
function saveDailyLimit() {
  const limitInput = document.getElementById("daily-limit-input");
  const limitValue = parseFloat(limitInput.value);

  if (isNaN(limitValue) || limitValue <= 0) {
    alert("Please enter a valid limit amount!");
    return;
  }

  // 1. Save to LocalStorage (Privacy & Persistence)
  localStorage.setItem("user_daily_limit", limitValue);

  // 2. Update the UI inside the Planner
  document.getElementById("current-limit-display").innerText =
    "$" + limitValue.toFixed(2);

  // 3. Reset input and sync Dashboard
  limitInput.value = "";
  alert("Daily spending limit set to $" + limitValue.toFixed(2));

  // Call your dashboard refresh to update the "Saving Block"
  if (typeof refreshDashboard === "function") {
    refreshDashboard();
  }
}

// Add this to your initApp() to load the limit on startup
function loadDailyLimit() {
  const savedLimit = localStorage.getItem("user_daily_limit");
  if (savedLimit) {
    document.getElementById("current-limit-display").innerText =
      "$" + parseFloat(savedLimit).toFixed(2);
  }
}
