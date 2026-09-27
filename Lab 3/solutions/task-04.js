// Task 4: Tasks 1-3 plus a live count and empty-state message.
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

function updateTaskCount() {
  const count = taskList.children.length;
  if (count === 0) {
    taskCount.textContent = "No tasks yet.";
  } else {
    taskCount.textContent = `${count} ${count === 1 ? "task" : "tasks"}`;
  }
}

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

updateTaskCount();
