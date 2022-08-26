import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export interface AuthorSelectorModalProps {
  onSelectAuthor: Function;
  onClose: Function;
  open: boolean;
  members: string[];
}

export const AuthorSelectorModal = (props: AuthorSelectorModalProps) => {
  const onListItemClick = (member: string) => {
    props.onSelectAuthor(member);
    props.onClose();
  };

  return (
    <Modal
      toggle={() => props.onClose}
      isOpen={props.open}
      className='member-selector-modal'
    >
      <ModalHeader toggle={() => props.onClose}>
        Members
      </ModalHeader>
      <ModalBody>
        {props.members.map((member, indx) =>
          <div className='list-item' key={indx} onClick={() => onListItemClick(member)}>
            {member}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}