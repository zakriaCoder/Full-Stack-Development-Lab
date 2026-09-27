// Task 6: Tasks 1-5 plus a Clear Completed feature.
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const errorMessage = document.getElementById("errorMessage");

function updateTaskCount() {
  const count = taskList.children.length;
  taskCount.textContent = count === 0 ? "No tasks yet." : `${count} ${count === 1 ? "task" : "tasks"}`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    errorMessage.textContent = "Please type a task before adding it.";
    taskInput.focus();
    return;
  }
  errorMessage.textContent = "";
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
  updateTaskCount();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});
taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");
  if (deleteButton && taskList.contains(deleteButton)) {
    deleteButton.closest("li").remove();
    updateTaskCount();
    return;
  }
  if (event.target.matches("li span")) {
    event.target.closest("li").classList.toggle("completed");
  }
});

const clearCompletedBtn = document.createElement("button");
clearCompletedBtn.type = "button";
clearCompletedBtn.className = "clear-btn";
clearCompletedBtn.textContent = "Clear Completed";
document.querySelector(".todo-app").appendChild(clearCompletedBtn);
clearCompletedBtn.addEventListener("click", () => {
  taskList.querySelectorAll("li.completed").forEach((item) => item.remove());
  updateTaskCount();
});

updateTaskCount();
