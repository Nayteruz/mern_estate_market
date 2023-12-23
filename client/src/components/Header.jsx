import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"

const Header = () => {

	return (
		<header className="bg-slate-200 shadow-md">
			<div className="flex justify-between items-center max-w-6xl mx-auto p-3">
				<div className="font-bold text-sm sm:text-xl flex flex-wrap">
					<span className="text-slate-500">Nuar</span>
					<span className="text-slate-700">Estate</span>
				</div>
				<form className="bg-slate-100 p-3 rounded-lg flex items-center">
					<input
						type="text"
						placeholder="Поиск"
						className="bg-transparent focus:outline-none w-24 sm:w-64"/>
					<FaSearch className="text-slate-600" />
				</form>
				<ul className="flex gap-4">
					<li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
						<Link to="/">Home</Link>
					</li>
					<li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
						<Link to="/about">About</Link>
					</li>
					<li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
						<Link to="/sign-in">Sign In</Link>
					</li>
				</ul>
			</div>
		</header>
	)
}

export default Header;