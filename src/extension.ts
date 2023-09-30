// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { publicDecrypt } from 'crypto';
import { TerminalProvider } from './TerminalProvider';
import { TreeViewProvider } from './TreeViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "turbocmd" is now active!');
	const provide=new SidebarProvider(context.extensionUri);  
	const provide1=new TerminalProvider(context.extensionUri);
	const provide2=new TreeViewProvider(context.extensionUri);
	 provide.setV(provide1)  
	  context.subscriptions.push(vscode.window.registerWebviewViewProvider('buttons-turbocmd',provide))	
	  context.subscriptions.push(vscode.window.registerWebviewViewProvider('term-turbocmd',provide1))	
	  context.subscriptions.push(vscode.window.registerWebviewViewProvider('treeview-turbocmd',provide2))	
	  let disposable = vscode.commands.registerCommand('turbocmd.helloWorld', () => {
		
	});
	context.subscriptions.push(disposable); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
