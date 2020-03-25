import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {useTranslation} from 'react-i18next'
import AuthNavBar from './AuthNavBar'
import {connect} from 'react-redux'
import {setUILanguage} from '../actions/manifest'

function AppBarTwo(props) {
    const { handleSettingsUpdate } = props;
    const { i18n, t } = useTranslation();

    console.log('appBarprops', props);
    return (
        <header className="fixed top-0 left-0 w-full" style={{ zIndex: 9999 }}>
            <div>
                <AppBar position="static" className="p-3">
                    <div
                        className="container mx-auto flex justify-between"
                        style={{ alignItems: 'center' }}
                    >
                        <a href="/">
                            <span className="text-2xl">{t('siteName')}</span>
                        </a>
                        <div style={{ width: 300 }}>
                            <div className="w-full flex flex-row justify-between content-between">
                                <FormControl style={{ width: 200 }}>
                                    <Select
                                        value={props['default-ui-string-lang']}
                                        onChange={e => {
                                            i18n.changeLanguage(e.target.value);
                                            props.dispatch(
                                                setUILanguage(e.target.value)
                                            )
                                        }}
                                        style={{
                                            color: 'white',
                                            backgroundColor: 'transparent',
                                            borderBottomColor: 'white',
                                        }}
                                        native
                                    >
                                        <option value="en">English</option>
                                        <option value="bo">བོད</option>
                                    </Select>
                                </FormControl>
                                <AuthNavBar />
                            </div>
                        </div>
                    </div>
                </AppBar>
            </div>
        </header>
    )
}

const mapStateToProps = function(state) {
    return {
        'default-ui-string-lang':
            state.manifest.appData.bvmt['default-ui-string-lang'],
    }
};

export default connect(mapStateToProps)(AppBarTwo)
