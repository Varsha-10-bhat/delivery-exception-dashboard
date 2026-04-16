const form = document.querySelector("#exceptionForm");
const tableBody = document.querySelector("#tableBody");

const filterType = document.querySelector("#filterType");
const filterStatus = document.querySelector("#filterStatus");

/* FORM */
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.querySelector("#deliveryId").value;
  const name = document.querySelector("#customerName").value;
  const issue = document.querySelector("#issueType").value;

  const priority = document.querySelector('input[name="priority"]:checked');

  if (!priority) {
    alert("Please select priority");
    return;
  }

  addRow(id, name, issue, priority.value);
  form.reset();
});

/* ADD ROW */
function addRow(id, name, issue, priority) {
  const tr = document.createElement("tr");
  tr.classList.add("fade-in");

  tr.innerHTML = `
    <td>${id}</td>
    <td>${name}</td>
    <td>${issue}</td>
    <td class="${priority === 'High' ? 'high' : ''}">${priority}</td>
    <td class="status status-open">Open</td>
    <td>
      <button class="resolve-btn">✔</button>
      <button class="delete-btn">✖</button>
    </td>
  `;

  tableBody.appendChild(tr);
  updateCounts();
}

/* ACTIONS */
tableBody.addEventListener("click", function(e) {

  if (e.target.classList.contains("resolve-btn")) {
    const row = e.target.closest("tr");
    const status = row.querySelector(".status");

    status.textContent = "Resolved";
    status.classList.remove("status-open");
    status.classList.add("status-resolved");

    e.target.disabled = true;

    updateCounts();
  }

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure?")) {
      e.target.closest("tr").remove();
      updateCounts();
    }
  }

});

/* FILTER */
filterType.addEventListener("change", filterRows);
filterStatus.addEventListener("change", filterRows);

function filterRows() {
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const issue = row.children[2].textContent;
    const status = row.children[4].textContent;

    const matchType = filterType.value === "All" || issue === filterType.value;
    const matchStatus = filterStatus.value === "All" || status === filterStatus.value;

    row.style.display = (matchType && matchStatus) ? "" : "none";
  });
}

/* COUNTS */
function updateCounts() {
  let open = 0, resolved = 0;

  tableBody.querySelectorAll("tr").forEach(row => {
    const status = row.children[4].textContent;

    if (status === "Open") open++;
    else resolved++;
  });

  document.querySelector("#openCount").textContent = open;
  document.querySelector("#resolvedCount").textContent = resolved;
  document.querySelector("#reportOpen").textContent = open;
  document.querySelector("#reportResolved").textContent = resolved;
}

/* NAVIGATION */
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  item.addEventListener("click", function() {

    navItems.forEach(i => i.classList.remove("active"));
    this.classList.add("active");

    document.querySelectorAll("#dashboardSection, #exceptionsSection, #reportsSection")
      .forEach(sec => sec.style.display = "none");

    const target = document.getElementById(this.dataset.section);
    target.style.display = "block";
    target.classList.add("fade-in");
  });
});