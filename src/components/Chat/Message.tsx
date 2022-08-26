import { Button, ButtonGroup, Input } from 'reactstrap';
import { PLAYER } from '../../types';

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
  selectionMode: boolean;
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
    const marginSuffix = (props.someClicked && !props.thisClicked && !props.selectionMode) ? 'margined-right' : ''
    dataItemSuffix = props.dataItemsLength! > 1 ? `data-item ${selectedSuffix} ${listSuffix} ${listItemSuffix} ${marginSuffix}` : '';
  }

  const onClickMessage = () => {
    if (isPlayerMessage && !props.isSelected) {
      props.onSelectDataItem!();
    }
    props.onClick();
  };

  return (
    <div className={`message-container ${playerSuffix} ${dataItemSuffix}`}>
      {props.selectionMode ?
        <Input type='checkbox' className='message-checkbox' /> :
        props.thisClicked &&
        <div className='add-actions'>
          {isPlayerMessage &&
            <div className='add-button' onClick={() => props.onAddDataItem!()}>﬩</div>
          }
          <div className='add-button' onClick={() => props.onAddMessage()}>＋</div>
        </div>
      }
      <div className={`message ${playerSuffix} ${dataItemSuffix}`} onClick={onClickMessage}>
        <div className='message-author'>{props.author}</div>
        <div className={`message-text ${props.text ? '' : 'empty'}`}>{props.text || 'Write a message...'}</div>
      </div>
      {!props.selectionMode && props.thisClicked &&
        <ButtonGroup className='message-actions'>
          <Button onClick={() => props.onEdit()}>Edit</Button>
          {isPlayerMessage && <Button onClick={() => props.onFork!()}>Fork</Button>}
          <Button onClick={() => props.onRemove()} color='danger'>Remove</Button>
        </ButtonGroup>
      }
    </div>
  );
}