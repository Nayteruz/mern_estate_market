import {Link} from "react-router-dom";

const NotFound = () => {

	return (
		<div>
			<h1>Страница не найдена</h1>
			<p>Вернуться на главную страницу <Link to="/">страницу</Link></p>
		</div>
	)
}

export default NotFound;