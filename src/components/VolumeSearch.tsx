import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiAlert from '@material-ui/lab/Alert'
import { isNil } from 'ramda'
import { useAuth0 } from '../react-auth0-spa'

const VolumeSearch = props => {
    const { t } = useTranslation()
    const [volume, setVolume] = React.useState('')
    const { user, loading } = useAuth0()
    return props.isFetching || loading ? (
        <CircularProgress />
    ) : (
        <div
            className="container mx-auto flex items-center justify-center flex-wrap"
            style={{ paddingTop: 60 }}
        >
            <div className="mt-10">
                <TextField
                    //{...!user?{disabled:true}:{}}
                    placeholder={t('volumeLabel')}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={props.forVolume ? props.forVolume : volume}
                    onChange={e => setVolume(e.target.value)}
                    className="w-2/3"
                    style={{
                        width: 250,
                        margin: '0 8px 0 8px',
                    }}
                />
                <Button
                    //{...!user?{disabled:true}:{}}
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '1em' }}
                    onClick={() => {
                        window.location.href = `/?volume=${volume}`
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
            {!user && !loading && (
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        marginTop: '10px',
                    }}
                >
                    Please login first
                </div>
            )}
        </div>
    )
}

export default VolumeSearch
