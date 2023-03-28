import { ListGroup, ListGroupItem } from 'reactstrap';
import { ImportBoxContentHeader } from './ImportBoxContentHeader';
import { ImportResult } from './ImportStep';

export interface VerifyStepProps {
  data: ImportResult[];
  firstChat: string;
  onBack: Function;
  onSubmit: Function;
  onCancel: Function;
}

export const VerifyStep = (props: VerifyStepProps) => {
  return (
    <div>
      <ImportBoxContentHeader
        title='Verify Data'
        onCancel={props.onCancel}
        onBack={props.onBack}
        onSubmit={props.onSubmit}
      />
      <ListGroup className='margined-top'>
        {props.data.map(item =>
          <ListGroupItem
            key={item.fileName}
            active={item.fileName === props.firstChat}
          >
            {item.fileName}
          </ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
};