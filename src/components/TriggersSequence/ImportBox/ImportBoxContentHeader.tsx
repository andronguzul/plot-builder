import { Button, ButtonGroup } from 'reactstrap';

export interface ImportBoxContentHeaderProps {
  title: string;
  onNext?: Function;
  onCancel: Function;
  onBack?: Function;
  onSubmit?: Function;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
}

export const ImportBoxContentHeader = (props: ImportBoxContentHeaderProps) => {
  return (
    <div className='import-box-content-header'>
      <div className='import-box-content-header-title'>
        {props.title}
      </div>
      <ButtonGroup>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
        {props.onBack && <Button onClick={() => props.onBack?.()}>Back</Button>}
        {props.onNext && <Button onClick={() => props.onNext?.()} disabled={props.nextDisabled}>Next</Button>}
        {props.onSubmit && <Button onClick={() => props.onSubmit?.()} disabled={props.submitDisabled}>Submit</Button>}
      </ButtonGroup>
    </div>
  );
};