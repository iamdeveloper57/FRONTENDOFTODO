// Get DOM elements
const authForm = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const btn = document.getElementById("btn");
const todoForm = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const logoutBtn = document.getElementById("logout");

// API and token
// const API = "http://localhost:4000/api";
const API = process.env.API_URL || CONFIG.API_URL;
const token = localStorage.getItem("token");

// ========== AUTH SECTION ==========
if (authForm) {
  let isLogin = true;

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    document.getElementById("form-title").innerHTML = isLogin
      ? "Login"
      : "Sign up";
    toggleLink.innerHTML = isLogin ? "Sign up" : "Login";
    btn.innerHTML = isLogin ? "Login" : "Sign up";
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const endpoint = isLogin ? "/user/login" : "/user/signup";

    try {
      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Error");
      }
    } catch (error) {
      alert("Failed to connect to server.");
    }
  });
}

// ========== LOGOUT AND TODO SECTION ==========
if (logoutBtn) {
  if (!token) {
    window.location.href = "index.html";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Function to add a single todo item to the page
  const addTodoItem = (todo) => {
    const li = document.createElement("li");
    li.textContent = todo.task;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "X";
    deleteBtn.onclick = async () => {
      await fetch(API + "/todo/" + todo._id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      li.remove();
    };

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  };

  // Fetch and display todos on page load
  const fetchTodo = async () => {
    try {
      const res = await fetch(API + "/todo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const todos = await res.json();
      todoList.innerHTML = "";
      todos.forEach((todo) => addTodoItem(todo));
    } catch (error) {
      window.location.href = "index.html";
    }
  };

  fetchTodo();

  // ========== HANDLE TODO FORM SUBMISSION ==========
  if (todoForm) {
    todoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const res = await fetch(API + "/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: text }),
      });

      const newTodo = await res.json();
      // addTodoItem(newTodo);
      input.value = "";
      fetchTodo();
    });
  }
}
