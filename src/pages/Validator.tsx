import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import { getAllMessages } from '../utils';
import { ILanguage, Language } from '../types';

interface IContentData {
  fileName: string;
  keys: string[];
}

interface ITranslationData {
  fileName: string;
  translations: ILanguage[];
}

interface IErrorMsg {
  text?: string;
  data?: IContentData;
}

export const ValidatorPage = () => {
  const [, setSearchParams] = useSearchParams();
  const [contentData, setContentData] = useState<IContentData[]>([]);
  const [translationData, setTranslationData] = useState<ITranslationData[]>([]);
  const [errorMsgs, setErrorMsgs] = useState<IErrorMsg[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const hiddenJsonFileInput = useRef<HTMLInputElement>(null);

  const onImport = (e: React.ChangeEvent<HTMLInputElement>, cb: (data: string, fileName: string) => void) => {
    if (!e.target.files) return;
    for (const file of e.target.files) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = e => {
        try {
          const data = e.target?.result;
          if (typeof data !== "string") {
            throw new Error('File data is not string!');
          }
          cb(data, file.name);
        } catch (e) {
          console.error('Invalid file provided', e);
        }
      };
    }
  };

  const onJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string, fileName: string) => {
      const parsed = JSON.parse(data);

      if (parsed.translations) {
        processTranslationFile(parsed, fileName);
      } else {
        processOriginalFile(parsed, fileName);
      }
    });
  };

  const processTranslationFile = (parsed: any, fileName: string) => {
    setTranslationData((list) => [...list, {
      fileName,
      translations: parsed.translations,
    }])
  };

  const processOriginalFile = (parsed: any, fileName: string) => {
    let keys: string[] = [];
    if (parsed.messages) {
      keys = getAllMessages(parsed.messages);
    } else if (parsed.playerThoughts || parsed.radio) {
      const list = parsed.playerThoughts || parsed.radio;
      for (const item of list) {
        keys.push(item.text);
      }
    } else if (parsed.mechanics) {
      for (const item of parsed.mechanics) {
        keys.push(item.expectedResult);
      }
    } else if (parsed.characters) {
      for (const item of parsed.characters) {
        keys.push(item.description);
      }
    } else if (parsed.episodes) {
      for (const item of parsed.episodes) {
        keys.push(item.episodeName);
        keys.push(item.episodeDescription);
      }
    }

    setContentData((list) => [...list, {
      fileName,
      keys,
    }]);
  };

  const translationExists = (translationDataItem: ITranslationData, text: string) => {
    return translationDataItem.translations.find(translation => translation[Language.UA] === text || translation[Language.EN] === text);
  };

  const onValidate = () => {
    if (!contentData.length) {
      setErrorMsgs([{
        text: 'Missing original files!',
      }]);
      return;
    }
    const errors: IErrorMsg[] = [];
    for (const contentDataItem of contentData) {
      const translationDataItem = translationData.find(x => x.fileName === contentDataItem.fileName);
      if (!translationDataItem) {
        errors.push({
          text: `Missing translation file for ${contentDataItem.fileName}!`,
        });
        continue;
      }
      const missingKeys = contentDataItem.keys.filter(key => !translationExists(translationDataItem, key));
      if (missingKeys.length) {
        errors.push({
          data: {
            fileName: contentDataItem.fileName,
            keys: missingKeys,
          },
        });
      }
    }
    if (errors.length) {
      setErrorMsgs(errors);
    } else {
      setErrorMsgs([]);
      setSuccessMsg('Validation complete. No issues found');
    }
  };

  const logResult = () => {
    if (errorMsgs.length) {
      return (
        <>
          {errorMsgs.map((msg, key) => {
            if (msg.text) {
              return <div className='error-title' key={key}>{msg.text}</div>;
            } else if (msg.data) {
              return (
                <div className='error-content'>
                  <div className='error-title'>{msg.data.fileName}</div>
                  {msg.data.keys.map((missingKey, key) =>
                    <div className='error-data'><b>{`${key + 1}. `}</b>{missingKey}</div>
                  )}
                </div>
              )
            }
          })}
        </>
      );
    }
    if (successMsg) {
      return (
        <div className='success-title'>{successMsg}</div>
      );
    }
    return (
      <div className='info-title'>Press "Validate" to get results</div>
    );
  };

  return (
    <div className='validator-page'>
      <div className='header'>
        <ButtonGroup>
          <Button onClick={() => hiddenJsonFileInput.current?.click()}>Import json</Button>
          <Button onClick={onValidate}>Validate</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '1',
            });
          }}>Back</Button>
        </ButtonGroup>
      </div>
      <div className='content'>
        <div className='metadata'>
          <div className='metadata-header'>
            <div>Original Files</div>
            <div>Translation Files</div>
          </div>
          <div className='metadata-body'>
            <div className='metadata-body-list'>
              {contentData.map(x =>
                <div key={x.fileName} className='list-item'>{x.fileName}</div>
              )}
            </div>
            <div className='metadata-body-list'>
              {translationData.map(x =>
                <div key={x.fileName} className='list-item'>{x.fileName}</div>
              )}
            </div>
          </div>
        </div>
        <div className='validation-result'>
          <div className='metadata-header'>
            Validation Result
          </div>
          <div className='metadata-body'>
            {logResult()}
          </div>
        </div>
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