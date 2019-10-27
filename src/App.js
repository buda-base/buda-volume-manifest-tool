import React from 'react'
import './App.css'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { ThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import Cards from './components/Cards'
import InfoBar from './components/InfoBar'
import data from './manifest-simple'
import { map, path } from 'ramda'
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
        },
    },
})

const useStyles = makeStyles(theme => ({
    header: {
        width: '100%',
        flexGrow: 1,
        // backgroundColor: theme.primary[500],
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        fontFamily: 'Roboto-Medium',
        letterSpacing: 1.1,
    },
}))

function App() {
    const classes = useStyles()

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header className={classes.header}>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography
                                    edge="start"
                                    variant="h5"
                                    className={classes.title}
                                >
                                    BUDA
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </div>
                </header>
                <InfoBar />
                <Container maxWidth="xl">
                    {map(
                        item => (
                            <Cards data={item} />
                        ),
                        path(['view', 'view1', 'imagelist'],data)
                    )}
                </Container>
            </div>
        </ThemeProvider>
    )
}

export default App
