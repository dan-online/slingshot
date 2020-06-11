# Slingshot (WIP)

A module created for [Deno](https://deno.land)

## Usage

```typescript
import { Slingshot } from "https://raw.githubusercontent.com/dan-online/slingshot/mod.ts";

const app = new Slingshot();

app.get("/promise").then((req, res) => {
  res.status(200).json({ date: new Date() });
});

app.get("/callback", (req, res) => {
  res.status(200).json({ date: new Date() });
});
```

## Test

```bash
# unit tests
deno test -A
```

## Format code

```bash
deno fmt **/*.ts
```

## Resources

- [Deno Website](https://deno.land)
- [Deno Style Guide](https://deno.land/std/style_guide.md)
- [Deno Gitter](https://gitter.im/denolife/Lobby)
