import {Link} from "react-router-dom";

const SignUp = () => {

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7 ">Регистрация</h1>
			<form className="flex flex-col gap-4">
				<input type="text" placeholder="Имя пользователя"
				className="border p-3 rounded-lg outline-none" id="username"
				/>
				<input type="email" placeholder="Email"
				className="border p-3 rounded-lg outline-none" id="email"
				/>
				<input type="password" placeholder="Пароль"
				className="border p-3 rounded-lg outline-none" id="password"
				/>
				<button type="submit" className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">Зарегистрироваться</button>
			</form>
			<div className="flex gap-2 mt-5">
				<p>Уже зарегистрованы?</p>
				<Link to={'/sign-in'} >
					<span className="text-blue-700">Авторизоваться</span>
				</Link>
			</div>
		</div>
	)
}

export default SignUp;