import React, { useContext } from 'react';
import Home from '../component/Home';
import { AppContext } from '../state/AppContext';

const HomeContainer = ({ history }) => {

    const { auth, login, logout } = useContext(AppContext);

    return (
        <Home>
            {
                (auth?.isAuthenticated) ?
                    (
                        <div>
                            <div className="Buttons">
                                <button onClick={() => history.push('/profile')}>Profile</button>
                            </div>
                            <div className="Buttons">
                                <button onClick={logout}>Logout</button>
                                {/* Replace me with your root component. */}
                            </div>
                        </div>
                    ) : (
                        <div className="Buttons">
                            <button onClick={login}>Login</button>
                        </div>
                    )
            }
        </Home>)
}

export default HomeContainer;