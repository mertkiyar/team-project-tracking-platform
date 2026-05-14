const API = "http://localhost:3000/api";

// navigation
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});

// api helper
async function api(endpoint, method = "GET", body = null) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API}${endpoint}`, options);
  return res.json();
}

function formatText(text) {
  if (!text) return '';
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");

function openModal(title, contentHtml) {
  modalTitle.textContent = title;
  modalForm.innerHTML = contentHtml;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// init
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
  loadProjects();
  loadUsers();
  loadTasks();
});

// projects - get
async function loadProjects() {
  const projects = await api("/projects");
  if (!projects) return;
  const list = document.getElementById("projectList");
  list.innerHTML = projects.map((p) => `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>Status: <strong>${formatText(p.status)}</strong></p>
      <div class="card-actions">
        <button onclick="editProject(${p.id})">Edit</button>
        <button onclick="deleteProject(${p.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// projects - create
document.getElementById("addProjectBtn")?.addEventListener("click", () => {
  openModal("Add New Project", `
    <input type="text" id="prjTitle" placeholder="Project Title" required />
    <textarea id="prjDesc" placeholder="Description"></textarea>
    <select id="prjStatus">
      <option value="active">Active</option>
      <option value="completed">Completed</option>
      <option value="on-hold">On Hold</option>
    </select>
    <input type="date" id="prjStart" />
    <input type="date" id="prjEnd" />
    <button type="submit" class="btn-primary">Save Project</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("prjTitle").value,
      description: document.getElementById("prjDesc").value,
      status: document.getElementById("prjStatus").value,
      start_date: document.getElementById("prjStart").value,
      end_date: document.getElementById("prjEnd").value
    };
    await api("/projects", "POST", data);
    closeModal();
    loadProjects();
  };
});

// projects - delete
async function deleteProject(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    await api(`/projects/${id}`, "DELETE");
    loadProjects();
  }
}

// projects - update
async function editProject(id) {
  const p = await api(`/projects/${id}`);
  if (!p) return;

  openModal("Edit Project", `
    <input type="text" id="prjTitle" placeholder="Project Title" value="${p.title}" required />
    <textarea id="prjDesc" placeholder="Description">${p.description || ''}</textarea>
    <select id="prjStatus">
      <option value="active" ${p.status === 'active' ? 'selected' : ''}>Active</option>
      <option value="completed" ${p.status === 'completed' ? 'selected' : ''}>Completed</option>
      <option value="on-hold" ${p.status === 'on-hold' ? 'selected' : ''}>On Hold</option>
    </select>
    <input type="date" id="prjStart" value="${p.start_date || ''}" />
    <input type="date" id="prjEnd" value="${p.end_date || ''}" />
    <button type="submit" class="btn-primary">Update Project</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("prjTitle").value,
      description: document.getElementById("prjDesc").value,
      status: document.getElementById("prjStatus").value,
      start_date: document.getElementById("prjStart").value,
      end_date: document.getElementById("prjEnd").value
    };
    await api(`/projects/${id}`, "PUT", data);
    closeModal();
    loadProjects();
  };
}

// users - get
async function loadUsers() {
  const users = await api("/users");
  if (!users) return;
  const list = document.getElementById("userList");
  if (!list) return;
  list.innerHTML = users.map((u) => `
    <div class="card">
      <h3>${u.name}</h3>
      <p>${u.email}</p>
      <br>
      <p><strong>${u.department || 'N/A'}</strong></p>
      <br>
      <div class="card-actions">
        <button onclick="editUser(${u.id})">Edit</button>
        <button onclick="deleteUser(${u.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// users - create
document.getElementById("addUserBtn")?.addEventListener("click", () => {
  openModal("Add New User", `
    <input type="text" id="userName" placeholder="Name" required />
    <input type="email" id="userEmail" placeholder="Email" required />
    <input type="text" id="userDept" placeholder="Department" />
    <button type="submit" class="btn-primary">Save User</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      department: document.getElementById("userDept").value
    };
    await api("/users", "POST", data);
    closeModal();
    loadUsers();
  };
});

// users - delete
async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    await api(`/users/${id}`, "DELETE");
    loadUsers();
  }
}

// users - update
async function editUser(id) {
  const user = await api(`/users/${id}`);
  if (!user) return;

  openModal("Edit User", `
    <input type="text" id="userName" placeholder="Name" value="${user.name}" required />
    <input type="email" id="userEmail" placeholder="Email" value="${user.email}" required />
    <input type="text" id="userDept" placeholder="Department" value="${user.department || ''}" />
    <button type="submit" class="btn-primary">Update User</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      department: document.getElementById("userDept").value
    };
    await api(`/users/${id}`, "PUT", data);
    closeModal();
    loadUsers();
  };
}

// tasks - get
async function loadTasks() {
  const tasks = await api("/tasks");
  if (!tasks) return;
  const list = document.getElementById("taskList");
  if (!list) return;
  list.innerHTML = tasks.map((t) => `
    <div class="card">
      <h3>${t.title}</h3>
      <p>${t.description || ''}</p>
      <br>
      <p>Priority: <strong>${formatText(t.priority)}</strong></p>
      <p>Status: <strong>${formatText(t.status)}</strong></p>
      <br>
      <p>Assigned: <strong>${t.assigned_name || 'Unassigned'}</strong></p>
      <br>
      <div class="card-actions">
        <button onclick="editTask(${t.id})">Edit</button>
        <button onclick="deleteTask(${t.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// tasks - create
document.getElementById("addTaskBtn")?.addEventListener("click", async () => {
  const [projects, users] = await Promise.all([api("/projects"), api("/users")]);

  openModal("Add New Task", `
    <input type="text" id="taskTitle" placeholder="Task Title" required />
    <textarea id="taskDesc" placeholder="Description"></textarea>
    <select id="taskProject" required>
      <option value="">Select Project</option>
      ${projects.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
    </select>
    <select id="taskUser">
      <option value="">Assign User (Optional)</option>
      ${users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
    </select>
    <select id="taskPriority">
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="high">High</option>
    </select>
    <select id="taskStatus">
      <option value="todo" selected>Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
    <input type="date" id="taskDeadline" />
    <button type="submit" class="btn-primary">Save Task</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDesc").value,
      project_id: document.getElementById("taskProject").value,
      assigned_to: document.getElementById("taskUser").value || null,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      deadline: document.getElementById("taskDeadline").value
    };
    await api("/tasks", "POST", data);
    closeModal();
    loadTasks();
  };
});

// tasks - delete
async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    await api(`/tasks/${id}`, "DELETE");
    loadTasks();
  }
}

// tasks - update
async function editTask(id) {
  const [task, projects, users] = await Promise.all([
    api(`/tasks/${id}`),
    api("/projects"),
    api("/users")
  ]);
  if (!task) return;

  openModal("Edit Task", `
    <input type="text" id="taskTitle" placeholder="Task Title" value="${task.title}" required />
    <textarea id="taskDesc" placeholder="Description">${task.description || ''}</textarea>
    <select id="taskProject" required>
      <option value="">Select Project</option>
      ${projects.map(p => `<option value="${p.id}" ${p.id == task.project_id ? 'selected' : ''}>${p.title}</option>`).join('')}
    </select>
    <select id="taskUser">
      <option value="">Assign User (Optional)</option>
      ${users.map(u => `<option value="${u.id}" ${u.id == task.assigned_to ? 'selected' : ''}>${u.name}</option>`).join('')}
    </select>
    <select id="taskPriority">
      <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
      <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
      <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
    </select>
    <select id="taskStatus">
      <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Todo</option>
      <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
      <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
    </select>
    <input type="date" id="taskDeadline" value="${task.deadline || ''}" />
    <button type="submit" class="btn-primary">Update Task</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDesc").value,
      project_id: document.getElementById("taskProject").value,
      assigned_to: document.getElementById("taskUser").value || null,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      deadline: document.getElementById("taskDeadline").value
    };
    await api(`/tasks/${id}`, "PUT", data);
    closeModal();
    loadTasks();
  };
}
