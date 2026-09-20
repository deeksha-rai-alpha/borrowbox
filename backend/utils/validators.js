const { z } = require("zod");

// FR-01: Registration validation rules
const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().min(7, "Please enter a valid phone number"),
  location: z.string().trim().min(2, "Location is required"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// FR-04: Item validation rules
const itemSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().min(10, "Description is required"),
  category: z.enum([
    "Books",
    "Cameras & Electronics",
    "Tools",
    "Camping & Outdoor",
    "Sports Equipment",
    "Party & Decorations",
    "Agricultural Tools",
    "Study Materials",
    "Other",
  ]),
  condition: z.enum(["New", "Good", "Fair", "Worn"]),
  location: z.string().trim().min(2, "Location is required"),
});

// FR-10: Borrow request validation rules
const borrowRequestSchema = z
  .object({
    item: z.string().min(1, "Item id is required"),
    startDate: z.coerce.date({ errorMap: () => ({ message: "Please enter a valid start date" }) }),
    endDate: z.coerce.date({ errorMap: () => ({ message: "Please enter a valid end date" }) }),
    message: z.string().max(300).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// FR-17: Review validation rules
const reviewSchema = z.object({
  borrowRequest: z.string().min(1, "Borrow request id is required"),
  rating: z.coerce.number().min(1, "Rating must be between 1 and 5").max(5),
  comment: z.string().max(500).optional(),
});

// Generic middleware factory that validates req.body against a zod schema
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }
  req.body = result.data;
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  itemSchema,
  borrowRequestSchema,
  reviewSchema,
  validate,
};
