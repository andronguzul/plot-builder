import { Button, Table } from "reactstrap";

export interface TriggersSequenceContentBoxProps {
  triggers: string[];
  onImport: Function;
}

export const TriggersSequenceContentBox = (props: TriggersSequenceContentBoxProps) => (
  <div className='content-box'>
    <div className='content-box-header'>
      <Button onClick={() => props.onImport()}>Reimport</Button>
    </div>
    <Table>
      <thead className='content-box-table-header'>
        <tr>
          <th>#</th>
          <th>Trigger</th>
        </tr>
      </thead>
      <tbody>
        {props.triggers.map((trigger, indx) =>
          <tr className='table-dark'>
            <th>{indx}</th>
            <th>{trigger}</th>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
);