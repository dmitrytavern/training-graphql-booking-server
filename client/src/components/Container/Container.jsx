import './Container.sass'
import clsx from "clsx"

const Container = (props) => {
	const { children, fluid } = props

	const rootClassName = clsx({
		'container': !fluid,
		'container-fluid': fluid
	})

	return (
		<div className={rootClassName}>
			{children}
		</div>
	)
}

Container.defaultProps = {
	fluid: false
}

export default Container
