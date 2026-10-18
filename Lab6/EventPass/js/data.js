export const EVENT = Object.freeze({ title: "Neon Nights Live", date: "Friday", time: "09:00 PM", venue: "Campus Arena" });
export const PRICES = Object.freeze({ A: 1600, B: 1250, C: 900, D: 700 });
export const BOOKING_FEE = 150;
export const MAX_SEATS = 4;
export const DELAYS = Object.freeze({ verify: 850, payment: 1000, ticket: 700 });
export const ROWS = Object.freeze(["A", "B", "C", "D"]);
export const SEATS_PER_ROW = 6;
export const INITIAL_BOOKED = Object.freeze(["A2", "B4", "C6"]);

export const getScenario = (name) => {
  const config = { delays: { ...DELAYS }, maintenance: [], promiseLimit: false, slowPaymentNotes: false };
  if (name === "slowVerify") config.delays.verify = 1800;
  if (name === "maintenance") config.maintenance = ["A3"];
  if (name === "slowPayment") {
    config.delays.payment = 2500;
    config.slowPaymentNotes = true;
  }
  if (name === "groupLimit") config.promiseLimit = true;
  if (name === "slowTicket") config.delays.ticket = 2500;
  return config;
};

export const seatPrice = (id) => PRICES[id[0]] ?? 0;
export const total = (ids) => ids.length ? ids.reduce((sum, id) => sum + seatPrice(id), 0) + BOOKING_FEE : 0;
