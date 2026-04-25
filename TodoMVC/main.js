import { initApp, registerView } from "./framework/index.js";
import { renderAllView } from "./views/all.js";
import { renderActiveView } from "./views/active.js";
import { renderCompletedView } from "./views/completed.js";

registerView({
  key: "all",
  label: "All",
  renderer: renderAllView,
  isDefault: true
});

registerView({
  key: "active",
  label: "Active",
  renderer: renderActiveView
});

registerView({
  key: "completed",
  label: "Completed",
  renderer: renderCompletedView
});

initApp(document.getElementById("app"));