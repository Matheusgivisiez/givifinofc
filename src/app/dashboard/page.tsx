'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './page.module.css'

type ActiveTab = 'dashboard' | 'profile' | 'reports' | 'settings'
type TransactionType = 'income' | 'expense'
type ToastType = 'success' | 'error'

interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  category?: string
  date: string
}

interface Profile {
  name: string
  email: string
  photoUrl: string
}

const categoryOptions = ['Alimentacao', 'Receita', 'Assinaturas', 'Transporte', 'Saude', 'Lazer', 'Outros']

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const titleByTab: Record<ActiveTab, string> = {
  dashboard: 'Dashboard',
  profile: 'Perfil',
  reports: 'Relatorios',
  settings: 'Configuracoes',
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Hoje'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim() || 'Givifin'
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return initials.toUpperCase() || 'GF'
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function inferCategory(transaction: Pick<Transaction, 'type' | 'description'>) {
  if (transaction.type === 'income') {
    return 'Receita'
  }

  const description = normalizeText(transaction.description)

  if (description.includes('mercado') || description.includes('lanche')) {
    return 'Alimentacao'
  }

  if (description.includes('netflix') || description.includes('stream')) {
    return 'Assinaturas'
  }

  if (description.includes('uber') || description.includes('carro') || description.includes('onibus')) {
    return 'Transporte'
  }

  if (description.includes('farmacia') || description.includes('saude')) {
    return 'Saude'
  }

  return 'Outros'
}

function iconForTransaction(transaction: Pick<Transaction, 'type' | 'category' | 'description'>) {
  if (transaction.type === 'income') {
    return 'money'
  }

  const category = normalizeText(transaction.category ?? inferCategory(transaction))
  const description = normalizeText(transaction.description)

  if (category.includes('aliment') || description.includes('mercado') || description.includes('lanche')) {
    return 'food'
  }

  if (category.includes('assin') || description.includes('netflix') || description.includes('stream')) {
    return 'stream'
  }

  if (category.includes('transporte') || description.includes('uber') || description.includes('carro')) {
    return 'transport'
  }

  if (category.includes('saude') || description.includes('farmacia')) {
    return 'health'
  }

  return 'other'
}

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function BarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m16 17 5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TrendIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'up' ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'}
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h10A2.5 2.5 0 0 1 19 7.5v.5H8.5a1.8 1.8 0 1 0 0 3.6H20v5.9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 11.6h-4a1.8 1.8 0 0 0 0 3.6h4v-3.6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SelectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmptyCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function TransactionIcon({ icon }: { icon: string }) {
  if (icon === 'money') {
    return <WalletIcon />
  }

  if (icon === 'food') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h2l2.2 9.3a2 2 0 0 0 2 1.5h6.9a2 2 0 0 0 1.9-1.4L21 9H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.2" fill="currentColor" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  if (icon === 'stream') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (icon === 'transport') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 17h14l-1.5-7.5A3 3 0 0 0 14.6 7H9.4a3 3 0 0 0-2.9 2.5L5 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M7 17v2M17 17v2M7.5 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (icon === 'health') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  return <SelectIcon />
}

function Avatar({
  name,
  email,
  photoUrl,
  large = false,
}: {
  name: string
  email: string
  photoUrl: string
  large?: boolean
}) {
  const className = `${styles.avatar} ${large ? styles.avatarLarge : ''} ${photoUrl ? styles.avatarImage : ''}`

  if (photoUrl) {
    return (
      <span className={className} style={{ backgroundImage: `url(${photoUrl})` }}>
        <span className={styles.srOnly}>Foto do perfil</span>
      </span>
    )
  }

  return <span className={className}>{getInitials(name, email)}</span>
}

function NavItem({
  active,
  icon,
  children,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button type="button" className={`${styles.navItem} ${active ? styles.active : ''}`} onClick={onClick}>
      <span className={styles.navIcon}>{icon}</span>
      {children}
    </button>
  )
}

function StatCard({
  label,
  value,
  description,
  tone,
  icon,
  highlighted = false,
  children,
}: {
  label: string
  value: string
  description: string
  tone: 'green' | 'red'
  icon?: ReactNode
  highlighted?: boolean
  children?: ReactNode
}) {
  return (
    <article className={`${styles.statCard} ${highlighted ? styles.highlight : ''}`}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        {icon}
      </div>
      <div className={`${styles.statValue} ${tone === 'green' ? styles.greenText : styles.redText}`}>{value}</div>
      <div className={styles.statDesc}>{description}</div>
      {children}
    </article>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [type, setType] = useState<TransactionType>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Receita')
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [profileStatus, setProfileStatus] = useState('')
  const [dateLabel, setDateLabel] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  })
  const formCardRef = useRef<HTMLDivElement>(null)
  const toastTimerRef = useRef<number | null>(null)
  const router = useRouter()

  const fetchTransactions = useCallback(async () => {
    const response = await fetch('/api/transactions')

    if (!response.ok) {
      router.push('/login')
      return
    }

    const data = (await response.json()) as { transactions: Transaction[]; balance: number }
    setTransactions(data.transactions)
    setBalance(data.balance)
  }, [router])

  const fetchProfile = useCallback(async () => {
    const response = await fetch('/api/profile')

    if (!response.ok) {
      router.push('/login')
      return
    }

    const data = (await response.json()) as Profile
    setProfileName(data.name)
    setProfileEmail(data.email)
    setProfilePhotoUrl(data.photoUrl)
  }, [router])

  useEffect(() => {
    fetchTransactions()
    fetchProfile()
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
    setDateLabel(
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    )

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [fetchTransactions, fetchProfile])

  const totals = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.amount
          accumulator.incomeCount += 1
        } else {
          accumulator.expense += transaction.amount
          accumulator.expenseCount += 1
        }

        return accumulator
      },
      { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 },
    )
  }, [transactions])

  const goalPercent = totals.income > 0 ? Math.min(100, Math.max(0, Math.round((Math.max(balance, 0) / totals.income) * 100))) : 0

  const showToast = useCallback((message: string, nextType: ToastType) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    setToast({ message, type: nextType, visible: true })
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 3000)
  }, [])

  const changeType = (nextType: TransactionType) => {
    setType(nextType)
    setCategory((currentCategory) => {
      if (nextType === 'income') {
        return 'Receita'
      }

      return currentCategory === 'Receita' ? 'Alimentacao' : currentCategory
    })
  }

  const handleTransactionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      showToast('Informe um valor valido.', 'error')
      return
    }

    if (!description.trim()) {
      showToast('Adicione uma descricao.', 'error')
      return
    }

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: parsedAmount, description, category }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      showToast(data.error ?? 'Nao foi possivel adicionar a transacao.', 'error')
      return
    }

    setAmount('')
    setDescription('')
    await fetchTransactions()
    showToast(`${type === 'income' ? 'Receita' : 'Despesa'} de ${formatCurrency(parsedAmount)} adicionada.`, 'success')
  }

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileStatus('')

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profileName,
        email: profileEmail,
        photoUrl: profilePhotoUrl,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setProfileStatus(data.error ?? 'Nao foi possivel salvar o perfil.')
      showToast(data.error ?? 'Nao foi possivel salvar o perfil.', 'error')
      return
    }

    setProfileStatus('Perfil salvo com sucesso.')
    showToast('Perfil salvo com sucesso.', 'success')
    fetchProfile()
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePhotoUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>
          <span className={styles.logoIcon}>
            <BrandIcon />
          </span>
          Givifin
        </Link>

        <div className={styles.sidebarUser}>
          <Avatar name={profileName} email={profileEmail} photoUrl={profilePhotoUrl} />
          <div className={styles.userName}>{profileName || 'Conta Givifin'}</div>
          <div className={styles.userEmail}>{profileEmail || 'Conta conectada'}</div>
        </div>

        <nav className={styles.sidebarNav} aria-label="Navegacao do dashboard">
          <NavItem active={activeTab === 'dashboard'} icon={<GridIcon />} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </NavItem>
          <NavItem active={activeTab === 'profile'} icon={<UserIcon />} onClick={() => setActiveTab('profile')}>
            Perfil
          </NavItem>
          <NavItem active={activeTab === 'reports'} icon={<BarIcon />} onClick={() => setActiveTab('reports')}>
            Relatorios
          </NavItem>
          <NavItem active={activeTab === 'settings'} icon={<SettingsIcon />} onClick={() => setActiveTab('settings')}>
            Configuracoes
          </NavItem>
        </nav>

        <div className={styles.sidebarBottom}>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            <LogoutIcon />
            Sair
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>{titleByTab[activeTab]}</h1>
            <p className={styles.topbarSub}>{dateLabel}</p>
          </div>
          <div className={styles.topbarActions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Notificacoes"
              onClick={() => showToast('Nenhuma notificacao nova.', 'success')}
            >
              <BellIcon />
            </button>
            {activeTab === 'dashboard' && (
              <button type="button" className={styles.addButton} onClick={() => formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                <PlusIcon />
                Nova transacao
              </button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <main className={styles.content}>
            <section className={styles.statsRow} aria-label="Resumo financeiro">
              <StatCard
                label="Saldo atual"
                value={formatCurrency(balance)}
                description="Atualizado agora"
                tone={balance >= 0 ? 'green' : 'red'}
                highlighted
                icon={
                  <span className={`${styles.statBadge} ${balance >= 0 ? styles.up : styles.down}`}>
                    <TrendIcon direction={balance >= 0 ? 'up' : 'down'} />
                    {goalPercent}%
                  </span>
                }
              >
                <div className={styles.progressWrap}>
                  <div className={styles.progressMeta}>
                    <span>Meta mensal</span>
                    <strong>{goalPercent}%</strong>
                  </div>
                  <div className={styles.progressBar}>
                    <span style={{ width: `${goalPercent}%` }} />
                  </div>
                </div>
              </StatCard>

              <StatCard
                label="Receitas"
                value={formatCurrency(totals.income)}
                description={`${totals.incomeCount} entrada${totals.incomeCount !== 1 ? 's' : ''} registrada${totals.incomeCount !== 1 ? 's' : ''}`}
                tone="green"
                icon={
                  <span className={`${styles.statIconWrap} ${styles.incomeIcon}`}>
                    <TrendIcon direction="up" />
                  </span>
                }
              />

              <StatCard
                label="Despesas"
                value={formatCurrency(totals.expense)}
                description={`${totals.expenseCount} saida${totals.expenseCount !== 1 ? 's' : ''} registrada${totals.expenseCount !== 1 ? 's' : ''}`}
                tone="red"
                icon={
                  <span className={`${styles.statIconWrap} ${styles.expenseIcon}`}>
                    <TrendIcon direction="down" />
                  </span>
                }
              />
            </section>

            <section className={styles.gridTwo}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Transacoes recentes</h2>
                  <button type="button" className={styles.cardAction} onClick={() => showToast('A lista ja esta mostrando suas transacoes mais recentes.', 'success')}>
                    Ver todas
                  </button>
                </div>

                <div className={styles.transactionList}>
                  {transactions.length === 0 ? (
                    <div className={styles.emptyState}>
                      <EmptyCardIcon />
                      <p>Nenhuma transacao ainda.</p>
                      <p>Adicione sua primeira entrada.</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => {
                      const isIncome = transaction.type === 'income'
                      const icon = iconForTransaction(transaction)

                      return (
                        <article key={transaction.id} className={styles.transactionItem}>
                          <span className={`${styles.transactionIcon} ${styles[`icon${icon}`]}`}>
                            <TransactionIcon icon={icon} />
                          </span>

                          <span className={styles.transactionInfo}>
                            <strong>{transaction.description || 'Sem descricao'}</strong>
                            <small>
                              {formatDate(transaction.date)} | {transaction.category || inferCategory(transaction)}
                            </small>
                          </span>

                          <span className={styles.transactionRight}>
                            <strong className={isIncome ? styles.amountPositive : styles.amountNegative}>
                              {isIncome ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </strong>
                            <small>{isIncome ? 'Receita' : 'Despesa'}</small>
                          </span>
                        </article>
                      )
                    })
                  )}
                </div>
              </div>

              <div className={styles.formCard} ref={formCardRef}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Adicionar transacao</h2>
                </div>

                <form className={styles.formBody} onSubmit={handleTransactionSubmit}>
                  <div className={styles.typeToggle}>
                    <button
                      type="button"
                      className={`${styles.typeButton} ${type === 'income' ? styles.activeIncome : ''}`}
                      onClick={() => changeType('income')}
                    >
                      <TrendIcon direction="up" />
                      Receita
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeButton} ${type === 'expense' ? styles.activeExpense : ''}`}
                      onClick={() => changeType('expense')}
                    >
                      <TrendIcon direction="down" />
                      Despesa
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="amount">Valor</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>
                        <WalletIcon />
                      </span>
                      <input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Descricao</label>
                    <div className={styles.inputWrap}>
                      <span className={`${styles.inputIcon} ${styles.textareaIcon}`}>
                        <PencilIcon />
                      </span>
                      <textarea
                        id="description"
                        placeholder="Ex: Salario, Mercado, Netflix..."
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category">Categoria</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>
                        <SelectIcon />
                      </span>
                      <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className={styles.selectArrow}>
                        <ChevronIcon />
                      </span>
                    </div>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Adicionar transacao
                    <PlusIcon />
                  </button>
                </form>
              </div>
            </section>
          </main>
        )}

        {activeTab === 'profile' && (
          <main className={styles.profilePanel}>
            <section className={styles.profileSection}>
              <Avatar name={profileName} email={profileEmail} photoUrl={profilePhotoUrl} large />
              <h2 className={styles.profileName}>{profileName || 'Conta Givifin'}</h2>
              <p className={styles.profileEmail}>{profileEmail || 'Conta conectada'}</p>

              <div className={styles.profileStatRow}>
                <div className={styles.profileStat}>
                  <strong>{transactions.length}</strong>
                  <span>Transacoes</span>
                </div>
                <div className={styles.profileStat}>
                  <strong className={styles.greenText}>{formatCurrency(totals.income)}</strong>
                  <span>Total receitas</span>
                </div>
                <div className={styles.profileStat}>
                  <strong className={styles.redText}>{formatCurrency(totals.expense)}</strong>
                  <span>Total despesas</span>
                </div>
              </div>
            </section>
          </main>
        )}

        {activeTab === 'reports' && (
          <main className={styles.content}>
            <section className={styles.reportsGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Resumo do mes</h2>
                </div>
                <div className={styles.reportBody}>
                  <div>
                    <span>Saldo</span>
                    <strong className={balance >= 0 ? styles.greenText : styles.redText}>{formatCurrency(balance)}</strong>
                  </div>
                  <div>
                    <span>Receitas</span>
                    <strong className={styles.greenText}>{formatCurrency(totals.income)}</strong>
                  </div>
                  <div>
                    <span>Despesas</span>
                    <strong className={styles.redText}>{formatCurrency(totals.expense)}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Saude financeira</h2>
                </div>
                <div className={styles.reportBody}>
                  <p className={styles.reportText}>
                    Voce registrou {transactions.length} transacao{transactions.length !== 1 ? 'es' : ''}.
                    {balance >= 0
                      ? ' O saldo esta positivo para este ciclo.'
                      : ' O saldo esta negativo, vale revisar as despesas.'}
                  </p>
                </div>
              </div>
            </section>
          </main>
        )}

        {activeTab === 'settings' && (
          <main className={styles.content}>
            <section className={styles.settingsGrid}>
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Dados do perfil</h2>
                </div>

                <form className={styles.formBody} onSubmit={handleProfileSubmit}>
                  <div className={styles.photoPreview}>
                    <Avatar name={profileName} email={profileEmail} photoUrl={profilePhotoUrl} large />
                    <div>
                      <strong>Foto do perfil</strong>
                      <span>JPG, PNG ou GIF</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="photo">Imagem</label>
                    <input id="photo" type="file" accept="image/*" className={styles.fileInput} onChange={handlePhotoChange} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="profileName">Nome</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>
                        <UserIcon />
                      </span>
                      <input
                        id="profileName"
                        type="text"
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="profileEmail">E-mail</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>
                        <UserIcon />
                      </span>
                      <input
                        id="profileEmail"
                        type="email"
                        value={profileEmail}
                        onChange={(event) => setProfileEmail(event.target.value)}
                      />
                    </div>
                  </div>

                  {profileStatus && <p className={styles.profileStatus}>{profileStatus}</p>}

                  <button type="submit" className={styles.submitButton}>
                    Salvar perfil
                  </button>
                </form>
              </div>
            </section>
          </main>
        )}
      </div>

      <div className={`${styles.toast} ${styles[toast.type]} ${toast.visible ? styles.show : ''}`} role="status">
        <span>{toast.type === 'success' ? '✓' : '!'}</span>
        {toast.message}
      </div>
    </div>
  )
}
