<script lang="ts">
    import Icon from "@iconify/svelte";
    // data form load() in +page.ts
    export let data: any;

	import JsonViewer from "$lib/components/JsonViewer.svelte";
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

    async function refreshChat(){
        await ChatController.refreshMessages()
    }
    
</script>

<!-- <JsonViewer data={$userStore}/> -->
<!-- <JsonViewer data={$chatStore}/> -->

<button class="refresh" on:click={refreshChat}><Icon icon="uiw:reload"/> Refresh Chat</button>

<h1>Chatting with {contactName}</h1>
{#if messages && Object.keys(messages[0]).length != 0}
{#each messages as chatMessage}
<Message sender={mapSender(chatMessage.sender)} timestamp={chatMessage.timestamp} text={chatMessage.text}/>
{/each}
{/if}

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

    .refresh {
        position: fixed;
        top: 2vh;
        right: 1vw;
    }

</style>