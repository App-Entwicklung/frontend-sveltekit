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
<!-- <JsonViewer data={$store}></JsonViewer> -->

{#if isConnected}
<main>
    <slot />

</main>

{:else if isWrongNetwork}
    <p>Wrong network selected...</p>
{:else if isMetamaskInstalled}
    <p>{message}</p>
{:else if isLocked}
    <p>{MetamaskController.init()}</p>
{/if}

{#if message != "" && message != "Loaded."}
    <h1 class="message">{message} Please reload.</h1>
{/if}

<style>
    main {
        align-self: center;
        margin: auto;
        padding: 3vh;
        background-color: #363636;
        border: 1px solid;
        border-radius: 8px;
        border-color: #646cff;
        min-width: 500px;
        max-width: 80%;
        word-wrap: break-word;
    }

    .message {
        color: red;
        position: fixed;
        bottom: 0;

    }

</style>