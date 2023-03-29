import { useState } from 'react';
import { TriggersSequenceContentBox } from './ContentBox';
import { TriggerInfo, TriggersSequenceImportBox } from './ImportBox/ImportBox';
import { TriggersSequenceNoContentBox } from './NoContentBox';

export const TriggersSequenceContent = () => {
  const [importOpen, setImportOpen] = useState(false);
  const [triggers, setTriggers] = useState<TriggerInfo[]>([]);

  switch (true) {
    case importOpen:
      return (
        <TriggersSequenceImportBox
          onCancel={() => setImportOpen(false)}
          onSuccess={(triggers: TriggerInfo[]) => {
            setImportOpen(false);
            setTriggers(triggers);
          }}
        />
      );
    case !!triggers.length:
      return (
        <TriggersSequenceContentBox
          triggers={triggers}
          onImport={() => setImportOpen(true)}
        />
      );
    default:
      return (
        <TriggersSequenceNoContentBox
          onImport={() => setImportOpen(true)}
        />
      );
  }
};