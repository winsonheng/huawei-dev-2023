import React, { Component, useContext } from 'react'
import logo from '../assets/images/logo.png'
import "../assets/styles/Header.css"
import { Link } from 'react-router-dom'
import { PATH, ROOT } from '../constants/config';
import { UserContext } from '../App';


export default function Header(props){

  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  return (
    <div className="header">
      <div className="header-container">
        <Link to={PATH.ROOT}>
          <img className="logo" src={logo}  alt="Missing image"></img>
        </Link>
        <div className="header-links">
          <Link to={PATH.PRODUCTS_PAGE} className='header-link-wrapper'>
            <button className="header-link">
              Products
            </button>
          </Link>
          <Link to={PATH.REWARDS_PAGE} className='header-link-wrapper'>
            <button className="header-link">
              Rewards
            </button>
          </Link>
          {(() => {
            if (!isLoggedIn) {
              return (
                <>
                  <Link to={PATH.SIGNUP_PAGE}>
                    <button className="signup-btn">
                      Sign Up
                    </button>
                  </Link>
                  <Link to={PATH.LOGIN_PAGE}>
                    <button className="login-btn">
                      Login
                    </button>
                  </Link>
                </>
              );
            }
          })()}
        </div>
        {(() => {
          if (isLoggedIn) {
            return (
              <div className='header-account-wrapper'>
                <div className='header-account-image'>

                </div>
                <div className='header-account-username'>
                  {sessionStorage.getItem('username') ?? 'Username not set'}
                </div>
              </div>  
            );
          }
        })()}
      </div>
    </div>
  );
}
