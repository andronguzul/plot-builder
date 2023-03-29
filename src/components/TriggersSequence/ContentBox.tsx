import { useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import { TriggerInfo } from './ImportBox/ImportBox';

export interface TriggersSequenceContentBoxProps {
  triggers: TriggerInfo[];
  onImport: Function;
}

export const TriggersSequenceContentBox = (props: TriggersSequenceContentBoxProps) => {
  const [search, setSearch] = useState('');

  const triggers = search ? props.triggers.filter(x => x.chatName.includes(search)) : props.triggers;

  return (
    <div className='content-box'>
      <div className='content-box-header'>
        <Button onClick={() => props.onImport()}>Reimport</Button>
      </div>
      <div>
        <Input
          placeholder='search...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <thead className='content-box-table-header'>
          <tr>
            <th>#</th>
            <th>Chat Name</th>
            <th>Trigger</th>
          </tr>
        </thead>
        <tbody>
          {triggers.map((triggerInfo) =>
            <>
              <tr className='table-dark'>
                <th />
                <th>{triggerInfo.chatName}</th>
                <th />
              </tr>
              {triggerInfo.triggers.map((trigger, indx) =>
                <tr className='table-dark'>
                  <th>{indx + 1}</th>
                  <th />
                  <th>{trigger}</th>
                </tr>
              )}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
}