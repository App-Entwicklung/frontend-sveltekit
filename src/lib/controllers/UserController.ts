import EthersProvider from '$lib/contracts/ethersProvider';
import { ethers } from 'ethers';
import { get, writable, type Writable } from 'svelte/store';

const baseState = {
	myName: 'loading...',
	myAddress: 'loading...',
	myBalance: '',
	myContacts: [{}],
	pendingContactRequests: [{}],
	message: ''
};

class UserController {
	#userStore = writable({ ...baseState });
	store: any;
	ethersProvider!: EthersProvider;
	newName: Writable<string>;
	contactAddress: Writable<string>;

	constructor() {
		this.store = {
			subscribe: this.#userStore.subscribe
		};
		this.newName = writable('');
		this.contactAddress = writable('');
	}

	async init() {
		this.ethersProvider = new EthersProvider();
		await this.ethersProvider.getReady();
		return this.#updateValues();
	}

	async #updateValues() {
		await this.#getWalletInformation();
		if (!(await this.#getMyName())) return false;
		await this.#getContacts();
	}

	async register() {
		try {
			const name = get(this.newName);
			const tx = await this.ethersProvider.chatContract.createAccount(name);
			console.log(tx);
			const response = await tx.wait();
			console.log(response);
			this.newName.set('');
		} catch (error: any) {
			console.log(error.message);
		}
	}

	async sendContactRequest() {
		try {
			const contactAddress = get(this.contactAddress);
			const tx = await this.ethersProvider.chatContract.sendContactRequest(contactAddress);
			console.log(tx);
			const response = await tx.wait();
			console.log(response);
			this.contactAddress.set('');
		} catch (error: any) {
			console.log(error.message);
		}
	}

	async acceptContactRequest(request: string) {
		try {
			const tx = await this.ethersProvider.chatContract.acceptContactRequest(request);
			console.log(tx);
			const response = await tx.wait();
			console.log(response);
		} catch (error: any) {
			console.log(error.message);
		}
	}

	async denyContactRequest(request: string) {
		try {
			const tx = await this.ethersProvider.chatContract.denyContactRequest(request);
			console.log(tx);
			const response = await tx.wait();
			console.log(response);
		} catch (error: any) {
			console.log(error.message);
		}
	}

	async refreshContractRequests(){
		try{
			const {pendingContactRequests} = get(this.#userStore);
			const pendingContactRequestsOnChain = await this.ethersProvider.chatContract.getReceivedContactRequests()
			if(pendingContactRequests != pendingContactRequestsOnChain){
				this.#userStore.update((s) => ({...s, pendingContactRequests: pendingContactRequestsOnChain}))
			}
		}catch(error: any){
			console.log(error.message)
		}
	}

	async refreshContacts(){
		try {
			const {myContacts} = get(this.#userStore);
			const contactsOnChain = await this.ethersProvider.chatContract.getAllContacts()
			if(myContacts != contactsOnChain){
				this.#userStore.update((s) => ({...s, myContacts: contactsOnChain}))
			}
		} catch (error: any) {
			console.log(error.message)
		}
	}

	async #getMyName() {
		try {
			const name = await this.ethersProvider.chatContract.getName();
			this.#userStore.update((s) => ({ ...s, myName: name }));
			return true;
		} catch (error: any) {
			this.#userStore.update((s) => ({ ...s, message: error.message }));
			return false;
		}
	}

	async #getWalletInformation() {
		const myAddress = await this.ethersProvider.signer.getAddress();
		const amount = await this.ethersProvider.provider.getBalance(myAddress);
		const myBalance = ethers.formatEther(amount).toString();
		this.#userStore.update((s) => ({ ...s, myAddress, myBalance }));
	}

	async #getContacts() {
		try {
			const contacts = await this.ethersProvider.chatContract.getContacts();
			const requests = await this.ethersProvider.chatContract.getReceivedContactRequests();
			this.#userStore.update((s) => ({
				...s,
				myContacts: contacts,
				pendingContactRequests: requests
			}));
		} catch (error: any) {
			console.log(error.message);
		}
	}
}
export default new UserController();
