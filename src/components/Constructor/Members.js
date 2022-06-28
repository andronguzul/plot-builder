import { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';

function Members(props) {
  const [members, setMembers] = useState(props.members || []);

  useEffect(() => {
    setMembers(props.members || []);
  }, [props.members]);

  const onClose = () => {
    setMembers([]);
    props.onClose();
  };

  const onSave = () => {
    props.onClose(members);
  };

  const onAddMember = () => {
    setMembers([...members, '']);
  };

  const onRemoveMember = (indx) => {
    const membersToMutate = [...members];
    membersToMutate.splice(indx, 1);
    setMembers(membersToMutate);
  };

  const onEditMember = (e, indx) => {
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
      <ModalBody className='members-content'>
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