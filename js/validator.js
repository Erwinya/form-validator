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

function isBlank(value) {
  return !String(value).trim();
}

export const rules = {
  required: (label = "This field") => (value) =>
    isBlank(value) ? `${label} is required.` : null,

  // Non-required rules skip blank values; pair with required() for presence.
  minLength: (min, label = "This field") => (value) => {
    if (isBlank(value)) return null;
    return String(value).length >= min
      ? null
      : `${label} must be at least ${min} characters.`;
  },

  maxLength: (max, label = "This field") => (value) => {
    if (isBlank(value)) return null;
    return String(value).length <= max
      ? null
      : `${label} must be at most ${max} characters.`;
  },

  email: (value) => {
    if (isBlank(value)) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
      ? null
      : "Enter a valid email address.";
  },

  pattern: (regex, message = "Enter a valid value.") => (value) => {
    if (isBlank(value)) return null;
    const source = regex instanceof RegExp ? regex.source : String(regex);
    const flags = regex instanceof RegExp ? regex.flags.replace(/[gy]/g, "") : "";
    const re = new RegExp(source, flags);
    return re.test(String(value)) ? null : message;
  },

  matches: (otherField, label = "Fields") => (value, all) =>
    value === all[otherField] ? null : `${label} do not match.`,
};
