import { Button, ListGroup, ListGroupItem } from 'reactstrap';

function ContactChats() {
  return (
    <div>
      <ListGroup className='chats'>
        <ListGroupItem>
          Cras justo odio
        </ListGroupItem>
        <ListGroupItem>
          Dapibus ac facilisis in
        </ListGroupItem>
        <ListGroupItem>
          Morbi leo risus
        </ListGroupItem>
        <ListGroupItem>
          Porta ac consectetur ac
        </ListGroupItem>
        <ListGroupItem>
          Vestibulum at eros
        </ListGroupItem>
      </ListGroup>
      <Button className='add-button'>
        Add
      </Button>
    </div>
  );
}

export default ContactChats;