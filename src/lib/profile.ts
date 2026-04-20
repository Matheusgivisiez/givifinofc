import { getUserById, updateUserProfile } from '@/lib/users'

export interface Profile {
  name: string
  email: string
  photoUrl: string
}

export async function getProfile(userId: string): Promise<Profile> {
  const user = getUserById(userId)

  if (!user) {
    throw new Error('Usuario nao encontrado.')
  }

  return {
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
  }
}

export async function setProfile(userId: string, profile: Profile): Promise<Profile> {
  return updateUserProfile(userId, profile)
}
