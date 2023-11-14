import './styles/Notifications.css'
import { notificationClass } from '../types'
import { faker } from '@faker-js/faker'

const notifications = new Array(10).fill(0).map((_, i) => {
  const title = faker.lorem.sentence()
  const description = faker.lorem.paragraph()
  const imageUrl = faker.image.avatarLegacy()
  const url = faker.internet.url()
  const date = faker.date.past()

  return new notificationClass(i, title, description, imageUrl, url, date)
})

const Notif = ({ data }: { data: notificationClass }) => (
  <div className="notification" onClick={() => window.open(data.link)}>
    <img className="notification-image" src={data.image} />
    <div className="notification-content">
      <div className="notification-title">{data.title}</div>
      <div className="notification-description">{data.description}</div>
      <div className="notification-date">{data.date.toLocaleString()}</div>
    </div>
  </div>
)

export default function Notifications() {
  return (
    <div className="notifications-wrapper">
      {notifications.map((notif) => (
        <Notif data={notif} key={notif.id} />
      ))}
    </div>
  )
}
