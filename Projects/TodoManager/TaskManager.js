let taskId = 1;

const isDone = {
  Completed: "completed",
  Uncompleted: "uncompleted",
};

class Task {
  constructor(text) {
    this.id = taskId;
    this.text = text;
    this.status = isDone.Uncompleted;
    this.createdAt = new Date().toLocaleString();
  }
}

class TaskManger {
  constructor() {
    this.tasks = [];
  }

  add(text) {
    if (!text || typeof text !== "string" || text.length < 2)
      throw new Error("Must enter valid text");
    const task = new Task(text);
    taskId++;
    this.tasks.push(task);
    return task;
  }

  delete(id) {
    if (!id || typeof id !== "number") throw new Error("Must enter valid ID");
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  find(id) {
    if (!id || typeof id !== "number") throw new Error("Must enter valid ID");
    return this.tasks.filter((task) => task.id === id)[0];
  }

  changeStatus(id) {
    if (!id || typeof id !== "number") throw new Error("Must enter valid ID");
    this.find(id).status =
      this.find(id).status === isDone.Uncompleted
        ? isDone.Completed
        : isDone.Uncompleted;
  }

  edit(text, id) {
    if (!id || typeof id !== "number") throw new Error("Must enter valid ID");
    if (!text || typeof text !== "string" || text.length < 2)
      throw new Error("Must enter valid text");
    this.find(id).text = text;
  }
}
