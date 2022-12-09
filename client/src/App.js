import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Container from 'react-bootstrap/Container'
import ViolatorTable from './components/ViolatorTable'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/Navbar'

const socket = io('http://localhost:3001')

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [data, setData] = useState ([])

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('newData', (data) => {
      setData(data)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <Container className="App text-center">
      <NavBar isConnected={isConnected}/>
      <ErrorBoundary>
        {data.length > 0 ? <ViolatorTable droneData={data} /> : <p>Waiting for data...</p> }
      </ErrorBoundary>
    </Container>
  )
}

export default App
