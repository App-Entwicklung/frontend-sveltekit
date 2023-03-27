<script lang="ts">
	import JsonViewer from "$lib/components/JsonViewer.svelte";
    import UserController from "$lib/controllers/UserController";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    const {store, newName, contactAddress} = UserController;
    let existingAccount = writable(true);

    function onSubmitNewName() {
        UserController.register();
    }

    function onSubmitContactRequest(){
        UserController.sendContactRequest();
    }

    onMount(async()=> {
        const t = await UserController.init();
        existingAccount.set(t == false ? false : true);
    })

    $: ({ myName,myAddress,myBalance,myContacts, pendingContactRequests, message} = $store);


	function acceptRequest(request: any): any {
		console.log(request);
	}


	function denyRequest(request: any): any {
		console.log(request);
	}
</script>

<JsonViewer data={$store}/>

<main>
{#if $existingAccount}
    {#if myName != "loading..."}
        <h1>Hello there {myName}</h1>

        {#if myContacts.length > 0}
            <h2>Your contacts:</h2>
        
            {#each myContacts as contact}
                <ul><a href={`/chat/${contact.accountAddress}:${contact.name}`}>{contact.name}</a></ul>
            {/each}
        {/if}

        <h2>Add a new Contact:</h2>
        <form on:submit>
            <input bind:value={$contactAddress} placeholder="Contact Address" on:submit={onSubmitContactRequest}/>
            <button on:click={onSubmitContactRequest}>Send contact request</button>
        </form>

        {#if pendingContactRequests.length > 0}
            <h2>Pending incoming contact requests:</h2>

            {#each pendingContactRequests as request}
                <ul>{JSON.stringify(request,null,2)}<button on:click={() => acceptRequest(request)}>Accept</button><button on:click={() => denyRequest(request)}>Deny</button></ul>
            {/each}
        {/if}

    {:else}
        <h2>Hello2 {myAddress}</h2>
    {/if}
{:else}
    <form on:submit>
        <input bind:value={$newName} placeholder="NewName" on:submit={onSubmitNewName}/>
        <button on:click={onSubmitNewName}>Register</button>
    </form>
{/if}
</main>