import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name_pl: { type: String, required: true },
  name_ua: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    items: [OrderItemSchema],
    deliveryType: { type: String, enum: ["delivery", "pickup"], required: true },
    totalPrice: { type: Number, required: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      comment: { type: String, default: "" },
    },
    deliveryDate: { type: String, default: null },
    deliveryTime: { type: String, default: null },
    status: { type: String, default: "pending", enum: ["pending", "processing", "completed", "cancelled"] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
