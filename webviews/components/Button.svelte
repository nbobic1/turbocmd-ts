<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
export let arg 
	const submit = () => {
        console.log('ergaag',arg)
        dispatch('click',{
            arg:arg
        });
    }
</script>
<button style="flex:1; border-radius: 4px; margin:auto; margin-top:7px; background-color:#D6CE1D; color:#1F1922"  on:click={submit}><slot/></button>
       