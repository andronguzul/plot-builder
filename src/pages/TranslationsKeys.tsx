import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { getAllMessages } from '../utils';
import { Language } from '../types';

export const TranslationsKeysPage = () => {
  const [, setSearchParams] = useSearchParams();
  const [localizationKeys, setLocalizationKeys] = useState<string[]>();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.EN);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');

  const hiddenJsonFileInput = useRef<HTMLInputElement>(null);

  const onImport = (e: React.ChangeEvent<HTMLInputElement>, cb: Function) => {
    if (!e.target.files) return;
    const cancel = e.target.files.length !== 1;
    if (cancel) return;
    const fileName = e.target.files[0].name;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      try {
        const data = e.target?.result;
        cb(data, fileName);
      } catch (e) {
        console.error('Invalid file provided', e);
      }
    };
  };

  const onJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string, fileName: string) => {
      const parsed = JSON.parse(data);
      setCurrentFileName(fileName.split('.')[0]);

      if (parsed.messages) {
        const keys = getAllMessages(parsed.messages);
        setLocalizationKeys(keys);
      } else if (parsed.playerThoughts || parsed.radio || parsed.episodes) {
        const list = parsed.playerThoughts || parsed.radio || parsed.episodes;
        const keys = [];
        for (const item of list) {
          keys.push(item.text);
        }
        setLocalizationKeys(keys);
      } else if (parsed.mechanics) {
        const keys = [];
        for (const item of parsed.mechanics) {
          keys.push(item.expectedResult);
        }
        setLocalizationKeys(keys);
      } else if (parsed.characters) {
        const keys = [];
        for (const item of parsed.characters) {
          keys.push(item.description);
        }
        setLocalizationKeys(keys);
      }
    });
  };

  const download = async (fileName: string, content: any, extenstion: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + extenstion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDownload = async () => {
    if (localizationKeys?.length) {
      const result = localizationKeys.map(key => {
        const localization = {
          en: '',
          ru: '',
          ua: '',
        };
        switch (currentLanguage) {
          case Language.EN:
            localization.en = key;
            break;
          case Language.UA:
            localization.ua = key;
            break;
          case Language.EN:
            localization.ru = key;
            break;
        }
        return localization;
      });
      await download(currentFileName, JSON.stringify({ translations: result }), '.json');
    }
  };

  return (
    <div className='keys-page'>
      <div className='header'>
        <ButtonGroup>
          <Button onClick={() => hiddenJsonFileInput.current?.click()}>Import json</Button>
          <Button onClick={onDownload}>Download</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '1',
            });
          }}>Chat</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '2',
            });
          }}>Audio</Button>
        </ButtonGroup>
      </div>
      <div className='content'>
        {localizationKeys?.length &&
          <div>
            <b>Current language:</b>
            <Dropdown
              toggle={() => setLangDropdownOpen(!langDropdownOpen)}
              isOpen={langDropdownOpen}
            >
              <DropdownToggle caret>
                {currentLanguage}
              </DropdownToggle>
              <DropdownMenu>
                {Object.values(Language).map(language =>
                  <DropdownItem key={language} onClick={() => setCurrentLanguage(language)}>
                    {language}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        }
        {localizationKeys?.map((value, key) =>
          <div key={key} className='key-row'>{value}</div>
        )}
      </div>
      <input
        type='file'
        ref={hiddenJsonFileInput}
        onChange={onJsonImport}
        className='hidden'
        accept='.json'
        multiple
      />
    </div>
  );
};