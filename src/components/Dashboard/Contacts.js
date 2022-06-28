import { Button, ListGroup, ListGroupItem } from 'reactstrap';

function Contacts() {
  return (
    <div>
      <ListGroup className='contacts'>
        <ListGroupItem className='header'>
          Contacts
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

export default Contacts;