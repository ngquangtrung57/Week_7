import {Link} from "react-router-dom";

function Header(){
    return (
        <header className="bg-roast-400 py-4 text-center">
            <h1 className="m-0 font-display text-4xl text-roast-900 sm:text-5xl">
                <Link to="/" className="no-underline">JavaJam Coffee House</Link>
            </h1>
        </header>
    );
}

export default Header;
