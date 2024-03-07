// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


const BRACES = [
	["'", "'"],
	["\"", "\""],
	["`", "`"],
	["(", ")"],
	["[", "]"],
	["{", "}"],
	[" ", " "],
]


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "containedstring" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('containedstring.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (!editor) return vscode.window.showInformationMessage("couldn't find active Text Editor!");
		const cursorPosition = editor.selection.active;  // a vscode.Position
		const fileTextToCursor = editor.document.getText(new vscode.Range(cursorPosition.line, 0, cursorPosition.line, Number.MAX_SAFE_INTEGER));

		let firstMatch = null
		let secondMatch = null

		for (var b = 0, brace; brace = BRACES[b]; b++) {
			const char = fileTextToCursor[cursorPosition.character - 1]
			if (char === brace[0]) {
				firstMatch = cursorPosition.character
				for (var i = cursorPosition.character, schar; schar = fileTextToCursor[i]; i++) {
					if (schar === brace[1]) {
						secondMatch = i
						break
					}
				}
			}
		}

		if (firstMatch === null && secondMatch === null) {
			for (var b = 0, brace; brace = BRACES[b]; b++) {
				for (var i = cursorPosition.character - 1; i >= 0; i--) {
					const char = fileTextToCursor[i]
					if (char === brace[0]) {
						firstMatch = i + 1
						break
					}
				}

				if (firstMatch !== null) {
					for (var i = cursorPosition.character, schar; schar = fileTextToCursor[i]; i++) {
						if (schar === brace[1]) {
							secondMatch = i
							break
						}
					}
					if (secondMatch !== null) {
						break
					}
				}
				firstMatch = null
			}
		}

		if (firstMatch !== null && secondMatch !== null) {
			editor.selection = new vscode.Selection(
				new vscode.Position(cursorPosition.line, firstMatch),
				new vscode.Position(cursorPosition.line, secondMatch),
			)
			console.log("changed", editor.selection)
		}
		console.log("cursorPosition", cursorPosition)
		vscode.window.showInformationMessage(`line: ${fileTextToCursor}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
