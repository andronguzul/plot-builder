import ContactChats from '../components/Dashboard/ContactChats';
import Contacts from '../components/Dashboard/Contacts';

function Dashboard() {
  return (
    <div className='dashboard'>
      <Contacts />
      <div className='contact-chats'>
        <h1>Chats</h1>
        <ContactChats />
      </div>
    </div>
  );
}

export default Dashboard;