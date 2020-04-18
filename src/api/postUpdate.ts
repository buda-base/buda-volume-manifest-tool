import axios from 'axios'

// having a changelog is mandatory
function add_changelog(manifest, userQname, changelogStr) {
    const now = new Date();
    const changelog = {
        time: now.toISOString(),
        message: changelogStr,
        user: userQname,
    }
    manifest.changes.push(changelog)
}

async function saveManifest(
    manifest,
    auth0,
    changelogStr = {"@value": 'no log message', "@language": "en"}
){
    // first check: users must be logged in 
    if(auth0 && auth0.isAuthenticated) {

        console.log("user",auth0.user)

        // DEPRECATED ? not sure we really need this...
        // get an app token from IIIFPres Auth0 app
        // const json = await axios.post("https://bdrc-io.auth0.com/oauth/token", config.iiifpres, { headers: { 'content-type': 'application/json' } })
        // const app_token = json.data.access_token

        const app_token = localStorage.getItem("id_token")

        // and a changelog string must be provided (when the save button is pressed)

        // post updated manifest to api!
        const volume = manifest['for-volume']
        add_changelog(manifest, auth0.user.bdrcID, changelogStr)
        try {
            const data = await axios.put(`https://iiifpres-dev.bdrc.io/bvm/ig:${volume}`,manifest, { headers: {
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
