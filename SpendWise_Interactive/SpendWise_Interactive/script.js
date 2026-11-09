// SpendWise Interactive Budget Tracker
// Arrays hold multiple transaction records. The dashboard is rebuilt from this data.

const DEFAULT_BUDGET = 50000;
const STORAGE_KEYS = {
  budget: "spendwise_budget_v2",
  transactions: "spendwise_transactions_v2"
};

// These sample records preserve the figures from the earlier SpendWise dashboard.
// Savings are tracked separately and are not counted as expenses.
const starterTransactions = [
  { id: 1, name: "Groceries", category: "Food", type: "expense", amount: 8500 },
  { id: 2, name: "Bus and fuel", category: "Transport", type: "expense", amount: 4200 },
  { id: 3, name: "Monthly rent", category: "Rent", type: "expense", amount: 10000 },
  { id: 4, name: "Leisure", category: "Entertainment", type: "expense", amount: 3500 },
  { id: 5, name: "Water and electricity", category: "Utilities", type: "expense", amount: 5300 },
  { id: 6, name: "Monthly savings", category: "Savings", type: "saving", amount: 7000 }
];

let budget = loadBudget();
let transactions = loadTransactions();

const money = amount => `KSh ${Number(amount).toLocaleString("en-KE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})}`;

function loadBudget() {
  const saved = Number(localStorage.getItem(STORAGE_KEYS.budget));
  return saved > 0 ? saved : DEFAULT_BUDGET;
}

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions));
    return Array.isArray(saved) ? saved : starterTransactions.map(item => ({ ...item }));
  } catch (error) {
    return starterTransactions.map(item => ({ ...item }));
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.budget, String(budget));
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

// Loop through the array to total expense records only.
function calculateTotalSpent() {
  let total = 0;
  for (const transaction of transactions) {
    if (transaction.type === "expense") {
      total += Number(transaction.amount);
    }
  }
  return total;
}

function calculateSavings() {
  let total = 0;
  for (const transaction of transactions) {
    if (transaction.type === "saving") total += Number(transaction.amount);
  }
  return total;
}

function categoryTotals() {
  const categories = {
    Food: 0, Transport: 0, Rent: 0,
    Entertainment: 0, Savings: 0, Utilities: 0
  };

  // Process each record and add its amount to the matching category.
  for (const transaction of transactions) {
    if (Object.prototype.hasOwnProperty.call(categories, transaction.category)) {
      categories[transaction.category] += Number(transaction.amount);
    }
  }
  return categories;
}

function updateBudgetStatus(spent) {
  const remaining = budget - spent;
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const safePercent = Math.max(0, Math.min(percent, 100));

  document.getElementById("budgetPercent").textContent = `${percent}% used`;
  document.getElementById("budgetProgress").style.width = `${safePercent}%`;

  const message = document.getElementById("budgetMessage");
  message.className = "status-message";

  // Decision making: give feedback based on the budget used.
  if (remaining < 0) {
    message.textContent = `You have exceeded your budget by ${money(Math.abs(remaining))}. Review your spending.`;
    message.classList.add("over-budget");
  } else if (percent >= 80) {
    message.textContent = `Careful! You have used ${percent}% of your budget. Only ${money(remaining)} remains.`;
    message.classList.add("warning");
  } else {
    message.textContent = `Good work! You are within your budget. ${money(remaining)} remains.`;
    message.classList.add("within-budget");
  }
}

function renderCategoryCards() {
  const icons = {
    Food: "🍽️", Transport: "🚌", Rent: "🏠",
    Entertainment: "🎬", Savings: "💰", Utilities: "💡"
  };
  const totals = categoryTotals();
  const container = document.getElementById("categoryCards");
  container.innerHTML = "";

  // Loop through categories and create a card for each one.
  for (const [category, amount] of Object.entries(totals)) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-top">
        <h3>${category}</h3>
        <span class="icon" aria-hidden="true">${icons[category]}</span>
      </div>
      <div class="card-bottom">
        <p>${category === "Savings" ? "Money set aside" : "Monthly spending"}</p>
        <strong>${money(amount)}</strong>
      </div>`;
    container.appendChild(card);
  }
}

function renderTransactions() {
  const rows = document.getElementById("transactionRows");
  const emptyMessage = document.getElementById("emptyMessage");
  rows.innerHTML = "";
  emptyMessage.hidden = transactions.length !== 0;

  // Reverse a copy so newest records appear first.
  for (const item of [...transactions].reverse()) {
    const row = document.createElement("tr");
    const description = document.createElement("td");
    const category = document.createElement("td");
    const type = document.createElement("td");
    const amount = document.createElement("td");
    const action = document.createElement("td");
    const deleteButton = document.createElement("button");

    description.textContent = item.name;
    category.textContent = item.category;
    type.textContent = item.type === "saving" ? "Savings" : "Expense";
    amount.textContent = money(item.amount);
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.id = item.id;
    deleteButton.setAttribute("aria-label", `Delete ${item.name}`);
    action.appendChild(deleteButton);
    row.append(description, category, type, amount, action);
    rows.appendChild(row);
  }
}

function renderDashboard() {
  const spent = calculateTotalSpent();
  const remaining = budget - spent;

  document.getElementById("totalBudget").textContent = money(budget);
  document.getElementById("totalSpent").textContent = money(spent);
  document.getElementById("remaining").textContent = money(remaining);
  document.getElementById("budgetInput").value = budget;

  updateBudgetStatus(spent);
  renderCategoryCards();
  renderTransactions();
}

document.getElementById("expenseForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);
  const type = document.getElementById("recordType").value;
  let category = document.getElementById("expenseCategory").value;
  const message = document.getElementById("formMessage");

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    message.textContent = "Please enter a description and an amount greater than zero.";
    message.className = "form-message error-text";
    return;
  }

  if (type === "saving") category = "Savings";

  transactions.push({
    id: Date.now(),
    name,
    category,
    type,
    amount
  });

  saveData();
  renderDashboard();
  event.target.reset();
  message.textContent = `${type === "saving" ? "Savings" : "Expense"} added successfully.`;
  message.className = "form-message success-text";
});

document.getElementById("transactionRows").addEventListener("click", event => {
  if (!event.target.matches(".delete-button")) return;

  const id = Number(event.target.dataset.id);
  transactions = transactions.filter(item => item.id !== id);
  saveData();
  renderDashboard();
  document.getElementById("formMessage").textContent = "Transaction deleted.";
});

document.getElementById("budgetForm").addEventListener("submit", event => {
  event.preventDefault();
  const newBudget = Number(document.getElementById("budgetInput").value);
  const message = document.getElementById("budgetFormMessage");

  if (!Number.isFinite(newBudget) || newBudget <= 0) {
    message.textContent = "Please enter a budget greater than zero.";
    message.className = "form-message error-text";
    return;
  }

  budget = newBudget;
  saveData();
  renderDashboard();
  message.textContent = `Your monthly budget is now ${money(budget)}.`;
  message.className = "form-message success-text";
});

document.getElementById("clearTransactions").addEventListener("click", () => {
  if (!window.confirm("Are you sure you want to delete all transactions?")) return;
  transactions = [];
  saveData();
  renderDashboard();
});

document.getElementById("recordType").addEventListener("change", event => {
  const category = document.getElementById("expenseCategory");
  if (event.target.value === "saving") {
    category.value = "Savings";
    category.disabled = true;
  } else {
    category.disabled = false;
    if (category.value === "Savings") category.value = "Food";
  }
});

document.getElementById("currentMonth").textContent =
  new Date().toLocaleDateString("en-KE", { month: "long", year: "numeric" });

// First display: load stored records and update every dashboard section.
renderDashboard();
