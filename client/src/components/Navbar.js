import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const navBar = ({ isConnected }) => {
  return (
    <Navbar>
      <Nav className='container'>
        <a className='me-3' href='https://assignments.reaktor.com/birdnest/'>Assignment</a>
        <a href='https://github.com/jsqw/torvesta'>Source Code</a>
        <Navbar.Text className='ms-auto text-black'>
            Status: {isConnected ? 'Connected' : 'Connecting...'}
        </Navbar.Text>
      </Nav>
    </Navbar>
  )
}

export default navBar