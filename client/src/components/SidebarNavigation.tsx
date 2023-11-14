import { Link } from 'react-router-dom'
import Sidebar from './Home/Sidebar'
import { useSelector, useDispatch } from 'react-redux'
import { storeType, toggleTheme } from '../store'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'

export default function HomeNavigation() {
  const theme = useSelector((state: storeType) => state.theme)
  const dispatch = useDispatch()

  return (
    <div style={{ width: '15vw', minWidth: '150px' }}>
      <Sidebar>
        <Sidebar.Body>
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/notifications">
            <button>Notifications</button>
          </Link>
          <Link to="/profile">
            <button>Profile</button>
          </Link>
        </Sidebar.Body>
        <Link to="/settings">
          <button>Settings</button>
        </Link>
        <button onClick={() => dispatch(toggleTheme())}>
          {capitalizeFirstLetter(theme)} theme
        </button>
      </Sidebar>
    </div>
  )
}
