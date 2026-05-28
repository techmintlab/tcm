import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFAQDocument extends Document {
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const faqSchema = new Schema<IFAQDocument>(
  {
    category: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ category: 1, order: 1 });

const FAQ: Model<IFAQDocument> =
  mongoose.models.FAQ || mongoose.model<IFAQDocument>("FAQ", faqSchema);

export default FAQ;
