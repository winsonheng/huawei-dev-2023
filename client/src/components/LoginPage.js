import React, { Component, useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import { BACKEND_BASE_URL, PATH, ROOT } from '../constants/config';
import { USERS_GET_TOKEN, USERS_LOGIN_EMAIL } from '../constants/endpoints';
import { HttpMethod, StatusCode, postData } from '../util/RestUtil';
import { ToastContainer, toast } from 'react-toastify';
import '../assets/styles/LoginPage.css'

export default function LoginPage(props) {

  const location = useLocation();

  const { email } = location.state == null ? { email: '' } : location.state;

  const navigate = useNavigate();

  const [userInputs, setUserInputs] = useState({
    email: '',
    password: '',
    isEmailValid: false,
  });

  const [forgotPassword, setForgotPassword] = useState({
    showForgotPassword: false,
    email: '',
    isEmailValid: false,
    emailConfirmed: false
  });

  useEffect(() => {
    // populate the email field if it came from verified email
    if (email != '') {
      setUserInputs((prev) => {
        return {
          ...prev,
          email: email,
          isEmailValid: true
        };
      });
    }
  }, []);
  

  function handleEmailChange(e) {
    const email = e.target.value;
    setUserInputs((prev) => {
      return {
        ...prev,
        email: email,
        isEmailValid: e.target.checkValidity()
      };
    });
  }

  function handleForgotPasswordEmailChange(e) {
    const email = e.target.value;
    setForgotPassword((prev) => {
      return {
        ...prev,
        email: email,
        isEmailValid: e.target.checkValidity()
      };
    });
  }

  function handlePasswordChange(e) {
    const password = e.target.value;

    setUserInputs((prev) => {
      return {
        ...prev,
        password: password, 
      };
    });
  }

  function onSubmit(e) {
    if (!userInputs.isEmailValid) {
      return;
    }

    postData(
      HttpMethod.POST,
      BACKEND_BASE_URL + USERS_LOGIN_EMAIL,
      {
        email: userInputs.email,
        password: userInputs.password
      }
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log(response.data.user)
        getToken(response.data.user);
      } else if (response.status === StatusCode.UNAUTHORIZED) {
        toast.error(response.data.message);
      }
    });
    
  }

  function getToken(user) {
    postData(
      HttpMethod.POST,
      BACKEND_BASE_URL + USERS_GET_TOKEN, 
      {
        username: userInputs.email,
        password: userInputs.password
      },
    ).then(response => {
      if (response.status == StatusCode.OK) {
        user.token = response.data.token;
        props.setToken(response.data.token);
        if (user.username == null) {
          navigate(PATH.USER_SETUP_PAGE, {
            state: {
              user: user
            }
          });
        } else {
          navigate(PATH.MY_PRODUCTS);
          props.handleLogin(user);
        }
        toast.success('Login successful!');
      } else {
        toast.error('Something went wrong. Please try again!')
      }
    })
  }

  function onSubmitConfirmEmail(e) {
    console.log(forgotPassword.email);
    if (!forgotPassword.isEmailValid) {
      return;
    }

    // TODO: check email exists
    setForgotPassword((prev) => {
      return {
        ...prev,
        emailConfirmed: true
      }
    })
  }

  function onSubmitResendEmail(e) {
    console.log('Resending reset link');
  }

  function preventSubmit(e) {
    e.preventDefault();
  }

  function googleLoginSuccess(response) {
    console.log('Google login successful!', response);
    googleLogout();
  }

  function googleLoginError() {
    console.log('Google login error!');
  }

  return (
    <div className='login-page'>
        <ToastContainer theme='colored'/>
        <form className='login-form' onSubmit={preventSubmit}>
          <div className='login-account-left'>
            <h3 className='login-account-text'>
              Login<br></br>
              To Your<br></br>
              Account
            </h3>
            <p className='login-account-signup'>
              Don't have an account?<br></br>
              <Link to={PATH.SIGNUP_PAGE} className='login-account-signup-link'>
                Signup here
              </Link>
            </p>
          </div>
          <div className='login-account-right'>
            {(() => {
              // TODO: Convert this clause to be the forgot password section
              if (forgotPassword.showForgotPassword) {
                return (
                  <div className='login-email-sent-wrapper'>
                    <h1 className='login-email-sent-header'>
                      Reset your password
                    </h1>
                    {(() => {
                      if (!forgotPassword.emailConfirmed) {
                        return (
                          <>
                            <Form.Group 
                              className='login-form-group' 
                              controlId='loginEmail' 
                              onChange={handleForgotPasswordEmailChange}
                            >
                              <div className='login-form-email-icon'/>
                              <Form.Control 
                                className={'form-control' + (forgotPassword.email !== '' && !forgotPassword.isEmailValid ? 
                                  ' invalid-password' : 
                                  '')
                                } 
                                type='email'
                                name='resetPasswordEmail'
                                placeholder='Email'
                              />
                            </Form.Group>
                            <p className='login-email-sent-text'>
                              We'll send you an email containing a password reset link.
                              {/**We've sent an email to {this.state.email}.
                               * <br></br>Please click on the link to activate your account.*/}
                            </p>
                            <div className='login-email-resend-wrapper login-account-btn-wrapper'>
                              <button className='login-email-resend login-account-btn' onClick={onSubmitConfirmEmail}>
                                Confirm Email
                              </button>
                            </div>
                          </>
                        )
                      } else {
                        return (
                          <>
                            <div className='login-email-sent-icon'/>
                            <p className='login-email-sent-text'>
                              We've sent you a password reset link at {forgotPassword.email}.
                            </p>
                            <div className='login-email-resend-wrapper login-account-btn-wrapper'>
                              <button className='login-email-resend login-account-btn' onClick={onSubmitResendEmail}>
                                Resend Email
                              </button>
                            </div>
                          </>
                        )
                      }
                    })()}
                  </div>
                );
              } else {
                return (
                  <>
                    <div className='login-email-section'>
                      <Form.Group 
                        className='login-form-group' 
                        controlId='loginEmail' 
                        onChange={handleEmailChange}
                        
                      >
                        <div className='login-form-email-icon'/>
                        <Form.Control 
                          className={'form-control' + (userInputs.email !== '' && !userInputs.isEmailValid ? 
                            ' invalid-password' : 
                            '')
                          } 
                          type='email' 
                          placeholder='Email' // TODO: Allow login by username
                          defaultValue={email}
                        />
                      </Form.Group>
                      <Form.Group 
                        className='login-form-group' 
                        controlId='loginPassword'
                        onChange={handlePasswordChange}
                      >
                        <div className='login-form-password-icon'/>
                        <Form.Control 
                          className='form-control' 
                          type='password' 
                          placeholder='Password' 
                          required
                        />

                        <Form.Text className='login-form-forgot-password' onClick={() => setForgotPassword((prev) => {
                          return {
                            ...prev,
                            showForgotPassword: true
                          };
                        })}>
                          Forgot password?
                        </Form.Text>
                      </Form.Group>
                      <div className='login-account-btn-wrapper'>
                        <button className='login-account-btn' onClick={onSubmit}>
                          Login
                        </button>
                      </div>
                    </div>
                    <div className='login-separator'>
                      <div className='line'>

                      </div>
                      <div className='login-separator-or'>
                        OR
                      </div>
                      <div className='line'>

                      </div>
                    </div>
                    <div className='login-external-section'>
                      
                      <GoogleLogin
                        className='google-login'
                        size='large'
                        theme='outline'
                        context='login'
                        text='login_with'
                        onSuccess={googleLoginSuccess}
                        onError={googleLoginError}
                        useOneTap
                      />
                    </div>
                  </>
                );
              }
            })()}
            
          </div>
        </form>
      </div>
  )
}
