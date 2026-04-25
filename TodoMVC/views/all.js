import { mountTodoApp } from "../components/todo-app.js";

export function renderAllView(container) {
  mountTodoApp(container, "all");
}