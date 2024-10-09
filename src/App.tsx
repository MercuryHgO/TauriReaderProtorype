import { BrowserView, MobileView } from "react-device-detect";
import "./App.css";
import Book from "./Book";
import Picker from "./Picker";
import { ReactNode, useState } from "react";
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from "react-reader";
import SettingsEditor, { Settings, Theme } from "./Settings";

function App() {
  const books: {name: string, author: string}[] = [
    { name: "Alice In Wonderland", author: "Lewis Carroll"},
    { name: "Моби Дик или Серый кит", author: "Гермал Мелвилл"},
  ]

  const [isPickerOpen,setIsPickerOpen] = useState(false);
  const [location,setLocation] = useState<string|number>(0);
  const [settings,setSettings] = useState<Settings>({
    fontSize: 14,
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0
  })

  const [overlayView,setOverlayView] = useState<null|ReactNode>(null);



  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen)
  }

  const overlay = (
    <div
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: "0",
        left: "0",
        alignItems: "center",
        display:"flex",
        justifyContent: "center",
        background: settings.theme == Theme.light ? "#f6f6f6CC" : "#2f2f2fCC",
        zIndex: "20",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
        onClick={ () => setOverlayView(null)}
      >X</button>
      {overlayView!}
    </div>
  )

  const picker = (
    <Picker>
      {
        books.map(
          (book) => <Book name={book.name} author={book.author} />
        )
      }
    </Picker>
  )

  const lightReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: '#f6f6f6'
    },
  };

  const darkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: '#2f2f2f',
    },
  }

  const getRendition =  (rendition: any) => {
    if (settings.theme === Theme.dark) {
      rendition.themes.override('background-color',"#2f2f2f")
      rendition.themes.override('color',"#f6f6f6")
    }
  }

  const reader = (
    <div
      style={{
        height: '100vh',
        width: '100%'
      }}
    >
      <ReactReader 
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        readerStyles={{
          ...ReactReaderStyle,
          ...settings.theme === Theme.light ? lightReaderTheme : darkReaderTheme ,
        }}
        getRendition={ (rendition) => getRendition(rendition)}
      />
    </div>
  );


  const readerMobile= (
    <div
      style={{
        height: '100vh',
        width: '100%'
      }}
    >
      <ReactReader 
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        readerStyles={{
          ...ReactReaderStyle,
          ...settings.theme === Theme.light ? lightReaderTheme : darkReaderTheme ,
          reader: {
            ...ReactReaderStyle.reader,
            width: '100%',
            left: 0,
          },
          next: {
            backgroundColor: "#00000000",
            border: 'none',
            width: '50%',
            height: '90%',
            top: '10%',
            position: 'relative',
            contentVisibility: 'hidden',
            boxShadow: 'unset',
          },
          prev: {
            backgroundColor: "#00000000",
            border: 'none',
            width: '50%',
            left: '0',
            height: '90%',
            top: '10%',
            position: 'relative',
            contentVisibility: 'hidden',
            boxShadow: 'unset',
          },
        }}
        getRendition={ (rendition) => getRendition(rendition)}
      />
    </div>);



  // !!! Update reader on openPicker change
  return (
    <>
      {overlayView ? overlay : ""}
      <BrowserView className="container">
        <div
          style={{
            width: "100%",
            position: "relative"
          }}
        >
          <div className="menu-buttons-container">
            <button className="picker-button" onClick={togglePicker}>Список книг</button>
            <button onClick={
              () => setOverlayView(SettingsEditor({settigns: settings,settingsChanged: (settings) => setSettings(settings)}))
            }>Настройки</button>
          </div>
          {reader}
        </div>
        <div 
          className="picker-overlay"
          style={{
            width: `${isPickerOpen ? '500px' : '0%'}`,
            transition: 'width 0.1s ease-out',
            overflow: 'hidden',
            maxHeight: '100%',
          }}
        >
          {picker}
        </div>
      </BrowserView>
      <MobileView className="container mobile">
        <div className="menu-buttons-container">
          <button className="picker-button" onClick={togglePicker}>Список книг</button>
          <button onClick={
            () => setOverlayView(SettingsEditor({settigns: settings,settingsChanged: (settings) => setSettings(settings)}))
          }>Настройки</button>
        </div>
        {readerMobile}
        <div 
          className="picker-overlay-mobile"
          style={{
            width: '100%',
            position: 'absolute',
            top: '0',
            left: `${isPickerOpen ? '0' : '-100%'}`,
            transition: 'left 0.1s ease-out',
            zIndex: '100',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            height: '100vh',
            // maxHeight: '100vh'
          }}
        >
        <button className="picker-button" onClick={togglePicker}>X</button>
          {picker}
        </div>
      </MobileView>
    </>
  );
}

export default App;
