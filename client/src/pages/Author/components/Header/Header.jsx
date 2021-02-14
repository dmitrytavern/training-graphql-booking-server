import './Header.sass'
import classes from "./classes"
import { useAuth } from "../../../../contexts/auth.context"

const AuthorHeader = () => {
	const { user } = useAuth()

	return (
		<div className={classes.root}>
			<div className={classes.wrapper}>
				<div className={classes.name}>{user.name}</div>
			</div>
		</div>
	)
}

export default AuthorHeader
