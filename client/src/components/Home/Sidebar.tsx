import { storeType } from '../../store'
import './styles/Sidebar.css'
import { useSelector } from 'react-redux'

function Body({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-body-wrapper">{children}</div>
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-section-wrapper">{children}</div>
}

function Sidebar({ children }: { children: React.ReactNode }) {
  const headerOpen = useSelector((state: storeType) => state.headerOpen)

  return (
    <div
      className="sidebar-wrapper"
      data-header-closed={headerOpen ? null : true}
    >
      {children}
    </div>
  )
}

Sidebar.Body = Body
Sidebar.Section = Section
export default Sidebar
