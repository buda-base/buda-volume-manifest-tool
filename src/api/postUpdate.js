import axios from 'axios'
import {append, assoc} from 'ramda'
import config from '../auth_config.json'

// having a changelog is mandatory
function add_changelog(manifest, userId, changelogStr) {
    const now = new Date();
    const changelog = {
        time: now.toISOString(),
        message: changelogStr,
        user: null,
    }
    return assoc('changes', append(changelog, manifest.changes), manifest)
}

async function saveManifest(
    manifest,
    auth0,
    changelogStr = 'no log message'
){
    // first check: users must be logged in 
    if(auth0 && auth0.isAuthenticated) {

        console.log("user",auth0.user.email)

        // DEPRECATED ? not sure we really need this...
        // get an app token from IIIFPres Auth0 app
        // const json = await axios.post("https://bdrc-io.auth0.com/oauth/token", config.iiifpres, { headers: { 'content-type': 'application/json' } })
        // const app_token = json.data.access_token

        const app_token = localStorage.getItem("id_token")

        // and a changelog string must be provided (when the save button is pressed)

        // post updated manifest to api!
        const volume = manifest['for-volume']
        const formattedManifest = add_changelog(manifest, auth0.user.bdrcID, changelogStr)
        console.log('formattedManifest', formattedManifest)
        try {
            const data = await axios.put(`https://iiifpres-dev.bdrc.io/bvm/ig:${volume}`,formattedManifest, { headers: {
            "Authorization": "Bearer " + app_token } });
            manifest.rev = data.rev
        } catch (err) {
            // TODO: print error:
            console.error(err);
        }
    }
    else { 
        console.error("users must be logged in")
    }
}

export default saveManifest
