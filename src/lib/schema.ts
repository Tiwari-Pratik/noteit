
import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: "Must provide an Email" })
    .email({ message: "Invalid Email Address" }),
  password: z
    .string({ required_error: "Must provide a password" })
    .min(8, { message: "Password must be atleast 8 characters long" }),
});

export const ResetFormSchema = z.object({
  email: z
    .string({ required_error: "Must provide an Email" })
    .email({ message: "Invalid Email Address" }),
});

export const RegisterFormSchema = z
  .object({
    email: z
      .string({ required_error: "Must provide an Email" })
      .email({ message: "Invalid Email Address" }),
    password: z
      .string({ required_error: "Must provide a password" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
    confirmPassword: z
      .string({ required_error: "Must provide a password" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: "Must provide a password" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
    confirmPassword: z
      .string({ required_error: "Must provide a password" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface LoginState {
  message?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
}

export interface ResetState {
  message?: string | null;
  errors?: {
    email?: string[];
  };
}

export interface RegisterState {
  message?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

