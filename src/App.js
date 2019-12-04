import React from 'react'
import './index.css'
import AppBar from '@material-ui/core/AppBar'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import Cards from './components/Cards'
import InfoBar from './components/InfoBar'
import data from './manifest-simple'
import {map, path} from 'ramda'
import {Slider} from '@material-ui/core'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
    },
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header>
                    <div>
                        <AppBar position="static" className="p-3">
                            <div className="container mx-auto">
                                <span className="text-2xl">BUDA</span>
                            </div>
                        </AppBar>
                    </div>
                </header>
                <div className="container mx-auto flex flex-row py-6">
                    <div className="w-1/2 flex flex-col">
                        <span className="text-gray-600 text-sm">Volume:</span>
                        <span className="text-sm font-bold text-xl mb-3">
                            S4SAD2SD34
                        </span>
                        <span className="underline text-blue-600 cursor-pointer">
                            Preview
                        </span>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <span className="underline text-md font-medium self-end cursor-pointer">
                            SAVE
                        </span>
                    </div>
                </div>
                <InfoBar />
                <div className="container mx-auto">
                    <div className="mt-5 text-gray-700" style={{ width: 144 }}>
                        <span className="text-xs">Thumbnail Zoom Level:</span>
                        <Slider
                            value={30}
                            onChange={() => console.log('handle change')}
                            aria-labelledby="continuous-slider"
                        />
                    </div>
                    {map(
                        item => (
                            <Cards data={item} />
                        ),
                        path(['view', 'view1', 'imagelist'], data)
                    )}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
