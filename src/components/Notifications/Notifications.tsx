import React from 'react'
import { Notification } from '../../types'
import styles from './styles.module.css'

interface NotificationProps {
	notification: Notification[]
}

const Notifications: React.FC<NotificationProps> = ({ notification }) => {
	return (
		<div className={styles.notificationContainer}>
			{notification.map(note => (
				<div
					key={note.id}
					className={`${styles.notification} ${styles[note.type]}`}>
					{note.message}
				</div>
			))}
		</div>
	)
}

export default Notifications
