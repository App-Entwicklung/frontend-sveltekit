<script lang="ts">
	import JsonViewer from "$lib/components/JsonViewer.svelte";
    import UserController from "$lib/controllers/UserController";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    const {store, newName} = UserController;
    let existingAccount = writable(true);

    function onSubmit() {
        UserController.register()
    }

    onMount(async()=> {
        const t = await UserController.init();
        existingAccount.set(t == false ? false : true);
    })

    $: ({ myName,myAddress,myBalance,myContacts, message} = $store);
</script>

<JsonViewer data={$store}/>

{#if $existingAccount}
<main>
    {#if myName != "loading..."}
        <h1>Hello there {myName}</h1>
        <h1> HEllo</h1>
    {:else}
        <!-- <h1>{message}</h1> -->
        <h2>Hello2 {myAddress}</h2>
    {/if}
</main>
{:else}
    <form on:submit>
        <input bind:value={$newName} placeholder="NewName" on:submit={onSubmit}/>
        <button on:click={onSubmit}>Register</button>
    </form>
{/if}
