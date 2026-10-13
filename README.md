# form-validator

Small client-side validation engine with reusable rules and accessible inline errors.

## Status

Complete: validation rules, accessible signup demo, styles, and CI.

## Run

```powershell
python -m http.server 5182
```

Then open http://localhost:5182

## Module

```js
import { validate, rules } from "./js/validator.js";

const errors = validate(
  { email: "a@b.co", password: "secret", confirm: "secret" },
  {
    email: [rules.required("Email"), rules.email],
    password: [rules.required("Password"), rules.minLength(6, "Password")],
    confirm: [rules.matches("password", "Passwords")],
  }
);
```


## Built-in rules

| Helper | Purpose |
|--------|---------|
| `rules.required(label?)` | Non-empty value |
| `rules.minLength(n, label?)` | Minimum string length |
| `rules.email` | Basic email shape check |
| `rules.matches(otherField, label?)` | Must equal another field |

## License

MIT
