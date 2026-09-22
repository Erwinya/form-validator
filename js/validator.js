export function validate(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = values[field] ?? "";
    for (const rule of rules) {
      const message = rule(value, values);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}

export const rules = {
  required: (label = "This field") => (value) =>
    String(value).trim() ? null : `${label} is required.`,
  minLength: (min, label = "This field") => (value) =>
    String(value).length >= min ? null : `${label} must be at least ${min} characters.`,
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()) ? null : "Enter a valid email address.",
  matches: (otherField, label = "Fields") => (value, all) =>
    value === all[otherField] ? null : `${label} do not match.`,
};
