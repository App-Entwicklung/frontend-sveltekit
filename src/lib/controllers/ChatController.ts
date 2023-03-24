import EthersProvider from '$lib/contracts/ethersProvider';
import { writable } from 'svelte/store';

const baseState = {
	contactName: 'loading...',
	contactAddress: 'loading...',
	messages: []
};

class ChatController {
	#chatStore = writable({ ...baseState });
	store: any;
    ethersProvider: EthersProvider | undefined;

	constructor() {
		this.store = {
			subscribee: this.#chatStore.subscribe
		};
	}

	async init() {
		this.ethersProvider = new EthersProvider();
	}


}
export default new ChatController();
