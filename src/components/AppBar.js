import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'

class AppBarTwo extends React.Component {
    componentDidMount() {
    }

    render() {
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
}

export default AppBarTwo
