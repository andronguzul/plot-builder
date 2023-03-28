import { useSearchParams } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import { TriggersSequenceContent } from '../components/TriggersSequence/Content';

export const TriggersSequencePage = () => {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className='triggers-sequence-page'>
      <div className='header'>
        <ButtonGroup>
          <Button onClick={() => {
            setSearchParams({
              page: '1',
            });
          }}>Chat</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '2',
            });
          }}>Audio</Button>
        </ButtonGroup>
      </div>
      <TriggersSequenceContent />
    </div>
  );
}