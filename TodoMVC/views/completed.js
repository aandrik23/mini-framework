import { mountTodoApp } from "../components/todo-app.js";

export function renderCompletedView(container) {
  mountTodoApp(container, "completed");
}