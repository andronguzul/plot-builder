import { Button, ButtonGroup, Input } from 'reactstrap';
import { IMessage, PLAYER } from '../../types';

export interface MessageProps {
  text?: string;
  author: string;
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
}

export const Message = (props: MessageProps) => {
  const isPlayerMessage = props.author === PLAYER;
  const playerSuffix = isPlayerMessage ? 'player' : '';
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

  return (
    <div className={`message-container ${playerSuffix} ${dataItemSuffix}`}>
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
      <div className={`message ${playerSuffix} ${restructureToDataSuffix} ${dataItemSuffix}`} onClick={onClickMessage}>
        <div className='message-author'>{props.author}</div>
        <div className={`message-text ${props.text ? '' : 'empty'}`}>{props.text || 'Write a message...'}</div>
      </div>
      {!props.restructurePhase && props.thisClicked &&
        <ButtonGroup className='message-actions'>
          <Button onClick={() => props.onEdit()}>Edit</Button>
          {isPlayerMessage && <Button onClick={() => props.onFork!()}>Fork</Button>}
          <Button onClick={() => props.onRemove()} color='danger'>Remove</Button>
        </ButtonGroup>
      }
    </div>
  );
}