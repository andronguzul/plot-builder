import { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalHeader, Alert } from 'reactstrap';
import { TriggerType } from '../../types';

export interface TriggerEditorModalProps {
  onSave: Function;
  onClose: Function;
  open: boolean;
  trigger: string;
}

export const TriggerEditorModal = (props: TriggerEditorModalProps) => {
  const [trigger, setTrigger] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.trigger) {
      setTrigger(props.trigger);
    } else {
      setTrigger('');
    }
  }, [props.open, props.trigger]);

  const onAddTriggerPlaceholder = (triggerType: TriggerType) => {
    let newValue = trigger;
    if (trigger && trigger[trigger.length - 1] !== '_') newValue += '_';
    setTrigger(newValue + triggerType + ':');
  };

  const onSave = () => {
    if (!trigger) {
      setError('');
      props.onSave();
    }
    const triggers = trigger.split('_');
    const eachTriggerHasPair = triggers.every(x => x.split(':').length === 2);
    const keys = triggers.map(x => x.split(':')[0]);
    const eachKeyIsCorrect = keys.every(x => Object.values(TriggerType).includes(x as TriggerType));
    if (!eachTriggerHasPair || !eachKeyIsCorrect) {
      setError('Invalid trigger!');
    } else {
      setError('');
      props.onSave(trigger);
    }
  };

  return (
    <Modal
      toggle={() => props.onClose()}
      isOpen={props.open}
      className='trigger-editor-modal'
    >
      <ModalHeader toggle={() => props.onClose()}>
        Trigger Editor
      </ModalHeader>
      <ModalBody>
        {Object.values(TriggerType).map(triggerType =>
          <Button className='trigger-button' onClick={() => onAddTriggerPlaceholder(triggerType)}>{triggerType}</Button>
        )}
        <Input
          placeholder='trigger1-key:trigger1-data_trigger2-key:trigger2-data'
          type='textarea'
          value={trigger}
          onChange={e => setTrigger(e.target.value)}
        />
        <div className='margined-top in-row spaced-between'>
          <Button onClick={() => props.onClose()}>Close</Button>
          <Button onClick={onSave} color='success'>Save</Button>
        </div>
        {error &&
          <Alert color='danger' className='trigger-alert'>
            {error}
          </Alert>
        }
      </ModalBody>
    </Modal>
  );
}