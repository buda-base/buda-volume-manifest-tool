import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {lensProp} from 'ramda'
import {useTranslation} from 'react-i18next'

function AppBarTwo(props) {
    const { settings, handleSettingsUpdate } = props
    const { i18n } = useTranslation()

    return (
        <header>
            <div>
                <AppBar position="static" className="p-3">
                    <div className="container mx-auto flex justify-between">
                        <span className="text-2xl">BUDA</span>
                        <div className="w-1/6">
                            <div className="w-full">
                                <FormControl style={{ width: '100%' }}>
                                    <Select
                                        value={settings.defaultLanguage}
                                        onChange={e => {
                                            i18n.changeLanguage(e.target.value)
                                            handleSettingsUpdate(
                                                lensProp('defaultLanguage'),
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
