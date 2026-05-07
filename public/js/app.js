const API = "http://localhost:3000/api";

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});

// todo load projects, users and tasks
// todo add new projects. users and tasks
//todo use modal for adding new items
