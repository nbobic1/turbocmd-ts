import * as vscode from "vscode"
import { exec } from 'child_process';
const fs =require('fs')
const  path = require("path");

function getFolderTree(rootFolderUri:any) {
    console.log('root folder',rootFolderUri)
    const folderTree = {
      name: path.basename(rootFolderUri), // Root folder name
      path: rootFolderUri, // Root folder path
      type: 'folder', // You can include additional information about the folder
      children: [], // Subfolders and files will be stored here
    };
  
    function traverseFolder(currentPath:any, currentFolder:any) {
      const items = fs.readdirSync(currentPath);
  
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
  
        if (stats.isDirectory()) {
          const folder = {
            name: item,
            path: itemPath,
            type: 'folder',
            children: [],
          };
          currentFolder.children.push(folder);
          traverseFolder(itemPath, folder);
        } 
        // You can handle other types (e.g., symbolic links) as needed.
      }
    }
  
    traverseFolder(rootFolderUri, folderTree);
    return folderTree;
  }
export class TreeViewProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  buttonsWebView:any;
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
        var folderTree=getFolderTree(vscode?.workspace?.workspaceFolders?.at(0)?.uri.path.replace('/c:','C:'))
      webviewView.webview.postMessage({ type: 'rezult', text: folderTree})

        this.buttonsWebView.sendM({path:data.path??vscode?.workspace?.workspaceFolders?.at(0)?.uri.path.replace('/c:','C:')})

    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }
  public setV(webview:any)
  {
    this.buttonsWebView=webview
  
  }
  public sendM(text:any){
    this._view?.webview.postMessage({ type: 'terminalOutput', text:text.replace(/\n/g, "<br>")})
  }
  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, "out", "compiled/TreeView.js")
      );
   


    // Use a nonce to only allow a specific script to be run.
   
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        };">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
       
			</head>
      <body>
			</body>
            <script src="${scriptUri}"></script>
			</html>`;
  }
}