import { useState } from 'react';
import { TriggersSequence } from '../../types/triggers-sequence';
import { TriggersSequenceContentBox } from './ContentBox';
import { TriggersSequenceImportBox } from './ImportBox/ImportBox';
import { TriggersSequenceNoContentBox } from './NoContentBox';

export const TriggersSequenceContent = () => {
  const [importOpen, setImportOpen] = useState(false);
  const [sequence, setSequence] = useState<TriggersSequence>();

  if (importOpen) {
    return (
      <TriggersSequenceImportBox
        onCancel={() => setImportOpen(false)}
        onSuccess={(sequence) => {
          setImportOpen(false);
          setSequence(sequence);
        }}
      />
    );
  }
  if (sequence) {
    return (
      <TriggersSequenceContentBox
        sequence={sequence}
        onImport={() => setImportOpen(true)}
      />
    );
  }
  return (
    <TriggersSequenceNoContentBox
      onImport={() => setImportOpen(true)}
    />
  );
};