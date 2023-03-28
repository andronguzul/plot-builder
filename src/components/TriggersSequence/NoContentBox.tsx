import { Button } from 'reactstrap';

export interface TriggersSequenceNoContentBoxProps {
  onImport: Function;
}

export const TriggersSequenceNoContentBox = (props: TriggersSequenceNoContentBoxProps) => (
  <div className='no-content-box'>
    <Button color='success' onClick={() => props.onImport()}>Import</Button>
  </div>
);