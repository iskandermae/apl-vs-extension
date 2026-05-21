# APLF Go To Definition

F12 go-to-definition for `.aplf` and `.sysobject` files.

Places cursor on a word → F12 → finds file in workspace with matching stem → opens it.
Multiple matches → Quick Pick.

---

## Prerequisites

- Node.js ≥ 18
- VS Code ≥ 1.75

---

## Build

```bash
npm install
npm run compile
```

Unit tests:

```bash
npm test
```

---

## Run locally (dev)

Open workspace in VS Code → **F5** → Extension Development Host opens with extension loaded.

---

## Package (.vsix)

```bash
npx vsce package
```

Outputs `aplf-goto-definition-v.v.v.vsix` in project root.

---

## Install from .vsix

**VS Code UI:** Extensions panel → `···` menu → _Install from VSIX…_ → pick file.

**CLI:**

```bash
code --install-extension aplf-goto-definition-v.v.v.vsix
```

---

## Publish to Marketplace

1. Create publisher at https://marketplace.visualstudio.com/manage
2. Get Personal Access Token (PAT) from Azure DevOps
3. Login:

```bash
npx vsce login <publisher-name>
```

4. Publish:

```bash
npx vsce publish
```

Bump version before republish:

```bash
npx vsce publish patch   # 0.0.1 -> 0.0.2
npx vsce publish minor   # 0.0.1 -> 0.1.0
npx vsce publish major   # 0.0.1 -> 1.0.0
```
