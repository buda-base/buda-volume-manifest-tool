import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'

class AppBarTwo extends React.Component {
    componentDidMount() {
        // OpenSeaDragon({
        //     id: "openseadragon1",
        //     tileSources: "https://iiif.bdrc.io/bdr:V22084_I0916::09160001.tif/info.json"
        // });
    }

    render() {
        return (
            <header>
                <div>
                    {/*<div id="openseadragon1" style={{width: 800, height: 600}}></div>*/}
                    <AppBar position="static" className="p-3">
                        <div className="container mx-auto">
                            <span className="text-2xl">BUDA</span>
                        </div>
                    </AppBar>
                </div>
            </header>
        )
    }
}

export default AppBarTwo
