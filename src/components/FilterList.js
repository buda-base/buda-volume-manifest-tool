import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Checkbox} from '@material-ui/core'
import {lensProp} from 'ramda'
import React from 'react'
import {useTranslation} from 'react-i18next'
import Button from '@material-ui/core/Button'

export default function FilterList(props) {
    const { handleSettingsUpdate, hideDeletedImages } = props
    const { t } = useTranslation()
    return (
        <div className="container mx-auto flex flex-row justify-end">
            <Button
                onClick={props.foldCheckedImages}
                color="primary"
                variant="contained"
                style={{ marginRight: '2em' }}
            >
                {t('Fold Checked Images')}
            </Button>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={hideDeletedImages}
                        onChange={e => {
                            handleSettingsUpdate(
                                lensProp('hideDeletedImages'),
                                !hideDeletedImages
                            )
                        }}
                        value="show-hidden-images"
                        color="primary"
                    />
                }
                label={t('Hide Deleted Images')}
            />
        </div>
    )
}
