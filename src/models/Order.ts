import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderDocument extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    price: number;
    plan?: string;
  }[];
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: string;
  paymentId: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "processing" | "completed" | "cancelled";
  razorpayOrderId?: string;
  invoiceUrl?: string;
  customerDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number, required: true },
    plan: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [orderProductSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: "Razorpay",
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "completed", "cancelled"],
      default: "processing",
    },
    razorpayOrderId: {
      type: String,
    },
    invoiceUrl: {
      type: String,
    },
    customerDetails: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", orderSchema);

export default Order;
