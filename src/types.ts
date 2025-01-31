export interface Message {
	id: string
	text: string
	sender: 'user' | 'recipient'
	phoneNumber?: string
}

export interface Notification {
	id: string
	message: string
	type: 'info' | 'success' | 'error'
}

export interface ChatList {
	id: string
	name: string
	phoneNumbers: string
	messages: Message[]
}

export interface GreenApiCredentials {
	idInstance: string
	apiTokenInstance: string
}
