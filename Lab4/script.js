/* =========================================================
   STUDENT RESULT DASHBOARD
   Reference script for JavaScript Fundamentals (Lab 04)
   Every major concept is labelled with a comment so it can
   be traced back to the matching section of the lab manual.
   ========================================================= */

/* ---------------------------------------------------------
   1. VARIABLES & SYNTAX
   var / let / const, plus basic statement syntax.
   --------------------------------------------------------- */
const DASHBOARD_TITLE = "Student Result Dashboard"; // const: value never reassigned
let currentFilter = "all";                          // let: value changes over time
let searchTerm = "";
var sortAscending = true;                            // var: function/global scoped (shown for comparison)

/* ---------------------------------------------------------
   2. HOISTING
   var declarations are hoisted and initialised as undefined.
   let/const are hoisted too, but stay in the "temporal dead
   zone" until their declaration line runs.
   --------------------------------------------------------- */
console.log(hoistedVar); // undefined — declaration is hoisted, assignment is not
var hoistedVar = "I am hoisted";

// console.log(hoistedLet); // Would throw: Cannot access 'hoistedLet' before initialization
let hoistedLet = "I am only usable after this line";

/* ---------------------------------------------------------
   3. OBJECTS
   Plain data as an array of objects (this is the "database"
   for the whole dashboard).
   --------------------------------------------------------- */
const studentsData = [
  { id: 1, name: "Ayesha Khan",  subject: "Web Development", marks: 88 },
  { id: 2, name: "Bilal Ahmed",  subject: "Web Development", marks: 55 },
  { id: 3, name: "Sara Malik",   subject: "Web Development", marks: 72 },
  { id: 4, name: "Hamza Tariq",  subject: "Web Development", marks: 38 },
  { id: 5, name: "Zainab Riaz",  subject: "Web Development", marks: 95 },
  { id: 6, name: "Usman Ali",    subject: "Web Development", marks: 60 },
];

/* ---------------------------------------------------------
   4. ES6 CLASSES
   Wraps each plain object in a Student instance that carries
   its own behaviour (getStatus, getGrade).
   --------------------------------------------------------- */
class Student {
  constructor(id, name, subject, marks) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.marks = marks;
  }

  // CONDITIONS + TERNARY OPERATOR
  getStatus() {
    return this.marks >= 50 ? "pass" : "fail"; // ternary operator
  }

  // CONDITIONS: if / else if / else
  getGrade() {
    let grade; // let: assigned according to the student's marks
    if (this.marks >= 90) grade = "A";
    else if (this.marks >= 75) grade = "B";
    else if (this.marks >= 50) grade = "C";
    else grade = "F";
    console.log(`${this.name}: grade ${grade}`); // Warm-up 2
    return grade;
  }
}

/* ---------------------------------------------------------
   5. ARRAY METHODS — map()
   ARROW FUNCTIONS used throughout for compact syntax.
   Converts plain objects into Student class instances.
   --------------------------------------------------------- */
let studentList = studentsData.map(
  (s) => new Student(s.id, s.name, s.subject, s.marks)
);

// Warm-ups 2–4: calculate each grade once, then report status and failures.
console.group("Warm-ups 2–4");
studentList.forEach((student) => { student.grade = student.getGrade(); });
for (const student of studentList) {
  console.log(`${student.name}: ${student.getStatus()}`);
}
const failedStudents = studentList.filter((student) => student.getStatus() === "fail");
console.log("Failed students:", failedStudents);
console.log("Failed names:", failedStudents.map((student) => student.name));
console.groupEnd();

/* ---------------------------------------------------------
   6. FOR...IN LOOP
   Iterates over an object's own property names — useful for
   logging or debugging a single record.
   --------------------------------------------------------- */
function logStudentDetails(student) {
  console.log(`--- Details for ${student.name} ---`);
  for (const key in student) {
    console.log(`${key}: ${student[key]}`);
  }
}
logStudentDetails(studentsData[0]);

/* ---------------------------------------------------------
   7. CLASSIC FOR LOOP
   Simple index-based loop, printed to the console.
   --------------------------------------------------------- */
for (let i = 0; i < studentList.length; i++) {
  console.log(`${i + 1}. ${studentList[i].name} — ${studentList[i].marks} marks`);
}

/* ---------------------------------------------------------
   8. FUNCTIONS: declaration, expression and arrow function
   --------------------------------------------------------- */

// Function declaration (hoisted, can be called before it is defined)
function formatMarks(marks) {
  return `${marks} / 100`;
}

// Function expression (not hoisted the same way)
const isTopScorer = function (student, highest) {
  return student.id === highest.id;
};

// Arrow function (short syntax, used heavily below)
const toPercentage = (marks) => `${marks}%`;

/* ---------------------------------------------------------
   9. ARRAY METHODS — reduce(), filter()
   OPERATORS: arithmetic (+ , /), comparison (>, >=)
   --------------------------------------------------------- */
function calculateSummary(list) {
  const total = list.reduce((sum, s) => sum + s.marks, 0);       // reduce: running total
  const average = list.length ? (total / list.length).toFixed(2) : "0.00";

  const highest = list.reduce(
    (max, s) => (s.marks > max.marks ? s : max),
    list[0] || { name: "-", marks: 0 }
  );

  const passCount = list.filter((s) => s.getStatus() === "pass").length; // filter
  const failCount = list.length - passCount;

  // Returned as an object so the caller can destructure it
  return { average, highest, passCount, failCount };
}

/* ---------------------------------------------------------
   10. DESTRUCTURING (objects) + TEMPLATE LITERALS
   --------------------------------------------------------- */
function renderSummary(list) {
  const summaryEl = document.getElementById("summary");
  const { average, highest, passCount, failCount } = calculateSummary(list); // destructuring

  summaryEl.innerHTML = `
    <div class="summary-box">Average: ${average}</div>
    <div class="summary-box">Top Scorer: ${highest.name} (${highest.marks})</div>
    <div class="summary-box">Passed: ${passCount}</div>
    <div class="summary-box">Failed: ${failCount}</div>
  `;
}

/* ---------------------------------------------------------
   11. CREATING A CARD
   Destructuring + template literals + ternary operator.
   --------------------------------------------------------- */
function createCard(student) {
  const { name, subject, marks } = student; // object destructuring
  const status = student.getStatus();
  const grade = student.grade;

  const card = document.createElement("div");
  card.className = `student-card ${status}`;
  card.innerHTML = `
    <h3>${name}</h3>
    <p>${subject}</p>
    <p class="marks">Marks: ${formatMarks(marks)}</p>
    <span class="badge ${status}">${status === "pass" ? "Pass" : "Fail"}</span>
    <span class="grade">Grade: ${grade} (${toPercentage(marks)})</span>
  `;
  return card;
}

/* ---------------------------------------------------------
   12. FOR...OF LOOP
   Iterates over array values (not indexes) to build the grid.
   --------------------------------------------------------- */
function renderCards(list) {
  const cardGrid = document.getElementById("cardGrid");
  cardGrid.innerHTML = "";

  for (const student of list) {
    const card = createCard(student);
    cardGrid.appendChild(card);
  }
}

/* ---------------------------------------------------------
   13. ARRAY METHODS — filter() combined with LOGICAL OPERATORS
   --------------------------------------------------------- */
function applyFilters() {
  let filtered = studentList;

  if (currentFilter === "pass") {
    filtered = filtered.filter((s) => s.getStatus() === "pass");
  } else if (currentFilter === "fail") {
    filtered = filtered.filter((s) => s.getStatus() === "fail");
  }

  // Logical AND (&&): only apply the search filter when there is a term
  if (searchTerm && searchTerm.length > 0) {
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(searchTerm)
    );
  }

  renderCards(filtered);
  renderSummary(filtered);
}

/* ---------------------------------------------------------
   14. ARRAY METHODS — forEach()
   Attaches a click listener to every filter button.
   --------------------------------------------------------- */
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active")); // forEach again
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});

/* ---------------------------------------------------------
   15. SEARCH INPUT — event handling with an arrow function
   --------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
});

/* ---------------------------------------------------------
   16. ARRAY METHODS — sort()
   Sorts a copy of the array using the spread operator so the
   original studentList order is never lost by accident.
   --------------------------------------------------------- */
document.getElementById("sortBtn").addEventListener("click", () => {
  studentList = [...studentList].sort((a, b) =>
    sortAscending ? a.marks - b.marks : b.marks - a.marks
  );
  sortAscending = !sortAscending; // logical NOT
  applyFilters();
});

/* ---------------------------------------------------------
   17. INITIAL RENDER
   --------------------------------------------------------- */
document.title = DASHBOARD_TITLE;
applyFilters();
// Task 4 — Book class; each instance keeps its own stock.
class Book {
  constructor(id, title, author, price, stock, category) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }
  getStockStatus() {
    return this.stock < 5 ? "Low stock" : "Stock sufficient";
  }
}

// Task 1 — const keeps the array reference fixed; book stock can still change.
const catalog = [
  new Book(1, "Clean Code", "Robert C. Martin", 22.50, 8, "Programming"),
  new Book(2, "Eloquent JavaScript", "Marijn Haverbeke", 30, 6, "Programming"),
  new Book(3, "The Pragmatic Programmer", "David Thomas & Andrew Hunt", 40, 3, "Programming"),
  new Book(4, "Atomic Habits", "James Clear", 18, 7, "Self-Development"),
  new Book(5, "Deep Work", "Cal Newport", 20, 2, "Self-Development")
];
const orders = [ // const: the incoming batch reference is not reassigned.
  { id: 101, bookId: 1, quantity: 2 },
  { id: 102, bookId: 2, quantity: 3 },
  { id: 103, bookId: 3, quantity: 5 },
  { id: 104, bookId: 99, quantity: 1 },
  { id: 105, bookId: 4, quantity: 0 },
  { id: 106, bookId: 4, quantity: 2 },
  { id: 107, bookId: 5, quantity: 1 },
  { id: 108, bookId: 1, quantity: 7 }
];

// Task 2 — validation never changes stock and safely handles a missing book.
function validateOrder(order, books = catalog) {
  const book = books.find((item) => item.id === order.bookId); // const: lookup result is fixed.
  const validQuantity = Number.isInteger(order.quantity) && order.quantity > 0; // const: fixed check result.
  const canFulfill = Boolean(book && validQuantity && book.stock >= order.quantity); // const: fixed result.
  let reason = "Stock available"; // let: rejection checks may change the reason.
  if (!book) reason = "Book does not exist";
  else if (!validQuantity) reason = "Quantity must be a positive integer";
  else if (book.stock < order.quantity) reason = "Insufficient stock";
  return { valid: canFulfill, message: canFulfill ? `Accepted: ${reason}` : `Rejected: ${reason}`, book };
}

// Task 4 — destructuring and a template literal produce the confirmation.
function orderConfirmation(book, quantity) {
  const { title, price } = book; // const: extracted values are not reassigned.
  const message = `Order confirmed: ${quantity} x ${title} — $${(price * quantity).toFixed(2)} total.`; // const: fixed message.
  console.log(message);
  return message;
}

// Task 3 — sequential validation uses the stock left by earlier orders.
function processOrders(incomingOrders, books = catalog) {
  const results = []; // const: append results without reassigning the array.
  for (const order of incomingOrders) { // const: one order binding per iteration.
    const validation = validateOrder(order, books); // const: fixed validation for this order.
    if (validation.valid) validation.book.stock -= order.quantity;
    results.push({
      ...order,
      title: validation.book ? validation.book.title : `Unknown book (${order.bookId})`,
      status: validation.valid ? "Fulfilled" : "Rejected",
      reason: validation.message,
      revenue: validation.valid ? validation.book.price * order.quantity : 0,
      confirmation: validation.valid ? orderConfirmation(validation.book, order.quantity) : ""
    });
  }
  const summary = results.map(({ id, title, quantity, status, reason, revenue, confirmation }) =>
    ({ id, title, quantity, status, reason, revenue, confirmation })); // const: derived report reference stays fixed.
  const totalRevenue = summary.reduce((total, order) =>
    total + (order.status === "Fulfilled" ? order.revenue : 0), 0); // const: final calculated revenue.
  return { summary, totalRevenue };
}

// Task 5 — filter returns a new array, so sorting does not reorder the catalog.
function lowStockReport(category, threshold, books = catalog) {
  const report = books.filter((book) => book.stock < threshold && book.category === category)
    .sort((a, b) => a.stock - b.stock); // const: report reference is fixed.
  console.log(`Low-stock report: ${category}, stock < ${threshold}`);
  console.table(report);
  return report;
}

console.group("Task 2 — validation before batch processing");
const validationTests = [orders[0], orders[3]].map((order) => validateOrder(order).message); // const: fixed test results.
validationTests.forEach((message) => console.log(message));
console.groupEnd();
document.getElementById("validationResults").innerHTML = validationTests.map((message) => `<li>${message}</li>`).join("");

const batchReport = processOrders(orders); // const: this batch is processed once per page load.
console.table(batchReport.summary);
console.log(`Total revenue: $${batchReport.totalRevenue.toFixed(2)}`);
document.getElementById("ordersBody").innerHTML = batchReport.summary.map((order) => `
  <tr><td>${order.id}</td><td>${order.title}</td><td>${order.quantity}</td>
  <td>${order.status}</td><td>${order.reason}</td><td>$${order.revenue.toFixed(2)}</td></tr>`).join("");
document.getElementById("revenue").textContent = `Total revenue from fulfilled orders: $${batchReport.totalRevenue.toFixed(2)}`;
document.getElementById("confirmations").innerHTML = batchReport.summary.filter((order) => order.status === "Fulfilled")
  .map((order) => `<li>${order.confirmation}</li>`).join("");
document.getElementById("catalogBody").innerHTML = catalog.map((book) => `
  <tr><td>${book.title}</td><td>${book.author}</td><td>${book.category}</td>
  <td>$${book.price.toFixed(2)}</td><td>${book.stock}</td><td>${book.getStockStatus()}</td></tr>`).join("");

const reportSettings = [ // const: the two required report combinations remain fixed.
  { category: "Programming", threshold: 5 },
  { category: "Self-Development", threshold: 6 }
];
document.getElementById("stockReports").innerHTML = reportSettings.map(({ category, threshold }) => {
  const books = lowStockReport(category, threshold); // const: fixed result for this report.
  return `<div class="report"><strong>${category} — stock below ${threshold}</strong><ul>${books.length
    ? books.map((book) => `<li>${book.title}: ${book.stock} copies</li>`).join("")
    : "<li>No books match.</li>"}</ul></div>`;
}).join("");
