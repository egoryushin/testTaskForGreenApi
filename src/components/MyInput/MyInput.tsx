import React from 'react'
import styles from './styles.module.css'

interface MyInputProps {
	type: string
	placeholder: string
	value: string | number
	className?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const MyInput: React.FC<MyInputProps> = ({
	type,
	placeholder,
	value,
	onChange,
	onKeyUp,
}) => {
	return (
		<input
			className={styles.myInput}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onKeyUp={onKeyUp}
		/>
	)
}

export default MyInput
