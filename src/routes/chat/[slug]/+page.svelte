<script lang="ts">
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
    })

    $: ({ myName,myAddress,myBalance,myContacts, message} = $userStore); // Maybe needed

    // ChatController stuff
    import ChatController from "$lib/controllers/ChatController";
	import Message from "$lib/components/Message.svelte";

    const chatStore = ChatController.store;

    onMount(async()=> {
        await ChatController.init(data.slug)
    })

    // $: ({messages} = $chatStore)
    type messageT = {sender:string,timestamp:string,text: string}
    const messages: messageT[] = []
    for (let index = 0; index < 10; index++) {
        messages.push({sender: (index%2).toString(), timestamp: index.toString(),text: `Message ${index}`})
    }

    const [_, contactName] = data.slug.split(":",2)

    function mapSender(sender: string): string{
        return sender == "1" ? myName : contactName
        // return sender == myAddress ? myName : contactName
    }
    
</script>

<JsonViewer data={$userStore}/>
<JsonViewer data={$chatStore}/>


<h1>Chatting with {contactName}</h1>

{#each messages as chatMessage}
    <Message sender={mapSender(chatMessage.sender)} timestamp={chatMessage.timestamp} text={chatMessage.text} myAddress={myAddress}/>
{/each}

<div class="input">
    <input placeholder="Type your Message..."/><button>Send</button>
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