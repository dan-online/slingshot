> Slingshot, the http server with promises, callbacks or events to suit your needs

<img src="src/assets/slingshot.png" width="200px">

# Slingshot (WIP)

A module created for [Deno](https://deno.land) by [DanCodes](https://dancodes.online)

![](https://www.code-inspector.com/project/9271/status/svg)
![.github/workflows/deno.yml](https://github.com/dan-online/slingshot/workflows/.github/workflows/deno.yml/badge.svg)
[![DanCodes Discord](https://img.shields.io/discord/478586684666150934?color=%237289DA&label=discord%20support&logo=discord&logoColor=%23fff)](https://discord.gg/fdpcZAA)
![GitHub repo size](https://img.shields.io/github/repo-size/dan-online/slingshot)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/dan-online/slingshot)

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
import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

const app = new Slingshot();

app.promises.post("/").then(({ res }) => {
  // promises can only be called once
  return res.code(200).json({ date: new Date() });
});

app.callbacks.get("/callback", (req: SlingRequest, res: SlingResponse) => {
  // callback will be called every time
  res.code(200).json({ date: new Date() });
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
