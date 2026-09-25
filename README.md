# form-validator

Small client-side validation engine with reusable rules and accessible inline errors.

## Status

Validation rules plus a working signup demo (`index.html` / `js/app.js`) are in place. Styles will land in a follow-up commit.

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

## License

MIT
