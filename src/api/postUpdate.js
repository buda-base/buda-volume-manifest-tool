import axios from 'axios'
import {append, assoc} from 'ramda'
import config from '../auth_config.json'

// having a changelog is mandatory
function add_changelog(manifest, userId, changelogStr) {
    const changelog = {
        timestamp: Date.now(),
        str: changelogStr,
        user: null,
    }
    return assoc('changelog', append(changelog, manifest.changes), manifest)
}

async function saveManifest(
    manifest,
    auth0, // TODO find a way to get Auth0 object outside of a React component
    userId = 'noUser',
    changelogStr = 'defaultChangeStr'
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
        const formattedManifest = add_changelog(manifest, userId, changelogStr)
        console.log('formattedManifest', formattedManifest)
        
        const data = await axios.put(`https://iiifpres.bdrc.io/bvm/v:${volume}`,{}, { headers: {
            "Authorization": "Bearer " + app_token
        } })

        manifest.rev = data.rev
        // if the put fails (http status != 200), then a popup should be presented
        // to the user with the payload of the response
    }
    else { 
        console.error("users must be logged in")
    }

    // post updated manifest to api!
    const volumeQname = manifest['for-volume']
    if (!changelogStr) {
        changelogStr = "bvmt: update for "+volumeQname;
    }
    const formattedManifest = add_changelog(manifest, userId, changelogStr)
    console.log('formattedManifest', formattedManifest)
    const data = await axios.put(`https://iiifpres-dev.bdrc.io/bvm/ig:${volumeQname}`)
    manifest.rev = data.rev
    // if the put fails (http status != 200 && != 201), then a popup should be presented
    // to the user with the payload of the response
}

export default saveManifest
