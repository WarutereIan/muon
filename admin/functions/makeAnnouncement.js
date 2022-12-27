import Announcement from "../models/announcement.js"

var announcementsObject = {}
var announcementsArray = []

 async function makeAnnouncement (req,res){
    try{

    console.log(`
makeAnnouncement called
`)
    const {newAnnouncement} = req.body

    const timeOfAnnouncement = new Date()

    announcementsObject[timeOfAnnouncement] = newAnnouncement

    announcementsArray.push(announcementsObject)

    console.log(announcementsObject)

    var announcements = await Announcement.findOneAndReplace({},{announcements: announcementsObject},{new:true})

    res.json({
        "error": false,
        "error-message": "",
        "announcement-made-success": true,
        "announcement-document": announcements
    })
}
catch(e){
    console.log(e)
    res.json({
        "error":true,
        "error-message": e,
        "announcement-made-success": false,        

    })
}
}

export default makeAnnouncement