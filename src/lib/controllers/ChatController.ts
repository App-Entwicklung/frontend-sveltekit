import EthersProvider from '$lib/contracts/ethersProvider';
import { get, writable } from 'svelte/store';

const baseState = {
	contactName: 'loading...',
	contactAddress: 'loading...',
	messages: [{}]
};

class ChatController {
	#chatStore = writable({ ...baseState });
	store: any;
	ethersProvider!: EthersProvider;

	constructor() {
		this.store = {
			subscribe: this.#chatStore.subscribe
		};
	}

	async init(contact: string) {
		this.ethersProvider = new EthersProvider();
		await this.ethersProvider.getReady();

		// expecting string "contactAddress:contactName"
		const [contactAddress, contactName] = contact.split(':', 2);
		this.#chatStore.update((s) => ({ ...s, contactAddress, contactName }));

		await this.#loadMessages();
	}

	async #loadMessages() {
		const contactAddress = get(this.#chatStore).contactAddress
		const messages = await this.ethersProvider.chatContract.getMessages(contactAddress);
		this.#chatStore.update((s) => ({ ...s, messages }));
	}
}
export default new ChatController();
