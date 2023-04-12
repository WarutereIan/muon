import { Notification, Provider } from "apn"

const options = {
    
        token: {
            key: './AuthKey_QG8RUSP78T.p8',
            keyId: 'QG8RUSP78T',
            teamId: ''
        },
        production: false

    }   

let apnProvider = new Provider(options)

let deviceToken = ''

let note = new Notification()


note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
note.payload = {'messageFrom': 'John Appleseed'};
note.topic = "<your-app-bundle-id>"; //your-app-bundle-id

//send notification

let sendResult = await apnProvider.send(note, deviceToken)

console.log(sendResult)