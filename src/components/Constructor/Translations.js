import { useEffect, useState } from 'react';
import {
  Button, Dropdown, DropdownItem, DropdownMenu,
  DropdownToggle, Input, Modal, ModalBody,
  ModalHeader, Table
} from 'reactstrap';

function Translations(props) {
  const [translations, setTranslations] = useState([]);
  const [keys, setKeys] = useState([]);
  const languages = ['uk_UA', 'en', 'ru_RU'];
  const [defaultLanguage, setDefaultLanguage] = useState(languages[0]);
  const [defaultLanguageOpen, setDefaultLanguageOpen] = useState(false);

  useEffect(() => {
    if (props.translations) {
      const deepCopy = JSON.parse(JSON.stringify(props.translations));
      setTranslations(deepCopy);
    }
  }, [props.translations]);

  useEffect(() => {
    setKeys(props.keys || []);
  }, [props.keys]);

  const onClose = () => {
    setTranslations(props.translations || []);
    props.onClose();
  };

  const onSave = () => {
    const translationsToMutate = [...translations];
    for (const indx in translationsToMutate) {
      translationsToMutate[indx][defaultLanguage] = translationsToMutate[indx].key;
    }
    setTranslations(translationsToMutate);
    props.onSave(translationsToMutate);
  };

  const onTranslationChange = (e, key, lang) => {
    const translationsToMutate = [...translations];
    const translationToUpdate = translationsToMutate.find(x => x.key === key);
    if (!translationToUpdate) {
      translationsToMutate.push({
        key,
        [lang]: e.target.value,
      })
    } else {
      const indx = translationsToMutate.indexOf(translationToUpdate);
      translationsToMutate[indx][lang] = e.target.value;
    }
    setTranslations(translationsToMutate);
  }

  return (
    <Modal
      toggle={onClose}
      isOpen={props.open}
      className='translations'
    >
      <ModalHeader toggle={onClose}>
        Translations
      </ModalHeader>
      <ModalBody className='members-content'>
        <div className='in-row'>
          <span className='margined-right'>Default language:</span>
          <Dropdown
            toggle={() => setDefaultLanguageOpen(!defaultLanguageOpen)}
            isOpen={defaultLanguageOpen}
          >
            <DropdownToggle caret>
              {defaultLanguage}
            </DropdownToggle>
            <DropdownMenu>
              {languages.map(language =>
                <DropdownItem key={language} onClick={() => setDefaultLanguage(language)}>
                  {language}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Table>
          <thead>
            <tr className='table-headers'>
              <th>key</th>
              {languages.filter(x => x !== defaultLanguage).map(lang =>
                <th key={lang}>{lang}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {keys.map((key, indx) =>
              <tr key={indx}>
                <th scope='row' className='table-key'>{key}</th>
                {languages.filter(x => x !== defaultLanguage).map(lang =>
                  <th key={lang}>
                    <Input
                      placeholder={`${lang} translation`}
                      value={translations.find(x => x.key === key)?.[lang] || ''}
                      onChange={e => onTranslationChange(e, key, lang)}
                    />
                  </th>
                )}
              </tr>
            )}
          </tbody>
        </Table>
        <Button onClick={onSave} color='success'>Save</Button>
      </ModalBody>
    </Modal>
  );
}

export default Translations;