import { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export interface ICleanButtonProps {
  onClean: Function;
}

export const CleanButton = (props: ICleanButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} color='secondary'>
        Clean
      </Button>
      <Modal
        toggle={() => setShowModal(false)}
        isOpen={showModal}
        className='close-button-modal'
      >
        <ModalHeader toggle={() => setShowModal(false)}>
          Clean data
        </ModalHeader>
        <ModalBody>
          Are you sure you want to clean the data?
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => setShowModal(false)}>
            No
          </Button>{' '}
          <Button color='primary' onClick={() => {
            props.onClean();
            setShowModal(false);
          }}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};