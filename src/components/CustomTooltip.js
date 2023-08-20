import React, { useState } from 'react'
import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import { Button } from 'reactstrap';
import Flags from 'country-flag-icons/react/3x2'
import { DEFAULT_LANGUAGE, Languages, UnsupportedLanguages } from '../constants/languages';
import '../assets/styles/CustomTooltip.css';
import { useTranslation } from 'react-i18next';
import { T_LANDING, T_TOOLTIP } from '../constants/translations';

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
    const option = {
      value: key,
      label: Languages[key].nativeName,
      Flag: Flags[Languages[key].flag]
    };
    languageOptions.push(option);

    if (key === sessionStorage.getItem('tooltipLanguage')) {
      defaultLanguage = option;
    }
  }

  const formatOptionLabel = ({ value, label, Flag }) => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Flag style={{width: "42px"}}></Flag>
      <div style={{ marginLeft: "15px" }}>{label}</div>
    </div>
  );

  function handleLanguageChange(e) {
    console.log(e);
    sessionStorage.setItem('tooltipLanguage', e.value);
    setSelectedOption(e.value);
  }

  function onSubmit(e) {
    console.log('Submitting tooltip', props.text, selectedOption, translation, isAccurate);
  }

  console.log(defaultLanguage);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10px'
    }}>
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
            onChange={setTranslation}
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
