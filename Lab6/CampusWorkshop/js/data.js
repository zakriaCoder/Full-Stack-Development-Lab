export const MAX_WORKSHOPS = 2;
export const DELAYS = Object.freeze({ capacity: 900, approval: 850, confirmation: 700 });
export const INITIAL_WORKSHOPS = Object.freeze([
  { id: "ui-design", name: "UI Design Studio", fee: 1200, capacity: 18, registered: 12, detail: "Build clear interfaces and practical design systems." },
  { id: "frontend", name: "Frontend Foundations", fee: 1500, capacity: 20, registered: 15, detail: "Create responsive pages with HTML, CSS, and JavaScript." },
  { id: "python", name: "Python for Data", fee: 1000, capacity: 16, registered: 10, detail: "Explore data handling and small automation tasks." },
  { id: "cyber", name: "Cybersecurity Basics", fee: 1300, capacity: 14, registered: 14, detail: "Practice core security habits and threat awareness." }
]);

export const remainingSeats = ({ capacity, registered }) => Math.max(0, capacity - registered);
export const isFull = (workshop) => remainingSeats(workshop) === 0;
