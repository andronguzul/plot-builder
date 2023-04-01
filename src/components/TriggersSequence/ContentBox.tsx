import { Button, Table } from 'reactstrap';
import { TriggersSequence, } from '../../types/triggers-sequence';
import { TriggersSequenceList } from './TriggersSequenceList';

export interface TriggersSequenceContentBoxProps {
  sequence: TriggersSequence;
  onImport: Function;
}

export const TriggersSequenceContentBox = (props: TriggersSequenceContentBoxProps) => {
  return (
    <div className='content-box'>
      <div className='content-box-header'>
        <Button onClick={() => props.onImport()}>Reimport</Button>
      </div>
      <Table dark>
        <thead>
          <tr>
            <th>Trigger Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <TriggersSequenceList
            sequence={props.sequence}
          />
        </tbody>
      </Table>
    </div>
  );
}