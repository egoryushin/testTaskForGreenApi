import axios from 'axios'
import { useState } from 'react'
import { GreenApiCredentials } from '../../types'
import { useGreenApi } from '../../utils/hooks/useGreenApi'
import LoginForm from '../LoginForm/LoginForm'
import MessageInput from '../MessageInput/MessageInput'
import MessageList from '../MessageList/MessageList'
import MyInput from '../MyInput/MyInput'
import Notifications from '../Notifications/Notifications'
import styles from './styles.module.css'

const Chat: React.FC = () => {
	const [credentials, setCredentials] = useState<GreenApiCredentials>({
		idInstance: '',
		apiTokenInstance: '',
	})
	const [phoneNumber, setPhoneNumber] = useState('')
	const [isLoggedIn, setLoggedIn] = useState(false) // для проверки авторизации
	const { messages, notification, sendMessage, receiveMessage } =
		useGreenApi(credentials)

	// проверка на новые сообщения.
	// useEffect(() => {
	// 	if (isLoggedIn) {
	// 		const intervalMsg = setInterval(() => {
	// 			receiveMessage()
	// 		}, 10000) // проверка на новые сообщения каждые 10 сек
	// 		return () => {
	// 			clearInterval(intervalMsg)
	// 		}
	// 	}
	// }, [isLoggedIn, receiveMessage])

	const handleSendMessage = (message: string) => {
		sendMessage(phoneNumber, message)
	}

	const handleLogin = async () => {
		try {
			if (!credentials.idInstance || !credentials.apiTokenInstance) {
				alert('Заполните все поля')
				return
			}
			const response = await axios.get(
				`https://1103.api.green-api.com/waInstance${credentials.idInstance}/getStateInstance/${credentials.apiTokenInstance}`
			)

			if (response.data.stateInstance === 'authorized') {
				setLoggedIn(true)
			} else {
				alert('Неверные учетные данные')
			}
		} catch (error) {
			console.error('Ошибка входа	', error)
			alert('Ошибка при проверке данных. Попробуйте снова')
		}
	}

	return (
		<div className={styles.container}>
			<Notifications notification={notification} />
			{!isLoggedIn ? (
				// показываем форму взода, если не авторизован
				<div>
					<LoginForm
						credentials={credentials}
						setCredentials={setCredentials}
					/>
					<button className={styles.loginButton} onClick={handleLogin}>
						Войти
					</button>
				</div>
			) : (
				// показываем чат, если авторизован
				<div>
					<div className={styles.chatBody}>
						<MyInput
							type='text'
							placeholder='Recipient Phone Number'
							value={phoneNumber}
							onChange={e => setPhoneNumber(e.target.value)}
						/>
						<div className={styles.chatMessage}>
							<MessageList messages={messages} />
						</div>
						<div className={styles.messageInputContainer}>
							<MessageInput onSend={handleSendMessage} />
							<button className={styles.checkButton} onClick={receiveMessage}>
								Проверить новые сообщения
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Chat
