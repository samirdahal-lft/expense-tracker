<!-- proto:prototyping -->
## Prototyping (proto)

Proto finds its workspace automatically by walking up to the nearest `proto/`
(the folder with `proto/proto.json`) — like git finds `.git`. Run proto commands
from anywhere inside the app; no need to pass a root. (Override with
`--root <appRoot>` only in the rare case discovery can't reach it.)

Prototype screens live under `proto/<flow>/screens/`. When building or editing a
prototype:

- Compose screens **only** from components in `proto/manifest.json`, following
  `proto/CONTRACT.md` and `proto/PROJECT.md`. Never hand-style (`className="bg-… p-…"`, inline visual
  `style={{}}`) and never invent components.
- The `proto-screens` skill runs the authoring loop; a PostToolUse hook
  auto-lints every screen write and will reject hand-styled or off-catalog code.
- Pull only the components you need with `proto catalog <Names…>`; verify a
  screen with `proto lint --file proto/<flow>/screens/<Screen>.tsx`.
- Log every departure from the real app (faked data, defanged props, stubbed
  chrome, skipped states) in `proto/<flow>/INTEGRATION.md` as you author. When
  later **integrating** a mockup into the app, read that file first — it is the
  drift ledger that tells you what to close and how.
<!-- /proto:prototyping -->
