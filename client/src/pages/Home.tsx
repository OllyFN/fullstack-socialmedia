import './styles/Home.css'
import { popularClass, postClass } from '../types'
import Post from '../components/Home/Post'
import Sidebar from '../components/Home/Sidebar'
import PostInput from '../components/Home/PostInput'
import { faker } from '@faker-js/faker'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'

const mockPosts = new Array(100)
  .fill(0)
  .map(
    (_, i) =>
      new postClass(
        'username',
        'usertag',
        '/profilePic.png',
        'content',
        i,
        Math.floor(50000 * Math.random())
      )
  )

const mockPopular = new Array(5)
  .fill(0)
  .map(
    () =>
      new popularClass(
        capitalizeFirstLetter(faker.word.noun()),
        Math.floor(10000 * Math.random())
      )
  )

const Posts = ({ posts }: { posts: postClass[] }) =>
  posts.map((postData) => <Post key={postData.id} data={postData} />)

const Popular = ({ popular }: { popular: popularClass[] }) =>
  popular
    .sort((a, b) => b.posts - a.posts)
    .map(({ tag, posts }) => (
      <Sidebar.Section key={tag}>
        <h2>#{tag}</h2>
        <p>{posts} posts</p>
      </Sidebar.Section>
    ))

export default function Home() {
  return (
    <>
      <div className="home-wrapper">
        <div className="home-main-wrapper">
          <div className="home-posts-wrapper">
            <PostInput />
            <Posts posts={mockPosts} />
          </div>
        </div>
      </div>
      <div className="home-popular-sidebar">
        <Sidebar>
          <h1>Popular</h1>
          <Sidebar.Body>
            <Popular popular={mockPopular} />
          </Sidebar.Body>
        </Sidebar>
      </div>
    </>
  )
}
