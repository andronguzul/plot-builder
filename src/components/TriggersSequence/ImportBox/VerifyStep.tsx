import { useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { ImportBoxContentHeader } from './ImportBoxContentHeader';
import { ImportResult } from './ImportStep';

export interface VerifyStepProps {
  data: ImportResult[];
  onBack: Function;
  onSubmit: Function;
  onCancel: Function;
}

export const VerifyStep = (props: VerifyStepProps) => {
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const onSubmit = () => {
    setSubmitDisabled(true);
    props.onSubmit();
  };

  return (
    <div>
      <ImportBoxContentHeader
        title='Verify Data'
        onCancel={props.onCancel}
        onBack={props.onBack}
        onSubmit={onSubmit}
        submitDisabled={submitDisabled}
      />
      <ListGroup className='margined-top'>
        {props.data.map(item =>
          <ListGroupItem
            key={item.fileName}
          >
            {item.fileName}
          </ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
};