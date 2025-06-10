import { useState } from "react";
import { Link } from 'react-router';
import logo3 from '../../assets/logo3.jpg';
import './Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <nav>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        <img src={logo3} alt="Logo" />
                    </Link>
                        <ul className='d-flex nav-list gap-3'>
                                <li>
                                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                                </li>
                            {isLoggedIn && (
                                <>
                                    <li>
                                        <Link to="/deposit" onClick={() => setMenuOpen(false)}>Deposit</Link>
                                    </li>
                                    <li>
                                        <Link to="/withdraw" onClick={() => setMenuOpen(false)}>Withdraw</Link>
                                    </li>
                                    <li>
                                        <Link to="/alldata" onClick={() => setMenuOpen(false)}>All data</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        {isLoggedIn ? (
                            <button className='btn btn-secondary mt-2 mt-md-0' onClick={() => setIsLoggedIn(false)}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-secondary mt-2 mt-md-0" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                        )}
                </div>
            </nav>
        </header>
    );
};

export default Header;