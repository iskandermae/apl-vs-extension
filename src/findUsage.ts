import * as vscode from "vscode";

export function registerFindUsage(context: vscode.ExtensionContext): void {
  const findUsageDisposable = vscode.commands.registerCommand("aplf.findUsage", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active, /[A-Za-z_][A-Za-z0-9_]*/);
    if (!wordRange) {
      return;
    }

    const word = editor.document.getText(wordRange);
    const folders: string[] = vscode.workspace.getConfiguration("aplf").get("findUsageFolders") ?? [];
    const includePattern = folders.length > 0 ? folders.map((f) => `${f}/**`).join(",") : "";

    await vscode.commands.executeCommand("workbench.action.findInFiles", {
      query: `(?<![A-Za-z0-9_])${word}(?![A-Za-z0-9_])`,
      isRegex: true,
      isCaseSensitive: true,
      matchWholeWord: false,
      filesToInclude: includePattern,
    });
  });

  context.subscriptions.push(findUsageDisposable);
}
