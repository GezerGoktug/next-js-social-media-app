import { z } from "zod";

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Full names must be at least 3 characters long."),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("İnvalid email."),
  password: z.string().min(1, "Password is required"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
      "Password must contain at least 4 letters"
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    newPasswordConfirm: z.string().min(1, "Confirm password is required."),
    isHavePassword: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "New passwords do not match",
    path: ["newPasswordConfirm"],
  })
  .refine(
    (data) => data.isHavePassword || data.currentPassword, // provider mevcut değilse currentPassword gerekli
    {
      message: "Current Password is required",
      path: ["currentPassword"],
    }
  );

export const updateUserSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" }),
  country: z.string().optional(),
  city: z.string().optional(),
  bio: z
    .string()
    .max(300, { message: "Biography cannot exceed 300 characters" })
    .optional(),
  profileImg:
    typeof window === "undefined"
      ? z.any().optional()
      : z.instanceof(File).nullable().optional(),
  backdropImg:
    typeof window === "undefined"
      ? z.any().optional()
      : z.instanceof(File).nullable().optional(),
});
