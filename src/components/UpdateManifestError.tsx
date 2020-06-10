import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'
import { path } from 'ramda'
import { useTranslation } from 'react-i18next'

const UpdateManifestError = (props: {
    setPostErr: (arg0: any) => void
    postErr: any
}) => {
    const { t } = useTranslation()
    return (
        <Dialog
            onClose={() => props.setPostErr(null)}
            open={!!props.postErr}
            fullWidth
        >
            <MuiDialogTitle>{t('PostErrMsg')}</MuiDialogTitle>
            {path(['postErr'], props)}
        </Dialog>
    )
}

export default UpdateManifestError
