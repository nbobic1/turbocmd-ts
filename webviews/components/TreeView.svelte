<script>
    import vscode from "./vscodeVar";
    //send message so i get folder structure of opened project
    vscode.postMessage({})
   window.addEventListener('message', event => {
 console.log('event===term',event);
 const message = event.data; // The JSON data our extension sent
});
 
</script>
