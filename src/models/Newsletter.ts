import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewsletterDocument extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
}

const newsletterSchema = new Schema<INewsletterDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter: Model<INewsletterDocument> =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletterDocument>("Newsletter", newsletterSchema);

export default Newsletter;
