import { DELAYS, isFull } from "./data.js";

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export function checkCapacityCallback(context, callback) {
  setTimeout(() => {
    const full = context.workshops.find((workshop) => isFull(workshop));
    if (context.scenario === "full" && !full) return callback(new Error(`${context.workshops[0].name} is full in this scenario.`));
    if (full) return callback(new Error(`${full.name} is full. Approval was not started.`));
    callback(null, context);
  }, DELAYS.capacity);
}

export function approvalCallback(context, callback) {
  setTimeout(() => {
    if (context.scenario === "approval") return callback(new Error("Registration approval was declined. No registration was confirmed."));
    callback(null, context);
  }, DELAYS.approval);
}

export function confirmationCallback(context, callback) {
  const delay = context.scenario === "slowConfirmation" ? 2500 : DELAYS.confirmation;
  setTimeout(() => callback(null, {
    names: context.workshops.map(({ name }) => name),
    total: context.workshops.reduce((sum, { fee }) => sum + fee, 0),
    reference: `WS-${Date.now().toString(36).toUpperCase()}`
  }), delay);
}

export function runCallbacks(context, hooks) {
  hooks.stage("capacity", "running");
  checkCapacityCallback(context, (capacityError, checked) => {
    if (capacityError) return hooks.fail("capacity", capacityError);
    hooks.stage("capacity", "done");
    hooks.stage("approval", "running");
    approvalCallback(checked, (approvalError, approved) => {
      if (approvalError) return hooks.fail("approval", approvalError);
      hooks.stage("approval", "done");
      hooks.stage("confirmation", "running");
      confirmationCallback(approved, (confirmationError, confirmation) => {
        if (confirmationError) return hooks.fail("confirmation", confirmationError);
        hooks.stage("confirmation", "done");
        hooks.complete(confirmation);
      });
    });
  });
}

const fromCallback = (operation, context) => new Promise((resolve, reject) => {
  operation(context, (error, value) => error ? reject(error) : resolve(value));
});
const checkCapacity = (context) => fromCallback(checkCapacityCallback, context);
const approve = (context) => fromCallback(approvalCallback, context);
const confirm = (context) => fromCallback(confirmationCallback, context);

export function runPromises(context, hooks) {
  hooks.stage("capacity", "running");
  return checkCapacity(context)
    .then((checked) => {
      hooks.stage("capacity", "done");
      hooks.stage("approval", "running");
      return approve(checked);
    })
    .then((approved) => {
      hooks.stage("approval", "done");
      hooks.stage("confirmation", "running");
      return confirm(approved);
    })
    .then((confirmation) => {
      hooks.stage("confirmation", "done");
      hooks.complete(confirmation);
    })
    .catch((error) => {
      const active = ["capacity", "approval", "confirmation"].find((name) => hooks.isRunning(name)) ?? "capacity";
      hooks.fail(active, error);
    });
}

export async function runAsync(context, hooks) {
  try {
    hooks.stage("capacity", "running");
    const checked = await checkCapacity(context);
    hooks.stage("capacity", "done");
    hooks.stage("approval", "running");
    const approved = await approve(checked);
    hooks.stage("approval", "done");
    hooks.stage("confirmation", "running");
    const confirmation = await confirm(approved);
    hooks.stage("confirmation", "done");
    hooks.complete(confirmation);
  } catch (error) {
    const active = ["capacity", "approval", "confirmation"].find((name) => hooks.isRunning(name)) ?? "capacity";
    hooks.fail(active, error);
    throw error;
  }
}
