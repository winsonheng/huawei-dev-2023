import './assets/styles/App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { getCsrfToken } from './util/RestUtil';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { PATH } from './constants/config';
import Cookies from 'universal-cookie';
import { createContext, useEffect, useReducer, useState } from 'react';
import VerifiedPage from './components/VerifiedPage';
import UserSetupPage from './components/UserSetupPage';
import RewardsPage from './components/RewardsPage';
import ProductsPage from './components/ProductsPage';
import ProductDetails from './components/ProductDetails';
import { ToastContainer } from 'react-toastify';

export const UserContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

function App() {

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const location = useLocation();

  useEffect(() => {
    const cookies = new Cookies();
    const csrftoken = cookies.get('csrftoken');
    if (typeof(csrftoken) === 'undefined' || csrftoken === null) {
      getCsrfToken();
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);
  
  function setToken(token) {
    sessionStorage.setItem('token', token);
  }

  function handleLogin(user) {
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('lastLogin', user.lastLogin);
    setIsLoggedIn((prev) => {
      return true;
    })
  }

  return (
    <div className={"App" + (location.pathname === '/' ? ' landing' : '')}>
      <ToastContainer theme='colored' />
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <Header forceUpdate={forceUpdate}></Header>
      </UserContext.Provider>
      <Routes>
        <Route path={PATH.ROOT} >
          <Route index element={<LandingPage />}></Route>
          <Route path={PATH.LANDING_PAGE} element={<LandingPage/>}></Route>
          <Route path={PATH.LOGIN_PAGE} element={<LoginPage handleLogin={handleLogin} setToken={setToken}/>}></Route>
          <Route path={PATH.SIGNUP_PAGE} element={<SignupPage />}></Route>
          <Route path={PATH.VERIFIED_PAGE} element={<VerifiedPage />}></Route>
          <Route path={PATH.USER_SETUP_PAGE} element={<UserSetupPage handleLogin={handleLogin}/>} exact={true}></Route>
          <Route path={PATH.REWARDS_PAGE} element={<RewardsPage />}></Route>
          <Route path={PATH.PRODUCTS_PAGE} element={<ProductsPage />}></Route>
          <Route path={PATH.PRODUCT_DETAILS} element={<ProductDetails />}></Route>
        </Route>
    </Routes>
    </div>
  );
}

export default App;
