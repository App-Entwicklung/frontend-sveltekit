<script lang="ts">
    // data form load() in +page.ts
    export let data: any;

	// import JsonViewer from "$lib/components/JsonViewer.svelte";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    // UserController stuff
    import UserController from "$lib/controllers/UserController";
	import { redirect } from "@sveltejs/kit";

    const userStore = UserController.store;

    let existingAccount = writable(true);

    onMount(async()=> {
        const t = await UserController.init();
        if(t == false){
            throw redirect(307, "/")
        }
        existingAccount.set(t == false ? false : true);
        await ChatController.init(data.slug)
    })

    $: ({ myName,myAddress} = $userStore);

    // ChatController stuff
    import ChatController from "$lib/controllers/ChatController";
	import Message from "$lib/components/Message.svelte";

    const {sendText} = ChatController;
    const chatStore = ChatController.store;

    $: ({contactName, messages} = $chatStore)

    function mapSender(sender: string): string{
        return sender == myAddress ? myName : contactName
    }

    async function sendMessage(){
        await ChatController.sendMessage();
    }
    
</script>

<!-- <JsonViewer data={$userStore}/>
<JsonViewer data={$chatStore}/> -->


<h1>Chatting with {contactName}</h1>

{#each messages as chatMessage}
    <Message sender={mapSender(chatMessage.sender)} timestamp={chatMessage.timestamp} text={chatMessage.text}/>
{/each}

<div class="input">
    <input bind:value={$sendText} placeholder="Type your Message..."/><button on:click={sendMessage}>Send</button>
</div>

<style>
    .input {
        display: flex;
        justify-content: space-between;
    }
    input {
        margin-right: 1%;
        width: 90%;
    }


</style>