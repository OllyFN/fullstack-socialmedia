import { useEffect, useState } from 'react'
import './styles/PostInput.css'
const MAX_CHARS = 250

export default function PostInput() {
  const [input, setInput] = useState('')

  useEffect(() => {
    const inputTextarea = document.getElementById(
      'post-input-textarea'
    ) as HTMLTextAreaElement
    inputTextarea.style.height = '0px'
    inputTextarea.style.height = inputTextarea.scrollHeight + 'px'
  }, [input])

  const updateInput = (newInput: string) => {
    if (newInput.length <= MAX_CHARS) {
      // if our new input is below max length we just set it else we do a slice
      setInput(newInput)
    } else if (input.length < MAX_CHARS) {
      // this if statement prevents additional re-renders when input is already at max length
      setInput(newInput.slice(0, MAX_CHARS))
      console.log(123)
    }
  }

  return (
    <div className="post-input-wrapper">
      <div className="post-input-user-wrapper">
        <img src="/profilePic.png" />
        <div className="post-input-user-data-wrapper">
          <div className="post-input-user-data-name">username</div>
          <div className="post-input-user-data-tag">@usertag</div>
        </div>
      </div>
      <div className="post-input-textarea-wrapper">
        <textarea
          value={input}
          onChange={(e) => updateInput(e.target.value)}
          className="post-input-textarea"
          id="post-input-textarea"
        />
        <div
          className="post-input-char-counter no-select"
          data-max-chars={input.length == MAX_CHARS ? true : null}
        >
          {input.length}/{MAX_CHARS}
        </div>
      </div>
      <button className="post-input-send">Send</button>
    </div>
  )
}
