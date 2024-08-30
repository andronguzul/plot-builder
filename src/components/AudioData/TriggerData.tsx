import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Input } from 'reactstrap';
import { IAudio } from '../../types/audio';

export interface TriggerDataProps<T> {
  list: T[];
  opened: string[];
  accordionUpdateFn: Function;
  listUpdateFn: Function;
  newItem: T;
}

export const TriggerData = <T extends IAudio>(props: TriggerDataProps<T>) => {
  const onToggleAccordion = (id: string) => {
    const dataToMutate = [...props.opened];
    if (dataToMutate.includes(id)) {
      dataToMutate.splice(dataToMutate.indexOf(id), 1);
    } else {
      dataToMutate.push(id);
    }
    props.accordionUpdateFn(dataToMutate);
  };

  const onAddListItem = () => {
    if (props.list.some(x => !x.trigger)) return;
    const dataToMutate = [...props.list];
    const data: Partial<T> = {};
    for (const key of (Object.keys(props.newItem) as (keyof T)[])) {
      data[key] = props.newItem[key];
    }
    dataToMutate.push(data as T);
    props.listUpdateFn(dataToMutate);
  };

  const onChangeListItem = (indx: number, key: keyof T, value: string) => {
    const dataToMutate = [...props.list];
    dataToMutate[indx][key] = value as T[keyof T];
    props.listUpdateFn(dataToMutate);
  };

  const onRemoveListItem = (indx: number) => {
    const dataToMutate = [...props.list];
    dataToMutate.splice(indx, 1);
    props.listUpdateFn(dataToMutate);
  };

  return (
    <>
      <Accordion open={props.opened} {...{ toggle: (id: string) => onToggleAccordion(id) }}>
        {props.list.map((item, indx) =>
          <AccordionItem key={indx}>
            <AccordionHeader targetId={indx.toString()}>{item.trigger}</AccordionHeader>
            <AccordionBody accordionId={indx.toString()}>
              <div className='trigger-container'>
                <Input
                  placeholder={`trigger value`}
                  className='margined-right'
                  value={item.trigger}
                  onChange={(e) => onChangeListItem(indx, 'trigger', e.target.value)}
                />
                <Input
                  placeholder={`clipName value`}
                  className='margined-right'
                  value={item.clipName}
                  onChange={(e) => onChangeListItem(indx, 'clipName', e.target.value)}
                />
                <Button
                  color='danger'
                  onClick={() => onRemoveListItem(indx)}
                >Remove</Button>
              </div>
              <div className='text-container'>
                <Input
                  type='textarea'
                  placeholder={`text value`}
                  value={item.text}
                  onChange={(e) => onChangeListItem(indx, 'text', e.target.value)}
                  className='lang-container'
                />
              </div>
            </AccordionBody>
          </AccordionItem>
        )}
      </Accordion>
      <Button color='success' className='margined-top' onClick={onAddListItem}>Add</Button>
    </>
  );
};