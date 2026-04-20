import crypto from 'crypto'
import { db, importLegacyJsonToUser, withTransaction } from '@/lib/db'

export interface AppUser {
  id: string
  name: string
  email: string
  photoUrl: string
}

interface UserRow {
  id: string
  name: string
  email: string
  password_hash: string
  photo_url: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateName(name: string) {
  return name.trim().length >= 2
}

function validatePassword(password: string) {
  return password.trim().length >= 6
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) {
    return false
  }

  const derivedHash = crypto.scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(hash, 'hex')

  if (storedBuffer.length !== derivedHash.length) {
    return false
  }

  return crypto.timingSafeEqual(storedBuffer, derivedHash)
}

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function mapUser(row: Pick<UserRow, 'id' | 'name' | 'email' | 'photo_url'>): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url,
  }
}

function getUserRowById(userId: string) {
  return db.prepare(`
    SELECT id, name, email, password_hash, photo_url
    FROM users
    WHERE id = ?
  `).get(userId) as UserRow | undefined
}

function getUserRowByEmail(email: string) {
  return db.prepare(`
    SELECT id, name, email, password_hash, photo_url
    FROM users
    WHERE email = ?
  `).get(email) as UserRow | undefined
}

export function createUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const password = input.password

  if (!validateName(name)) {
    throw new Error('Informe um nome com pelo menos 2 caracteres.')
  }

  if (!validateEmail(email)) {
    throw new Error('Informe um email valido.')
  }

  if (!validatePassword(password)) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.')
  }

  const existingUser = getUserRowByEmail(email)
  if (existingUser) {
    throw new Error('Ja existe uma conta com esse email.')
  }

  const totalUsersRow = db.prepare('SELECT COUNT(*) as total FROM users').get() as { total: number }
  const isFirstUser = totalUsersRow.total === 0
  const userId = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  withTransaction(() => {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, photo_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, hashPassword(password), '', createdAt)

    if (isFirstUser) {
      importLegacyJsonToUser(userId)
    }
  })

  const createdUser = getUserRowById(userId)
  if (!createdUser) {
    throw new Error('Nao foi possivel criar a conta.')
  }

  return mapUser(createdUser)
}

export function authenticateUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = getUserRowByEmail(normalizedEmail)

  if (!user || !verifyPassword(password, user.password_hash)) {
    return null
  }

  return mapUser(user)
}

export function getUserById(userId: string) {
  const user = getUserRowById(userId)
  return user ? mapUser(user) : null
}

export function updateUserProfile(
  userId: string,
  input: { name: string; email: string; photoUrl: string },
) {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const photoUrl = input.photoUrl.trim()

  if (!validateName(name)) {
    throw new Error('Informe um nome com pelo menos 2 caracteres.')
  }

  if (!validateEmail(email)) {
    throw new Error('Informe um email valido.')
  }

  const existingEmail = db.prepare(`
    SELECT id
    FROM users
    WHERE email = ? AND id != ?
  `).get(email, userId) as { id: string } | undefined

  if (existingEmail) {
    throw new Error('Esse email ja esta em uso.')
  }

  db.prepare(`
    UPDATE users
    SET name = ?, email = ?, photo_url = ?
    WHERE id = ?
  `).run(name, email, photoUrl, userId)

  const updatedUser = getUserRowById(userId)
  if (!updatedUser) {
    throw new Error('Usuario nao encontrado.')
  }

  return mapUser(updatedUser)
}

export function requestPasswordReset(email: string) {
  const normalizedEmail = normalizeEmail(email)

  if (!validateEmail(normalizedEmail)) {
    throw new Error('Informe um email valido.')
  }

  const user = getUserRowByEmail(normalizedEmail)
  if (!user) {
    return { previewCode: null as string | null }
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString()

  withTransaction(() => {
    db.prepare(`
      UPDATE password_reset_tokens
      SET used_at = ?
      WHERE user_id = ? AND used_at IS NULL
    `).run(now.toISOString(), user.id)

    db.prepare(`
      INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at, used_at)
      VALUES (?, ?, ?, ?, ?, NULL)
    `).run(
      crypto.randomUUID(),
      user.id,
      hashResetToken(code),
      expiresAt,
      now.toISOString(),
    )
  })

  return { previewCode: code }
}

export function resetPasswordWithCode(input: { email: string; code: string; password: string }) {
  const email = normalizeEmail(input.email)
  const code = input.code.trim()
  const password = input.password

  if (!validateEmail(email)) {
    throw new Error('Informe um email valido.')
  }

  if (code.length !== 6) {
    throw new Error('Informe o codigo de 6 digitos.')
  }

  if (!validatePassword(password)) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.')
  }

  const user = getUserRowByEmail(email)
  if (!user) {
    throw new Error('Nao foi possivel validar o codigo informado.')
  }

  const token = db.prepare(`
    SELECT id, expires_at, used_at
    FROM password_reset_tokens
    WHERE user_id = ? AND token_hash = ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(user.id, hashResetToken(code)) as {
    id: string
    expires_at: string
    used_at: string | null
  } | undefined

  if (!token || token.used_at) {
    throw new Error('Codigo invalido ou ja utilizado.')
  }

  if (Date.parse(token.expires_at) < Date.now()) {
    throw new Error('Esse codigo expirou. Gere um novo codigo.')
  }

  withTransaction(() => {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), user.id)
    db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(new Date().toISOString(), token.id)
  })
}
