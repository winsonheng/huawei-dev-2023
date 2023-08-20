import React, { useState } from 'react'
import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import { Button } from 'reactstrap';
import Flags from 'country-flag-icons/react/3x2'
import { CLIENT_IDS, DEFAULT_LANGUAGE, Languages, UnsupportedLanguages } from '../constants/languages';
import '../assets/styles/CustomTooltip.css';
import { useTranslation } from 'react-i18next';
import { T_LANDING, T_TOOLTIP } from '../constants/translations';
import { BACKEND_BASE_URL, CLIENT_ID } from '../constants/config';
import { HttpMethod, postData } from '../util/RestUtil';
import { TRANSLATIONS_CREATE } from '../constants/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';

export default function CustomTooltip(props) {

  const { t, i18n } = useTranslation();

  const options = [];

  for (const key in Languages) {
    options.push({
      value: key,
      label: Languages[key].nativeName
    });
  }

  for (const key in UnsupportedLanguages) {
    options.push({
      value: key,
      label: UnsupportedLanguages[key].nativeName
    });
  }

  const [selectedOption, setSelectedOption] = useState(null);
  const [translation, setTranslation] = useState('');
  const [isAccurate, setIsAccurate] = useState(null);

  let defaultLanguage;
  const languageOptions = [];

  for (const key in Languages) {

    if (key === DEFAULT_LANGUAGE) {
      continue;
    }

    const option = {
      value: key,
      label: Languages[key].nativeName,
      Flag: Flags[Languages[key].flag]
    };
    languageOptions.push(option);

    if (key === sessionStorage.getItem('tooltipLanguage')) {
      defaultLanguage = option;

      if (selectedOption === null) {
        setSelectedOption(key);
      }
    }
  }

  for (const key in UnsupportedLanguages) {

    const option = {
      value: key,
      label: UnsupportedLanguages[key].nativeName,
      Flag: Flags[UnsupportedLanguages[key].flag]
    };
    languageOptions.push(option);

  }

  const formatOptionLabel = ({ value, label, Flag }) => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Flag style={{width: "42px"}}></Flag>
      <div style={{ marginLeft: "15px" }}>{label}</div>
    </div>
  );

  function handleLanguageChange(e) {
    sessionStorage.setItem('tooltipLanguage', e.value);
    setSelectedOption(e.value);
  }

  function onSubmit(e) {
    if (translation === '') {
      return;
    } 

    console.log('Submitting tooltip', props.text, selectedOption, translation, isAccurate);
    const sourceLanguageID = CLIENT_IDS[DEFAULT_LANGUAGE];
    const targetLanguageID = CLIENT_IDS[selectedOption];

    console.log(`Submitting translation "${props.text}" to "${translation}" with lang from ${sourceLanguageID} to ${targetLanguageID}. Client ID: ${CLIENT_ID}`);

    postData(
      HttpMethod.POST,
      BACKEND_BASE_URL + TRANSLATIONS_CREATE,
      {
        translations: [
          {
            text: props.text,
            translation: translation,
            sourceLanguageID: sourceLanguageID,
            targetLanguageID: targetLanguageID,
            isAccurate: isAccurate,
            clientID: CLIENT_ID
          }
        ]
      },
      false
    ).then(result => {
      console.log(result);
      if (result.status === HttpStatusCode.Created) {
        toast.success(t(T_TOOLTIP.thankYou));
      }
    });
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10px'
    }}>
      <ToastContainer theme='colored' />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '20px'
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginBottom: '20px'
        }}>
          <p className='tooltip-question'>
            {t(T_TOOLTIP.isAccurate)}
          </p>
          <div className={'thumbs-up' + (isAccurate === false ? ' thumbs-deactivated' : '')} onClick={() => setIsAccurate(true)}></div>
          <div className={'thumbs-down' + (isAccurate === true ? ' thumbs-deactivated' : '')} onClick={() => setIsAccurate(false)}></div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Select className='tooltip-language-selector'
            defaultValue={defaultLanguage !== undefined ? defaultLanguage : 'placeholder'}
            formatOptionLabel={formatOptionLabel}
            options={languageOptions}
            onChange={handleLanguageChange}
            placeholder={t(T_TOOLTIP.selectLanguage)}
          />
          <Form.Group 
            className='tooltip-translation' 
            controlId='translation' 
            onChange={e => setTranslation(e.target.value)}
            >
            <Form.Control 
              className='tooltip-translation-input'
              type='text'
              name='translation'
              placeholder={t(T_TOOLTIP.suggest)}
            />
          </Form.Group>
        </div>
      </div>
      <Button className='tooltip-submit' onClick={onSubmit}>
        {t(T_TOOLTIP.submit)} <br></br>
        {t(T_TOOLTIP.feedback)}
      </Button>
    </div>

  )
}
