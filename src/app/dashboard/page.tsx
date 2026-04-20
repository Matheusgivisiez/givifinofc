'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

interface Profile {
  name: string
  photoUrl: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [profile, setProfile] = useState<Profile>({ name: '', photoUrl: '' })
  const [profileName, setProfileName] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/transactions')
    if (res.ok) {
      const data = await res.json()
      setTransactions(data.transactions)
      setBalance(data.balance)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchProfile = useCallback(async () => {
    const res = await fetch('/api/profile')
    if (res.ok) {
      const data = await res.json()
      setProfile(data)
      setProfileName(data.name)
      setProfilePhotoUrl(data.photoUrl)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchProfile()
    const saved = localStorage.getItem('darkMode')
    const shouldBeDark = saved === null ? true : saved === 'true'
    setIsDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [fetchData, fetchProfile])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: parseFloat(amount), description }),
    })
    if (res.ok) {
      setAmount('')
      setDescription('')
      fetchData()
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profileName, photoUrl: profilePhotoUrl }),
    })
    if (res.ok) {
      fetchProfile()
    }
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-blue-900 dark:bg-black text-white">
      <header className="bg-blue-800 dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-blue-200 dark:text-gray-400 hover:text-white dark:hover:text-white focus:outline-none"
              >
                <span className="text-2xl">⋮</span>
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-blue-800 dark:bg-gray-800 border border-blue-700 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => { setActiveTab('profile'); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-200 dark:text-gray-300 hover:bg-blue-700 dark:hover:bg-gray-700"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-200 dark:text-gray-300 hover:bg-blue-700 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? 'Modo Claro' : 'Modo Noturno'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-200 dark:text-gray-300 hover:bg-blue-700 dark:hover:bg-gray-700"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100 ml-4">Givifin</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-blue-700 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-400 text-blue-300 dark:border-green-400 dark:text-green-400'
                    : 'border-transparent text-blue-200 dark:text-gray-400 hover:text-white dark:hover:text-white hover:border-blue-300 dark:hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-400 text-blue-300 dark:border-green-400 dark:text-green-400'
                    : 'border-transparent text-blue-200 dark:text-gray-400 hover:text-white dark:hover:text-white hover:border-blue-300 dark:hover:border-gray-300'
                }`}
              >
                Perfil
              </button>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="bg-blue-800 dark:bg-gray-800 overflow-hidden shadow rounded-lg mt-8">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white dark:text-gray-100 mb-4">Saldo Atual</h2>
                  <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {balance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-blue-800 dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white dark:text-gray-100 mb-4">Adicionar Transação</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Tipo</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                        className="mt-1 block w-full border-blue-600 dark:border-gray-600 rounded-md shadow-sm bg-blue-700 dark:bg-gray-700 text-white dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500"
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
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 block w-full border-blue-600 dark:border-gray-600 rounded-md shadow-sm bg-blue-700 dark:bg-gray-700 text-white dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Descrição</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full border-blue-600 dark:border-gray-600 rounded-md shadow-sm bg-blue-700 dark:bg-gray-700 text-white dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 dark:bg-gray-600 hover:bg-blue-700 dark:hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Adicionar
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-8 bg-blue-800 dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-white dark:text-gray-100 mb-4">Transações</h2>
                  <div className="space-y-4">
                    {transactions.map((t) => (
                      <div key={t.id} className="flex justify-between items-center border-b border-blue-700 dark:border-gray-700 pb-2">
                        <div>
                          <p className="font-medium text-white dark:text-gray-100">{t.description}</p>
                          <p className="text-sm text-blue-300 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {t.type === 'income' ? '+' : '-'}R$ {t.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <div className="mt-8 bg-blue-800 dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-white dark:text-gray-100 mb-4">Perfil</h2>
                {profile.photoUrl && (
                  <div className="mb-4">
                    <Image src={profile.photoUrl} alt="Foto do perfil" width={128} height={128} className="rounded-full object-cover border-2 border-blue-500 dark:border-gray-500" />
                  </div>
                )}
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">Nome</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="mt-1 block w-full border-blue-600 dark:border-gray-600 rounded-md shadow-sm bg-blue-700 dark:bg-gray-700 text-white dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 dark:text-gray-300">URL da Foto</label>
                    <input
                      type="url"
                      value={profilePhotoUrl}
                      onChange={(e) => setProfilePhotoUrl(e.target.value)}
                      className="mt-1 block w-full border-blue-600 dark:border-gray-600 rounded-md shadow-sm bg-blue-700 dark:bg-gray-700 text-white dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 dark:bg-gray-600 hover:bg-blue-700 dark:hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}