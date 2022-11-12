import { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { IParsedTrigger, ParsedTriggerList, TriggerType } from '../../types/trigger-editor';

export interface TriggerEditorModalProps {
  onSave: Function;
  onClose: Function;
  open: boolean;
  trigger: string;
}

export const TriggerEditorModal = (props: TriggerEditorModalProps) => {
  const [triggers, setTriggers] = useState<IParsedTrigger[]>([]);

  useEffect(() => {
    if (props.trigger) {
      setTriggers(ParsedTriggerList.parseRawTrigger(props.trigger));
    }
  }, [props.trigger]);

  const onChangeTriggerType = (e: React.ChangeEvent<HTMLInputElement>, triggerType: TriggerType) => {
    const checked = e.target.checked;
    if (checked && !ParsedTriggerList.includes(triggers, triggerType)) {
      setTriggers(ParsedTriggerList.add(triggers, triggerType));
    } else if (!checked && ParsedTriggerList.includes(triggers, triggerType)) {
      setTriggers(ParsedTriggerList.remove(triggers, triggerType));
    }
  };

  const onTriggerValueChange = (e: React.ChangeEvent<HTMLInputElement>, triggerType: TriggerType) => {
    setTriggers(ParsedTriggerList.changeValue(triggers, triggerType, e.target.value));
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
        {Object.values(TriggerType).map(triggerType => {
          const triggerValue = ParsedTriggerList.getValue(triggers, triggerType);
          return (
            <div className='trigger-item'>
              <div>
                <Input
                  className='trigger-item-checkbox'
                  type='checkbox'
                  checked={triggerValue !== null}
                  onChange={(e) => onChangeTriggerType(e, triggerType)}
                />{' '}
                {triggerType}
              </div>
              <Input
                className='trigger-item-value'
                placeholder='value'
                disabled={triggerValue === null}
                value={triggerValue || ''}
                onChange={e => onTriggerValueChange(e, triggerType)}
              />
            </div>
          );
        })}
        <div className='margined-top in-row spaced-between'>
          <Button onClick={() => props.onClose()}>Close</Button>
          <Button onClick={() => props.onSave(ParsedTriggerList.getRawTrigger(triggers))} color='success'>Save</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}