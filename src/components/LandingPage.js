import React, { Component } from 'react'
import "../assets/styles/LandingPage.css"
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import { BACKEND_BASE_URL, PATH, ROOT } from '../constants/config';
import { HttpMethod, postData } from '../util/RestUtil';
import { toBase64 } from '../util/FileUtil';
import { SONGS_UPLOAD } from '../constants/endpoints';
import { Tooltip } from 'react-tooltip'
import { Button } from 'reactstrap';
import { languages } from '../constants/languages';
import { withTranslation } from 'react-i18next';
import { T_LANDING } from '../constants/translations';


class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.t = props.t;
    this.i18n = props.i18n;

    this.fileInput = React.createRef();
    this.changeFileInput = React.createRef();
    this.body = React.createRef();
    this.bodyDescription = React.createRef();
    this.bodyGif = React.createRef();
    this.bodyTop = React.createRef();
    this.bodyBottom = React.createRef();

    this.state = {
      selectedFile: undefined,
      unsupportedFileFormat: false,
      isFileUploadSuccessful: undefined,
      showPreferences: false,
      difficulty: 'Any',
      bpm: '',
      waitingForResult: false,
      obtainedResult: false,
      songid: null,
      transcription: '',
      transcription_url: ''
    };
  }

  animateBody() {
    console.log('animating');
    console.log(this.bodyDescription.current.offsetHeight,
      this.bodyDescription.current.offsetWidth);
    
    const translateY = this.bodyDescription.current.offsetHeight 
                      + this.bodyDescription.current.offsetTop
                      + this.bodyGif.current.offsetHeight;

    const duration = 1000;
    const easing = 'linear';

    const keyframesTop = [
      { transform: `translateY(-100%)`, opacity: 0, easing: easing }
    ];
    const optionsTop = {
      duration: duration, 
      fill: 'forwards' 
    }

    const keyframesBottom = [
      { transform: `translateY(-100%)`, opacity: 1, easing: easing }
    ];
    const optionsBottom = {
      duration: duration, 
      fill: 'forwards' 
    }

    this.bodyTop.current.animate(keyframesTop, optionsTop);
    this.bodyBottom.current.animate(keyframesBottom, optionsBottom);

  }

  render() {
    return (
      <div className="body" ref={this.body}> 
        <div className="body-container-top" ref={this.bodyTop}>
          <h2 className="body-description" ref={this.bodyDescription} data-tooltip-id="tooltip" data-tooltip-content>
            <span className='body-description-highlight'>{this.t(T_LANDING.description)}</span>
          </h2>
          <h3 className="body-delivered-within">
            Delivered within 2 working days.*
          </h3>
          <input hidden
            className="upload-btn"
            type="file"
            accept=".mp3, .ogg, .wav"
            onChange={this.uploadSong}
            ref={this.fileInput}
          />
          {(() => {
            if (sessionStorage.getItem('token') === null) {
              return (
                <Link to={PATH.SIGNUP_PAGE}>
                  <button 
                    className="upload-btn" 
                  >
                    Shop Now
                  </button>
                </Link>
              ); 
            } else {
              return (
                <>
                  <button 
                    className="upload-btn" 
                    onClick={e => {
                      this.fileInput.current.dispatchEvent(new MouseEvent("click"));
                    }}
                  >
                    Upload Audio
                  </button>
                  <h4 className="body-selected-file">
                    {
                      this.state.selectedFile === undefined ? 
                        "No File Selected" : 
                        this.state.unsupportedFileFormat ?
                          "Unsupported file format. Only .mp3, .ogg and .wav formats are supported." :
                          "Selected file: " + this.state.selectedFile.name
                    }
                  </h4>
                </>
               );
            }
          })()}
          <p className='body-disclaimer'>
            *Shipping fees & taxes may apply.
          </p>
          {Object.keys(languages).map(lng => (
           <button key={lng} onClick={e => this.i18n.changeLanguage(lng)}>
            {languages[lng].nativeName}
           </button> 
          ))}
        </div>
      
        <Tooltip 
          id="tooltip"
          clickable
          render={({ content, activeAnchor }) => (
            <span>
              The element #{content} is currently active.
              <br/>
              Relevant attribute: {activeAnchor?.getAttribute('data-some-relevant-attr') || 'not set'}
            </span>
          )}
        />
      </div>
    )
  }
}

export default withTranslation()(LandingPage);
