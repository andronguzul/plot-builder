import { useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { ParsedTriggerList } from '../../types';
import { TriggersSequence } from '../../types/triggers-sequence';
import { ForkIcon } from '../ForkIcon';

export interface TriggersSequenceProps {
  sequence: TriggersSequence;
}

export const TriggersSequenceList = (props: TriggersSequenceProps) => {
  const [selectedForkItem, setSelectedForkItem] = useState<TriggersSequence>();

  return (
    <>
      {props.sequence.triggers.map(trigger => {
        if (trigger.value) {
          const parsed = ParsedTriggerList.parseRawTrigger(trigger.value);
          return (
            <>
              {parsed.map(x =>
                <tr>
                  <th>{x.key}</th>
                  <th>{x.value}</th>
                </tr>
              )}
            </>
          )
        } else if (trigger.fork) {
          return (
            <>
              <tr>
                <th className='fork-container'>
                  <ForkIcon />
                </th>
                <th>
                  <ButtonGroup>
                    {trigger.fork.map(forkItem => {
                      const parsed = ParsedTriggerList.parseRawTrigger(forkItem.triggers[0].value!);
                      return (
                        <Button onClick={() => setSelectedForkItem(forkItem)}>{parsed[0].value}</Button>
                      );
                    })}
                  </ButtonGroup>
                </th>
              </tr>
              {selectedForkItem &&
                <TriggersSequenceList sequence={selectedForkItem} />
              }
            </>
          );
        }
        return <></>;
      })}
    </>
  )
}