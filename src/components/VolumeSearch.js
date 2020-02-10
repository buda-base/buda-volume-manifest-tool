import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import React from 'react'
import {useTranslation} from 'react-i18next'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiAlert from '@material-ui/lab/Alert'
import {isNil} from 'ramda'

const VolumeSearch = props => {
    const { t } = useTranslation()
    const [volume, setVolume] = React.useState('')
    return props.isFetching ? (
        <CircularProgress />
    ) : (
        <div
            className="container mx-auto flex items-center justify-center"
            style={{ paddingTop: 60 }}
        >
            <div className="mt-10">
                <TextField
                    placeholder={t('volumeLabel')}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={volume}
                    onChange={e => setVolume(e.target.value)}
                    className="w-2/3"
                    style={{
                        width: 250,
                        margin: '0 8px 0 8px',
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '1em' }}
                    onClick={() => {
                        window.location = `/?volume=${volume}`
                    }}
                >
                    {t('submit')}
                </Button>
                {!isNil(props.fetchErr) && (
                    <MuiAlert style={{ marginTop: '2em' }} severity="error">
                        {t('submitErrorMsg')}
                    </MuiAlert>
                )}
            </div>
        </div>
    )
}

export default VolumeSearch
