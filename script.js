let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;
  const category = document.getElementById("categorySelect").value;
  const dueDate = document.getElementById("dueDateInput").value;
  const text = input.value.trim();

  if (text === "") { alert("Please type a task!"); return; }

  const task = {
    id: Date.now(),
    text,
    priority,
    category,
    dueDate,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = "";
  document.getElementById("dueDateInput").value = "";
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  list.innerHTML = "";

  const filtered = tasks.filter(t => {
    const matchSearch = t.text.toLowerCase().includes(searchVal);
    const matchFilter =
      currentFilter === "all" ? true :
      currentFilter === "done" ? t.done :
      !t.done;
    return matchSearch && matchFilter;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-msg">No tasks found! 🎉</div>`;
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.dataset.priority = task.priority;
    if (task.done) li.classList.add("done");

    const priorityEmoji = task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢";
    const categoryEmoji = task.category === "work" ? "💼" : task.category === "personal" ? "👤" : task.category === "shopping" ? "🛒" : "📌";
    const dueDateText = task.dueDate ? `📅 ${task.dueDate}` : "";

    li.innerHTML = `
      <span class="task-text" onclick="toggleDone(${task.id})">${task.text}</span>
      <div class="task-meta">
        <span>${priorityEmoji} ${task.priority}</span>
        <span>${categoryEmoji} ${task.category}</span>
        ${dueDateText ? `<span>${dueDateText}</span>` : ""}
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateCounter();
}

function toggleDone(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit your task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    tasks = tasks.map(t => t.id === id ? { ...t, text: newText.trim() } : t);
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`filter-${type}`).classList.add("active");
  renderTasks();
}

function searchTasks() { renderTasks(); }

function updateCounter() {
  const remaining = tasks.filter(t => !t.done).length;
  document.getElementById("counter").textContent = `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;
}

function toggleDark() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  document.querySelector(".dark-toggle").textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

// Load saved theme
window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.querySelector(".dark-toggle").textContent = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

  // Enter key to add task
  document.getElementById("taskInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  renderTasks();
};