import * as vscode from "vscode"
import { exec } from 'child_process';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
   terminalWebView:any=null
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
      console.log('dataaaa',data)
      switch (data.type) {
        case "logout": {
          break;
        }
        case "buttonClick": {
          var tem=vscode?.workspace?.workspaceFolders?.at(0)?.uri.path.replace('/c:','C:')
          console.log('tem',tem)
          /*
          this part of code executes comand in terminal
          var term=vscode.window.activeTerminal
          term?.sendText(data.text+'\n')
          term?.show()
          */
          exec(data.text,{cwd:data.path}, (error, stdout, stderr) => {
            if (error) {
                  console.error(`Error: ${error}`);
                  return
            }
            webviewView.webview.postMessage({ type: 'rezult', text:stdout})
            webviewView.webview.postMessage({ type: 'terminalOutput', text:stdout   })
            if(this.terminalWebView!==null)
            {
              console.log('postavljam')
              this.terminalWebView.sendM(stdout+stderr)
            }
            console.log(`Output: ${stderr}`)
            console.log(`Output: ${stdout}`);
        });
          break;
        }
       
        case "onInfo": {
         
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
        
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }
public setV(webview:any)
{
  this.terminalWebView=webview

}
public sendM(m:any){
  this._view?.webview.postMessage(m)
}
  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/App.js")
    );


    // Use a nonce to only allow a specific script to be run.
   
    return `<!DOCTYPE html>
			<html lang="en" style="width:100%; height:100%">
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
        <script >
        </script>
			</head>
      <body style="width:100%; height:100%; padding:0">
      
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}