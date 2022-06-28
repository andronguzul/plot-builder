import { Form, FormGroup, Label, Input, Card, Button } from 'reactstrap';

function Auth() {
  return (
    <div className='auth'>
      <Card className='form-card'>
        <Form>
          <FormGroup>
            <Label for='email'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              placeholder='test@gmail.com'
              type='email'
            />
          </FormGroup>
          <FormGroup>
            <Label for='password'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
            />
          </FormGroup>
          <div className='submit-container'>
            <Button>
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Auth;