import React, { Component, useContext, useReducer, useState } from 'react'
import logo from '../assets/images/logo.png'
import "../assets/styles/Header.css"
import { Link } from 'react-router-dom'
import { PATH, ROOT } from '../constants/config';
import { UserContext } from '../App';
import Flags from 'country-flag-icons/react/3x2'
import { DEFAULT_LANGUAGE, Languages } from '../constants/languages';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import Switch from "react-switch";
import info from '../assets/images/info-logo.png'
import { Tooltip } from 'react-tooltip';
import { T_HEADER } from '../constants/translations';


export default function Header(props){

  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  const { t, i18n } = useTranslation();

  const languageOptions = [];
  let defaultLanguage;

  for (const key in Languages) {
    const option = {
      value: key,
      label: Languages[key].nativeName,
      Flag: Flags[Languages[key].flag]
    };
    languageOptions.push(option);

    if (key === i18n.language) {
      defaultLanguage = option
    }
    else if (defaultLanguage === undefined && key === DEFAULT_LANGUAGE) {
      defaultLanguage = option;
    }
  }

  const formatOptionLabel = ({ value, label, Flag }) => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Flag style={{width: "42px"}}></Flag>
      <div style={{ marginLeft: "15px" }}>{label}</div>
    </div>
  );

  const [isContributor, setIsContributor] = useState(sessionStorage.getItem("isContributor") === 'true' ? true : false);

  function handleContributorChange(checked) {
    sessionStorage.setItem("isContributor", checked);
    setIsContributor(checked);
    props.forceUpdate();
  }

  return (
    <div className="header">
      <div className="header-container">
        <Link to={PATH.ROOT}>
          <img className="logo" src={logo}  alt="Company Name"></img>
        </Link>
        <Select
          defaultValue={defaultLanguage}
          formatOptionLabel={formatOptionLabel}
          options={languageOptions}
          onChange={e => i18n.changeLanguage(e.value)}
        />
        <Switch className="header-switch" onChange={handleContributorChange} checked={isContributor} uncheckedIcon={false}></Switch>
        <p className={"header-contributor-mode" + (isContributor ? "" : " disabled")}>
          {t(T_HEADER.contributorMode)}
        </p>
        <img 
          className='header-info' src={info} alt="Info" 
          data-tooltip-id="info-tooltip" 
          data-tooltip-content={t(T_HEADER.infoText)}
        />
        <div className="header-links">
          <Link to={PATH.PRODUCTS_PAGE} className='header-link-wrapper'>
            <button className="header-link">
              {t(T_HEADER.products)}
            </button>
          </Link>
          <Link to={PATH.REWARDS_PAGE} className='header-link-wrapper'>
            <button className="header-link">
              {t(T_HEADER.rewards)}
            </button>
          </Link>
          {(() => {
            if (!isLoggedIn) {
              return (
                <>
                  <Link to={PATH.SIGNUP_PAGE}>
                    <button className="signup-btn">
                      {t(T_HEADER.signup)}
                    </button>
                  </Link>
                  <Link to={PATH.LOGIN_PAGE}>
                    <button className="login-btn">
                      {t(T_HEADER.login)}
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
      <Tooltip style={{zIndex: '100'}}
        id="info-tooltip"
      />
    </div>
  );
}
