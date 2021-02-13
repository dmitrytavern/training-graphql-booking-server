import './Header.sass'
import classes from "./classes"
import clsx from "clsx"
import { useAuth } from "../../../../contexts/auth.context"

import { ReactComponent as IconBook } from '../../../../assets/icons/book.svg'
import { ReactComponent as IconEye } from '../../../../assets/icons/eye.svg'

const AuthorHeader = () => {
	const { user } = useAuth()

	return (
		<div className={classes.root}>
			<div className={classes.wrapper}>
				<div className={classes.avatar}>

				</div>


				<div className={classes.name}>{user.name}</div>


				<div className={classes.infoBar}>
					<div className={clsx([classes.info, classes.infoBooks])}>
						<IconBook/>
						<span>16 Books</span>
					</div>

					<div className={clsx([classes.info, classes.infoFollowing])}>
						<IconEye/>
						<span>243 Following</span>
					</div>

					<div className={clsx([classes.info, classes.infoFollowers])}>
						<IconEye/>
						<span>12 Followers</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthorHeader
