<script lang="ts">
	import { onMount } from "svelte";
	import JsonViewer from "../lib/components/JsonViewer.svelte";
	import MetamaskController from "../lib/controllers/MetamaskController";


    const {store} = MetamaskController;

    function onChainChanged(chainId: any){
        chainId = parseInt(chainId, 16);
        MetamaskController.networkChanged(chainId)
    }

    onMount(async() => {await MetamaskController.init() 
    if($store.isMetamaskInstalled){
        window.ethereum.on("chainChanged", onChainChanged)
    }})

    $:({isConnected, isWrongNetwork, isMetamaskInstalled, isLocked, message} = $store)
    
</script>
<JsonViewer data={$store}></JsonViewer>

{#if isConnected}
<slot />

{:else if isWrongNetwork}
    <p>Wrong network selected...</p>
{:else if isMetamaskInstalled}
    <p>{message}</p>
{:else if isLocked}
    <p>{MetamaskController.init()}</p>
{:else}
    <p>{message}</p>
{/if}