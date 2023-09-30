<script>
    import Button from "./Button.svelte";
import vscode from "./vscodeVar";
	let comand = '';
    let btnName='';
    let params=''
    let path='C:'
    let executeingCommand
    let buttons=vscode.getState()?.buttons??[] 
      function handleClick () {
        buttons=[...buttons,{ text: btnName, command:comand }];
        buttons=buttons;
        vscode.setState({...vscode.getState(),buttons:buttons})
          }
       function sendCommand(event) {
        vscode.postMessage({ type: 'buttonClick', text:event.detail.arg+' '+params,path:path});
      }
      function removeButton(event){
       buttons = buttons.filter((item, i) => i !== event.detail.arg); 
        buttons=buttons
        vscode.setState({...vscode.getState(),buttons:buttons})
     
      }
      window.addEventListener('message', event => {
                console.log('event u buttons',event);
                const message = event.data.path; 
                path=message
            });
   </script>
<div style=" width:100%; height:100%; padding:10px; background: linear-gradient(0deg, #626321 , rgba(39, 38, 22, 0.00) ;" >
Additional command text:
 <input
 bind:value={params}
 style="border-radius: 4px;"
 />
 {#each buttons as item,index (item.text)}
 <div style="display: flex;felx-direction:row; gap:10px">
    <Button arg={item.command} on:click={sendCommand}>{item.text}  </Button>
  <Button arg={index}  on:click={removeButton}>Remove button</Button>
 </div>
  
{/each}
<div style="display:flex; border:1px solid #1F1922; border-radius:4px; padding:8px; margin-top:20px; flex-direction: row; gap:10px; margin-bottom:20px">
    <div style="flex:3"> 
        Enter button name:<br>
        <input 
        style="border-radius: 4px; margin-top:5px; "
          bind:value={btnName}/>
    </div>
    <div style="flex:3">
        Enter button command:<br>
        <input 
        style="border-radius: 4px; margin-top:5px"
          bind:value={comand}/>  
    </div>
    <div >
        <br>
        <Button on:click={handleClick}>
        <slot>
            Create button
        </slot></Button>
        </div>
   </div>
{buttons.slice(0,0)}
</div>
