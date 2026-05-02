'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, type ReactNode, useState } from 'react'
import styles from './page.module.css'

type AuthMode = 'login' | 'register' | 'requestReset' | 'resetPassword'

interface FieldProps {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  icon: ReactNode
  autoComplete?: string
  inputMode?: 'email' | 'numeric' | 'text'
  maxLength?: number
  minLength?: number
  onChange: (value: string) => void
}

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  visible: boolean
  autoComplete: string
  onChange: (value: string) => void
  onToggle: () => void
}

const modeCopy: Record<AuthMode, { badge: string; title: ReactNode; subtitle: string; button: string }> = {
  login: {
    badge: 'Acesso seguro',
    title: (
      <>
        Bem-vindo
        <br />
        de <span>volta.</span>
      </>
    ),
    subtitle: 'Entre na sua conta e continue controlando suas financas com clareza.',
    button: 'Entrar agora',
  },
  register: {
    badge: 'Nova conta',
    title: (
      <>
        Comece
        <br />
        de <span>graca.</span>
      </>
    ),
    subtitle: 'Crie seu acesso para organizar receitas, despesas e metas em um unico painel.',
    button: 'Criar conta',
  },
  requestReset: {
    badge: 'Recuperacao',
    title: (
      <>
        Vamos
        <br />
        recuperar <span>tudo.</span>
      </>
    ),
    subtitle: 'Informe seu e-mail para gerar um codigo temporario de redefinicao.',
    button: 'Gerar codigo',
  },
  resetPassword: {
    badge: 'Nova senha',
    title: (
      <>
        Defina
        <br />
        seu novo <span>acesso.</span>
      </>
    ),
    subtitle: 'Digite o codigo recebido e escolha uma nova senha para sua conta.',
    button: 'Salvar nova senha',
  },
}

const transactions = [
  {
    label: 'Supermercado',
    detail: 'Hoje, 14:32 | Alimentacao',
    amount: '-R$ 245,80',
    tone: 'expense',
    icon: 'cart',
  },
  {
    label: 'Salario',
    detail: '01 Abr | Receita',
    amount: '+R$ 5.500,00',
    tone: 'income',
    icon: 'coin',
  },
  {
    label: 'Netflix',
    detail: '29 Mar | Assinaturas',
    amount: '-R$ 55,90',
    tone: 'expense',
    icon: 'screen',
  },
] as const

function BrandIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m22 7-10 5L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="m11 12 8-8M16 7l2 2M14 9l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
    </svg>
  )
}

function TrendIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'up' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TransactionIcon({ type }: { type: (typeof transactions)[number]['icon'] }) {
  if (type === 'coin') {
    return <BrandIcon />
  }

  if (type === 'screen') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 3-2 4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-2-4H6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 7h16M9 11.5a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TextField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  icon,
  autoComplete,
  inputMode,
  maxLength,
  minLength,
  onChange,
}: FieldProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrap}>
        <span className={styles.inputIcon}>{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          required
          inputMode={inputMode}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  visible,
  autoComplete,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrap}>
        <span className={styles.inputIcon}>
          <LockIcon />
        </span>
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          required
          minLength={6}
          autoComplete={autoComplete}
          className={`${styles.input} ${styles.inputWithButton}`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" className={styles.togglePassword} onClick={onToggle}>
          {visible ? <EyeOffIcon /> : <EyeIcon />}
          <span className={styles.srOnly}>{visible ? 'Ocultar senha' : 'Mostrar senha'}</span>
        </button>
      </div>
    </div>
  )
}

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [previewCode, setPreviewCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const copy = modeCopy[mode]

  const clearFeedback = () => {
    setError('')
    setSuccess('')
  }

  const readApiMessage = async (response: Response, fallbackMessage: string) => {
    const rawText = await response.text()

    if (!rawText) {
      return fallbackMessage
    }

    try {
      const parsed = JSON.parse(rawText) as { error?: string; message?: string }
      return parsed.error ?? parsed.message ?? fallbackMessage
    } catch {
      if (response.status >= 500) {
        return `Erro interno do servidor (${response.status}).`
      }

      return rawText.slice(0, 160)
    }
  }

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    clearFeedback()
    setPassword('')
    setConfirmPassword('')
    setResetCode('')
    setShowPassword(false)
    setShowConfirmPassword(false)

    if (nextMode !== 'resetPassword') {
      setPreviewCode('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearFeedback()

    if ((mode === 'register' || mode === 'resetPassword') && password !== confirmPassword) {
      setError('As senhas nao conferem.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          setError(await readApiMessage(response, 'Nao foi possivel entrar.'))
          return
        }

        router.push('/dashboard')
        return
      }

      if (mode === 'register') {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        if (!response.ok) {
          setError(await readApiMessage(response, 'Nao foi possivel criar a conta.'))
          return
        }

        router.push('/dashboard')
        return
      }

      if (mode === 'requestReset') {
        const response = await fetch('/api/password-reset/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          setError(await readApiMessage(response, 'Nao foi possivel gerar o codigo.'))
          return
        }

        const data = await response.json().catch(() => ({}))

        setPreviewCode(typeof data.previewCode === 'string' ? data.previewCode : '')
        setResetCode(typeof data.previewCode === 'string' ? data.previewCode : '')
        setSuccess(data.message ?? 'Codigo gerado com sucesso.')
        setMode('resetPassword')
        return
      }

      const response = await fetch('/api/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: resetCode, password }),
      })

      if (!response.ok) {
        setError(await readApiMessage(response, 'Nao foi possivel redefinir a senha.'))
        return
      }

      const data = await response.json().catch(() => ({}))

      setSuccess(data.message ?? 'Senha redefinida com sucesso.')
      setPassword('')
      setConfirmPassword('')
      setResetCode('')
      setPreviewCode('')
      setMode('login')
    } catch {
      setError('Erro de conexao. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    clearFeedback()
    setError('Login com Google ainda nao esta configurado neste projeto.')
  }

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <BrandIcon />
            </span>
            Givifin
          </Link>

          <nav className={styles.navLinks} aria-label="Navegacao principal">
            <Link href="/#recursos">Recursos</Link>
            <Link href="/#como-funciona">Como funciona</Link>
            <Link href="/#precos">Precos</Link>
            <Link href="/#contato">Contato</Link>
          </nav>

          <div className={styles.navActions}>
            <button type="button" className={styles.outlineButton} onClick={() => changeMode('register')}>
              Criar conta
            </button>
            <Link href="/dashboard" className={styles.primaryButton}>
              Acessar painel
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.leftPanel}>
          <div className={styles.loginCard}>
            {mode !== 'login' && (
              <button type="button" className={styles.backButton} onClick={() => changeMode('login')}>
                Voltar para login
              </button>
            )}

            <div className={styles.loginBadge}>{copy.badge}</div>
            <h1 className={styles.loginTitle}>{copy.title}</h1>
            <p className={styles.loginSubtitle}>{copy.subtitle}</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'register' && (
                <TextField
                  id="name"
                  label="Nome"
                  placeholder="Seu nome completo"
                  value={name}
                  icon={<UserIcon />}
                  autoComplete="name"
                  minLength={2}
                  onChange={setName}
                />
              )}

              <TextField
                id="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                icon={<MailIcon />}
                inputMode="email"
                autoComplete="email"
                onChange={setEmail}
              />

              {mode === 'resetPassword' && (
                <TextField
                  id="resetCode"
                  label="Codigo"
                  placeholder="000000"
                  value={resetCode}
                  icon={<KeyIcon />}
                  inputMode="numeric"
                  minLength={6}
                  maxLength={6}
                  onChange={(value) => setResetCode(value.replace(/\D/g, '').slice(0, 6))}
                />
              )}

              {mode !== 'requestReset' && (
                <PasswordField
                  id="password"
                  label={mode === 'resetPassword' ? 'Nova senha' : 'Senha'}
                  placeholder="Sua senha"
                  value={password}
                  visible={showPassword}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  onChange={setPassword}
                  onToggle={() => setShowPassword((current) => !current)}
                />
              )}

              {(mode === 'register' || mode === 'resetPassword') && (
                <PasswordField
                  id="confirmPassword"
                  label="Confirmar senha"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  visible={showConfirmPassword}
                  autoComplete="new-password"
                  onChange={setConfirmPassword}
                  onToggle={() => setShowConfirmPassword((current) => !current)}
                />
              )}

              {mode === 'login' && (
                <div className={styles.formOptions}>
                  <label className={styles.remember}>
                    <input type="checkbox" />
                    Lembrar de mim
                  </label>
                  <button type="button" className={styles.forgotButton} onClick={() => changeMode('requestReset')}>
                    Esqueci a senha
                  </button>
                </div>
              )}

              {previewCode && mode === 'resetPassword' && (
                <div className={styles.codePreview}>
                  Codigo de demonstracao: <strong>{previewCode}</strong>
                </div>
              )}

              {error && <p className={`${styles.feedback} ${styles.error}`}>{error}</p>}
              {success && <p className={`${styles.feedback} ${styles.success}`}>{success}</p>}

              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? 'Processando...' : copy.button}
                {!loading && <ArrowIcon />}
              </button>

              {mode === 'login' && (
                <>
                  <div className={styles.divider}>ou continue com</div>
                  <button type="button" className={styles.googleButton} onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    Entrar com Google
                  </button>
                </>
              )}
            </form>

            {mode === 'login' && (
              <p className={styles.switchText}>
                Nao tem uma conta?{' '}
                <button type="button" onClick={() => changeMode('register')}>
                  Criar conta gratis
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className={styles.switchText}>
                Ja tem uma conta?{' '}
                <button type="button" onClick={() => changeMode('login')}>
                  Entrar agora
                </button>
              </p>
            )}
          </div>
        </section>

        <aside className={styles.rightPanel} aria-label="Previa do painel financeiro">
          <div className={styles.previewContent}>
            <div>
              <p className={styles.previewLabel}>Visao geral</p>
              <h2 className={styles.previewHeading}>
                Suas financas,
                <br />
                sempre em dia.
              </h2>
            </div>

            <div className={styles.dashCard}>
              <div className={styles.dashHeader}>
                <div className={styles.dashDots} aria-hidden="true">
                  <span className={styles.dotRed} />
                  <span className={styles.dotYellow} />
                  <span className={styles.dotGreen} />
                </div>
                <span className={styles.dashMonth}>Visao geral | Abril 2026</span>
              </div>

              <p className={styles.saldoLabel}>Saldo total</p>
              <p className={styles.saldoValue}>
                <sup>R$</sup> 45.830<small>,00</small>
              </p>

              <div className={styles.badgeUp}>
                <TrendIcon direction="up" />
                12,5% vs. mes anterior
              </div>

              <div className={styles.progressRow}>
                <span>Meta mensal</span>
                <strong>78%</strong>
              </div>
              <div className={styles.progressBar}>
                <span />
              </div>

              <div className={styles.metrics}>
                <div className={styles.metricBox}>
                  <div className={styles.metricTitle}>
                    <TrendIcon direction="up" />
                    Receitas
                  </div>
                  <div className={styles.metricIncome}>R$ 8.500</div>
                </div>

                <div className={styles.metricBox}>
                  <div className={`${styles.metricTitle} ${styles.metricExpenseTitle}`}>
                    <TrendIcon direction="down" />
                    Despesas
                  </div>
                  <div className={styles.metricExpense}>R$ 3.200</div>
                </div>
              </div>

              <div className={styles.transHeader}>
                <span>Transacoes recentes</span>
                <span>Ver tudo</span>
              </div>

              <div className={styles.transactionList}>
                {transactions.map((transaction) => (
                  <div key={transaction.label} className={styles.transItem}>
                    <span className={`${styles.transIcon} ${transaction.icon === 'screen' ? styles.transIconBlue : ''}`}>
                      <TransactionIcon type={transaction.icon} />
                    </span>
                    <span className={styles.transInfo}>
                      <strong>{transaction.label}</strong>
                      <small>{transaction.detail}</small>
                    </span>
                    <strong className={transaction.tone === 'income' ? styles.amountPositive : styles.amountNegative}>
                      {transaction.amount}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
