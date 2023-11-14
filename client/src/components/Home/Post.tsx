import './styles/Post.css'
import { postData } from '../../types.ts'
import Icon from '../Icon.tsx'
import { useState } from 'react'

export default function Post({ data }: { data: postData }) {
  const [postLiked, setPostLiked] = useState(false)

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <img
          className="post-userpicture clickable no-select"
          src={data.userpicture}
        />
        <div className="post-userinfo">
          <div className="post-username clickable">{data.username}</div>
          <div className="post-usertag clickable">@{data.usertag}</div>
        </div>
      </div>
      <div className="post-content">{data.content}</div>
      <div className="post-likes">
        <Icon
          name="heart"
          hoverable
          clickable
          filled={postLiked}
          onClick={() => setPostLiked((c) => !c)}
        />
        {data.likes + +postLiked}
      </div>
    </div>
  )
}
