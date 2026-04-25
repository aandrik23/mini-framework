# Mini Framework

A lightweight JavaScript SPA micro-framework built with native browser APIs.

It is designed to stay simple, explicit, and reusable without relying on React, Vue, Angular, or other high-level frameworks.

## Features

* Native DOM rendering with `el()`
* Explicit SVG support with `svgEl()`
* Global event-driven updates with `subscribe()` and `emit()`
* Dynamic view registration with `registerView()`
* Default view support
* URL hash routing
* Full root rendering for route/view changes
* Scoped rendering for partial UI updates
* Built-in dialog helpers:

  * `uiAlert()`
  * `uiConfirm()`
  * `uiPrompt()`

---

## Philosophy

This framework is built around a few simple ideas:

* no virtual DOM
* no hidden reactivity
* no unnecessary abstraction
* explicit state updates
* explicit rendering
* small reusable building blocks

State changes trigger renders through explicit events.
Route changes are synchronized through the URL hash.

---

## Project Structure

Structure:

```text
mini-framework/
  app/
    init.js
  components/
    dialog.js
    dom.js
  render/
    render.js
    scoped.js
  state/
    events.js
    router.js
  index.js
  package.json
  README.md
```

---

## How the Framework Works

The framework has two rendering levels.

### 1. Full rendering

Used for:

* initial app mount
* route changes
* full top-level view swaps

The active view is resolved through the router and rendered into the root container.

### 2. Scoped rendering

Used for:

* lists
* counters
* footers
* smaller UI sections inside a view

This lets you update part of a page without redrawing the whole app.

### Overall flow

```text
register views
-> init app
-> initialize router
-> sync current route from URL
-> render active view

later:
state change
-> emit()
-> subscribed render runs again

route change
-> setView(key)
-> URL hash changes
-> hashchange updates current route
-> emit()
-> root render runs again
```

---

## Public API Overview

The framework exports the following public API from `index.js`:

* `initApp`
* `registerView`
* `initializeRouter`
* `getView`
* `setView`
* `getDefaultView`
* `getViewRenderer`
* `getRoutes`
* `getViewList`
* `subscribe`
* `unsubscribe`
* `emit`
* `el`
* `svgEl`
* `uiAlert`
* `uiConfirm`
* `uiPrompt`
* `createScopedRenderer`

---

## Creating Elements

### `el(tag, attrs, children)`

Creates a standard HTML element.

### Example

```js
import { el } from "mini-framework";

const title = el("h1", { text: "Hello" });
```

---

## Adding Attributes

Attributes and properties are passed through the `attrs` object.

### Example

```js
import { el } from "mini-framework";

const input = el("input", {
  type: "text",
  value: "hello",
  class: "field",
  placeholder: "Write something"
});
```

### Supported attribute styles

Examples include:

* `class`
* `text`
* `html`
* `value`
* `type`
* `checked`
* `placeholder`
* DOM properties when supported by the node

---

## Creating Events

Events are declared through `on...` attributes.

### Example

```js
import { el } from "mini-framework";

const button = el("button", {
  text: "Click me",
  onclick: () => {
    console.log("clicked");
  }
});
```

You can use any DOM event in this style, such as:

* `onclick`
* `oninput`
* `onchange`
* `ondblclick`
* `onkeydown`

---

## Nesting Elements

Children can be passed as a single node or an array of nodes.

### Example

```js
import { el } from "mini-framework";

const card = el("div", { class: "card" }, [
  el("h2", { text: "Title" }),
  el("p", { text: "Description text" }),
  el("button", { text: "Open" })
]);
```

You can also pass plain text-like values as children.

### Example

```js
const item = el("li", null, ["Todo item"]);
```

---

## SVG Support

### `svgEl(tag, attrs, children)`

Creates an SVG element using the SVG namespace.

### Example

```js
import { svgEl } from "mini-framework";

const icon = svgEl("svg", { viewBox: "0 0 24 24", width: 24, height: 24 }, [
  svgEl("circle", {
    cx: 12,
    cy: 12,
    r: 10,
    fill: "none",
    stroke: "currentColor"
  })
]);
```

---

## Event System

The framework provides a simple global update system.

### `subscribe(fn)`

Registers a listener.

### `unsubscribe(fn)`

Removes a listener.

### `emit()`

Triggers all listeners.

### Example

```js
import { emit } from "mini-framework";

let count = 0;

export function increment() {
  count += 1;
  emit();
}
```

This is typically used after changing shared state.

---

## Routing

The framework uses hash-based routing.

### Why hash routing

It allows:

* route persistence on refresh
* browser back/forward support
* simple SPA routing without server route configuration

### Route behavior

If your default view is `all`:

* `#/` -> default view
* `#/active` -> `active`
* `#/completed` -> `completed`

### Registering views

```js
import { registerView } from "mini-framework";

registerView({
  key: "all",
  label: "All",
  renderer: renderAll,
  isDefault: true
});

registerView({
  key: "active",
  label: "Active",
  renderer: renderActive
});

registerView({
  key: "completed",
  label: "Completed",
  renderer: renderCompleted
});
```

### Changing views

```js
import { setView } from "mini-framework";

setView("active");
```

That updates the URL hash and route state.

### Reading routes for navigation

```js
import { getRoutes } from "mini-framework";

const routes = getRoutes();
```

Returned shape:

```js
[
  { key: "all", label: "All", hash: "#/" },
  { key: "active", label: "Active", hash: "#/active" },
  { key: "completed", label: "Completed", hash: "#/completed" }
]
```

---

## Full Rendering

### `initApp(container)`

Bootstraps the framework and connects the root container to the router and root renderer.

### Example

```js
import { initApp, registerView } from "mini-framework";
import { renderHome } from "./views/home.js";
import { renderAbout } from "./views/about.js";

registerView({
  key: "home",
  label: "Home",
  renderer: renderHome,
  isDefault: true
});

registerView({
  key: "about",
  label: "About",
  renderer: renderAbout
});

initApp(document.getElementById("app"));
```

This initializes the router, subscribes the root renderer, and performs the first render.

---

## Scoped Rendering

### `createScopedRenderer(container, renderFn)`

Creates a local renderer for one specific container.

Use it when only part of a view should update.

### Example

```js
import { el, createScopedRenderer } from "mini-framework";

function renderCounterSection(container) {
  container.appendChild(el("p", { text: "Counter section" }));
}

const root = document.getElementById("counter-root");
const scoped = createScopedRenderer(root, renderCounterSection);

scoped.render();
```

### Typical use cases

* todo list body
* footer
* counters
* filters
* small independent sections inside a larger view

---

## Dialog Helpers

### `uiAlert(message, options)`

Shows an alert dialog.

```js
import { uiAlert } from "mini-framework";

await uiAlert("Saved successfully");
```

### `uiConfirm(message, options)`

Shows a confirmation dialog and resolves to `true` or `false`.

```js
import { uiConfirm } from "mini-framework";

const ok = await uiConfirm("Delete this item?");
```

### `uiPrompt(message, options)`

Shows an input dialog and resolves to a submitted value or `null`.

```js
import { uiPrompt } from "mini-framework";

const name = await uiPrompt("Enter your name");
```

Custom number prompt:

```js
const hours = await uiPrompt("Hours per day?", {
  defaultValue: 2,
  inputType: "number",
  inputAttrs: {
    min: 1,
    max: 24
  }
});
```

---

## Example App Structure

```text
my-app/
  index.html
  main.js
  views/
    all.js
    active.js
    completed.js
  state/
    todos.js
```

### Example `main.js`

```js
import { initApp, registerView } from "mini-framework";
import { renderAll } from "./views/all.js";
import { renderActive } from "./views/active.js";
import { renderCompleted } from "./views/completed.js";

registerView({
  key: "all",
  label: "All",
  renderer: renderAll,
  isDefault: true
});

registerView({
  key: "active",
  label: "Active",
  renderer: renderActive
});

registerView({
  key: "completed",
  label: "Completed",
  renderer: renderCompleted
});

initApp(document.getElementById("app"));
```

---

## Example State Module

The framework does not force one global store shape.
A simple shared state module works well.

```js
import { emit } from "mini-framework";

let todos = [];

export function getTodos() {
  return todos;
}

export function addTodo(text) {
  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  emit();
}
```

---

## Rules of Use

### Register views before calling `initApp()`

Correct:

```js
registerView(...);
registerView(...);
initApp(container);
```

Wrong:

```js
initApp(container);
registerView(...);
```

### Call `emit()` after shared state changes

If state changes without `emit()`, the subscribed UI will not rerender.

### Use `svgEl()` for SVG nodes

Do not create SVG through `el()`.

### Use scoped rendering when full rerender would be too broad

Scoped rendering is useful for preserving control over smaller sections of the UI.

---

## Current Limitations

This framework is intentionally minimal.

It does not currently include:

* virtual DOM
* diffing
* template compiler
* nested route trees
* built-in global store abstraction
* automatic component lifecycle system

---

## Recommended Use Cases

This framework is a good fit for:

* small SPAs
* TodoMVC-style apps
* student projects
* internal tools
* apps that prefer explicit DOM control

---

## Summary

Mini Framework gives you a simple way to build browser apps using:

* native DOM creation
* explicit route registration
* URL-synced navigation
* manual state updates
* full or scoped rendering
* lightweight dialog helpers

It is intentionally small, explicit, and framework-first.
