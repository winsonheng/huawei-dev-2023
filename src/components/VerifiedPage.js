import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HttpMethod, StatusCode, postData } from '../util/RestUtil';
import { BACKEND_BASE_URL, PATH } from '../constants/config';
import { USERS_VERIFY_EMAIL } from '../constants/endpoints';
import { ToastContainer } from 'react-toastify';
import { Form } from 'react-bootstrap';
import '../assets/styles/VerifiedPage.css'

export default function VerifiedPage() {

  const [email, setEmail] = useState('');

  const params = useParams();
  const uidb64 = params['uidb64'];
  const token = params['token'];

  console.log('UIDB64:', uidb64, 'Token:', token);

  postData(
    HttpMethod.POST, 
    BACKEND_BASE_URL + USERS_VERIFY_EMAIL,
    {
      uidb64: uidb64,
      token: token
    }
  ).then(response => {
    if (response.status === StatusCode.OK) {
      console.log('Successfully verified');
      setEmail(prev => {
        console.log(response.data.email)
        return response.data.email;
      })
    } else {
      console.log('ERROR!');
    }
  })

  return (
    <div className='verified-page'>
      <ToastContainer theme='colored'/>
      <div className='signup-form'>
        <div id='verified-left' className='create-account-left'>
          <h3 className='create-account-text'>
            Activate<br></br>
            Your<br></br>
            Account
          </h3>
        </div>
        <div id='verified-right' className='create-account-right'>
          <div className='signup-email-sent-wrapper'>
            <h1 className='signup-email-sent-header'>
              Welcome!
            </h1>
            <div className='signup-email-sent-icon'/>
            <p className='signup-email-sent-text'>
              Proceed to login and start transcribing
              <br></br>your products now!
            </p>
            <div className='signup-email-resend-wrapper create-account-btn-wrapper'>
            <Link to={PATH.LOGIN_PAGE} state={{ email: email }}>
              <button id='verified-login-btn' className='create-account-btn'>
                Login
              </button>
            </Link>
            </div>
          </div>     
        </div>
      </div>
    </div>
  );
}
