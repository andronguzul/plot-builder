import { ListGroup, ListGroupItem } from 'reactstrap';
import { ImportBoxContentHeader } from './ImportBoxContentHeader';
import { ImportResult } from './ImportStep';

export interface SelectFirstChatStepProps {
  data: ImportResult[];
  firstChat: string;
  onNext: Function;
  onBack: Function;
  onSelect: Function;
  onCancel: Function;
}

export const SelectFirstChatStep = (props: SelectFirstChatStepProps) => {
  return (
    <div>
      <ImportBoxContentHeader
        title='Select First Chat'
        onNext={props.onNext}
        nextDisabled={!props.firstChat}
        onBack={props.onBack}
        onCancel={props.onCancel}
      />
      <ListGroup className='margined-top'>
        {props.data.map(item =>
          <ListGroupItem
            key={item.fileName}
            active={item.fileName === props.firstChat}
            onClick={() => props.onSelect(item.fileName)}
            className='selectable-list-group-item'
          >
            {item.fileName}
          </ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
};