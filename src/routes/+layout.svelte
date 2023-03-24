<script lang="ts">
	import { onMount } from "svelte";
	import JsonViewer from "../lib/components/JsonViewer.svelte";
	import MetamaskController from "../lib/contracts/controllers/MetamaskController";


    const {store} = MetamaskController;

    onMount(() => {MetamaskController.init()})
    
</script>
<JsonViewer data={$store}></JsonViewer>
<slot />