import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Input } from 'reactstrap';
import { ILanguage, Language } from '../../types';
import { IBaseTrigger } from '../../types/audio';

export interface TriggerDataProps<T> {
  list: T[];
  opened: string[];
  accordionUpdateFn: Function;
  listUpdateFn: Function;
  onAddItem: T;
}

export const TriggerData = <T extends IBaseTrigger & ILanguage & Record<keyof T, string>>(props: TriggerDataProps<T>) => {
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
    for (const key of (Object.keys(props.onAddItem) as (keyof T)[])) {
      data[key] = props.onAddItem[key];
    }
    dataToMutate.push(data as T);
    props.listUpdateFn(dataToMutate);
  };

  const onChangeListItem = (trigger: string, key: keyof T, value: string) => {
    const dataToMutate = [...props.list];
    const item = dataToMutate.find(x => x.trigger === trigger);
    if (!item) return;
    const indx = dataToMutate.indexOf(item);
    dataToMutate[indx][key] = value as T[keyof T];
    props.listUpdateFn(dataToMutate);
  };

  const onRemoveListItem = (trigger: string) => {
    const dataToMutate = [...props.list];
    const item = dataToMutate.find(x => x.trigger === trigger);
    if (!item) return;
    const indx = dataToMutate.indexOf(item);
    dataToMutate.splice(indx, 1);
    props.listUpdateFn(dataToMutate);
  };

  const getKeys = (item: T, languageKeys: boolean): (keyof T)[] => {
    return (Object.keys(item) as (keyof T)[]).filter(key => {
      const includes = Object.values(Language).includes(key as Language);
      if (languageKeys) return includes;
      return !includes;
    });
  };

  return (
    <>
      <Accordion open={props.opened} {...{ toggle: (id: string) => onToggleAccordion(id) }}>
        {props.list.map((item, indx) =>
          <AccordionItem key={indx}>
            <AccordionHeader targetId={indx.toString()}>{item.trigger}</AccordionHeader>
            <AccordionBody accordionId={indx.toString()}>
              <div className='trigger-container'>
                {getKeys(item, false).map(key =>
                  <Input
                    key={key.toString()}
                    placeholder='trigger value'
                    className='margined-right'
                    value={item[key]}
                    onChange={(e) => onChangeListItem(item.trigger, key, e.target.value)}
                  />
                )}
                <Button
                  color='danger'
                  onClick={() => onRemoveListItem(item.trigger)}
                >Remove</Button>
              </div>
              <div className='text-container'>
                {getKeys(item, true).map(key =>
                  <Input
                    key={key.toString()}
                    type='textarea'
                    placeholder={`${key.toString()} info`}
                    value={item[key]}
                    onChange={(e) => onChangeListItem(item.trigger, key, e.target.value)}
                    className='lang-container'
                  />
                )}
              </div>
            </AccordionBody>
          </AccordionItem>
        )}
      </Accordion>
      <Button color='success' className='margined-top' onClick={onAddListItem}>Add</Button>
    </>
  );
};