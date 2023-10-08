<script>
    import { createEventDispatcher } from 'svelte';
    import Folder from './Folder.svelte'
    export let name;
    export let folders;
    export let selectedPath;
    let hide=true;
    const dispatch = createEventDispatcher();
   function handleClick(){
    dispatch('folderChange',{path:folders.path})
   } 
   function handleHide(){
    hide=!hide
   }
</script>
<div style="padding-left:10px; border-left:1px solid #fff">
    <div style="display: flex; flex-direction:row; gap:5px;">
    <button  style="background-color: #00000000; text-align:left" on:click={handleClick}>{name}</button>
    <button style="background-color: #D6CE1D; width:20px; color:black;" on:click={handleHide}>
   {#if !hide} 
    -
    {:else}
    v
   {/if}
    </button>
    </div>
    {#if folders.path===selectedPath}
        <hr style="border:0; height:1px; background-color: #D6CE1D;"/> 
    {/if}
    <div>
        {#if !hide}
            {#each folders.children as item,index (index)}
            <Folder on:folderChange selectedPath={selectedPath} folders={item} name={item.name}></Folder> 
            {/each}
            {/if}
    </div>
</div>