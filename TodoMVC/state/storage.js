const TODOS_STORAGE_KEY = "todo-mvc-items";

function isValidTodo(todo) {
  return (
    todo &&
    typeof todo === "object" &&
    typeof todo.id === "string" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  );
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore storage failures
  }
}