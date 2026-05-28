import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonialDocument extends Document {
  name: string;
  company: string;
  designation: string;
  content: string;
  avatar: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    designation: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

const Testimonial: Model<ITestimonialDocument> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonialDocument>("Testimonial", testimonialSchema);

export default Testimonial;
