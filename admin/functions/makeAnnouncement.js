import Announcement from "../models/announcement.js"

var announcementsObject = []
var announcementsArray = []

 async function makeAnnouncement (req,res){
    try{

    console.log(`
makeAnnouncement called
`)
    const {newAnnouncement} = req.body

    const timeOfAnnouncement = new Date()

    var oldAnnouncementsDoc = await Announcement.findOne()
    
    var oldAnnouncementsArr = oldAnnouncementsDoc.announcements

    var newAnnouncementInstance = `${newAnnouncement} created at ${timeOfAnnouncement}`

    console.log(oldAnnouncementsArr)

    oldAnnouncementsArr.push(newAnnouncementInstance)

    var updatedAnnouncements = await Announcement.findOneAndReplace({},{announcements: oldAnnouncementsArr},{new:true})

    res.json({
        "error": false,
        "error-message": "",
        "announcement-made-success": true,
        "announcement-made": updatedAnnouncements.announcements[oldAnnouncementsArr.length-1]
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