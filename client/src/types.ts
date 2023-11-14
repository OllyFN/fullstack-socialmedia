import { MouseEventHandler } from 'react'

export class postClass {
  username: string
  usertag: string
  userpicture: string
  content: string
  id: number
  likes: number
  constructor(
    username: string,
    usertag: string,
    userpicture: string,
    content: string,
    id: number,
    likes: number
  ) {
    this.username = username
    this.usertag = usertag
    this.userpicture = userpicture
    this.content = content
    this.id = id
    this.likes = likes
  }
}

interface userData {
  name: string
  tag: string
  bio: string
  joined: Date
  // TODO add followers and following when database & rest api is ready
  // followers: userClass[]
  // following: userClass[]
}

interface userImage {
  avatar: string
  banner: string
}

export class userClass {
  id: number
  data: userData
  image: userImage

  constructor(id: number, data: userData, image: userImage) {
    this.id = id
    this.data = data
    this.image = image
  }
}

export class popularClass {
  tag: string
  posts: number
  constructor(tag: string, posts: number) {
    this.tag = tag
    this.posts = posts
  }
}

export class notificationClass {
  id: number
  title: string
  description: string
  image: string
  link: string
  date: Date
  constructor(
    id: number,
    title: string,
    description: string,
    image: string,
    link: string,
    date: Date
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.image = image
    this.link = link
    this.date = date
  }
}

export type postData = InstanceType<typeof postClass>

export interface iconProps {
  name: string
  filled?: boolean
  hoverable?: boolean
  clickable?: boolean
  onClick?: MouseEventHandler
}
