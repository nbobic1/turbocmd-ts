import * as vscode from "vscode"
import { exec } from 'child_process';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

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
          exec(data.text,{cwd:tem}, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
return
            }
            webviewView.webview.postMessage({ type: 'rezult', text:stdout.replace(new RegExp('\n', 'g'),'<br/>')
           })
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

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
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
        <link href="${styleMainUri}" rel="stylesheet">
        <script >
        </script>
			</head>
      <body>
      <h1>hadsfdag</h1>
      <h2>Changing an Text of an element in the HTML document using JavaScript.</h2>
   <p id = "upper">The text of the below element will be replaced by the text you enter in input bar once you click the button.</p>
   <input type = "text" id = "input"/> <br> <br>
   <button id = "btn" onclick = "changeImage()"> Click to change the Text </button>
   <div id = "para1"></div>
   <p id = "para2">This is the initial text of Para2.</p>
    
  
   <input
   onfocus="this.style.border='1px solid #007bff';"
   onblur="this.style.border='0px solid #007bff';"
   class="suggest-input-container" 
   style="outline: none; background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground); 
    border-width: 0px; border-style: solid; border-radius:2px;   padding:3px;   value=" Search Extensions in Marketplace"></input>

   <script>
   const vscode = acquireVsCodeApi();
   var para1 = document.getElementById("para1");
      window.addEventListener('message', event => {
    console.log('event===',event);
    const message = event.data; // The JSON data our extension sent
        para1.innerHTML=message.text
    switch (message.command) {
        case 'refactor':
            count = Math.ceil(count * 0.5);
            counter.textContent = count;
            break;
    }
});
      var para2 = document.getElementById("para2");
   var input=document.getElementById("input") 
      function changeImage() {
        console.log('ww',) 
        vscode.postMessage({ type: 'buttonClick', text:input.value });
         var inp = document.getElementById("inp");
         var enteredText = inp.value;
         para1.innerText = enteredText + ", This text is changed using the innerText property. ";
         para2.innerHTML = " <u> " + enteredText + " </u> " + ", <b> This text is changed using the <em> innerHTML </em> property. <b> <br> ";
      }
   </script>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}