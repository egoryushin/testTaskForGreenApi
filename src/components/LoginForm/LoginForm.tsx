import { GreenApiCredentials } from '../../types'
import MyInput from '../MyInput/MyInput'
import styles from './styles.module.css'

interface MyLoginFormProps {
	credentials: GreenApiCredentials
	setCredentials: (credentials: GreenApiCredentials) => void
}

const LoginForm: React.FC<MyLoginFormProps> = ({
	credentials,
	setCredentials,
}) => {
	return (
		<div className={styles.loginForm}>
			<h2>Вход</h2>
			<MyInput
				type='text'
				placeholder='ID Instance'
				value={credentials.idInstance}
				onChange={e =>
					setCredentials({ ...credentials, idInstance: e.target.value })
				}
			/>
			<MyInput
				type='password'
				placeholder='API Token Instance'
				value={credentials.apiTokenInstance}
				onChange={e =>
					setCredentials({ ...credentials, apiTokenInstance: e.target.value })
				}
			/>
		</div>
	)
}

export default LoginForm
