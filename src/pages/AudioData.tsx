import { useRef, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, ButtonGroup } from 'reactstrap';
import { TriggerData } from '../components/AudioData/TriggerData';
import { ILanguage, ILocalization, ITranslation, Language } from '../types';
import { IBaseTrigger, IPlayerThoughts, IPlayerThoughtsData, IPlayerThoughtsFile, IRadio, IRadioData, IRadioFile } from '../types/audio';

interface IResultData<TD> {
  triggerData: TD[];
  translations: ITranslation[];
}

interface ITriggerData {
  trigger: string;
  text: string;
}

export const AudioData = () => {
  const [playerThoughts, setPlayerThoughts] = useState<IPlayerThoughtsData[]>([]);
  const [radio, setRadio] = useState<IRadioData[]>([]);
  const [openedSections, setOpenedSections] = useState<string[]>([]);
  const [openedPlayerThoughts, setOpenedPlayerThoughts] = useState<string[]>([]);
  const [openedRadio, setOpenedRadio] = useState<string[]>([]);

  const hiddenPlayerThoughtsFileInput = useRef<HTMLInputElement>(null);
  const hiddenRadioFileInput = useRef<HTMLInputElement>(null);

  const onToggleAccordion = (id: string) => {
    const dataToMutate = [...openedSections];
    if (dataToMutate.includes(id)) {
      dataToMutate.splice(dataToMutate.indexOf(id), 1);
    } else {
      dataToMutate.push(id);
    }
    setOpenedSections(dataToMutate);
  };

  const getResultData = <T extends IBaseTrigger & ILanguage, TD extends ITriggerData>(data: T[]): IResultData<TD> => {
    const triggerData: TD[] = data.map(item => {
      const triggerItem: any = {
        text: item.en,
      };
      const keys = (Object.keys(item) as (keyof T)[]).filter(x => !Object.values(Language).includes(x as Language));
      for (const key of keys) {
        triggerItem[key] = item[key];
      }
      return triggerItem as TD;
    })
    const translations: ITranslation[] = data.map(item => {
      const translation: Partial<ITranslation> = {
        key: item.en,
      };
      for (const langKey of Object.values(Language)) {
        translation[langKey] = item[langKey];
      }
      return translation as ITranslation;
    });
    return {
      triggerData,
      translations,
    }
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string[]> => {
    if (!e.target.files) return [];
    const cancel = e.target.files.length !== 2;
    if (cancel) return [];
    const tasks: Promise<string>[] = [];
    for (const file of e.target.files) {
      tasks.push(new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = e => {
          try {
            const loaded = e.target?.result as string;
            if (loaded) res(loaded);
            else {
              console.log('Empty or non-string data');
            }
          } catch (e) {
            console.log('Invalid file provided', e);
          }
        };
      }));
    }
    return Promise.all(tasks);
  }

  const onPlayerThoughtsImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data: string[] = await onImport(e);
    if (!data.length) return;
    const unknownParsed = JSON.parse(data[0]);
    const triggerDataIndx = unknownParsed.playerThoughts ? 0 : 1;
    const translationIndx = unknownParsed.translations ? 0 : 1;

    const triggerData: IPlayerThoughtsFile = JSON.parse(data[triggerDataIndx]);
    const translationsData: ILocalization = JSON.parse(data[translationIndx]);

    const playerThoughtsData: IPlayerThoughtsData[] = triggerData.playerThoughts.map(item => {
      const translation = translationsData.translations.find(x => x.key === item.text);
      return {
        trigger: item.trigger,
        en: translation?.en || '',
        ua: translation?.ua || '',
        ru: translation?.ru || '',
      };
    });
    setPlayerThoughts(playerThoughtsData);
  };

  const onRadioImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = await onImport(e);
    const unknownParsed = JSON.parse(data[0]);
    const triggerDataIndx = unknownParsed.radio ? 0 : 1;
    const translationIndx = unknownParsed.translations ? 0 : 1;

    const triggerData: IRadioFile = JSON.parse(data[triggerDataIndx]);
    const translationsData: ILocalization = JSON.parse(data[translationIndx]);

    const radioData: IRadioData[] = triggerData.radio.map(item => {
      const translation = translationsData.translations.find(x => x.key === item.text);
      return {
        trigger: item.trigger,
        clipName: item.clipName,
        en: translation?.en || '',
        ua: translation?.ua || '',
        ru: translation?.ru || '',
      };
    });
    setRadio(radioData);
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
    if (playerThoughts.length) {
      const playerThoughtsInfo = getResultData<IPlayerThoughtsData, IPlayerThoughts>(playerThoughts);
      const playerThoughtsFile: IPlayerThoughtsFile = {
        playerThoughts: playerThoughtsInfo.triggerData,
      };
      const translationsFile: ILocalization = {
        translations: playerThoughtsInfo.translations,
      };
      await download('player-thoughts', JSON.stringify(playerThoughtsFile), '.json');
      await download('player-thoughts', JSON.stringify(translationsFile), '.json');
    }
    if (radio.length) {
      const radioInfo = getResultData<IRadioData, IRadio>(radio);
      const radioFile: IRadioFile = {
        radio: radioInfo.triggerData,
      };
      const translationsFile: ILocalization = {
        translations: radioInfo.translations,
      };
      await download('radio', JSON.stringify(radioFile), '.json');
      await download('radio', JSON.stringify(translationsFile), '.json');
    }
  };

  return (
    <div className='audio-page'>
      <div className='header'>
        <ButtonGroup>
          <Button onClick={() => hiddenPlayerThoughtsFileInput.current?.click()}>Import player thoughts</Button>
          <Button onClick={() => hiddenRadioFileInput.current?.click()}>Import radio</Button>
          <Button onClick={onDownload}>Download</Button>
        </ButtonGroup>
      </div>
      <div className='content'>
        <Accordion open={openedSections} {...{ toggle: (id: string) => onToggleAccordion(id) }}>
          <AccordionItem>
            <AccordionHeader targetId='1'>Player Thoughts</AccordionHeader>
            <AccordionBody accordionId='1'>
              <TriggerData
                list={playerThoughts}
                opened={openedPlayerThoughts}
                listUpdateFn={setPlayerThoughts}
                accordionUpdateFn={setOpenedPlayerThoughts}
                onAddItem={{
                  trigger: '',
                  en: '',
                  ua: '',
                  ru: '',
                }}
              />
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId='2'>Radio</AccordionHeader>
            <AccordionBody accordionId='2'>
              <TriggerData
                list={radio}
                opened={openedRadio}
                listUpdateFn={setRadio}
                accordionUpdateFn={setOpenedRadio}
                onAddItem={{
                  trigger: '',
                  clipName: '',
                  en: '',
                  ua: '',
                  ru: '',
                }}
              />
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>
      <input
        type='file'
        ref={hiddenPlayerThoughtsFileInput}
        onChange={onPlayerThoughtsImport}
        className='hidden'
        accept='.json'
        multiple
      />
      <input
        type='file'
        ref={hiddenRadioFileInput}
        onChange={onRadioImport}
        className='hidden'
        accept='.json'
        multiple
      />
    </div>
  );
};