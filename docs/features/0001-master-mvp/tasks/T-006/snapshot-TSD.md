## TSD S-0001.05 — Premium, themed UI  (PRD §S-0001.05)
| Aspect | Spec |
|--------|------|
| Interfaces | A theme toggle control switching between **light** and **dark** mode. The chosen mode persists across reloads (stored client-side). Server state is consumed through a single typed API-client module; components consume it via hooks (no scattered raw fetches — CONSTITUTION §4). |
| Data / State | Client-persisted theme preference (browser-local). No server state. |
| Behavior | Single-page layout built from rounded card surfaces with subtle shadows, one consistent accent color, and a considered type/spacing scale. Toggling theme restyles every surface — background, text, accent, and the donut chart — and the choice survives a reload. |
| Access | The single local user. |
| Boundaries | Browser-local persistence for the theme preference. |
| Tests | unit/component: toggle flips mode and applies the corresponding styling tokens; preference is read back after a simulated reload; chart colors resolve in both modes. smoke: switch theme in the running app; all surfaces incl. chart render correctly in both modes. |

---
