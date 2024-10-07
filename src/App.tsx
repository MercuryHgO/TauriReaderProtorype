import { BrowserView, MobileView } from "react-device-detect";
import "./App.css";
import Book from "./Book";
import Picker from "./Picker";
import { useState } from "react";
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from "react-reader";

function App() {
  const books: {name: string, author: string}[] = [
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
    { name: "Book name", author: "Book Author"},
  ]

  const [isPickerOpen,setIsPickerOpen] = useState(false);
  const [location,setLocation] = useState<string|number>(0);

  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen)
  }

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
    if (window.matchMedia('(prefers-color-scheme: dark)')) {
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
          ...window.matchMedia('(prefers-color-scheme: dark)') ? darkReaderTheme : lightReaderTheme
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
          ...window.matchMedia('(prefers-color-scheme: dark)') ? darkReaderTheme : lightReaderTheme,
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
    </div>
  );
  return (
    <>
      <BrowserView className="container">
        <div 
          className="picker-overlay"
          style={{
            width: `${isPickerOpen ? '0%' : '500px'}`,
            transition: 'width 0.1s ease-out',
            overflow: 'hidden',
            maxHeight: '100%',
          }}
        >
          {picker}
        </div>
        <button className="picker-button" onClick={togglePicker}>Open picker</button>
        {reader}
      </BrowserView>
      <MobileView className="container mobile">
        <button 
          className="picker-button" onClick={togglePicker}
          style={{
            position: "absolute",
            zIndex: "10",
            right: '1vh'
          }}
        >Open picker</button>
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
            height: '100%'
          }}
        >
        <button className="picker-button" onClick={togglePicker}>Open picker</button>
          {picker}
        </div>
      </MobileView>
    </>
  );
}

export default App;
