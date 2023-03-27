<script lang="ts">
	import JsonViewer from "$lib/components/JsonViewer.svelte";
    import UserController from "$lib/controllers/UserController";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    const {store, newName, contactAddress} = UserController;
    let existingAccount = writable(true);

    async function onSubmitNewName() {
        await UserController.register();
    }

    async function onSubmitContactRequest(){
        await UserController.sendContactRequest();
    }

    onMount(async()=> {
        const t = await UserController.init();
        existingAccount.set(t == false ? false : true);
    })

    $: ({ myName,myAddress,myBalance,myContacts, pendingContactRequests, message} = $store);


	async function acceptRequest(request: string) {
        await UserController.acceptContactRequest(request);
	}


	async function denyRequest(request: string) {
		await UserController.denyContactRequest(request)
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
                <ul>
                    <div>
                        {request[0]} ({request[1]})
                        <button class="accept" on:click={() => acceptRequest(request[1])}>Accept</button>
                        <button class="deny" on:click={() => denyRequest(request[1])}>Deny</button>
                    </div>
                </ul>
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

<style>
    .accept {
        background-color: #2ecc72;
    }
    .deny {
        background-color: #cc402e;
    }
</style>