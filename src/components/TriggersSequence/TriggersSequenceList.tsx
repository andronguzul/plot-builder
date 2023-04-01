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
          const sorted = ParsedTriggerList.sortTriggers(parsed);
          return (
            <>
              {sorted.map(x =>
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
                    {trigger.fork.map((forkItem, indx) => {
                      const parsed = ParsedTriggerList.parseRawTrigger(forkItem.triggers[0].value!);
                      const sorted = ParsedTriggerList.sortTriggers(parsed);
                      return (
                        <Button onClick={() => setSelectedForkItem(forkItem)}>{sorted[0].value}</Button>
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