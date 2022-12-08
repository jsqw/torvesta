import Moment from 'react-moment'

const violatorTable = ({ droneData }) => {

  return (
    <table>
      <thead>
        <tr>
          <th>
        Drone serial:
          </th>
          <th>
        Closest dist:
          </th>
          <th>
        Last seen:
          </th>
          <th>
        Pilot name:
          </th>
          <th>
        Pilot email:
          </th>
          <th>
        Pilot phone:
          </th>
        </tr>
      </thead>
      <tbody>
        {droneData.map((d) =>
          <tr key={d.serial}>
            <td>{d.serial}</td>
            <td>{d.closestDistance}</td>
            <td><Moment unix format={'hh:mm:ss'}>{d.lastSeen}</Moment></td>
            <td>{d.contactDetails.name}</td>
            <td>{d.contactDetails.email}</td>
            <td>{d.contactDetails.phone}</td>
          </tr>
        )}
      </tbody>
    </table>)
}

export default violatorTable