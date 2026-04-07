import { z } from "zod";

// ─── Zod Schemas for Backend Validation ─────────────────────────────────────

/**
 * Order item schema — validates each product in the cart.
 */
export const OrderItemSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required")
    .max(50, "Product ID too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid product ID format"),
  name_pl: z.string().min(1, "Polish name is required").max(200),
  name_ua: z.string().min(1, "Ukrainian name is required").max(200),
  price: z.number().positive("Price must be positive").finite(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Minimum quantity is 1")
    .max(99, "Maximum quantity is 99"),
});

/**
 * Customer details schema — validates checkout form fields.
 */
export const CustomerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(60, "First name too long")
    .regex(/^[^\d<>{}$]+$/, "Invalid characters in first name"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(60, "Last name too long")
    .regex(/^[^\d<>{}$]+$/, "Invalid characters in last name"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format"),
  comment: z.string().max(500, "Comment too long").default(""),
});

/**
 * Delivery date/time — optional strings with format constraints.
 */
const DeliveryDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
  .nullable()
  .optional();

const DeliveryTimeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Invalid time format")
  .nullable()
  .optional();

/**
 * Full order schema — the complete request body for POST /api/orders.
 */
export const CreateOrderSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "Cart cannot be empty")
    .max(50, "Too many items in cart"),
  deliveryType: z.enum(["delivery", "pickup"], {
    error: "Delivery type must be 'delivery' or 'pickup'",
  }),
  totalPrice: z
    .number()
    .nonnegative("Total price must be non-negative")
    .finite(),
  customer: CustomerSchema,
  deliveryDate: DeliveryDateSchema,
  deliveryTime: DeliveryTimeSchema,
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Product query parameters schema — validates GET /api/products query params.
 */
export const ProductQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return !v || isNaN(n) || n < 1 ? 1 : Math.floor(n);
    }),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return !v || isNaN(n) || n < 1 || n > 50 ? 9 : Math.floor(n);
    }),
  category: z.string().max(100).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return !v || isNaN(n) ? undefined : Math.max(0, n);
    }),
  maxPrice: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return !v || isNaN(n) ? undefined : Math.max(0, n);
    }),
});

/**
 * Helper: formats Zod errors into a user-friendly string.
 */
export function formatZodErrors(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}
