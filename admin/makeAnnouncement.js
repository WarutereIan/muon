var announcements = {}

function makeAnnouncement (req,res){
    const {announcement} = req.body

    const timeOfAnnouncement = new Date()

    announcements[timeOfAnnouncement] = announcement

    return announcements
}