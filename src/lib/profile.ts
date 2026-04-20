import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const profileFile = path.join(dataDir, 'profile.json')

async function ensureProfileFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    try {
      await fs.access(profileFile)
    } catch {
      await fs.writeFile(profileFile, JSON.stringify({ name: '', photoUrl: '' }))
    }
  } catch (error) {
    console.error('Error initializing profile file:', error)
  }
}

// Initialize on module load
ensureProfileFile().catch(console.error)

export interface Profile {
  name: string
  photoUrl: string
}

export async function getProfile(): Promise<Profile> {
  try {
    await ensureProfileFile()
    const data = await fs.readFile(profileFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading profile:', error)
    return { name: '', photoUrl: '' }
  }
}

export async function setProfile(profile: Profile): Promise<void> {
  try {
    await ensureProfileFile()
    await fs.writeFile(profileFile, JSON.stringify(profile, null, 2))
  } catch (error) {
    console.error('Error writing profile:', error)
    throw error
  }
}