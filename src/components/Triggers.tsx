import { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';

export interface TriggersProps {
  triggers: string[];
  onClose: Function;
  onSave: Function;
  open: boolean
}

export const Triggers = (props: TriggersProps) => {
  const [triggers, setTriggers] = useState(props.triggers || []);

  useEffect(() => {
    setTriggers(props.triggers || []);
  }, [props.triggers]);

  const onClose = () => {
    setTriggers(props.triggers || []);
    props.onClose();
  };

  const onSave = () => {
    props.onSave(triggers);
  };

  const onAddTrigger = () => {
    setTriggers([...triggers, '']);
  };

  const onRemoveTrigger = (indx: number) => {
    const triggersToMutate = [...triggers];
    triggersToMutate.splice(indx, 1);
    setTriggers(triggersToMutate);
  };

  const onEditTrigger = (e: React.ChangeEvent<HTMLInputElement>, indx: number) => {
    const triggersToMutate = [...triggers];
    triggersToMutate[indx] = e.target.value;
    setTriggers(triggersToMutate);
  }

  return (
    <Modal
      toggle={onClose}
      isOpen={props.open}
      className='triggers'
    >
      <ModalHeader toggle={onClose}>
        Triggers to start the chat 
      </ModalHeader>
      <ModalBody>
        {triggers.map((trigger, indx) =>
          <Card key={indx} className={'trigger-card ' + (indx ? 'margined-top' : '')}>
            <div className='in-row spaced-between'>
              <Input
                placeholder='trigger'
                value={trigger}
                onChange={e => onEditTrigger(e, indx)}
                className='margined-right'
              />
              <Button color='danger' onClick={() => onRemoveTrigger(indx)}>Remove</Button>
            </div>
          </Card>
        )}
        <div className='margined-top in-row spaced-between'>
          <Button onClick={onAddTrigger}>Add</Button>
          <Button onClick={onSave} color='success'>Save</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default Triggers;