import { writable } from 'svelte/store';

const config = {
	GOERLI_TESTNET: 5
};
const MESSAGES = {
	NOT_INSTALLED: 'Metamask not installed.',
	LOADING: 'Loading...',
	LOADED: 'Loaded.',
	ERROR: 'Error.'
};

const baseState = {
	isMetamaskInstalled: false,
	isWrongNetwork: true,
	isLocked: false,
	isConnected: false,
	message: MESSAGES.LOADING
};

class MetamaskController {
	#appStore = writable({ ...baseState });
	store: any;

	constructor() {
		this.store = {
			subscribe: this.#appStore.subscribe
		};
	}

	async init() {
		const { ethereum } = window;
		const hasMetamask = Boolean(ethereum && ethereum.isMetamask);

		if (!hasMetamask) return this.#appStore.set({ ...baseState, message: MESSAGES.NOT_INSTALLED });

		try {
			await ethereum.request({ method: 'eth_requestAccounts' });
		} catch (error) {
			console.log(error);
		}
	}
}

export default new MetamaskController();
