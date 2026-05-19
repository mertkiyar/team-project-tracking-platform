const API = "http://localhost:3000/api";

//auth
async function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorLogin = document.getElementById("loginError");

  if (!email || !password) {
    errorLogin.style.display = "block";
    errorLogin.textContent = "Please fill all blanks!";
    return;
  }

  try {
    const response = await api("/auth/login", "POST", { email, password });
    
    if (response.error) {
      errorLogin.style.display = "block";
      errorLogin.textContent = response.error;
      return;
    }

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("userId", response.user.id);
    localStorage.setItem("userName", response.user.name);
    localStorage.setItem("userRole", response.user.role);
    errorLogin.style.display = "none";
    showMainPage();
  } catch (err) {
    errorLogin.style.display = "block";
    errorLogin.textContent = "Login failed. Please try again.";
  }
}

function showMainPage() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

function showLoginPage() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  showLoginPage();
}

function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (token) {
    showMainPage();
  } else {
    showLoginPage();
  }
}

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
  // Check authentication on page load
  checkAuth();

  // Login - Enter tuşu ile giriş
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  if (loginEmail) {
    loginEmail.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }
  if (loginPassword) {
    loginPassword.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  // Modal close button
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  //logout
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
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

  list.innerHTML = "";

  // projects card
  projects.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = p.title;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = p.description;
    card.appendChild(desc);

    const br = document.createElement("br");
    card.appendChild(br); // empty line

    const startDate = document.createElement("p");
    startDate.textContent = "Start Date: "

    const strongStartDate = document.createElement("strong");
    strongStartDate.textContent = new Date(p.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    startDate.appendChild(strongStartDate);
    card.appendChild(startDate);

    const endDate = document.createElement("p");
    endDate.textContent = "Prd. End Date: "
    const strongEndDate = document.createElement("strong");
    strongEndDate.textContent = new Date(p.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    endDate.appendChild(strongEndDate);
    card.appendChild(endDate);

    const status = document.createElement("p");
    status.textContent = "Status: "
    const strongStatus = document.createElement("strong");
    strongStatus.textContent = formatText(p.status)
    status.appendChild(strongStatus);
    card.appendChild(status);

    const br2 = document.createElement("br");
    card.appendChild(br2); // empty line

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    const membersButton = document.createElement("button");
    membersButton.className = "btn-primary";
    membersButton.textContent = "Members";
    membersButton.onclick = () => viewProjectMembers(p.id);
    cardActions.appendChild(membersButton);

    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => editProject(p.id);
    cardActions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteProject(p.id);
    cardActions.appendChild(deleteButton);

    card.appendChild(cardActions);

    list.appendChild(card);
  });
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
    <input type="date" id="prjStart" required />
    <input type="date" id="prjEnd" required />
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
    <input type="date" id="prjStart" value="${p.start_date || ''}" required />
    <input type="date" id="prjEnd" value="${p.end_date || ''}" required />
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

// projects - view members
async function viewProjectMembers(projectId) {
  const members = await api("/members");
  if (!members) return;

  const projectMembers = members.filter(m => m.project_id === projectId);

  let memberHtml = "";
  projectMembers.forEach(m => {
    memberHtml += `
      <div class="member-item" data-id="${m.id}" style="padding: 12px; background: #f0f0f0; margin: 8px 0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${m.name}</strong><br>
          <small>${m.email}</small>
        </div>
        <button class="btn-delete remove-member-btn" style="padding: 6px 10px; font-size: 12px;">Remove</button>
      </div>
    `;
  });

  if (projectMembers.length === 0) {
    memberHtml = "<p>no members assigned</p>";
  }

  openModal("Project Members", `
    <button id="addMemberBtn" class="btn-primary" style="margin-bottom: 15px;">+ Add Member</button>
    <div id="memberList">${memberHtml}</div>
  `);

  document.getElementById("addMemberBtn")?.addEventListener("click", () => {
    showAddMemberForm(projectId);
  });

  document.querySelectorAll(".remove-member-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const memberId = e.target.closest(".member-item").dataset.id;
      if (confirm("Remove this member from project?")) {
        await api(`/members/${memberId}`, "DELETE");
        viewProjectMembers(projectId);
      }
    });
  });
}

// users - get
async function loadUsers() {
  const users = await api("/users");
  if (!users) return;
  const list = document.getElementById("userList");
  if (!list) return;

  list.innerHTML = "";

  const nonAdminUsers = users.filter(u => u.role !== 'admin');
  nonAdminUsers.forEach((u) => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("h3");
    name.textContent = u.name;
    card.appendChild(name);

    const email = document.createElement("p");
    email.textContent = u.email;
    card.appendChild(email);

    const br = document.createElement("br");
    card.appendChild(br);

    const role = document.createElement("p");
    role.textContent = "Role: ";
    const strongRole = document.createElement("strong");
    strongRole.textContent = u.role ? u.role.replace(/_/g, " ").toUpperCase() : "N/A";
    role.appendChild(strongRole);
    card.appendChild(role);

    const department = document.createElement("p");
    department.textContent = "Department: ";
    const strongDept = document.createElement("strong");
    strongDept.textContent = u.department || "N/A";
    department.appendChild(strongDept);
    card.appendChild(department);

    const br2 = document.createElement("br");
    card.appendChild(br2);

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => editUser(u.id);
    cardActions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteUser(u.id);
    cardActions.appendChild(deleteButton);

    card.appendChild(cardActions);

    list.appendChild(card);
  });
}

// users - create
document.getElementById("addUserBtn")?.addEventListener("click", () => {
  openModal("Add New User", `
    <input type="text" id="userName" placeholder="Name" required />
    <input type="email" id="userEmail" placeholder="Email" required />
    <input type="password" id="userPassword" placeholder="Password" required />
    <select id="userRole" required>
      <option value="">Select Role</option>
      <option value="employee">Employee</option>
      <option value="project_manager">Project Manager</option>
      <option value="admin">Admin</option>
    </select>
    <input type="text" id="userDept" placeholder="Department" />
    <button type="submit" class="btn-primary">Save User</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      password: document.getElementById("userPassword").value,
      role: document.getElementById("userRole").value,
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
    <select id="userRole" required>
      <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>Employee</option>
      <option value="project_manager" ${user.role === 'project_manager' ? 'selected' : ''}>Project Manager</option>
      <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
    </select>
    <input type="text" id="userDept" placeholder="Department" value="${user.department || ''}" />
    <button type="submit" class="btn-primary">Update User</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      role: document.getElementById("userRole").value,
      department: document.getElementById("userDept").value
    };
    await api(`/users/${id}`, "PUT", data);
    closeModal();
    loadUsers();
  };
}

// members - add form
async function showAddMemberForm(projectId) {
  const users = await api("/users");
  const members = await api("/members");

  const projectMembers = members.filter(m => m.project_id === projectId);
  const availableUsers = users.filter(u =>
    u.role !== 'admin' && !projectMembers.find(m => m.user_id === u.id)
  );

  let options = "";
  availableUsers.forEach(u => {
    options += `<option value="${u.id}">${u.name} (${u.email})</option>`;
  });

  if (availableUsers.length === 0) {
    alert("No users available to add");
    return;
  }

  openModal("Add Member to Project", `
    <select id="memberId" required>
      <option value="">Select User</option>
      ${options}
    </select>
    <select id="memberRole" required>
      <option value="">Select Role</option>
      <option value="developer">Developer</option>
      <option value="qa">QA</option>
      <option value="designer">Designer</option>
    </select>
    <button type="submit" class="btn-primary">Add Member</button>
  `);

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const memberId = document.getElementById("memberId").value;
    const memberRole = document.getElementById("memberRole").value;

    console.log("Form data:", { projectId, memberId, memberRole });

    const data = {
      project_id: parseInt(projectId),
      user_id: parseInt(memberId),
      project_role: memberRole
    };
    console.log("Sending:", data);

    const response = await api("/members", "POST", data);
    console.log("Add member response:", response);
    if (response.error) {
      alert("Error: " + response.error);
      return;
    }
    closeModal();
    viewProjectMembers(projectId);
  };
}

// tasks - get
async function loadTasks() {
  const tasks = await api("/tasks");
  if (!tasks) return;
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach((t) => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = t.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = t.description || "";
    card.appendChild(description);

    const br = document.createElement("br");
    card.appendChild(br);

    const tag = document.createElement("p");
    tag.textContent = "Tag: ";
    const strongTag = document.createElement("strong");
    strongTag.textContent = formatText(t.tag);
    tag.appendChild(strongTag);

    card.appendChild(tag);

    const priority = document.createElement("p");
    priority.textContent = "Priority: ";
    const strongPriority = document.createElement("strong");
    strongPriority.textContent = formatText(t.priority);
    priority.appendChild(strongPriority);

    card.appendChild(priority);

    const deadline = document.createElement("p");
    deadline.textContent = "Deadline: "
    const strongDeadline = document.createElement("strong");
    strongDeadline.textContent = t.deadline ? new Date(t.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No deadline';
    deadline.appendChild(strongDeadline);
    card.appendChild(deadline);

    const project = document.createElement("p");
    project.textContent = "Project: "
    const strongProject = document.createElement("strong");
    strongProject.textContent = t.project_title || "Unknown Project";
    project.appendChild(strongProject);
    card.appendChild(project);

    const status = document.createElement("p");
    status.textContent = "Status: "
    const strongStatus = document.createElement("strong");
    strongStatus.textContent = formatText(t.status)
    status.appendChild(strongStatus);
    card.appendChild(status);

    const br2 = document.createElement("br");
    card.appendChild(br2);

    const assigned = document.createElement("p");
    assigned.textContent = "Assigned: "
    const strongAssigned = document.createElement("strong");
    strongAssigned.textContent = t.assigned_name || 'Unassigned';
    assigned.appendChild(strongAssigned);
    card.appendChild(assigned);

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => editTask(t.id);
    cardActions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(t.id);
    cardActions.appendChild(deleteButton);

    card.appendChild(cardActions);

    list.appendChild(card);
  });
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
    <select id="taskTag">
      <option value="feature" selected>Feature</option>
      <option value="bug">Bug</option>
      <option value="fix">Fix</option>
      <option value="enhancement">Enhancement</option>
      <option value="docs">Docs</option>
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
      tag: document.getElementById("taskTag").value,
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
    <select id="taskTag">
      <option value="feature" ${task.tag === 'feature' ? 'selected' : ''}>Feature</option>
      <option value="bug" ${task.tag === 'bug' ? 'selected' : ''}>Bug</option>
      <option value="fix" ${task.tag === 'fix' ? 'selected' : ''}>Fix</option>
      <option value="enhancement" ${task.tag === 'enhancement' ? 'selected' : ''}>Enhancement</option>
      <option value="docs" ${task.tag === 'docs' ? 'selected' : ''}>Docs</option>
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
      tag: document.getElementById("taskTag").value,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value,
      deadline: document.getElementById("taskDeadline").value
    };
    await api(`/tasks/${id}`, "PUT", data);
    closeModal();
    loadTasks();
  };
}
