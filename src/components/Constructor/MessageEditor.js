import { useEffect, useState } from 'react';
import {
  Accordion, AccordionBody, AccordionHeader,
  AccordionItem, Button, Card, Dropdown, DropdownItem,
  DropdownMenu, DropdownToggle, Input, Label
} from 'reactstrap';

function MessageEditor(props) {
  const [message, setMessage] = useState(props.data.text || '');
  const [possibleAnswers, setPossibleAnswers] = useState(props.data.possible_answers || []);
  const [author, setAuthor] = useState(props.data.author || props.members[0]);
  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);
  const [openedForks, setOpenedForks] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);

  const onSubmit = () => {
    const result = {
      ...props.data,
      text: message,
      author,
    };
    if (possibleAnswers.length) {
      result.possible_answers = possibleAnswers;
    }
    props.onSubmit(result);
  };

  useEffect(() => {
    if (!message || !author) return setCanSubmit(false);
    if (possibleAnswers.length) {
      for (const answer of possibleAnswers) {
        if (!answer.text) return setCanSubmit(false);
        if (!answer.fork) continue;
        for (const subMessage of answer.fork) {
          if (!subMessage.text || !subMessage.author) return setCanSubmit(false);
        }
      }
    }
    setCanSubmit(true);
  }, [message, author, possibleAnswers]);

  useEffect(() => {
    if (!author && props.members.length) setAuthor(props.members[0]);
    else if (author && !props.members.includes(author)) setAuthor();
  }, [props.members, author]);

  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };

  const onAddEmptyPossibleAnswer = () => {
    setPossibleAnswers([
      ...possibleAnswers,
      { text: '' }
    ]);
  };

  const onPossibleAnswerTextChange = (e, indx) => {
    const answers = [...possibleAnswers];
    answers[indx].text = e.target.value;
    setPossibleAnswers(answers);
  };

  const onPossibleAnswerForkChange = (e, indx) => {
    const answers = [...possibleAnswers];
    answers[indx].fork = e.target.checked ? [{}] : undefined;
    setPossibleAnswers(answers);
  };

  const onRemovePossibleAnswer = (indx) => {
    const answers = [...possibleAnswers];
    answers.splice(indx, 1);
    setPossibleAnswers(answers);
  };

  const onToggleAccordion = (targetId) => {
    const opened = [...openedForks];
    if (opened.includes(targetId)) {
      opened.splice(opened.indexOf(targetId), 1);
    } else {
      opened.push(targetId);
    }
    setOpenedForks(opened);
  };

  const onAddMessageToFork = (indx) => {
    const possibleAnswersToMutate = [...possibleAnswers];
    possibleAnswersToMutate[indx].fork.push({});
    setPossibleAnswers(possibleAnswersToMutate);
  };

  const onRemoveMessageFromFork = (indx) => {
    const possibleAnswersToMutate = [...possibleAnswers];
    possibleAnswersToMutate[indx].fork.splice(possibleAnswersToMutate[indx].fork.length - 1, 1);
    setPossibleAnswers(possibleAnswersToMutate);
  };

  const onSubmitForkMessage = (answerIndx, messageIndx, message) => {
    const possibleAnswersToMutate = [...possibleAnswers];
    possibleAnswers[answerIndx].fork[messageIndx] = message;
    setPossibleAnswers(possibleAnswersToMutate);
    onToggleAccordion(answerIndx.toString() + messageIndx.toString());
  };

  return (
    <AccordionItem className='message'>
      <AccordionHeader targetId={props.targetId} className='header'>
        {message.slice(0, 100)}
      </AccordionHeader>
      <AccordionBody accordionId={props.targetId} className='editor'>
        {props.replyToAnswer &&
          <div className='margined-bottom'>
            <i>Reply to:</i>{' ' + props.replyToAnswer}
          </div>
        }
        <div className='in-row spaced-between'>
          <div className='in-row'>
            <span className='margined-right'>Author*:</span>
            <Dropdown
              toggle={() => setAuthorDropdownOpen(!authorDropdownOpen)}
              isOpen={authorDropdownOpen}
              disabled={!props.members.length}
            >
              <DropdownToggle caret>
                {author}
              </DropdownToggle>
              <DropdownMenu>
                {props.members.map(member =>
                  <DropdownItem key={member} onClick={() => setAuthor(member)}>
                    {member}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
          <Button color='success' onClick={onSubmit} disabled={!canSubmit}>Submit</Button>
        </div>
        <Label className='margined-top'>Message*:</Label>
        <Input
          placeholder='message'
          value={message}
          onChange={onMessageUpdate}
          type='textarea'
          className='input-area'
        />
        <div className='in-row margined-top'>
          <span className='margined-right'>Possible answers:</span>
          <Button onClick={onAddEmptyPossibleAnswer}>Add</Button>
        </div>
        <div className='possible-answers margined-top'>
          {possibleAnswers.map((answer, indx) =>
            <Card key={indx} className={'possible-answer-card ' + (indx ? 'margined-top' : '')}>
              <Input
                placeholder='answer'
                value={answer.text}
                onChange={e => onPossibleAnswerTextChange(e, indx)}
                type='textarea'
              />
              <div className='margined-top in-row spaced-between'>
                <div>
                  <Input
                    type='checkbox'
                    checked={!!answer.fork}
                    onChange={e => onPossibleAnswerForkChange(e, indx)}
                  />
                  {' '}
                  <Label>
                    Fork
                  </Label>
                </div>
                <Button color='danger' onClick={() => onRemovePossibleAnswer(indx)}>Remove</Button>
              </div>
            </Card>
          )}
        </div>
        {possibleAnswers.map((answer, answerIndx) => answer.fork &&
          <div key={answerIndx}>
            <Accordion open={openedForks} toggle={onToggleAccordion} className='margined-top'>
              {answer.fork.map((forkMessage, messageIndx) =>
                <MessageEditor
                  members={props.members}
                  key={messageIndx}
                  data={forkMessage}
                  replyToAnswer={answer.text}
                  onSubmit={(message) => onSubmitForkMessage(answerIndx, messageIndx, message)}
                  targetId={answerIndx.toString() + messageIndx.toString()}
                />
              )}
            </Accordion>
            <Button onClick={() => onAddMessageToFork(answerIndx)} className='margined-top margined-right'>Add</Button>
            <Button onClick={() => onRemoveMessageFromFork(answerIndx)} className='margined-top'>Remove</Button>
          </div>
        )}
      </AccordionBody>
    </AccordionItem>
  )
}

export default MessageEditor;