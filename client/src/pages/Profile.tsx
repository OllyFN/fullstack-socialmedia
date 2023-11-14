import './styles/Profile.css'
import { postClass, userClass } from '../types'
import { faker } from '@faker-js/faker'
import Post from '../components/Home/Post'

const profileData = new userClass(
  Math.round(Math.random() * 100),
  {
    name: faker.person.firstName(),
    tag: faker.internet.userName(),
    bio: faker.lorem.paragraph(), // bio
    joined: faker.date.past(), // joined date
  },
  {
    avatar: faker.internet.avatar(), // avatar
    banner: faker.image.image(), // banner
  }
)

const randomFeed = (i: number) =>
  new postClass(
    profileData.data.name,
    profileData.data.tag,
    profileData.image.avatar,
    faker.lorem.paragraph(),
    i,
    Math.floor(10000 * Math.random())
  )

const mockFeed = new Array(10).fill(0).map((_, i) => randomFeed(i))

const ProfileInfo = ({ user }: { user: userClass }) => (
  <div className="profile">
    <img className="profile-avatar" src={user.image.avatar} />
    <div className="profile-content">
      <div className="profile-name">{user.data.name}</div>
      <div className="profile-username">@{user.data.tag}</div>
      <div className="profile-bio">{user.data.bio}</div>
      <div className="profile-joined-date">
        Joined {user.data.joined.toLocaleString()}
      </div>
    </div>
  </div>
)

const ProfileFeed = ({ feed }: { feed: postClass[] }) => (
  <div className="profile-feed">
    {feed.map((post: postClass) => (
      <Post key={post.id} data={post} />
    ))}
  </div>
)

export default function Profile() {
  return (
    <div className="profile-wrapper">
      <ProfileInfo user={profileData} />
      <ProfileFeed feed={mockFeed} />
    </div>
  )
}
