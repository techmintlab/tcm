import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const contactSchema = new Schema<IContactDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ isRead: 1, createdAt: -1 });

const Contact: Model<IContactDocument> =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>("Contact", contactSchema);

export default Contact;
