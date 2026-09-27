// Task 2: Task 1 plus mark a task complete by clicking its text.
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;
  const item = document.createElement("li");
  const label = document.createElement("span");
  label.textContent = text;
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  item.append(label, deleteBtn);
  taskList.appendChild(item);
  taskInput.value = "";
  taskInput.focus();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});
taskList.addEventListener("click", (event) => {
  if (event.target.matches("li span")) {
    event.target.closest("li").classList.toggle("completed");
  }
});
