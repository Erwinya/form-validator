# form-validator

Small client-side validation engine with reusable rules and accessible inline errors.

## Status

Core `validate` helper and reusable `rules` (`required`, `minLength`, `email`, `matches`) are in place. Demo page and styles will land in follow-up commits.

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

## Planned run

```powershell
python -m http.server 5182
```

Then open http://localhost:5182

## License

MIT
