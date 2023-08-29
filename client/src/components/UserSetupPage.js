import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_BASE_URL, PATH } from '../constants/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import { HttpMethod, StatusCode, postData } from '../util/RestUtil';
import { USERS_SET_USERNAME } from '../constants/endpoints';
export default function UserSetupPage(props) {

  const [userInputs, setUserInputs] = useState({
    username: '',
    isUsernameValid: false
  });

  const navigate = useNavigate();

  const location = useLocation();
  const {user} = location.state;

  function handleUsernameChange(e) {
    const username = e.target.value;

    console.log(checkUsernameValidity(username))

    setUserInputs(prev => {
      return {
        ...prev,
        username: username,
        isUsernameValid: checkUsernameValidity(username)
      }
    });
  }

  function checkUsernameValidity(username) {
    return !username.match(/\W/g);
  }

  function onSubmit(e) {
    if (userInputs.username == '' || !userInputs.isUsernameValid) {
      return;
    }

    postData(
      HttpMethod.POST,
      BACKEND_BASE_URL + USERS_SET_USERNAME,
      {
        username: userInputs.username
      },
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        user.username = userInputs.username;
        props.handleLogin(user);
        navigate(PATH.REWARDS_PAGE);
      } else {
        toast.error('Something went wrong with our servers! Please try again later');
      }
    })
  }

  function preventSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className='login-page'>
      <ToastContainer theme='colored'/>
      <form className='login-form' onSubmit={preventSubmit}>
        <div className='login-account-left'>
          <h3 className='login-account-text'>
            Setup<br></br>
            Your<br></br>
            Profile
          </h3>
          <p className='login-account-signup'>
            Don't have an account?<br></br>
            <Link to={PATH.SIGNUP_PAGE} className='login-account-signup-link'>
              Signup here
            </Link>
          </p>
        </div>
        <div className='login-account-right'>
          <div className='login-email-sent-wrapper'>
            <h1 className='login-email-sent-header'>
              Create Your Username
            </h1>
            <Form.Group 
              className='login-form-group' 
              controlId='loginEmail' 
              onChange={handleUsernameChange}
            >
              <div className='login-form-email-icon'/>
              <Form.Control 
                className={'form-control' + (userInputs.username !== '' && !userInputs.isUsernameValid ? 
                  ' invalid-password' : 
                  '')
                } 
                type='username'
                name='username'
                placeholder='Username'
              />
            </Form.Group>
            <p className='login-email-sent-text'>
              Username should contain only alphanumeric characters<br></br>
              and underscores
            </p>
            <div className='login-email-resend-wrapper login-account-btn-wrapper'>
              <button className='login-email-resend login-account-btn' onClick={onSubmit}>
                Save & Proceed
              </button>
            </div>
          </div>      
        </div>
      </form>
    </div>
  );
}
