import { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';

export interface MembersProps {
  members: string[];
  onClose: Function;
  onSave: Function;
  open: boolean
}

export const Members = (props: MembersProps) => {
  const [members, setMembers] = useState(props.members || []);

  useEffect(() => {
    setMembers(props.members || []);
  }, [props.members]);

  const onClose = () => {
    setMembers(props.members || []);
    props.onClose();
  };

  const onSave = () => {
    props.onSave(members);
  };

  const onAddMember = () => {
    setMembers([...members, '']);
  };

  const onRemoveMember = (indx: number) => {
    const membersToMutate = [...members];
    membersToMutate.splice(indx, 1);
    setMembers(membersToMutate);
  };

  const onEditMember = (e: React.ChangeEvent<HTMLInputElement>, indx: number) => {
    const membersToMutate = [...members];
    membersToMutate[indx] = e.target.value;
    setMembers(membersToMutate);
  }

  return (
    <Modal
      toggle={onClose}
      isOpen={props.open}
      className='members'
    >
      <ModalHeader toggle={onClose}>
        Members
      </ModalHeader>
      <ModalBody>
        {members.map((member, indx) =>
          <Card key={indx} className={'member-card ' + (indx ? 'margined-top' : '')}>
            <div className='in-row spaced-between'>
              <Input
                placeholder='member'
                value={member}
                onChange={e => onEditMember(e, indx)}
                className='margined-right'
              />
              <Button color='danger' onClick={() => onRemoveMember(indx)}>Remove</Button>
            </div>
          </Card>
        )}
        <div className='margined-top in-row spaced-between'>
          <Button onClick={onAddMember}>Add</Button>
          <Button onClick={onSave} color='success'>Save</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default Members;