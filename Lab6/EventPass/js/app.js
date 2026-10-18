import { BOOKING_FEE, EVENT, INITIAL_BOOKED, MAX_SEATS, PRICES, ROWS, SEATS_PER_ROW, getScenario, seatPrice, total } from "./data.js";
import { runAsync, runCallbacks, runPromises } from "./flows.js";

const $ = (selector) => document.querySelector(selector);
const seatMap = $("#seatMap");
const selected = new Set();
const booked = new Set(INITIAL_BOOKED);
const fee = BOOKING_FEE;
let busy = false;

function trace(message) {
  const entry = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  entry.textContent = `${time} ${message}`;
  $("#trace").append(entry);
  $("#trace").scrollTop = $("#trace").scrollHeight;
}

function renderSeats() {
  seatMap.replaceChildren();
  ROWS.forEach((row) => {
    const line = document.createElement("div");
    line.className = "seat-row";
    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = row;
    line.append(label);
    for (let number = 1; number <= SEATS_PER_ROW; number += 1) {
      const id = `${row}${number}`;
      const button = document.createElement("button");
      button.className = "seat";
      button.textContent = number;
      button.title = `${id} · Rs ${PRICES[row]}`;
      button.dataset.id = id;
      if (booked.has(id)) {
        button.classList.add("booked");
        button.disabled = true;
        button.title = `${id} · Booked`;
      } else if (getScenario($("#experiment").value).maintenance.includes(id)) {
        button.classList.add("maintenance");
        button.title = `${id} · Maintenance experiment`;
        if (selected.has(id)) button.classList.add("selected");
      } else if (selected.has(id)) button.classList.add("selected");
      button.addEventListener("click", () => toggleSeat(id));
      line.append(button);
    }
    seatMap.append(line);
  });
  renderTotals();
}

function renderTotals() {
  const ids = [...selected];
  $("#selectedCount").textContent = ids.length ? ids.join(", ") : "None";
  const seatTotal = ids.reduce((sum, id) => sum + seatPrice(id), 0);
  $("#seatTotal").textContent = `Rs ${seatTotal.toLocaleString()}`;
  $("#feeTotal").textContent = `Rs ${(ids.length ? fee : 0).toLocaleString()}`;
  $("#grandTotal").textContent = `Rs ${total(ids).toLocaleString()}`;
}

function toggleSeat(id) {
  if (busy || booked.has(id)) return;
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < MAX_SEATS) selected.add(id);
  else setNotice(`Select no more than ${MAX_SEATS} seats.`, true);
  renderSeats();
}

function setNotice(message, error = false) {
  const notice = $("#notice");
  notice.textContent = message;
  notice.classList.toggle("error", error);
}

function setBusy(value) {
  busy = value;
  $("#book").disabled = value;
  $("#quickPick").disabled = value;
  $("#mode").disabled = value;
  $("#experiment").disabled = value;
  $("#outcome").disabled = value;
  renderSeats();
}

function resetStages() {
  document.querySelectorAll(".stage").forEach((item) => {
    item.classList.remove("running", "done", "failed");
    item.querySelector("b").textContent = "Waiting";
  });
}

const hooks = {
  stage(name, state) {
    const item = document.querySelector(`[data-stage="${name}"]`);
    item.classList.remove("running", "done", "failed");
    item.classList.add(state);
    item.querySelector("b").textContent = state === "running" ? "In progress" : state === "done" ? "Complete" : "Failed";
    trace(`${name === "verify" ? "Seat verification" : name === "payment" ? "Payment" : "Ticket"}: ${state}.`);
  },
  isRunning(name) { return document.querySelector(`[data-stage="${name}"]`).classList.contains("running"); },
  note(message) { trace(message); },
  fail(stage, error) {
    hooks.stage(stage, "failed");
    trace(`Error: ${error.message}`);
    setNotice(error.message, true);
    setBusy(false);
  },
  complete(ticket) {
    ticket.ids.forEach((id) => booked.add(id));
    $("#ticket").innerHTML = `<p class="eyebrow">DIGITAL EVENTPASS</p><h2>Booking confirmed</h2><p>${ticket.ids.join(" · ")}</p><p>Reference <strong>${ticket.reference}</strong></p><p>Total paid <strong>Rs ${ticket.amount.toLocaleString()}</strong></p>`;
    $("#ticket").classList.remove("hidden");
    trace(`Ticket ${ticket.reference} issued for ${ticket.ids.join(", ")}.`);
    setNotice("Booking complete. Your seats are confirmed.");
    setBusy(false);
  }
};

function quickPick() {
  const availableSeats = ROWS.flatMap((row) => Array.from({ length: SEATS_PER_ROW }, (_, index) => `${row}${index + 1}`))
    .filter((id) => !booked.has(id) && !getScenario($("#experiment").value).maintenance.includes(id));
  selectGroup(...availableSeats.slice(0, 3));
  setNotice("Quick-pick selected up to three available seats.");
  renderSeats();
}

function selectGroup(...ids) {
  const nextSelection = [...new Set(ids)].slice(0, MAX_SEATS);
  selected.clear();
  nextSelection.forEach((id) => selected.add(id));
}

async function startBooking() {
  if (busy) return;
  if (!selected.size) return setNotice("Choose at least one available seat.", true);
  resetStages();
  $("#ticket").classList.add("hidden");
  const context = { ids: [...selected], amount: total([...selected]), booked, config: getScenario($("#experiment").value), outcome: $("#outcome").value };
  const mode = $("#mode").value;
  setBusy(true);
  trace(`Booking started using ${mode === "async" ? "async/await" : mode}.`);
  if (mode === "callbacks") runCallbacks(context, hooks);
  else if (mode === "promises") await runPromises(context, hooks);
  else {
    try { await runAsync(context, hooks); }
    catch (error) { trace(`Async flow rethrew: ${error.message}`); }
  }
}

$("#quickPick").addEventListener("click", quickPick);
$("#book").addEventListener("click", startBooking);
$("#experiment").addEventListener("change", () => { selected.clear(); renderSeats(); setNotice("Scenario changed. Select available seats."); });
$("#reset").addEventListener("click", () => {
  if (busy) return;
  selected.clear();
  booked.clear();
  INITIAL_BOOKED.forEach((id) => booked.add(id));
  $("#mode").value = "callbacks";
  $("#experiment").value = "baseline";
  $("#outcome").value = "success";
  $("#ticket").classList.add("hidden");
  $("#trace").replaceChildren();
  resetStages();
  setNotice("Demo reset. A2, B4, and C6 are booked.");
  renderSeats();
});
$("#clearTrace").addEventListener("click", () => $("#trace").replaceChildren());
renderSeats();
$("#eventTitle").textContent = EVENT.title;
$("#eventDate").textContent = EVENT.date.toUpperCase();
$("#eventTime").textContent = EVENT.time;
$("#eventVenue").textContent = EVENT.venue;
trace("EventPass ready. Select seats to begin.");
