import { Message } from '../../types'
import styles from './styles.module.css'

interface MessageListProps {
	messages: Message[]
}
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
	return (
		<div className={styles.chatMessage}>
			{messages.map(msg => (
				<div
					key={msg.id}
					className={`${styles.message} ${
						msg.sender === 'user' ? styles.userMessage : styles.recipientMessage
					}`}>
					<p className={styles.text}>
						{msg.sender === 'recipient' && <strong>{msg.phoneNumber}</strong>}
						{msg.text}
					</p>
				</div>
			))}
		</div>
	)
}

export default MessageList
