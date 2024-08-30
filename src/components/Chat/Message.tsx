import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import { MessageType, PLAYER } from '../../types';
import { TriggerEditorModal } from './TriggerEditorModal';

export interface MessageProps {
  text?: string;
  author: string;
  type: MessageType;
  onEdit: Function;
  onSelectDataItem?: Function;
  isSelected?: boolean;
  dataItemIndx?: number;
  dataItemsLength?: number;
  onClick: Function;
  thisClicked?: boolean;
  someClicked?: boolean;
  onAddDataItem?: Function;
  onAddMessage: Function;
  onFork?: Function;
  onRemove: Function;
  restructurePhase: number;
  existsInRestructureFromData: boolean;
  restructureFromDataCanBeChanged: boolean;
  onRestructureFromDataChange: Function;
  isRestructureToData: boolean;
  trigger?: string;
  onTriggerChange: Function;
  longestMessage?: React.RefObject<HTMLDivElement>;
  isTheLongestMessage?: boolean;
  onMessageDivLengthChange?: Function;
  forkVisible?: boolean;
  onSwitchForkVisibility: Function;
}

export const Message = (props: MessageProps) => {
  const [triggerOpen, setTriggerOpen] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.dataItemsLength && props.dataItemsLength > 1) {
      props.onMessageDivLengthChange?.(messageRef, props.text);
    }
  }, [props.text]);

  const isPlayerMessage = props.author === PLAYER;
  let dataItemSuffix = '';
  if (isPlayerMessage) {
    const listSuffix = props.dataItemsLength ? 'list' : '';
    let listItemSuffix = '';
    if (props.dataItemsLength) {
      if (props.dataItemIndx === 0) listItemSuffix = 'first';
      else if (props.dataItemIndx === props.dataItemsLength - 1) listItemSuffix = 'last';
    }
    const selectedSuffix = props.isSelected ? '' : 'not-selected';
    let marginSuffix = (props.someClicked && !props.thisClicked) ? 'margined-right' : '';
    if (props.restructurePhase === 1) {
      marginSuffix = (!isPlayerMessage || props.dataItemIndx === 0) ? '' : 'restructure-margin';
    }
    dataItemSuffix = props.dataItemsLength! > 1 ? `data-item ${selectedSuffix} ${listSuffix} ${listItemSuffix} ${marginSuffix}` : '';
  }
  const restructureToDataSuffix = props.isRestructureToData ? 'restructure-to-data' : '';

  const onClickMessage = () => {
    if (isPlayerMessage && !props.isSelected) {
      props.onSelectDataItem!();
    }
    props.onClick();
  };

  const onSubmitTriggerValue = (triggerValue?: string) => {
    props.onTriggerChange(triggerValue);
    setTriggerOpen(false);
  };

  return (
    <>
      <div className={`message-container ${dataItemSuffix}`}>
        {props.restructurePhase === 1 ?
          (!isPlayerMessage || props.dataItemIndx === 0) &&
          <Input
            type='checkbox'
            className='message-checkbox'
            onChange={(e) => props.onRestructureFromDataChange?.(e.target.checked)}
            disabled={!props.restructureFromDataCanBeChanged}
            checked={props.existsInRestructureFromData}
          /> :
          props.thisClicked &&
          <div className='add-actions'>
            {isPlayerMessage &&
              <div className='add-button' onClick={() => props.onAddDataItem!()}>﬩</div>
            }
            <div className='add-button' onClick={() => props.onAddMessage()}>＋</div>
          </div>
        }
        <div
          className={`message ${restructureToDataSuffix} ${dataItemSuffix}`}
          onClick={onClickMessage}
          ref={messageRef}
          style={(props.longestMessage && !props.isTheLongestMessage) ? { width: props.longestMessage.current?.getBoundingClientRect().width } : {}}
        >
          <div className='message-author'>{props.author}</div>
          <div
            className={`message-text ${props.text ? '' : 'empty'} ${props.type === MessageType.File ? 'file' : ''}`}
          >{props.text || 'Write a message...'}</div>
        </div>
        {!props.restructurePhase && props.thisClicked &&
          <ButtonGroup className='message-actions'>
            <Button onClick={() => props.onEdit()}>Edit</Button>
            {isPlayerMessage && <Button onClick={() => props.onFork!()}>Fork</Button>}
            <Button onClick={() => setTriggerOpen(true)}>Trigger Editor</Button>
            <Button onClick={() => props.onSwitchForkVisibility()}>{props.forkVisible ? 'Hide' : 'Show'}</Button>
            <Button onClick={() => props.onRemove()} color='danger'>Remove</Button>
          </ButtonGroup>
        }
        {props.trigger &&
          <div className='trigger'>
            {props.trigger}
          </div>
        }
      </div>
      <TriggerEditorModal
        open={triggerOpen}
        onClose={() => setTriggerOpen(false)}
        onSave={onSubmitTriggerValue}
        trigger={props.trigger || ''}
      />
    </>
  );
}