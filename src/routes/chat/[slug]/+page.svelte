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

    // $: ({ myName,myAddress,myBalance,myContacts, message} = $userStore); // Maybe needed

    // ChatController stuff
    import ChatController from "$lib/controllers/ChatController";

    const chatStore = ChatController.store;

    onMount(async()=> {
        await ChatController.init(data.slug)
    })
    
</script>

<JsonViewer data={$userStore}/>
<JsonViewer data={$chatStore}/>


<h1>Chatting with {data.slug}</h1>


