import { useState } from 'react'
import MyInput from '../MyInput/MyInput'
import styles from './styles.module.css'

interface MessageInputProps {
	onSend: (message: string) => void
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
	const [message, setMessage] = useState('')

	const handleSend = () => {
		if (message.trim()) {
			onSend(message)
			setMessage('')
		}
	}

	return (
		<div className={styles.messageContainer}>
			<MyInput
				className={styles.messageInput}
				type='text'
				placeholder='Введите сообщение'
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyUp={e => e.key === 'Enter' && handleSend()}
			/>
			<button className={styles.sendButton} onClick={handleSend}>
				Отправить
			</button>
		</div>
	)
}

export default MessageInput
