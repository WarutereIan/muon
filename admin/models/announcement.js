import { Schema, model } from "mongoose";

const AnnouncementSchema = new Schema({
    announcements: []
})

export default model("Announcement",AnnouncementSchema)