import { INITIAL_WORKSHOPS, MAX_WORKSHOPS, remainingSeats } from "./data.js";
import { runAsync, runCallbacks, runPromises } from "./flows.js";

const $ = (selector) => document.querySelector(selector);
const workshops = INITIAL_WORKSHOPS.map((workshop) => ({ ...workshop }));
const selected = new Set();
let busy = false;

function log(message) {
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} ${message}`;
  $("#timeline").append(item);
  $("#timeline").scrollTop = $("#timeline").scrollHeight;
}

function render() {
  const container = $("#workshops");
  container.replaceChildren();
  workshops.forEach((workshop, index) => {
    const { id, name, fee, capacity, registered, detail } = workshop;
    const remaining = remainingSeats(workshop);
    const full = remaining === 0;
    const card = document.createElement("article");
    card.className = `workshop${selected.has(id) ? " selected" : ""}${full ? " full" : ""}`;
    card.innerHTML = `<div class="number">0${index + 1}</div><div><h3>${name}</h3><p>${detail}</p><div class="meta"><span>Rs ${fee.toLocaleString()}</span><span>${remaining} of ${capacity} seats available</span></div></div><label><input type="checkbox" value="${id}" ${selected.has(id) ? "checked" : ""} ${full || busy ? "disabled" : ""}><span>${full ? "Full" : "Select"}</span></label>`;
    card.querySelector("input").addEventListener("change", () => toggleSelection(id));
    container.append(card);
  });
  const items = [...selected].map((id) => workshops.find(({ id: workshopId }) => workshopId === id)).filter(Boolean);
  $("#selectionCount").textContent = `${items.length} / ${MAX_WORKSHOPS} selected`;
  $("#summaryTitle").textContent = items.length ? `${items.length} workshop${items.length > 1 ? "s" : ""} selected` : "No sessions selected";
  $("#summaryItems").replaceChildren(...items.map(({ name }) => {
    const tag = document.createElement("span");
    tag.className = "selection-item";
    tag.textContent = name;
    return tag;
  }));
  const total = items.reduce((sum, { fee }) => sum + fee, 0);
  $("#summaryTotal").textContent = `Total fee: Rs ${total.toLocaleString()}`;
}

function toggleSelection(id) {
  if (busy) return;
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < MAX_WORKSHOPS) selected.add(id);
  else $("#status").textContent = `Choose no more than ${MAX_WORKSHOPS} workshops.`;
  render();
}

function selectGroup(...ids) {
  const nextSelection = [...new Set(ids)].filter((id) => workshops.some((workshop) => workshop.id === id)).slice(0, MAX_WORKSHOPS);
  selected.clear();
  nextSelection.forEach((id) => selected.add(id));
  render();
}

function resetStages() {
  document.querySelectorAll("[data-stage]").forEach((stage) => {
    stage.classList.remove("running", "done", "failed");
    stage.querySelector("b").textContent = "Waiting";
  });
}

const hooks = {
  stage(name, state) {
    const stage = document.querySelector(`[data-stage="${name}"]`);
    stage.classList.remove("running", "done", "failed");
    stage.classList.add(state);
    stage.querySelector("b").textContent = state === "running" ? "In progress" : state === "done" ? "Complete" : "Failed";
    log(`${name[0].toUpperCase()}${name.slice(1)}: ${state}.`);
  },
  isRunning(name) { return document.querySelector(`[data-stage="${name}"]`).classList.contains("running"); },
  fail(stage, error) {
    hooks.stage(stage, "failed");
    log(`Error: ${error.message}`);
    $("#status").textContent = error.message;
    $("#status").classList.add("error");
    setBusy(false);
  },
  complete(confirmation) {
    confirmation.names.forEach((name) => {
      const workshop = workshops.find((item) => item.name === name);
      if (workshop) workshop.registered += 1;
    });
    $("#confirmation").innerHTML = `<small>REGISTRATION CONFIRMED</small><h2>${confirmation.reference}</h2><p>${confirmation.names.join(" + ")}</p><p>Total fee: <strong>Rs ${confirmation.total.toLocaleString()}</strong></p>`;
    $("#confirmation").classList.remove("hidden");
    log(`Confirmed ${confirmation.reference}.`);
    $("#status").textContent = "Registration complete. Your seats are confirmed.";
    $("#status").classList.remove("error");
    selected.clear();
    setBusy(false);
  }
};

function setBusy(value) {
  busy = value;
  $("#register").disabled = value;
  $("#mode").disabled = value;
  $("#scenario").disabled = value;
  $("#clear").disabled = value;
  render();
}

async function register() {
  if (busy) return;
  if (!selected.size) {
    $("#status").textContent = "Select at least one workshop.";
    $("#status").classList.add("error");
    return;
  }
  const ids = [...selected];
  const names = ids.map((id) => workshops.find((workshop) => workshop.id === id)?.name);
  if (new Set(names).size !== names.length || names.some((name) => !name)) {
    $("#status").textContent = "Selection contains a duplicate or invalid workshop.";
    return;
  }
  const context = { workshops: ids.map((id) => workshops.find((workshop) => workshop.id === id)), scenario: $("#scenario").value };
  const mode = $("#mode").value;
  resetStages();
  $("#confirmation").classList.add("hidden");
  $("#status").classList.remove("error");
  setBusy(true);
  log(`Registration started using ${mode === "async" ? "async/await" : mode}.`);
  if (mode === "callbacks") runCallbacks(context, hooks);
  else if (mode === "promises") await runPromises(context, hooks);
  else {
    try { await runAsync(context, hooks); }
    catch (error) { log(`Async flow rethrew: ${error.message}`); }
  }
}

$("#register").addEventListener("click", register);
$("#clear").addEventListener("click", () => { selected.clear(); render(); $("#status").textContent = "Selection cleared."; });
$("#clearLog").addEventListener("click", () => $("#timeline").replaceChildren());
$("#scenario").addEventListener("change", () => {
  if ($( "#scenario").value === "full") selectGroup("cyber");
  else if (!selected.size) render();
  $("#status").classList.remove("error");
  $("#status").textContent = "Scenario changed. Confirm your selection and register.";
});
log("Workshop registration portal ready.");
render();
