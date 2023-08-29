import React, { Component } from 'react'
import "../assets/styles/LandingPage.css"
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import { BACKEND_BASE_URL, PATH, ROOT } from '../constants/config';
import { HttpMethod, postData } from '../util/RestUtil';
import { toBase64 } from '../util/FileUtil';
import { PRODUCTS_UPLOAD } from '../constants/endpoints';
import { Tooltip } from 'react-tooltip'
import { Button } from 'reactstrap';
import { Languages } from '../constants/languages';
import { withTranslation } from 'react-i18next';
import { T_LANDING } from '../constants/translations';
import CustomTooltip from './CustomTooltip';


class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.t = props.t;
    this.i18n = props.i18n;

    this.body = React.createRef();
    this.bodyDescription = React.createRef();
    this.bodyTop = React.createRef();
    this.bodyBottom = React.createRef();

  }


  render() {
    return (
      <div className="body" ref={this.body}> 
        <div className="body-container-top" ref={this.bodyTop}>
          <h2 className="body-description" ref={this.bodyDescription} data-tooltip-id="tooltip" data-tooltip-content={T_LANDING.description}>
            <span className='body-description-highlight'>{this.t(T_LANDING.description)}</span>
          </h2>
          <h3 className="body-delivered-within" data-tooltip-id="tooltip" data-tooltip-content={T_LANDING.deliveredWithin}>
            {this.t(T_LANDING.deliveredWithin)}*
          </h3>
          <Link to={PATH.SIGNUP_PAGE}>
            <button 
              className="upload-btn" 
              data-tooltip-id="tooltip" 
              data-tooltip-content={T_LANDING.shopNow}
            >
              {this.t(T_LANDING.shopNow)}
            </button>
          </Link>
          <p className='body-disclaimer' data-tooltip-id="tooltip" data-tooltip-content={T_LANDING.disclaimer}>
            *{this.t(T_LANDING.disclaimer)}
          </p>
        </div>
        {sessionStorage.getItem("isContributor") === "true" ? (
          <Tooltip style={{zIndex: '100'}}
            id="tooltip"
            clickable
            render={({ content, activeAnchor }) => (
              <CustomTooltip text={content}></CustomTooltip>
            )}
          />
        ) : <></>}
        
      </div>
    )
  }
}

export default withTranslation()(LandingPage);
