# APLF Go To Definition

VS Code extension for APL (`.apl`) and `.sysobject` files.

---

## Features

### Go to Definition — `F12`

Place cursor on a word → **F12** → finds a file in the workspace whose stem matches the word → opens it.
Multiple matches open a Quick Pick.

---

### Find Usage — right-click → _Find Usage_

Searches the workspace (or configured folders) for all non-identifier-bounded occurrences of the word under the cursor using VS Code's built-in search panel.

Configure which folders are searched:

```jsonc
// settings.json
"aplf.findUsageFolders": ["src/Business/CorporateActions"]
```

---

### APL Symbol Shortcuts

Insert APL symbols at the cursor while editing `.apl` / `.sysobject` files.

| Shortcut           | Symbol                      |
| ------------------ | --------------------------- |
| `Ctrl+Shift+=`     | `⍬` empty numeric vector    |
| `Ctrl+]`           | `←` left arrow / assignment |
| `Ctrl+I`           | `⍳` iota underbar           |
| `Ctrl+Shift+Space` | open symbol picker          |

#### Toggle on/off

Run **Toggle APL Symbol Shortcuts** from the Command Palette (`Ctrl+Shift+P`), or set:

```jsonc
// settings.json
"aplf.aplSymbolsEnabled": false
```

#### Symbol picker

**`Ctrl+Shift+Space`** (or right-click → _Pick APL Symbol_ / Command Palette) opens a searchable Quick Pick of all available symbols and inserts the selected one.

#### Extend with a custom symbols file

Point `aplf.aplSymbolsFile` at a local JSON file to add more symbols to the picker:

```jsonc
// settings.json
"aplf.aplSymbolsFile": "path/to/my-symbols.json"
```

File format (same as `apl-symbols.json` — `info` is optional, shown as a hint in the picker):

```json
[
  { "info": "ctrl+a", "symbol": "⍺" },
  { "info": "ctrl+w", "symbol": "⍵" }
]
```

#### Add your own APL symbols

Add entries to VS Code's `keybindings.json` (`Ctrl+Shift+P` → _Open Keyboard Shortcuts (JSON)_):

```jsonc
{
  "command": "aplf.insertSymbol",
  "args": { "symbol": "⍺" },
  "key": "ctrl+a",
  "when": "editorTextFocus && (editorLangId == 'apl' || editorLangId == 'sysobject') && aplf.symbolsEnabled",
}
```

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
