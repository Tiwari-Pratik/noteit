
"use server";
import bcrypt from "bcryptjs";
import prisma from "./db";
import { getUserByEmail } from "./userData";
import {
  RegisterState,
  LoginState,
  LoginFormSchema,
  RegisterFormSchema,
  ResetState,
  ResetFormSchema,
  ChangePasswordFormSchema,
} from "./schema";
import { signIn, signOut } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "./myRoutes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation"


export const registerUser = async (
  prevState: RegisterState,
  formData: FormData,
) => {
  // console.log(Object.fromEntries(formData.entries()));
  const validatedData = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedData.success) {
    return {
      message: "Failed to register user",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { email, password, confirmPassword } = validatedData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      message: "Failed to register user",
      errors: {
        email: ["Email already taken. Please use another email"],
      },
    };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: failed to create user",
    };
  }


  redirect("/signin");
};

export const loginUser = async (prevState: LoginState, formData: FormData) => {
  const validatedData = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedData.success) {
    return {
      message: "Failed to login",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedData.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { message: "Invalid Credentials: Email does not exist!" };
  }


  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials. Can not Login" };
        default:
          return { message: "Something went wrong!" };
      }
    }
    throw error;
  }
  return { message: null };
};

export const logoutUser = async () => {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
};

