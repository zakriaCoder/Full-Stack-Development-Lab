const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const result = (context) => ({ ids: [...context.ids], amount: context.amount, reference: `NN-${Date.now().toString(36).toUpperCase()}` });

export function verifySeatsCallback(context, callback) {
  setTimeout(() => {
    if (context.outcome === "conflict") return callback(new Error("A seat conflict was detected. No payment was started."));
    const unavailable = context.ids.find((id) => context.booked.has(id) || context.config.maintenance.includes(id));
    if (unavailable) return callback(new Error(`${unavailable} is unavailable. Choose another seat.`));
    if (context.config.promiseLimit && context.ids.length > 2) return callback(new Error("Promise mode allows a maximum of two seats in this experiment."));
    callback(null, context);
  }, context.config.delays.verify);
}

export function processPaymentCallback(context, callback) {
  setTimeout(() => {
    if (context.outcome === "payment") return callback(new Error("Payment was declined. No seats were booked."));
    callback(null, context);
  }, context.config.delays.payment);
}

export function issueTicketCallback(context, callback) {
  setTimeout(() => {
    if (context.outcome === "ticket") return callback(new Error("Ticket service failed. No seats were booked."));
    callback(null, result(context));
  }, context.config.delays.ticket);
}

export function runCallbacks(context, hooks) {
  hooks.stage("verify", "running");
  hooks.note("Seat verification started.");
  verifySeatsCallback(context, (verifyError, verified) => {
    if (verifyError) return hooks.fail("verify", verifyError);
    hooks.stage("verify", "done");
    hooks.stage("payment", "running");
    if (context.config.slowPaymentNotes) hooks.note("Payment started. The interface remains responsive during the delay.");
    processPaymentCallback(verified, (paymentError, paid) => {
      if (paymentError) return hooks.fail("payment", paymentError);
      if (context.config.slowPaymentNotes) hooks.note("Payment succeeded after the delayed response.");
      hooks.stage("payment", "done");
      hooks.stage("ticket", "running");
      issueTicketCallback(paid, (ticketError, issued) => {
        if (ticketError) return hooks.fail("ticket", ticketError);
        hooks.stage("ticket", "done");
        hooks.complete(issued);
      });
    });
  });
}

const fromCallback = (operation, context) => new Promise((resolve, reject) => {
  operation(context, (error, value) => error ? reject(error) : resolve(value));
});

const verifySeats = (context) => fromCallback(verifySeatsCallback, context);
const processPayment = (context) => fromCallback(processPaymentCallback, context);
const issueTicket = (context) => fromCallback(issueTicketCallback, context);

export function runPromises(context, hooks) {
  hooks.stage("verify", "running");
  hooks.note("Seat verification started.");
  return verifySeats(context)
    .then((verified) => {
      hooks.stage("verify", "done");
      hooks.stage("payment", "running");
      return processPayment(verified);
    })
    .then((paid) => {
      hooks.stage("payment", "done");
      hooks.stage("ticket", "running");
      return issueTicket(paid);
    })
    .then((issued) => {
      hooks.stage("ticket", "done");
      hooks.complete(issued);
    })
    .catch((error) => {
      const active = ["verify", "payment", "ticket"].find((name) => hooks.isRunning(name)) ?? "verify";
      hooks.fail(active, error);
    });
}

export async function runAsync(context, hooks) {
  try {
    hooks.stage("verify", "running");
    hooks.note("Seat verification started.");
    const verified = await verifySeats(context);
    hooks.stage("verify", "done");
    hooks.stage("payment", "running");
    const paid = await processPayment(verified);
    hooks.stage("payment", "done");
    hooks.stage("ticket", "running");
    const issued = await issueTicket(paid);
    hooks.stage("ticket", "done");
    hooks.complete(issued);
  } catch (error) {
    const active = ["verify", "payment", "ticket"].find((name) => hooks.isRunning(name)) ?? "verify";
    hooks.fail(active, error);
    throw error;
  }
}
