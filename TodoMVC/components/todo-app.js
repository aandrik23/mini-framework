import {
  el,
  setView,
  createScopedRenderer,
  subscribeTo
} from "../framework/index.js";

import {
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  updateTodo,
  getRemainingCount,
  hasCompletedTodos,
  getTodosByFilter
} from "../state/todos.js";

function renderHeader() {
  const input = el("input", {
    class: "new-todo",
    placeholder: "What needs to be done?",
    autofocus: true
  });

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    addTodo(input.value);
    input.value = "";
  });

  return el("header", { class: "header" }, [
    el("h1", { text: "todos" }),
    input
  ]);
}

function renderTodoItem(todo) {
  const checkbox = el("input", {
    class: "toggle",
    type: "checkbox",
    checked: todo.completed,
    onchange: () => toggleTodo(todo.id)
  });

  const label = el("label", {
    text: todo.text,
    ondblclick: () => startEdit()
  });

  const destroyBtn = el("button", {
    class: "destroy",
    onclick: () => removeTodo(todo.id)
  });

  const editInput = el("input", {
    class: "edit",
    value: todo.text
  });

  let li = null;
  let editing = false;

  function finishEdit() {
    if (!editing) return;
    editing = false;
    li.classList.remove("editing");
    updateTodo(todo.id, editInput.value);
  }

  function cancelEdit() {
    if (!editing) return;
    editing = false;
    editInput.value = todo.text;
    li.classList.remove("editing");
  }

  function startEdit() {
    editing = true;
    li.classList.add("editing");
    editInput.focus();
    editInput.selectionStart = editInput.value.length;
    editInput.selectionEnd = editInput.value.length;
  }

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit();
    if (e.key === "Escape") cancelEdit();
  });

  editInput.addEventListener("blur", finishEdit);

  li = el("li", {
    class: todo.completed ? "completed" : ""
  }, [
    el("div", { class: "view" }, [
      checkbox,
      label,
      destroyBtn
    ]),
    editInput
  ]);

  return li;
}

function renderMain(container, filter) {
  const todos = getTodosByFilter(filter);

  if (todos.length === 0) return;

  container.appendChild(
    el("section", { class: "main" }, [
      el("ul", { class: "todo-list" }, todos.map(renderTodoItem))
    ])
  );
}

function renderFilters(currentFilter) {
  const items = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" }
  ];

  return el("ul", { class: "filters" }, items.map(item =>
    el("li", null, [
      el("a", {
        class: item.key === currentFilter ? "selected" : "",
        href: item.key === "all" ? "#/" : `#/${item.key}`,
        text: item.label,
        onclick: (e) => {
          e.preventDefault();
          setView(item.key);
        }
      })
    ])
  ));
}

function renderFooter(container, currentFilter) {
  const todos = getTodosByFilter(currentFilter);
  const remaining = getRemainingCount();
  const completedExists = hasCompletedTodos();

  if (todos.length === 0 && remaining === 0 && !completedExists) {
    return;
  }

  container.appendChild(
    el("footer", { class: "footer" }, [
      el("span", { class: "todo-count" }, [
        el("strong", { text: String(remaining) }),
        ` item${remaining === 1 ? "" : "s"} left`
      ]),
      renderFilters(currentFilter),
      completedExists
        ? el("button", {
            class: "clear-completed",
            text: "Clear completed",
            onclick: () => clearCompleted()
          })
        : null
    ])
  );
}

export function mountTodoApp(container, currentFilter) {
  const app = el("section", { class: "todoapp" });
  const headerRoot = el("div");
  const mainRoot = el("div");
  const footerRoot = el("div");

  app.appendChild(headerRoot);
  app.appendChild(mainRoot);
  app.appendChild(footerRoot);

  container.appendChild(app);

  container.appendChild(
    el("footer", { class: "info" }, [
      el("p", { text: "Double-click to edit a todo" })
    ])
  );

  headerRoot.appendChild(renderHeader());

  const mainRenderer = createScopedRenderer(mainRoot, (target) => {
    renderMain(target, currentFilter);
  });

  const footerRenderer = createScopedRenderer(footerRoot, (target) => {
    renderFooter(target, currentFilter);
  });

  function redrawTodoUI() {
    mainRenderer.render();
    footerRenderer.render();
  }

  redrawTodoUI();

  const stopTodosChanged = subscribeTo("todos:changed", redrawTodoUI);

  return function cleanup() {
    stopTodosChanged();
  };
}