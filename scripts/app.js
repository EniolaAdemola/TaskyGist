"use strict";
(function () {
  const STORAGE_KEY = "taskManager_tasks";
  /** @typedef {{id:string,text:string,completed:boolean,createdAt:string,updatedAt:string}} Task */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Elements
  const listEl = $("#task-list");
  const emptyEl = $("#empty-state");
  const footerEl = $("#footer");
  const addBtn = $("#add-task-btn");
  const filtersEl = $(".filters");

  const countAllEl = $("#count-all");
  const countActiveEl = $("#count-active");
  const countCompletedEl = $("#count-completed");
  const badgeAllEl = $("#badge-all");
  const badgeActiveEl = $("#badge-active");
  const badgeCompletedEl = $("#badge-completed");

  // Modal elements
  const taskModal = $("#task-modal");
  const taskForm = $("#task-form");
  const taskInput = $("#task-input");
  const charCount = $("#char-count");
  const formError = $("#form-error");
  const errorText = $("#error-text");
  const cancelBtn = $("#cancel-btn");
  const saveBtn = $("#save-btn");
  const saveDefault = $(".save-default", saveBtn);
  const saveLoading = $(".save-loading", saveBtn);
  const modalHeading = $("#task-modal-heading");

  const confirmModal = $("#confirm-modal");
  const confirmCancel = $("#confirm-cancel");
  const confirmDelete = $("#confirm-delete");

  const toastContainer = $("#toast-container");

  // State
  /** @type {Task[]} */
  let tasks = [];
  /** @type {'all'|'active'|'completed'} */
  let filter = "all";
  /** @type {string|null} */
  let editingId = null;
  /** @type {string|null} */
  let pendingDeleteId = null;

  const sampleTasks = [
    {
      id: "1",
      text: "Complete project documentation",
      completed: false,
      createdAt: "2025-08-24T00:00:00.000Z",
      updatedAt: "2025-08-24T00:00:00.000Z",
    },
    {
      id: "2",
      text: "Review code with team",
      completed: true,
      createdAt: "2025-08-24T00:00:00.000Z",
      updatedAt: "2025-08-24T00:00:00.000Z",
    },
    {
      id: "3",
      text: "Design new user interface",
      completed: false,
      createdAt: "2025-08-24T00:00:00.000Z",
      updatedAt: "2025-08-24T00:00:00.000Z",
    },
  ];

  // Utils
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
        return sampleTasks;
      }
    } catch (e) {
      console.error("Error loading tasks", e);
      toast(
        "Storage Error",
        "Could not load saved tasks. Using sample data.",
        "danger"
      );
      return sampleTasks;
    }
    return [];
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Error saving tasks", e);
      toast(
        "Storage Error",
        "Could not save tasks to local storage.",
        "danger"
      );
    }
  }

  function formatDate(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return Math.floor(diffInHours) + "h ago";
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  }

  function toast(title, description, tone = "default") {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<strong>${title}</strong>${
      description ? " — " + description : ""
    }`;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 2500);
  }

  function setModal(open) {
    if (open) {
      taskModal.hidden = false;
      setTimeout(() => taskInput.focus(), 0);
    } else {
      taskModal.hidden = true;
      taskForm.reset();
      charCount.textContent = "0/200";
      formError.hidden = true;
      errorText.textContent = "";
      editingId = null;
    }
  }

  function setConfirmModal(open) {
    confirmModal.hidden = !open;
  }

  function validate(text) {
    const t = text.trim();
    if (!t) return "Task description is required";
    if (t.length < 3) return "Task must be at least 3 characters long";
    if (t.length > 200) return "Task must be less than 200 characters";
    return "";
  }

  // Rendering
  function render() {
    const filtered = tasks.filter((t) =>
      filter === "all" ? true : filter === "active" ? !t.completed : t.completed
    );

    // Empty state and footer
    emptyEl.hidden =
      filtered.length !== 0 || tasks.length !== 0
        ? filtered.length !== 0
        : false;
    if (tasks.length === 0) {
      emptyEl.hidden = false;
      $(".empty-title").textContent = "No tasks yet";
      $(".empty-text").textContent = "Add your first task to get started!";
    } else if (filtered.length === 0) {
      emptyEl.hidden = false;
      if (filter === "active") {
        $(".empty-title").textContent = "No active tasks";
        $(".empty-text").textContent = "All your tasks are completed! 🎉";
      } else if (filter === "completed") {
        $(".empty-title").textContent = "No completed tasks";
        $(".empty-text").textContent = "Complete some tasks to see them here.";
      }
    } else {
      emptyEl.hidden = true;
    }

    footerEl.hidden = tasks.length === 0;

    // Counts
    const counts = {
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    };
    countAllEl.textContent = String(counts.all);
    countActiveEl.textContent = String(counts.active);
    countCompletedEl.textContent = String(counts.completed);
    badgeAllEl.textContent = String(counts.all);
    badgeActiveEl.textContent = String(counts.active);
    badgeCompletedEl.textContent = String(counts.completed);

    // Filter buttons aria state
    $$(".filters .btn").forEach((btn) => {
      const f = btn.getAttribute("data-filter");
      btn.setAttribute("aria-pressed", String(f === filter));
      if (f === filter) {
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");
      } else {
        btn.classList.add("btn-outline");
        btn.classList.remove("btn-primary");
      }
    });

    // List
    listEl.innerHTML = "";
    filtered.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.style.animationDelay = index * 0.05 + "s";

      const checkbox = document.createElement("button");
      checkbox.className = "checkbox" + (task.completed ? " completed" : "");
      checkbox.setAttribute(
        "aria-label",
        task.completed ? "Mark as incomplete" : "Mark as complete"
      );
      checkbox.innerHTML = task.completed ? "✔" : "";
      checkbox.addEventListener("click", () => toggleTask(task.id));

      const content = document.createElement("div");
      content.className = "content";
      const textEl = document.createElement("div");
      textEl.className = "text" + (task.completed ? " completed" : "");
      textEl.textContent = task.text;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent =
        `Created ${formatDate(task.createdAt)}` +
        (task.updatedAt !== task.createdAt
          ? ` • Updated ${formatDate(task.updatedAt)}`
          : "");
      content.appendChild(textEl);
      content.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.className = "action";
      editBtn.setAttribute("aria-label", "Edit task");
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => startEdit(task));

      const delBtn = document.createElement("button");
      delBtn.className = "action danger";
      delBtn.setAttribute("aria-label", "Delete task");
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", () => askDelete(task.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(checkbox);
      li.appendChild(content);
      li.appendChild(actions);
      listEl.appendChild(li);
    });
  }

  // Actions
  function addTask(text) {
    const now = new Date().toISOString();
    const t = {
      id: String(Date.now()),
      text: text.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    tasks = [t, ...tasks];
    saveTasks();
    toast("Task Added", `"${t.text}" has been added to your tasks.`);
    render();
  }

  function updateTask(id, updates) {
    tasks = tasks.map((t) =>
      t.id === id
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    );
    saveTasks();
    render();
  }

  function deleteTask(id) {
    const t = tasks.find((x) => x.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    if (t) toast("Task Deleted", `"${t.text}" has been deleted.`);
    render();
  }

  function toggleTask(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask(id, { completed: !t.completed });
    toast(
      t.completed ? "Task Marked Active" : "Task Completed",
      `"${t.text}" has been ${t.completed ? "reactivated" : "completed"}.`
    );
  }

  // UI helpers
  function startAdd() {
    editingId = null;
    modalHeading.textContent = "Add New Task";
    $("#save-label").textContent = "Add Task";
    $("#task-modal-desc").textContent =
      "Enter a clear description for your new task.";
    taskInput.value = "";
    charCount.textContent = "0/200";
    formError.hidden = true;
    setModal(true);
  }

  function startEdit(task) {
    editingId = task.id;
    modalHeading.textContent = "Edit Task";
    $("#save-label").textContent = "Update Task";
    $("#task-modal-desc").textContent = "Update your task description below.";
    taskInput.value = task.text;
    charCount.textContent = task.text.length + "/200";
    formError.hidden = true;
    setModal(true);
  }

  function askDelete(id) {
    pendingDeleteId = id;
    setConfirmModal(true);
  }

  // Event listeners
  addBtn.addEventListener("click", startAdd);

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    filter = btn.getAttribute("data-filter");
    render();
  });

  taskInput.addEventListener("input", () => {
    const t = taskInput.value;
    charCount.textContent = t.length + "/200";
    formError.hidden = true;
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value;
    const err = validate(text);
    if (err) {
      errorText.textContent = err;
      formError.hidden = false;
      return;
    }

    // show loading state
    saveDefault.hidden = true;
    saveLoading.hidden = false;
    setTimeout(() => {
      if (editingId) {
        updateTask(editingId, { text: text.trim() });
        toast("Task Updated", "Your task has been successfully updated.");
      } else {
        addTask(text);
      }
      saveDefault.hidden = false;
      saveLoading.hidden = true;
      setModal(false);
    }, 300);
  });

  cancelBtn.addEventListener("click", () => setModal(false));
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) setModal(false);
  });

  confirmCancel.addEventListener("click", () => setConfirmModal(false));
  confirmDelete.addEventListener("click", () => {
    if (pendingDeleteId) deleteTask(pendingDeleteId);
    pendingDeleteId = null;
    setConfirmModal(false);
  });
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) setConfirmModal(false);
  });

  // Init
  tasks = loadTasks();
  render();
})();
