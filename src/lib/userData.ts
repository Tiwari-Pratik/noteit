import prisma from "./db"

export const getUserById = async (id: string) => {

  try {
    const user = await prisma.user.findUnique(
      {
        where: {
          id
        }
      }
    )
    if (user) {
      return user
    } else {
      return null
    }
  } catch (error) {
    return null

  }

}


export const getUserByEmail = async (email: string) => {

  try {
    const user = await prisma.user.findUnique(
      {
        where: {
          email
        }
      }
    )
    if (user) {
      return user
    } else {
      return null
    }
  } catch (error) {
    return null

  }

}
