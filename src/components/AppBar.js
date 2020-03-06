import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {lensPath} from 'ramda'
import {useTranslation} from 'react-i18next'
import AuthNavBar from "./AuthNavBar";

function AppBarTwo(props) {
    const { manifest, handleSettingsUpdate } = props
    const { i18n, t } = useTranslation()

    return (
        <header className="fixed top-0 left-0 w-full" style={{ zIndex: 9999}}>
            <div>
                <AppBar position="static" className="p-3">
                    <div className="container mx-auto flex justify-between" style={{alignItems:"center"}}>
                        <a href="/">
                            <span className="text-2xl">{t('siteName')}</span>
                        </a>
                        <AuthNavBar/>
                        <div className="w-1/6">
                            <div className="w-full">
                                <FormControl style={{ width: '100%' }}>
                                    <Select
                                        value={
                                            manifest.volumeData.defaultLanguage
                                        }
                                        onChange={e => {
                                            i18n.changeLanguage(e.target.value)
                                            handleSettingsUpdate(
                                                lensPath([
                                                    'default-string-lang',
                                                ]),
                                                e.target.value
                                            )
                                            handleSettingsUpdate(
                                                lensPath([
                                                    'volumeData',
                                                    'defaultLanguage',
                                                ]),
                                                e.target.value
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
                            </div>
                        </div>
                    </div>
                </AppBar>
            </div>
        </header>
    )
}

export default AppBarTwo
