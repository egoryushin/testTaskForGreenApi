import axios from 'axios'
import { useState } from 'react'
import { Message, Notification } from '../../types'

export const useGreenApi = (credentials: {
	idInstance: string
	apiTokenInstance: string
}) => {
	const [messages, setMessage] = useState<Message[]>([])
	const [notification, setNotification] = useState<Notification[]>([])

	const addNotification = (
		message: string,
		type: 'info' | 'success' | 'error'
	) => {
		const newNotification: Notification = {
			id: Date.now().toString(),
			message,
			type,
		}
		setNotification(prev => [...prev, newNotification])

		// автоматическое удаление уведомления через 5 сек
		setTimeout(() => {
			setNotification(prev => prev.filter(n => n.id !== newNotification.id))
		}, 5000)
	}

	const sendMessage = async (phoneNumber: string, message: string) => {
		if (!credentials.idInstance || !credentials.apiTokenInstance) {
			addNotification('Войдите в систему', 'error')
			return
		}
		try {
			const response = await axios.post(
				`https://1103.api.green-api.com/waInstance${credentials.idInstance}/sendMessage/${credentials.apiTokenInstance}`,
				{
					chatId: `${phoneNumber}@c.us`,
					message,
				}
			)
			console.log('Отчет об отпрвке сообщения:', response)

			setMessage(prev => [
				...prev,
				{
					id: Date.now().toString(),
					text: message,
					sender: 'user',
					phoneNumber,
				},
			])
			addNotification('Сообщение отправлено', 'success')
		} catch (error) {
			console.error('Ошибка в отправке сообщения: ', error)
			addNotification('Ошибка в отправке сообщения: ', 'error')
		}
	}

	// incomingMessageReceived ?
	const receiveMessage = async () => {
		if (!credentials.idInstance || !credentials.apiTokenInstance) {
			addNotification('Войдите в систему', 'error')
			return
		}

		try {
			const response = await axios.get(
				`https://1103.api.green-api.com/waInstance${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}?receiveTimeout=5`
			)
			console.log('Response receiveMessage:', response.data.body)
			if (response.data && response.data.receiptId) {
				const notification = response.data
				const receiptId = response.data.receiptId

				// проверка уведомления на содержание сообщения
				if (
					notification.body &&
					notification.body.typeWebhook === 'incomingMessageReceived' &&
					notification.body.messageData &&
					notification.body.messageData.typeMessage === 'textMessage'
				) {
					const messageText =
						notification.body.messageData.textMessageData.textMessage
					const senderPhone = notification.body.senderData.sender.replace(
						'@c.us',
						''
					)

					// Добавляем в список сообщений
					setMessage(prev => [
						...prev,
						{
							id: Date.now().toString(),
							text: messageText,
							sender: 'recipient',
							phoneNumber: senderPhone,
						},
					])

					console.log('Добавлено сообщение:', {
						id: Date.now().toString(),
						text: messageText,
						sender: 'recipient',
						phoneNumber: senderPhone,
					})

					addNotification(
						`Новое сообщение от ${senderPhone}: ${messageText}`,
						'info'
					)
				} else {
					console.log('Не текстовое сообщение или другое уведомление')
				}
				if (typeof receiptId === 'number') {
					await axios.delete(
						`https://1103.api.green-api.com/waInstance${credentials.idInstance}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`
					)
				} else {
					console.error('receiptId не является числом', receiptId)
					addNotification(
						'Ошибка в удалении уведомления: receiptId не является числом',
						'error'
					)
				}
			} else {
				console.log('Нет уведомлений')
			}
		} catch (error) {
			console.error('Ошибка в получении сообщения: ', error)
			addNotification('Ошибка в получении сообщения: ', 'error')
		}
	}
	// старый способ
	// const receiveMessage = async () => {
	// 	try {
	// 		const response = await axios.get(
	// 			`https://1103.api.green-api.com/waInstance${credentials.idInstance}/ReceiveMessage/${credentials.apiTokenInstance}`
	// 		)
	// 		if (response.data.body && response.data.body.messageData) {
	// 			const message =
	// 				response.data.body.messageData.textMessageData.textMessage

	// 			setMessage(prev => [
	// 				...prev,
	// 				{ id: Date.now().toString(), text: message, sender: 'recipient' },
	// 			])
	// 		}
	// 		console.log('Response receiveMessage:', response.data.body)
	// 	} catch (error) {
	// 		console.error('Ошибка в получении сообщения: ', error)
	// 	}
	// }

	return { messages, notification, sendMessage, receiveMessage }
}
