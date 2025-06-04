import { Link } from 'react-router'; ;
import logo1 from '../../assets/logo1.webp';
import './Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    return (
            <header>
                <nav>
                    <div className="container d-flex justify-content-between align-items-center">
                        <img src="{<logo1/>}" alt="" />
                        <ul className='d-flex nav-list gap-3'>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                {isLoggedIn && (
                                    <>
                                        <li>
                                            <Link to="/deposit">Deposit</Link>
                                        </li>
                                        <li>
                                            <Link to="/withdraw">Withdraw</Link>
                                        </li>
                                        <li>
                                            <Link to="/alldata">All data</Link>
                                        </li>
                                    </>
                                )}
                        </ul>

                        {isLoggedIn ? (
                            <button className='btn btn-secondary' onClick={() => setIsLoggedIn(false)}>
                                Logout
                            </button>
                        ) : (
                            <button className='btn btn-secondary'>
                                <Link to="/login" className="no-underline">Login</Link>
                            </button>
                        )}

                    </div>
                </nav>
            </header>
    );
};

export default Header;