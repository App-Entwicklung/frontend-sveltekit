import { ethers } from 'ethers';
import config from './ChatApp.json';

class EthersProvider {
	provider: ethers.BrowserProvider;
	signer: any;
	ready = false;

	constructor() {
		// BrowserProvider replaces providers.Web3Provider
		this.provider = new ethers.BrowserProvider(window.ethereum, 'any');
		this.signer = this.provider.getSigner();
	}

	async getReady() {
		this.signer = await this.signer;
		this.ready = true;
	}

	getContract({ address, abi }: { address: string; abi: ethers.InterfaceAbi }) {
		// With signer as runner, it doesn't work anymore
		return new ethers.Contract(address, abi, this.signer);
	}

	get chatContract() {
		const contract = this.getContract({ address: config.address, abi: config.abi });
		return {
			createAccount: async (name: string) => await contract.createAccount(name),
			deleteAccount: async () => await contract.deleteAccount(),
			getName: async () => await contract.getName(),
			setName: async (name: string) => await contract.setName(name),
			getContacts: async () => await contract.getContacts(),
			setAccountPublicity: async (isPublic: boolean) =>
				await contract.setAccountPublicity(isPublic),
			sendContactRequest: async (receiverAddress: string) =>
				await contract.sendContactRequest(receiverAddress),
			retractContactRequest: async (receiverAddeess: string) =>
				await contract.retractContactRequest(receiverAddeess),
			acceptContactRequest: async (requestFrom: string) =>
				await contract.acceptContactRequest(requestFrom),
			denyContactRequest: async (requestFrom: string) =>
				await contract.denieContactRequest(requestFrom),
			getReceivedContactRequests: async () => await contract.getReceivedContactRequests(),
			getSendedContactRequests: async () => await contract.getSendedContactRequests(),
			getMessages: async (partnerAddress: string) => await contract.getMessages(partnerAddress),
			sendMessage: async (receiver: string, text: string) =>
				await contract.sendMessage(receiver, text),
			getAllContacts: async () => await contract.getAllContacts(),
			getAllPublicContacts: async () => await contract.getAllPublicContacts()
		};
	}
}

export default EthersProvider;
