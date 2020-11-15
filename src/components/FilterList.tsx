import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Checkbox } from '@material-ui/core'
import React from 'react'
import { lensPath, view } from 'ramda'
import { useTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'


export default function FilterList(props: {
    foldCheckedImages?: any
    handleSettingsUpdate?: any
    manifest?: any
}) {
    const { handleSettingsUpdate, manifest } = props
    const { t } = useTranslation()
    const hideDeletedImagesLens = lensPath([
        'volumeData',
        'bvmt_props',
        'hideDeletedImages',
    ])
    const hideDeletedImages = view(hideDeletedImagesLens, manifest) as boolean
    return (
        <div className="container mx-auto flex flex-row justify-end bg-white py-4">
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
                        onChange={_ => {
                            handleSettingsUpdate(
                                hideDeletedImagesLens,
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
