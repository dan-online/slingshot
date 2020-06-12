# Slingshot (WIP)

A module created for [Deno](https://deno.land)

## Usage

### Regular

```bash
deno run --allow-env --allow-net myFile.ts
```

### Debug

```bash
DEBUG=* deno run --allow-env --allow-net myFile.ts
```

### myFile.ts

```typescript
import {
  Slingshot,
  Response,
} from "https://raw.githubusercontent.com/dan-online/slingshot/master/mod.ts";

const app = new Slingshot();

app.promises.get("/promise").then((route: any) => {
  // promises can only be called once
  const { res } = route;
  res.status(200).json({ date: new Date() });
});

app.callbacks.get("/callback", (req: Request, res: Response) => {
  // callback will be called every time
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
