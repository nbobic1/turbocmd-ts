<script>
    import { createEventDispatcher } from 'svelte';
    import Folder from './Folder.svelte'
    export let name;
    export let folders;
    const dispatch = createEventDispatcher();
   function handleClick(){
    dispatch('folderChange',{path:folders.path})
   } 
</script>
<div style="padding-left:10px; border-left:1px solid #fff">
    <button style="background-color: #00000000; text-align:left" on:click={handleClick}>{name}</button>
    <div>
        {#each folders.children as item,index (index)}
        <Folder on:folderChange folders={item} name={item.name}></Folder> 
        {/each}
    </div>
</div>