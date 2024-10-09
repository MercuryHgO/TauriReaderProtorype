import { BrowserView, MobileView } from "react-device-detect"
import "./style.css"

export enum Theme {
  "light",
  "dark"
}

export type Settings = {
  fontSize: number,
  theme: Theme
}

export type SettingsEditorProps = {
  settigns: Settings
  settingsChanged: (settings: Settings) => void
}

const SettingsEditor = (props: SettingsEditorProps) => {
  const settingsWindow = (
    <div 
      className="settingsWindow"
      style={{
        backgroundColor: props.settigns.theme === Theme.light ? "#e6e6e6" : "#2e2e2e"
      }}
    >
      <h1>Размер шрифта</h1>
      <div
        style={{
          display: "flex",
          justifyContent:"space-between"
        }}
      >
        <button>-</button>      
        <p
          style={{
            fontSize: props.settigns.fontSize + "px"
          }}
        >{props.settigns.fontSize}</p>
        <button>+</button>
      </div>
      <h2>Тема</h2>
      <button>{props.settigns.theme ? "Темная" : "Светлая"}</button>
    </div>
  )

  return (
    <>
      <BrowserView>
        <div 
          className="settingsContainer"
        >
          {settingsWindow}
        </div>
      </BrowserView>
      <MobileView>
        <div
          className="settingsContainer"
        >
          {settingsWindow}
        </div>
      </MobileView>
    </>
  )
}

export default SettingsEditor
