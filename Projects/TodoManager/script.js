const todoManager = new TaskManger();

const newTodoDiv = document.getElementById("new-todo");
const myTodoDiv = document.getElementById("my-todos");
const sortDiv = document.getElementById("sort-todos");
const todoInput = document.createElement("input");
const todoBtn = document.createElement("button");
const sortBtn = document.createElement("button");

todoBtn.textContent = "Add";
sortBtn.textContent = "Sort";

todoInput.classList.add("input");
todoBtn.classList.add("btn", "btn-success");
sortBtn.classList.add("btn", "btn-primary");

todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    todoBtn.click();
  }
});
todoBtn.addEventListener("click", () => addTodo());
sortBtn.addEventListener("click", () => sortTodos());

const useEffect = () => {
  if (todoManager.tasks.length === 0) sortBtn.style.display = "none";
  else sortBtn.style.display = "block";
  myTodoDiv.innerHTML = "";
  todoManager.tasks.map((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.dataset.taskId = task.id;
    taskDiv.classList.add("task");

    const taskBtnGroup = document.createElement("div");
    taskBtnGroup.classList.add("task-btn-group");

    const taskText = document.createElement("h3");
    taskText.id = "taskText";
    taskText.textContent = `${task.text}`;
    if (task.status === isDone.Completed) {
      taskText.classList.add("completed");
    }

    const removeTask = document.createElement("button");
    removeTask.textContent = "🗑";
    removeTask.classList.add("btn");
    removeTask.addEventListener("click", (e) => removeTodo(e));

    const editTask = document.createElement("button");
    editTask.textContent = "✏️";
    editTask.classList.add("btn");
    editTask.addEventListener("click", (e) => startEditTodo(e));

    const doneTask = document.createElement("button");
    doneTask.textContent = "✅";
    doneTask.classList.add("btn");
    doneTask.addEventListener("click", (e) => changeStatus(e));

    taskDiv.appendChild(taskText);
    taskBtnGroup.appendChild(doneTask);
    taskBtnGroup.appendChild(editTask);
    taskBtnGroup.appendChild(removeTask);
    taskDiv.appendChild(taskBtnGroup);
    myTodoDiv.appendChild(taskDiv);
  });
};

const addTodo = () => {
  todoManager.add(todoInput.value);
  resetInput();
  todoInput.focus();
  useEffect();
};

function resetInput() {
  todoInput.value = "";
}

const removeTodo = (e) => {
  todoManager.delete(Number(e.target.closest("[data-task-id]").dataset.taskId));
  useEffect();
};

const startEditTodo = (e) => {
  const taskDiv = e.target.closest("[data-task-id]");
  const taskText = taskDiv.querySelector("h3");
  const taskInput = document.createElement("input");
  const finishEditBtn = document.createElement("button");

  taskInput.innerHTML = taskText.innerHTML;
  taskText.parentNode.replaceChild(taskInput, taskText);

  taskDiv
    .querySelectorAll("button")
    .forEach((button) => (button.style.display = "none"));

  finishEditBtn.textContent = "✏️";
  finishEditBtn.classList.add("btn");
  finishEditBtn.addEventListener("click", () => finishEditTodo(taskDiv));
  taskDiv.appendChild(finishEditBtn);
};

const finishEditTodo = (taskDiv) => {
  const taskInput = taskDiv.querySelector("input");
  if (taskInput.value.length < 2) throw new Error("Must enter valid text");
  const taskText = document.createElement("h3");

  taskText.innerHTML = taskInput.value;
  taskInput.parentNode.replaceChild(taskText, taskInput);

  todoManager.edit(taskText.textContent, Number(taskDiv.dataset.taskId));
  useEffect();
};

const changeStatus = (e) => {
  const taskDiv = e.target.closest("[data-task-id]");
  todoManager.changeStatus(Number(taskDiv.dataset.taskId));
  useEffect();
};

const sortTodos = () => {
  todoManager.tasks.sort(
    (a, b) =>
      (a.status === isDone.Completed) - (b.status === isDone.Completed) ||
      a.text.localeCompare(b.text)
  );
  useEffect();
};

const compare = (a, b) => {
  if (a.text < b.text) return -1;
  if (a.text > b.text) return 1;
  return 0;
};

const sortCompleted = (a) => {
  if (a.status === isDone.Completed) return 1;
  if (a.status === isDone.Uncompleted) return -1;
  return 0;
};

useEffect();
newTodoDiv.appendChild(todoInput);
newTodoDiv.appendChild(todoBtn);
sortDiv.appendChild(sortBtn);
