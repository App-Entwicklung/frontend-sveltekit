import { writable } from 'svelte/store';

const config = {
	GOERLI_TESTNET: 5,
	POLYGON: 137
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
				s.isConnected = ethereum.networkVersion == config.POLYGON;
				s.isWrongNetwork = !(ethereum.networkVersion == config.POLYGON);
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
		const isConnected = chainId == config.POLYGON;
		const isWrongNetwork = !isConnected;
		this.#appStore.update((s) => ({ ...s, isConnected, isWrongNetwork }));
	}
}

export default new MetamaskController();
