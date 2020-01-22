import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Checkbox} from '@material-ui/core'
import {lensProp} from 'ramda'
import React from 'react'
import {useTranslation} from 'react-i18next'

export default function FilterList(props) {
    const { showCheckedImages, handleSettingsUpdate, showHiddenImages } = props
    const { t } = useTranslation()
    return (
        <div className="container mx-auto flex flex-row justify-end">
            <FormControlLabel
                style={{ display: 'block' }}
                control={
                    <Checkbox
                        checked={showCheckedImages}
                        onChange={e => {
                            handleSettingsUpdate(
                                lensProp('showCheckedImages'),
                                !showCheckedImages
                            )
                        }}
                        value="show-checked-images"
                        color="primary"
                    />
                }
                label={t('Show Checked Images')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showHiddenImages}
                        onChange={e => {
                            handleSettingsUpdate(
                                lensProp('showHiddenImages'),
                                !showHiddenImages
                            )
                        }}
                        value="show-hidden-images"
                        color="primary"
                    />
                }
                label={t('Show Hidden Images')}
            />
        </div>
    )
}
