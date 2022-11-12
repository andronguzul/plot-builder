import { useState } from 'react';
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
          <Button>Import player thoughts</Button>
          <Button>Import radio</Button>
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
    </div>
  );
};