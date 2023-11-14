import useScrollPosition from '../hooks/useScrollPosition'
import { storeType } from '../store'
import './styles/ScrollToTop.css'
import { useSelector } from 'react-redux'

export default function ScrollToTop() {
  const [scrollPos, _] = useScrollPosition()
  const headerOpen = useSelector((state: storeType) => state.headerOpen)

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="scroll-to-top-wrapper"
      data-open={headerOpen ? true : null}
      data-visible={scrollPos > 0 ? true : null}
    >
      ^
    </button>
  )
}
