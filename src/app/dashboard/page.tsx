'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

interface Profile {
  name: string
  email: string
  photoUrl: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [profileStatus, setProfileStatus] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchTransactions = useCallback(async () => {
    const response = await fetch('/api/transactions')

    if (!response.ok) {
      router.push('/login')
      return
    }

    const data = await response.json()
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

    const savedMode = localStorage.getItem('darkMode')
    const shouldUseDarkMode = savedMode === null ? true : savedMode === 'true'
    setIsDarkMode(shouldUseDarkMode)

    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [fetchTransactions, fetchProfile])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())

    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleTransactionSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: Number(amount), description }),
    })

    if (!response.ok) {
      return
    }

    setAmount('')
    setDescription('')
    fetchTransactions()
  }

  const handleProfileSubmit = async (event: React.FormEvent) => {
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
      return
    }

    setProfileStatus('Perfil salvo com sucesso.')
    fetchProfile()
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-blue-900 text-white dark:bg-black">
      <header className="bg-blue-800 shadow dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100">Givifin</h1>
            <p className="mt-1 text-sm text-blue-200 dark:text-gray-400">{profileEmail || 'Conta conectada'}</p>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((current) => !current)}
              className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Menu
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-blue-700 bg-blue-800 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => {
                    setActiveTab('profile')
                    setMenuOpen(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-blue-100 transition hover:bg-blue-700 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Perfil
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="block w-full px-4 py-2 text-left text-sm text-blue-100 transition hover:bg-blue-700 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? 'Modo claro' : 'Modo escuro'}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-blue-100 transition hover:bg-blue-700 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-blue-700 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'border-blue-300 text-blue-200 dark:border-green-400 dark:text-green-400'
                  : 'border-transparent text-blue-200 hover:border-blue-300 hover:text-white dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-blue-300 text-blue-200 dark:border-green-400 dark:text-green-400'
                  : 'border-transparent text-blue-200 hover:border-blue-300 hover:text-white dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-white'
              }`}
            >
              Perfil
            </button>
          </nav>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="mt-8 overflow-hidden rounded-lg bg-blue-800 shadow dark:bg-gray-800">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="mb-4 text-lg font-medium text-white dark:text-gray-100">Saldo atual</h2>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-blue-800 shadow dark:bg-gray-800">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="mb-4 text-lg font-medium text-white dark:text-gray-100">Adicionar transacao</h2>
                <form onSubmit={handleTransactionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Tipo</label>
                    <select
                      value={type}
                      onChange={(event) => setType(event.target.value as 'income' | 'expense')}
                      className="mt-1 block w-full rounded-md border-blue-600 bg-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                    >
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-blue-600 bg-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Descricao</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-blue-600 bg-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    Adicionar
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-blue-800 shadow dark:bg-gray-800">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="mb-4 text-lg font-medium text-white dark:text-gray-100">Transacoes</h2>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b border-blue-700 pb-2 dark:border-gray-700"
                    >
                      <div>
                        <p className="font-medium text-white dark:text-gray-100">{transaction.description}</p>
                        <p className="text-sm text-blue-300 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        className={`font-bold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {transactions.length === 0 && (
                    <p className="text-sm text-blue-200 dark:text-gray-400">
                      Nenhuma transacao cadastrada ainda.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="mt-8 rounded-lg bg-blue-800 shadow dark:bg-gray-800">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="mb-4 text-lg font-medium text-white dark:text-gray-100">Perfil</h2>

              {profilePhotoUrl && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-blue-200 dark:text-gray-300">Foto atual</p>
                  <img
                    src={profilePhotoUrl}
                    alt="Foto do perfil"
                    className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover dark:border-gray-400"
                  />
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">
                    Foto de perfil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mt-1 block w-full text-blue-200 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 dark:text-gray-300"
                  />
                  <p className="mt-2 text-xs text-gray-400">Formatos suportados: JPG, PNG, GIF</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Nome</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    className="mt-1 block w-full rounded-md border-blue-600 bg-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(event) => setProfileEmail(event.target.value)}
                    className="mt-1 block w-full rounded-md border-blue-600 bg-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                  />
                </div>

                {profileStatus && <p className="text-sm text-blue-100 dark:text-gray-300">{profileStatus}</p>}

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Salvar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
