'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Credenciais inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 dark:bg-black">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white dark:text-gray-100">
            Faça login na sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-600 dark:border-gray-600 placeholder-blue-300 dark:placeholder-gray-400 text-white dark:text-gray-100 bg-blue-800 dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-600 dark:border-gray-600 placeholder-blue-300 dark:placeholder-gray-400 text-white dark:text-gray-100 bg-blue-800 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-blue-500 dark:focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-gray-600 hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-gray-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}