import { EVENT, INITIAL_BOOKED, PRICES, ROWS, SEATS_PER_ROW } from "../EventPass/js/data.js";

const output = document.querySelector("#output");
const write = (message) => { output.textContent += `${message}\n`; };

function callbackBooking(id, callback) {
  setTimeout(() => INITIAL_BOOKED.includes(id) ? callback(new Error(`${id} is already booked`)) : callback(null, `${id} verified`), 300);
}

function chargeCard(result) {
  return new Promise((resolve, reject) => setTimeout(() => result === "decline" ? reject(new Error("Card declined")) : resolve("Payment approved"), 300));
}

async function verifyPayment(result) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (result === "decline") throw new Error("Payment declined");
  return "Payment approved";
}

function chooseSeats(...candidates) {
  const booked = new Set(INITIAL_BOOKED);
  return [...new Set(candidates)].filter((id) => !booked.has(id)).slice(0, 3);
}

const examples = {
  timer() {
    write("Start");
    setTimeout(() => write("Timer callback (1000 ms)"), 1000);
    write("End");
  },
  callbackSuccess() {
    callbackBooking("A1", (error, value) => write(error ? `Error: ${error.message}` : value));
    write("Callback registered; execution continues.");
  },
  callbackError() {
    callbackBooking("A2", (error, value) => write(error ? `Error-first callback: ${error.message}` : value));
  },
  promiseError() {
    chargeCard("decline").then(write).catch((error) => write(`Caught with .catch(): ${error.message}`));
  },
  asyncError() {
    verifyPayment("decline").then(write).catch((error) => write(`Caught async rejection: ${error.message}`));
  },
  spreadRest() {
    const proposed = ["A1", "A3", "A4"];
    write(`Rest arguments and spread array: ${chooseSeats(...proposed).join(", ")}`);
  },
  eventData() {
    const { title, date, time, venue } = EVENT;
    const priceList = ROWS.map((row) => `${row}: Rs ${PRICES[row]} × ${SEATS_PER_ROW}`).join(" | ");
    write(`${title} · ${date} · ${time} · ${venue}`);
    write(priceList);
    write(`Initially booked: ${[...INITIAL_BOOKED].join(", ")}`);
  }
};

document.querySelectorAll("[data-run]").forEach((button) => button.addEventListener("click", () => {
  if (button.dataset.run === "timer") write("Timer order example:");
  else write(`${button.textContent}:`);
  examples[button.dataset.run]();
}));
document.querySelector("#clear").addEventListener("click", () => { output.textContent = ""; });
