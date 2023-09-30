<script>
    import Folder from "./Folder.svelte";
import vscode from "./vscodeVar";
let treeview=undefined
    //send message so i get folder structure of opened project
    vscode.postMessage({})
   window.addEventListener('message', event => {
 console.log('tree view',event);
 const message = event.data.text; // The JSON data our extension sent
treeview=message

});

function folderChange(event){
    vscode.postMessage({path:event.detail.path})
}
</script>
{#if treeview}
<Folder on:folderChange={folderChange} folders={treeview} name={treeview.name}></Folder> 
{/if}