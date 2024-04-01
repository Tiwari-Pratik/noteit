
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
import { auth, signIn, signOut } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "./myRoutes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation"
import { notesSchema, notesState } from "./notesSchemas";
import { revalidatePath } from "next/cache";
import { getEmbedding } from "./openai";
import { notesIndex } from "./pinecone";


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


export const saveNote = async (prevState: notesState, formData: FormData) => {
  const validatedData = notesSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!validatedData.success) {
    return {
      message: "Failed to save note",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { title, body } = validatedData.data


  const session = await auth()
  // console.log(session)
  const userId = session?.user?.id
  console.log(userId)

  if (userId) {

    try {
      const noteString = title + "\n\n" + body ?? ""
      const embedding = await getEmbedding(noteString)
      // console.log(embedding)
      const note = await prisma.$transaction(async (tx) => {
        const note = await tx.note.create({
          data: {
            userId,
            title,
            content: body
          }
        })

        await notesIndex.upsert([
          {
            id: note.id,
            values: embedding,
            metadata: { userId }
          }
        ])

        return note

      })
    } catch (error) {
      return { message: "Could't save the note into the database" }
    }

  } else {
    return { message: "You are not authorized" }
  }

  revalidatePath("/")
  return { message: "success" }

}


export const editNote = async (id: string, prevState: notesState, formData: FormData) => {
  const validatedData = notesSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!validatedData.success) {
    return {
      message: "Failed to save note",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { title, body } = validatedData.data

  const session = await auth()
  // console.log(session)
  const userId = session?.user?.id

  if (userId) {

    try {


      const noteString = title + "\n\n" + body ?? ""
      const embedding = await getEmbedding(noteString)
      const editedNote = await prisma.$transaction(async (tx) => {
        const note = await tx.note.update({
          where: {
            id: id
          },
          data: {
            userId,
            title,
            content: body
          }
        })

        await notesIndex.upsert([{
          id,
          values: embedding,
          metadata: { userId }
        }])
        return note
      })
    } catch (error) {
      return { message: "Could't save the note into the database" }
    }

  } else {
    return { message: "You are not authorized" }
  }

  revalidatePath("/")
  return { message: "success" }

}

export const deleteNote = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (userId) {

    try {

      await prisma.$transaction(async (tx) => {

        const note = await tx.note.delete({
          where: {
            id: id
          },
        })
        await notesIndex.deleteOne(id)
      })
    } catch (error) {
      throw new Error("Couldn't delete the note")
    }

  } else {
    throw new Error("Not authorized")
  }

  revalidatePath("/")


}
