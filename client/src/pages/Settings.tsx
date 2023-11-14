import './styles/Settings.css'

// This settings page is barebones for now
// I will add more settings later on

const SettingOption = ({
  title,
  input = false,
  checkbox = false,
  radio = false,
  dropdown = false,
  data = [],
}: {
  title: string
  input?: boolean
  checkbox?: boolean
  radio?: boolean
  dropdown?: boolean
  data?: string[]
}) => {
  if (
    (input ? 1 : 0) +
      (checkbox ? 1 : 0) +
      (radio ? 1 : 0) +
      (dropdown ? 1 : 0) !==
    1
  ) {
    throw new Error('Must specify exactly one setting type')
  }

  return (
    <div className="setting-option">
      <div className="setting-option-title">{title}</div>
      {input && <input className="setting-option-input" />}
      {checkbox &&
        data.map((option: string) => (
          <>
            <label htmlFor={title + option}>{option}</label>
            <input
              type="checkbox"
              id={title + option}
              className="setting-option-checkbox"
            />
          </>
        ))}
      {radio &&
        data.map((option: string) => (
          <>
            <label htmlFor={title + option}>{option}</label>
            <input
              type="radio"
              name={title}
              id={title + option}
              className="setting-option-radio"
            />
          </>
        ))}
      {dropdown && (
        <select className="setting-option-dropdown">
          {data.map((option: string) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  )
}

export default function Settings() {
  return (
    <div className="settings-wrapper">
      <SettingOption title="Username" input />
      <SettingOption title="Tag" input />
      <SettingOption title="Bio" input />
      <SettingOption title="Email" input />
      <SettingOption title="Gender" radio data={['Male', 'Female', 'Other']} />
    </div>
  )
}
