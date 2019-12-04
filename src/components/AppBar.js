import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'

export default () => {
    return (
        <header>
            <div>
                <AppBar position="static" className="p-3">
                    <div className="container mx-auto">
                        <span className="text-2xl">BUDA</span>
                    </div>
                </AppBar>
            </div>
        </header>
    )
}
