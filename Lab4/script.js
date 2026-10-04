


const DASHBOARD_TITLE = "Student Result Dashboard";
let currentFilter = "all";
let searchTerm = "";
var sortAscending = true;


console.log(hoistedVar);
var hoistedVar = "I am hoisted";
let hoistedLet = "I am only usable after this line";


const studentsData = [
  { id: 1, name: "Ayesha Khan",  subject: "Web Development", marks: 88 },
  { id: 2, name: "Bilal Ahmed",  subject: "Web Development", marks: 55 },
  { id: 3, name: "Sara Malik",   subject: "Web Development", marks: 72 },
  { id: 4, name: "Hamza Tariq",  subject: "Web Development", marks: 38 },
  { id: 5, name: "Zainab Riaz",  subject: "Web Development", marks: 95 },
  { id: 6, name: "Usman Ali",    subject: "Web Development", marks: 60 },
];


class Student {
  constructor(id, name, subject, marks) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.marks = marks;
  }
  getStatus() {
    return this.marks >= 50 ? "pass" : "fail";
  }
  getGrade() {
    let grade;
    if (this.marks >= 90) grade = "A";
    else if (this.marks >= 75) grade = "B";
    else if (this.marks >= 50) grade = "C";
    else grade = "F";
    console.log(`${this.name}: grade ${grade}`);
    return grade;
  }
}


let studentList = studentsData.map(
  (s) => new Student(s.id, s.name, s.subject, s.marks)
);
console.group("Warm-ups 2–4");
studentList.forEach((student) => { student.grade = student.getGrade(); });
for (const student of studentList) {
  console.log(`${student.name}: ${student.getStatus()}`);
}
const failedStudents = studentList.filter((student) => student.getStatus() === "fail");
console.log("Failed students:", failedStudents);
console.log("Failed names:", failedStudents.map((student) => student.name));
console.groupEnd();


function logStudentDetails(student) {
  console.log(`--- Details for ${student.name} ---`);
  for (const key in student) {
    console.log(`${key}: ${student[key]}`);
  }
}
logStudentDetails(studentsData[0]);


for (let i = 0; i < studentList.length; i++) {
  console.log(`${i + 1}. ${studentList[i].name} — ${studentList[i].marks} marks`);
}
function formatMarks(marks) {
  return `${marks} / 100`;
}
const isTopScorer = function (student, highest) {
  return student.id === highest.id;
};
const toPercentage = (marks) => `${marks}%`;


function calculateSummary(list) {
  const total = list.reduce((sum, s) => sum + s.marks, 0);
  const average = list.length ? (total / list.length).toFixed(2) : "0.00";

  const highest = list.reduce(
    (max, s) => (s.marks > max.marks ? s : max),
    list[0] || { name: "-", marks: 0 }
  );

  const passCount = list.filter((s) => s.getStatus() === "pass").length;
  const failCount = list.length - passCount;
  return { average, highest, passCount, failCount };
}


function renderSummary(list) {
  const summaryEl = document.getElementById("summary");
  const { average, highest, passCount, failCount } = calculateSummary(list);

  summaryEl.innerHTML = `
    <div class="summary-box">Average: ${average}</div>
    <div class="summary-box">Top Scorer: ${highest.name} (${highest.marks})</div>
    <div class="summary-box">Passed: ${passCount}</div>
    <div class="summary-box">Failed: ${failCount}</div>
  `;
}


function createCard(student) {
  const { name, subject, marks } = student;
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


function renderCards(list) {
  const cardGrid = document.getElementById("cardGrid");
  cardGrid.innerHTML = "";

  for (const student of list) {
    const card = createCard(student);
    cardGrid.appendChild(card);
  }
}


function applyFilters() {
  let filtered = studentList;

  if (currentFilter === "pass") {
    filtered = filtered.filter((s) => s.getStatus() === "pass");
  } else if (currentFilter === "fail") {
    filtered = filtered.filter((s) => s.getStatus() === "fail");
  }
  if (searchTerm && searchTerm.length > 0) {
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(searchTerm)
    );
  }

  renderCards(filtered);
  renderSummary(filtered);
}


const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});


document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
});


document.getElementById("sortBtn").addEventListener("click", () => {
  studentList = [...studentList].sort((a, b) =>
    sortAscending ? a.marks - b.marks : b.marks - a.marks
  );
  sortAscending = !sortAscending;
  applyFilters();
});


document.title = DASHBOARD_TITLE;
applyFilters();
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
const catalog = [
  new Book(1, "Clean Code", "Robert C. Martin", 22.50, 8, "Programming"),
  new Book(2, "Eloquent JavaScript", "Marijn Haverbeke", 30, 6, "Programming"),
  new Book(3, "The Pragmatic Programmer", "David Thomas & Andrew Hunt", 40, 3, "Programming"),
  new Book(4, "Atomic Habits", "James Clear", 18, 7, "Self-Development"),
  new Book(5, "Deep Work", "Cal Newport", 20, 2, "Self-Development")
];
const orders = [
  { id: 101, bookId: 1, quantity: 2 },
  { id: 102, bookId: 2, quantity: 3 },
  { id: 103, bookId: 3, quantity: 5 },
  { id: 104, bookId: 99, quantity: 1 },
  { id: 105, bookId: 4, quantity: 0 },
  { id: 106, bookId: 4, quantity: 2 },
  { id: 107, bookId: 5, quantity: 1 },
  { id: 108, bookId: 1, quantity: 7 }
];
function validateOrder(order, books = catalog) {
  const book = books.find((item) => item.id === order.bookId);
  const validQuantity = Number.isInteger(order.quantity) && order.quantity > 0;
  const canFulfill = Boolean(book && validQuantity && book.stock >= order.quantity);
  let reason = "Stock available";
  if (!book) reason = "Book does not exist";
  else if (!validQuantity) reason = "Quantity must be a positive integer";
  else if (book.stock < order.quantity) reason = "Insufficient stock";
  return { valid: canFulfill, message: canFulfill ? `Accepted: ${reason}` : `Rejected: ${reason}`, book };
}
function orderConfirmation(book, quantity) {
  const { title, price } = book;
  const message = `Order confirmed: ${quantity} x ${title} — $${(price * quantity).toFixed(2)} total.`;
  console.log(message);
  return message;
}
function processOrders(incomingOrders, books = catalog) {
  const results = [];
  for (const order of incomingOrders) {
    const validation = validateOrder(order, books);
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
    ({ id, title, quantity, status, reason, revenue, confirmation }));
  const totalRevenue = summary.reduce((total, order) =>
    total + (order.status === "Fulfilled" ? order.revenue : 0), 0);
  return { summary, totalRevenue };
}
function lowStockReport(category, threshold, books = catalog) {
  const report = books.filter((book) => book.stock < threshold && book.category === category)
    .sort((a, b) => a.stock - b.stock);
  console.log(`Low-stock report: ${category}, stock < ${threshold}`);
  console.table(report);
  return report;
}

console.group("Task 2 — validation before batch processing");
const validationTests = [orders[0], orders[3]].map((order) => validateOrder(order).message);
validationTests.forEach((message) => console.log(message));
console.groupEnd();
document.getElementById("validationResults").innerHTML = validationTests.map((message) => `<li>${message}</li>`).join("");

const batchReport = processOrders(orders);
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

const reportSettings = [
  { category: "Programming", threshold: 5 },
  { category: "Self-Development", threshold: 6 }
];
document.getElementById("stockReports").innerHTML = reportSettings.map(({ category, threshold }) => {
  const books = lowStockReport(category, threshold);
  return `<div class="report"><strong>${category} — stock below ${threshold}</strong><ul>${books.length
    ? books.map((book) => `<li>${book.title}: ${book.stock} copies</li>`).join("")
    : "<li>No books match.</li>"}</ul></div>`;
}).join("");
