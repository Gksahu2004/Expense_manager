const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseLimit = parseFloat(localStorage.getItem("expenseLimit")) || 0;

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const limitForm = document.getElementById("limitForm");
const limitStatus = document.getElementById("limitStatus");
const limitAmount = document.getElementById("limitAmount");
const expenseChart = document.getElementById("expenseChart").getContext("2d");

let chart;

form.addEventListener("submit", addTransaction);
limitForm.addEventListener("submit", setExpenseLimit);

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal + expenseTotal;

  balance.textContent = formatter.format(balanceTotal);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1); // Ensure expense total is displayed correctly

  if (balanceTotal < 0) {
    balance.style.color = "red";
  } else {
    balance.style.color = "black";
  }

  if (expenseTotal * -1 > expenseLimit) {
    limitStatus.textContent = "Warning: Expense limit reached!";
    limitStatus.style.color = "red";
  } else {
    limitStatus.textContent = "";
  }

  updateChart(incomeTotal, expenseTotal);
}

function renderList() {
  list.innerHTML = "";

  status.textContent = "";
  if (transactions.length === 0) {
    status.textContent = "No transactions.";
    return;
  }

  transactions.forEach(({ id, name, amount, date, type }) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    li.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${name}</h5>
        <small>${date}</small>
      </div>
      <div class="d-flex w-100 justify-content-between">
        <span>${type === "expense" ? "-" : ""}${formatter.format(Math.abs(amount))}</span>
        <button class="btn btn-sm btn-danger" onclick="removeTransaction(${id})">Remove</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function addTransaction(e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const amount = parseFloat(form.amount.value);
  const type = form.type.value;
  const date = form.date.value;

  if (!name || isNaN(amount) || !type || !date) {
    alert("Please fill out all fields.");
    return;
  }

  const transaction = {
    id: generateID(),
    name,
    amount: type === "expense" ? -amount : amount,
    type,
    date,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  form.reset();
  updateTotal();
  renderList();
}

function removeTransaction(id) {
  transactions.splice(
    transactions.findIndex((trx) => trx.id === id),
    1
  );

  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTotal();
  renderList();
}

function setExpenseLimit(e) {
  e.preventDefault();

  const limit = parseFloat(limitAmount.value);

  if (isNaN(limit) || limit < 0) {
    alert("Please enter a valid limit amount.");
    return;
  }

  expenseLimit = limit;
  localStorage.setItem("expenseLimit", expenseLimit.toString());

  updateTotal();
}

function updateChart(incomeTotal, expenseTotal) {
  if (!chart) {
    chart = new Chart(expenseChart, {
      type: "bar",
      data: {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            label: "Amount (INR)",
            data: [incomeTotal, expenseTotal * -1],
            backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return formatter.format(value);
              },
            },
          },
        },
      },
    });
  } else {
    chart.data.datasets[0].data = [incomeTotal, expenseTotal * -1];
    chart.update();
  }
}

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Initializations
updateTotal();
renderList();
