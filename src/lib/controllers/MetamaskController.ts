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
	isWrongNetwork: false,
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
		const hasMetamask = Boolean(ethereum && ethereum.isMetaMask);

		if (!hasMetamask) return this.#appStore.set({ ...baseState, message: MESSAGES.NOT_INSTALLED });

		try {
			await ethereum.request({ method: 'eth_requestAccounts' });

			this.#appStore.update((s) => {
				s.isMetamaskInstalled = hasMetamask;
				s.isConnected = ethereum.networkVersion == config.GOERLI_TESTNET;
				s.isWrongNetwork = !(ethereum.networkVersion == config.GOERLI_TESTNET);
				s.message = MESSAGES.LOADED;
				s.isLocked = false;
				return s;
			});
		} catch (error: any) {
			const message = error?.message || MESSAGES.ERROR;
			this.#appStore.set({ ...baseState, message, isLocked: true });
		}
	}

	networkChanged(chainId: any) {
		const isConnected = chainId == config.GOERLI_TESTNET;
		const isWrongNetwork = !isConnected;
		this.#appStore.update((s) => ({ ...s, isConnected, isWrongNetwork }));
	}
}

export default new MetamaskController();
