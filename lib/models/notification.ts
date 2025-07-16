// lib/models/notification.ts
import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  contestId: {
    type: Number,
    required: true,
    index: true,
  },
  contestName: {
    type: String,
    required: true,
  },
  
  contestDate: {
    type: String, 
    required: true,
  },
  contestTime: {
    type: String, 
    required: true,
  },
 
  contestUrl: {
    type: String,
    required: true,
  },
  notifyBefore: {
    type: String,
    default: "1h",
  },
  platform: {
    type: String,
    default: "Unknown",
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

NotificationSchema.index({ userEmail: 1, contestId: 1 }, { unique: true });

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;