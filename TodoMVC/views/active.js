import { mountTodoApp } from "../components/todo-app.js";

export function renderActiveView(container) {
  mountTodoApp(container, "active");
}