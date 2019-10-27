import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { createMuiTheme } from '@material-ui/core/styles';

const theme =
        createMuiTheme({
          palette: {
            type: 'dark'
          },
        })

// import blue from '@material-ui/core/colors/blue';


const useStyles = makeStyles(theme => ({
  header: {
    width: '100%',
    flexGrow: 1,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
  },
}));

function App() {
  const classes = useStyles();

  return (


        <ThemeProvider theme={theme}>
      <div className="App">
      <header className={classes.header}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
              {/*  <MenuIcon />*/}
              {/*</IconButton>*/}
              <Typography edge="start" variant="h5" className={classes.title}>
                BUDA
              </Typography>
              {/*<Button color="inherit">Login</Button>*/}
            </Toolbar>
          </AppBar>
        </div>
      </header>
    </div>

        </ThemeProvider>
  );
}

export default App;
