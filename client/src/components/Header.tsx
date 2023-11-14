import useScrollPosition from '../hooks/useScrollPosition'
import { storeType, setHeaderState } from '../store'
import './styles/Header.css'
import { useSelector, useDispatch } from 'react-redux'

export default function Header() {
  const [_scrollPos, scrollDir] = useScrollPosition()
  const headerOpen = useSelector((state: storeType) => state.headerOpen)
  const dispatch = useDispatch()

  dispatch(setHeaderState(scrollDir != 'down'))

  return <div id="header" data-closed={headerOpen ? null : true}></div>
}
