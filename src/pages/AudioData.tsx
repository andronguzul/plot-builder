import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, ButtonGroup } from 'reactstrap';
import { TriggerData } from '../components/AudioData/TriggerData';
import { CleanButton } from '../components/CleanButton';
import { IPlayerThoughts, IPlayerThoughtsFile, IRadio, IRadioFile } from '../types/audio';

export const AudioData = () => {
  const [, setSearchParams] = useSearchParams();
  const [playerThoughts, setPlayerThoughts] = useState<IPlayerThoughts[]>([]);
  const [radio, setRadio] = useState<IRadio[]>([]);
  const [openedSections, setOpenedSections] = useState<string[]>([]);
  const [openedPlayerThoughts, setOpenedPlayerThoughts] = useState<string[]>([]);
  const [openedRadio, setOpenedRadio] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();

  const hiddenPlayerThoughtsFileInput = useRef<HTMLInputElement>(null);
  const hiddenRadioFileInput = useRef<HTMLInputElement>(null);

  const playerThoughtsRef = useRef<IPlayerThoughts[]>();
  const radioRef = useRef<IRadio[]>();
  const openedPlayerThoughtsRef = useRef<string[]>();
  const openedRadioRef = useRef<string[]>();
  playerThoughtsRef.current = playerThoughts;
  radioRef.current = radio;
  openedPlayerThoughtsRef.current = openedPlayerThoughts;
  openedRadioRef.current = openedRadio;

  useEffect(() => {
    const savedPlayerThoughts = localStorage.getItem('playerThoughts');
    const savedRadio = localStorage.getItem('radio');
    const savedOpenedPlayerThoughts = localStorage.getItem('openedPlayerThoughts');
    const savedOpenedRadio = localStorage.getItem('openedRadio');
    const savedLastUpdated = localStorage.getItem('audioLastUpdated');
    if (savedPlayerThoughts) setPlayerThoughts(JSON.parse(savedPlayerThoughts));
    if (savedRadio) setRadio(JSON.parse(savedRadio));
    if (savedOpenedPlayerThoughts) setOpenedPlayerThoughts(JSON.parse(savedOpenedPlayerThoughts));
    if (savedOpenedRadio) setOpenedRadio(JSON.parse(savedOpenedRadio));
    if (savedLastUpdated) setLastUpdated(new Date(savedLastUpdated));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSavedItem(playerThoughtsRef.current, 'playerThoughts');
      updateSavedItem(radioRef.current, 'radio');
      updateSavedItem(openedPlayerThoughtsRef.current, 'openedPlayerThoughts');
      updateSavedItem(openedRadioRef.current, 'openedRadio');
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const updateSavedItem = (currentData: unknown, localStorageKey: string) => {
    const localStorageData = localStorage.getItem(localStorageKey);
    if (JSON.stringify(currentData) !== localStorageData) {
      localStorage.setItem(localStorageKey, JSON.stringify(currentData));
      const now = new Date();
      localStorage.setItem('audioLastUpdated', now.toString());
      setLastUpdated(now);
    }
  };

  const onToggleAccordion = (id: string) => {
    const dataToMutate = [...openedSections];
    if (dataToMutate.includes(id)) {
      dataToMutate.splice(dataToMutate.indexOf(id), 1);
    } else {
      dataToMutate.push(id);
    }
    setOpenedSections(dataToMutate);
  };

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

  const onPlayerThoughtsImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string) => {
      const parsed: IPlayerThoughtsFile = JSON.parse(data);
      setPlayerThoughts(parsed.playerThoughts);
    });
  };

  const onRadioImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string) => {
      const parsed: IRadioFile = JSON.parse(data);
      setRadio(parsed.radio);
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
    if (playerThoughts.length) {
      const playerThoughtsFile: IPlayerThoughtsFile = {
        playerThoughts,
      };
      await download('player-thoughts', JSON.stringify(playerThoughtsFile), '.json');
    }
    if (radio.length) {
      const radioFile: IRadioFile = {
        radio,
      };
      await download('radio', JSON.stringify(radioFile), '.json');
    }
  };

  return (
    <div className='audio-page'>
      <div className='header'>
        <div className='last-updated'>
          Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'never'}
        </div>
        <ButtonGroup>
          <Button onClick={() => hiddenPlayerThoughtsFileInput.current?.click()}>Import player thoughts</Button>
          <Button onClick={() => hiddenRadioFileInput.current?.click()}>Import radio</Button>
          <CleanButton
            onClean={() => {
              setOpenedPlayerThoughts([]);
              setOpenedRadio([]);
              setPlayerThoughts([]);
              setRadio([]);
            }}
          />
          <Button onClick={onDownload}>Download</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '1',
            });
          }}>Chat</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '3',
            });
          }}>Keys</Button>
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
                newItem={{
                  trigger: '',
                  text: ''
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
                newItem={{
                  trigger: '',
                  clipName: '',
                  text: ''
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