import React from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { ImportBoxContentHeader } from './ImportBoxContentHeader';

export interface ImportStepProps {
  data: ImportResult[];
  onNext: Function;
  onImport: Function;
  onCancel: Function;
}

export interface ImportResult {
  fileName: string;
  data: string;
}

export const ImportStep = (props: ImportStepProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<ImportResult[]> => {
    if (!e.target.files) return [];
    const tasks: Promise<ImportResult>[] = [];
    for (const file of e.target.files) {
      tasks.push(new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = e => {
          try {
            const loaded = e.target?.result as string;
            if (loaded) res({
              fileName: file.name,
              data: loaded
            });
            else {
              console.error('Empty or non-string data');
            }
          } catch (e) {
            console.error('Invalid file provided', e);
          }
        };
      }));
    }
    return Promise.all(tasks);
  };

  const onImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = await onImport(e);
    props.onImport(data);
  };

  return (
    <div>
      <ImportBoxContentHeader
        title='Import Content'
        onNext={props.onNext}
        nextDisabled={!props.data.length}
        onCancel={props.onCancel}
      />
      <div className='import-step'>
        {props.data.length ?
          <div>
            <Button
              onClick={() => hiddenFileInput.current?.click()}
              className='margined-bottom'
            >Reimport</Button>
            <ListGroup>
              {props.data.map(item =>
                <ListGroupItem key={item.fileName}>
                  {item.fileName}
                </ListGroupItem>
              )}
            </ListGroup>
          </div> :
          <div className='no-data' onClick={() => hiddenFileInput.current?.click()}>
            Click anywhere in the box to open file explorer
          </div>
        }
      </div>
      <input
        type='file'
        ref={hiddenFileInput}
        onChange={onImportData}
        className='hidden'
        accept='.json'
        multiple
      />
    </div>
  );
};