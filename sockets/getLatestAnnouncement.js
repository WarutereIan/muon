import Announcement from "../admin/models/announcement.js";

export async function getLastAnnouncement (req, res) {
    try {
    
    const announcement = await Announcement.findOne()


    const announcementsArray = announcement.announcements

    const latestAnnouncement = announcementsArray[announcementsArray.length - 1]

    return latestAnnouncement
}
    catch(e){
        console.log(`
error getting latest announcement from db:

${e}
        `)
        res.status(504).send('error fetching latest announcement from db')

        
    }
}

