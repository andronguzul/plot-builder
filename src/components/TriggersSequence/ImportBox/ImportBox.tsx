import { useState } from 'react';
import { Progress } from 'reactstrap';
import { TriggersSequence } from '../../../types/triggers-sequence';
import { getTriggersSequence } from '../../../utils/triggers-sequence';
import { ImportResult, ImportStep } from './ImportStep';
import { SelectFirstChatStep } from './SelectFirstChatStep';
import { VerifyStep } from './VerifyStep';

export interface TriggersSequenceImportBoxProps {
  onCancel: () => void;
  onSuccess: (sequence: TriggersSequence) => void;
}

export enum ImportBoxStep {
  IMPORT = 'IMPORT',
  SELECT_FIRST_CHAT = 'SELECT_FIRS_CHAT',
  VERIFY = 'VERIFY',
}

export const TriggersSequenceImportBox = (props: TriggersSequenceImportBoxProps) => {
  const [step, setStep] = useState(ImportBoxStep.IMPORT);
  const [progressValue, setProgressValue] = useState(0);
  const [chats, setChats] = useState<ImportResult[]>([]);
  const [firstChatName, setFirstChatName] = useState('');

  const getSequence = (): TriggersSequence => {
    const firstChat = chats.find(x => x.fileName === firstChatName);
    if (!firstChat) {
      throw new Error(`First chat was not found (${firstChatName})`);
    }

    const triggers = getTriggersSequence(firstChatName, chats);
    console.log(triggers);

    return {
      triggers,
    };
  };

  const onCancel = () => {
    setChats([]);
    setFirstChatName('');
    props.onCancel();
  };

  const onSuccess = () => {
    setChats([]);
    setFirstChatName('');
    props.onSuccess(getSequence());
  };

  const onStepChange = (step: ImportBoxStep) => {
    switch (step) {
      case ImportBoxStep.IMPORT:
        setProgressValue(0);
        break;
      case ImportBoxStep.SELECT_FIRST_CHAT:
        setProgressValue(50);
        break;
      case ImportBoxStep.VERIFY:
        setProgressValue(100);
        break;
    }
    setStep(step);
  };

  const getStepComponent = () => {
    switch (step) {
      case ImportBoxStep.IMPORT:
        return (
          <ImportStep
            data={chats}
            onImport={(data: ImportResult[]) => setChats(data)}
            onNext={() => onStepChange(ImportBoxStep.SELECT_FIRST_CHAT)}
            onCancel={() => onCancel()}
          />
        );
      case ImportBoxStep.SELECT_FIRST_CHAT:
        return (
          <SelectFirstChatStep
            data={chats}
            firstChat={firstChatName}
            onSelect={(chat: string) => setFirstChatName(chat)}
            onBack={() => onStepChange(ImportBoxStep.IMPORT)}
            onNext={() => onStepChange(ImportBoxStep.VERIFY)}
            onCancel={() => onCancel()}
          />
        );
      case ImportBoxStep.VERIFY:
        return (
          <VerifyStep
            data={chats}
            firstChat={firstChatName}
            onBack={() => onStepChange(ImportBoxStep.SELECT_FIRST_CHAT)}
            onSubmit={() => onSuccess()}
            onCancel={() => onCancel()}
          />
        );
    }
  };

  return (
    <div className='import-box'>
      <Progress
        animated
        value={progressValue}
        color='success'
      />
      <div className='import-box-content'>
        {getStepComponent()}
      </div>
    </div>
  )
};