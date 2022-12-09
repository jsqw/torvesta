import Moment from 'react-moment'
import Table from 'react-bootstrap/Table'

const ViolatorTable = ({ droneData }) => {
  return (
    <>
      <h3>NDZ perimeter violators</h3>
      <Table bordered className='text-start'>
        <thead>
          <tr>
            <th>Drone serial</th>
            <th>Closest dist</th>
            <th>Last seen</th>
            <th>Pilot name</th>
            <th>Pilot email</th>
            <th>Pilot phone</th>
          </tr>
        </thead>
        <tbody>
          {droneData.map((d) =>
            <tr key={d.serial}>
              <td>{d.serial}</td>
              <td>{d.closestDistance} m</td>
              <td><Moment unix format={'hh:mm:ss'}>{d.lastSeen}</Moment></td>
              <td>{d.contactDetails.name}</td>
              <td>{d.contactDetails.email}</td>
              <td>{d.contactDetails.phone}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default ViolatorTable