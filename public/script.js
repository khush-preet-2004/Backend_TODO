const filtersContainer = document.getElementById("filters");
const form = document.getElementById("task-form");
const todoContainer = document.getElementById("todos-Container");

const clearCompletedBtn = document.getElementById("clear-btn");

getAllTodos(); 
todoContainer.addEventListener("click", async (e) => {
  const btnClass = e.target.className;
  if (btnClass != "delete" && btnClass != "status") return;

  const todoId = e.target.parentElement.id;

  if (btnClass == "delete") {
    await axios.delete(`http://localhost:4000/todo/delete/${todoId}`);
  }

  if (btnClass == "status") {
    await axios.put(`http://localhost:4000/todo/update/${todoId}`);
  }
  getAllTodos();
});

async function getAllTodos() {
  const res = await axios.get("http://localhost:4000/todo/all");
  const todos = res.data.todos;
  renderTodos(todos);
}

function renderTodos(todos) {
  todoContainer.innerHTML = ""; 
  for (let todo of todos) {
    const div = document.createElement("div");
    div.className = "todo";
    div.innerHTML = `<h3>${todo.task}</h3> <div id=${todo._id}>
    <button class="status">${todo.status ? "Undo" : "Complete"}</button>
    <button class="delete">delete</button>
    </div>`;
    todoContainer.prepend(div);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  const input = form.children[0];
  const task = input.value; 
  await axios.post("http://localhost:4000/todo/create", {
    task: task
  });
  input.value = "";
  getAllTodos(); 
});

async function getFilterTodos(filterName) {
  let res = await axios.get("http://localhost:4000/todo/filter", {
    params: {
      filterName: filterName
    }
  });
  let todos = res.data.todos;
  renderTodos(todos);
}

filtersContainer.addEventListener("click", (e) => {
  const btnId = e.target.id;
  const allBtns = filtersContainer.children;
  if (btnId == "all") {
    getFilterTodos("all");
    e.target.className = "active";
    allBtns[1].className = "";
    allBtns[2].className = "";
  } else if (btnId == "active") {
    getFilterTodos("active");
    e.target.className = "active";
    allBtns[0].className = "";
    allBtns[2].className = "";
  } else if (btnId == "completed") {
    getFilterTodos("completed");
    e.target.className = "active";
    allBtns[0].className = "";
    allBtns[1].className = "";
  }
});


clearCompletedBtn.addEventListener("click", async () => {
  try {
    await axios.delete("http://localhost:4000/todo/clear");
    getAllTodos();
  } catch (error) {
    console.error(error);
  }
});
