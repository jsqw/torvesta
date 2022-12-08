import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import ViolatorTable from './components/Violatortable'

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
    <div className="App">
      <h3>Status: {!isConnected ? 'Connecting...' : 'Connected'}</h3>
      <ViolatorTable droneData={data} />
    </div>
  )
}

export default App
