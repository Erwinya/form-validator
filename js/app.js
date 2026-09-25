import { rules, validate } from "./validator.js";

const form = document.getElementById("signup");
const status = document.getElementById("form-status");

const schema = {
  name: [rules.required("Full name"), rules.minLength(2, "Full name")],
  email: [rules.required("Email"), rules.email],
  password: [rules.required("Password"), rules.minLength(8, "Password")],
  confirm: [rules.required("Confirm password"), rules.matches("password", "Passwords")],
};

function readValues() {
  return Object.fromEntries(new FormData(form).entries());
}

function clearErrors() {
  form.querySelectorAll(".error").forEach((el) => {
    el.textContent = "";
  });
  form.querySelectorAll("input").forEach((el) => el.classList.remove("invalid"));
}

function showErrors(errors) {
  clearErrors();
  for (const [field, message] of Object.entries(errors)) {
    const input = form.elements.namedItem(field);
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (input) input.classList.add("invalid");
    if (errorEl) errorEl.textContent = message;
  }
}

form.addEventListener("input", () => {
  const errors = validate(readValues(), schema);
  showErrors(errors);
  status.textContent = Object.keys(errors).length
    ? "Fix the highlighted fields."
    : "Looking good.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const errors = validate(readValues(), schema);
  showErrors(errors);
  if (Object.keys(errors).length) {
    status.textContent = "Please correct the errors before submitting.";
    const first = form.querySelector("input.invalid");
    if (first) first.focus();
    return;
  }
  status.textContent = "Validation passed. Ready to submit to an API.";
});
