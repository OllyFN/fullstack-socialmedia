import { iconProps } from '../types'
import './styles/Icon.css'
type Icons = {
  [key: string]: { viewBox: string; path: string }
}

const icons: Icons = {
  heart: {
    viewBox: '-16 -16 360 340',
    path: 'M 305.5 165.4 l -140 141 l -141 -141 a 100 100 315 0 1 141 -141 a 100 100 315 0 1 141 141 z',
  },
}

export default function Icon({
  name,
  filled = true,
  hoverable = false,
  clickable = false,
  onClick,
}: iconProps) {
  const icon = icons[name]
  const svgProps = {
    className:
      'icon' +
      (filled ? ' icon-filled' : '') +
      (hoverable ? ' icon-hoverable' : '') +
      (clickable ? ' icon-clickable' : ''),
    viewBox: icon.viewBox,
  }
  return (
    <svg {...svgProps} onClick={onClick ?? undefined}>
      <path d={icon.path} />
    </svg>
  )
}
