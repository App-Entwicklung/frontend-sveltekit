import EthersProvider from '$lib/contracts/ethersProvider';
import { get, writable, type Writable } from 'svelte/store';

const baseState = {
	contactName: 'loading...',
	contactAddress: 'loading...',
	messages: [{}]
};

class ChatController {
	#chatStore = writable({ ...baseState });
	store: any;
	ethersProvider!: EthersProvider;
	sendText: Writable<string>;

	constructor() {
		this.store = {
			subscribe: this.#chatStore.subscribe
		};
		this.sendText = writable('');
	}

	async init(contact: string) {
		this.ethersProvider = new EthersProvider();
		await this.ethersProvider.getReady();

		// expecting string "contactAddress:contactName"
		const [contactAddress, contactName] = contact.split(':', 2);
		this.#chatStore.update((s) => ({ ...s, contactAddress, contactName }));

		await this.refreshMessages();
	}

	async #loadMessages() {
		const contactAddress = get(this.#chatStore).contactAddress;
		let messages = await this.ethersProvider.chatContract.getMessages(contactAddress);
		if (messages.length)
			messages = messages.map((message: any) => ({
				sender: message[0],
				timestamp: this.#parseTimeStamp(message[1]),
				text: message[2]
			}));
		return messages;
	}

	async refreshMessages() {
		const { messages } = get(this.#chatStore);
		const messagesOnChain = await this.#loadMessages();
		if (messages != messagesOnChain) {
			this.#chatStore.update((s) => ({ ...s, messages: messagesOnChain }));
		}
	}

	#parseTimeStamp(timestamp: string) {
		return new Date(
			// timestamp in seconds from 1970-01-01T00:00:0000Z in UTC
			// make timestamp to milliseconds
			parseInt(timestamp) * 1000 -
				// and substract timezone-offset of clients timezone
				// calculate from minute to milliseconds first
				new Date().getTimezoneOffset() * 6000
				// use british time system bc american sucks
		).toLocaleString("en-GB");
	}

	async sendMessage() {
		try {
			const sendText = get(this.sendText);
			const contactAddress = get(this.#chatStore).contactAddress;
			const tx = await this.ethersProvider.chatContract.sendMessage(contactAddress, sendText);
			console.log(tx);
			const response = await tx.wait();
			console.log(response);
			this.sendText.set('');
		} catch (error: any) {
			console.log(error.message);
		}
	}
}
export default new ChatController();
