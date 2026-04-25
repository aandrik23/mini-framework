import { emit } from "../framework/index.js";
import { loadTodos, saveTodos } from "./storage.js";

let todos = loadTodos();

function commit() {
  saveTodos(todos);
  emit("todos:changed");
}

export function getTodos() {
  return todos;
}

export function getActiveTodos() {
  return todos.filter(todo => !todo.completed);
}

export function getCompletedTodos() {
  return todos.filter(todo => todo.completed);
}

export function getTodosByFilter(filter) {
  if (filter === "active") return getActiveTodos();
  if (filter === "completed") return getCompletedTodos();
  return getTodos();
}

export function getRemainingCount() {
  return todos.filter(todo => !todo.completed).length;
}

export function hasCompletedTodos() {
  return todos.some(todo => todo.completed);
}

export function addTodo(text) {
  const value = text.trim();
  if (!value) return;

  todos.push({
    id: crypto.randomUUID(),
    text: value,
    completed: false
  });

  commit();
}

export function toggleTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  commit();
}

export function removeTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  commit();
}

export function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  commit();
}

export function updateTodo(id, text) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;

  const value = text.trim();

  if (!value) {
    removeTodo(id);
    return;
  }

  todo.text = value;
  commit();
}