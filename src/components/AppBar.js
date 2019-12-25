import React from 'react'
import AppBar from '@material-ui/core/AppBar/AppBar'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {lensProp} from 'ramda'

function AppBarTwo(props) {
    const { settings, handleSettingsUpdate } = props
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
                                            handleSettingsUpdate(
                                                lensProp('defaultLanguage'),
                                                e.target.value
                                            )
                                        }}
                                        style={{
                                            color: 'white',
                                            backgroundColor: 'transparent',
                                            borderBottomColor: 'white'
                                        }}
                                        native
                                    >
                                        <option value="eng">English</option>
                                        <option value="bo">Tibetan</option>
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
