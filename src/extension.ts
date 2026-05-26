import * as vscode from "vscode";
import { registerAplSymbolCommands } from "./aplSymbols";
import { registerGotoDefinition } from "./gotoDefinition";
import { registerFindUsage } from "./findUsage";

export function activate(context: vscode.ExtensionContext) {
  registerAplSymbolCommands(context);
  registerGotoDefinition(context);
  registerFindUsage(context);
}

export function deactivate() {}
