import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface AplSymbolEntry {
  info?: string;
  symbol: string;
}

function loadSymbolsFromFile(filePath: string): AplSymbolEntry[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is AplSymbolEntry => typeof item?.symbol === "string");
  } catch {
    return [];
  }
}

async function insertSymbol(symbol: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  await editor.edit((editBuilder) => {
    for (const selection of editor.selections) {
      editBuilder.replace(selection, symbol);
    }
  });
}

function setSymbolsContext(enabled: boolean): void {
  vscode.commands.executeCommand("setContext", "aplf.aplSymbolsEnabled", enabled);
}

export function registerAplSymbolCommands(context: vscode.ExtensionContext): void {
  // Load default symbols from the bundled apl-symbols.json
  const defaultSymbols = loadSymbolsFromFile(path.join(context.extensionPath, "apl-symbols.json"));

  // Initialise APL symbols context from persisted config
  const initialEnabled: boolean = vscode.workspace.getConfiguration("aplf").get("aplSymbolsEnabled") ?? true;
  setSymbolsContext(initialEnabled);

  // Keep context in sync when user edits settings
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("aplf.aplSymbolsEnabled")) {
        const enabled: boolean = vscode.workspace.getConfiguration("aplf").get("aplSymbolsEnabled") ?? true;
        setSymbolsContext(enabled);
      }
    }),
  );

  // Insert a single APL symbol at every cursor position
  context.subscriptions.push(
    vscode.commands.registerCommand("aplf.insertSymbol", async (args: { symbol: string }) => {
      if (typeof args?.symbol === "string") {
        await insertSymbol(args.symbol);
      }
    }),
  );

  // Toggle APL symbol shortcuts on / off
  context.subscriptions.push(
    vscode.commands.registerCommand("aplf.toggleAplSymbols", async () => {
      const cfg = vscode.workspace.getConfiguration("aplf");
      const current: boolean = cfg.get("aplSymbolsEnabled") ?? true;
      const next = !current;
      await cfg.update("aplSymbolsEnabled", next, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`APL symbol shortcuts ${next ? "enabled" : "disabled"}.`);
    }),
  );

  // Show a picker with all default + custom symbols and insert the chosen one
  context.subscriptions.push(
    vscode.commands.registerCommand("aplf.pickAplSymbol", async () => {
      const cfg = vscode.workspace.getConfiguration("aplf");
      const customFile: string = cfg.get("aplSymbolsFile") ?? "";
      let customSymbols: AplSymbolEntry[] = [];
      if (customFile) {
        const resolved = path.isAbsolute(customFile)
          ? customFile
          : path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? "", customFile);
        customSymbols = loadSymbolsFromFile(resolved);
      }
      const items = [...defaultSymbols, ...customSymbols].map((s) => ({
        label: s.symbol,
        description: s.info ?? "",
      }));
      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: "Select an APL symbol to insert",
      });
      if (picked) {
        await insertSymbol(picked.label);
      }
    }),
  );
}
