import assert from "node:assert/strict";
import { test } from "node:test";
import { rules, validate } from "../js/validator.js";

test("valid input produces no errors", () => {
  const errors = validate(
    { email: "a@b.co", password: "secret12", confirm: "secret12", name: "Ada" },
    {
      name: [rules.required("Name"), rules.minLength(2, "Name"), rules.maxLength(80, "Name")],
      email: [rules.required("Email"), rules.email],
      password: [rules.required("Password"), rules.minLength(8, "Password"), rules.pattern(/\d/, "Need digit")],
      confirm: [rules.matches("password", "Passwords")],
    },
  );
  assert.deepEqual(errors, {});
});

test("first failing rule wins per field", () => {
  const errors = validate(
    { password: "ab" },
    {
      password: [
        rules.required("Password"),
        rules.minLength(8, "Password"),
        rules.pattern(/\d/, "Need digit"),
      ],
    },
  );
  assert.equal(errors.password, "Password must be at least 8 characters.");
});

test("multiple fields fail independently", () => {
  const errors = validate(
    { email: "bad", password: "" },
    {
      email: [rules.required("Email"), rules.email],
      password: [rules.required("Password")],
    },
  );
  assert.equal(errors.email, "Enter a valid email address.");
  assert.equal(errors.password, "Password is required.");
});

test("whitespace-only fails required and skips optional rules", () => {
  assert.equal(rules.required("Name")("   "), "Name is required.");
  assert.equal(rules.minLength(3, "Name")("   "), null);
  assert.equal(rules.maxLength(3, "Name")("   "), null);
  assert.equal(rules.email("   "), null);
  assert.equal(rules.pattern(/\d/, "digit")("   "), null);
});

test("min and max length boundaries", () => {
  assert.equal(rules.minLength(3, "Code")("ab"), "Code must be at least 3 characters.");
  assert.equal(rules.minLength(3, "Code")("abc"), null);
  assert.equal(rules.maxLength(3, "Code")("abcd"), "Code must be at most 3 characters.");
  assert.equal(rules.maxLength(3, "Code")("abc"), null);
});

test("email and pattern rules", () => {
  assert.equal(rules.email("a@b.co"), null);
  assert.equal(rules.email("nope"), "Enter a valid email address.");
  assert.equal(rules.pattern(/\d/, "Need digit")("abc"), "Need digit");
  assert.equal(rules.pattern(/\d/, "Need digit")("a1"), null);
  const sticky = /\d/gy;
  assert.equal(rules.pattern(sticky, "Need digit")("a1"), null);
  assert.equal(rules.pattern(sticky, "Need digit")("a1"), null);
});

test("matches compares fields", () => {
  const ok = rules.matches("password", "Passwords")("x", { password: "x" });
  const bad = rules.matches("password", "Passwords")("y", { password: "x" });
  assert.equal(ok, null);
  assert.equal(bad, "Passwords do not match.");
});

test("fields absent from schema are ignored", () => {
  const errors = validate({ email: "a@b.co", extra: "ignored" }, { email: [rules.email] });
  assert.deepEqual(errors, {});
});
