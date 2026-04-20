'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthMode = 'login' | 'register' | 'requestReset' | 'resetPassword'

interface PasswordFieldProps {
  id: string
  placeholder: string
  value: string
  visible: boolean
  onChange: (value: string) => void
  onToggle: () => void
}

function PasswordField(props: PasswordFieldProps) {
  return (
    <div className="flex border-b border-slate-600 bg-slate-800 last:border-b-0">
      <input
        id={props.id}
        name={props.id}
        type={props.visible ? 'text' : 'password'}
        required
        minLength={6}
        className="block w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none sm:text-sm"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <button
        type="button"
        onClick={props.onToggle}
        className="border-l border-slate-600 px-4 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        {props.visible ? 'Ocultar' : 'Mostrar'}
      </button>
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

  const clearFeedback = () => {
    setError('')
    setSuccess('')
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

  const handleSubmit = async (event: React.FormEvent) => {
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
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          setError(data.error ?? 'Nao foi possivel entrar.')
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
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          setError(data.error ?? 'Nao foi possivel criar a conta.')
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
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          setError(data.error ?? 'Nao foi possivel gerar o codigo.')
          return
        }

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
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error ?? 'Nao foi possivel redefinir a senha.')
        return
      }

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

  const titleByMode: Record<AuthMode, string> = {
    login: 'Faca login na sua conta',
    register: 'Crie sua conta',
    requestReset: 'Recuperar senha',
    resetPassword: 'Definir nova senha',
  }

  const descriptionByMode: Record<AuthMode, string> = {
    login: 'Entre com seu email para acessar o painel financeiro.',
    register: 'Cadastre nome, email e senha para usar o sistema.',
    requestReset: 'Informe seu email para gerar um codigo temporario.',
    resetPassword: 'Digite o codigo recebido e escolha sua nova senha.',
  }

  const buttonLabelByMode: Record<AuthMode, string> = {
    login: 'Entrar',
    register: 'Cadastrar',
    requestReset: 'Gerar codigo',
    resetPassword: 'Salvar nova senha',
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-8">
        {(mode === 'login' || mode === 'register') && (
          <div className="mx-auto flex w-full max-w-xs rounded-xl border border-slate-700 bg-slate-900/80 p-1">
            <button
              type="button"
              onClick={() => changeMode('login')}
              className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'login' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => changeMode('register')}
              className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'register' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cadastro
            </button>
          </div>
        )}

        {(mode === 'requestReset' || mode === 'resetPassword') && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => changeMode('login')}
              className="text-sm font-medium text-slate-300 underline underline-offset-4 transition hover:text-white"
            >
              Voltar para login
            </button>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-center text-3xl font-extrabold text-white">{titleByMode[mode]}</h2>
          <p className="text-center text-sm text-slate-400">{descriptionByMode[mode]}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-md border border-slate-600 shadow-sm">
            {mode === 'register' && (
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                className="block w-full border-b border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:outline-none sm:text-sm"
                placeholder="Nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}

            <input
              id="email"
              name="email"
              type="email"
              required
              className={`block w-full bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:outline-none sm:text-sm ${
                mode === 'requestReset' ? '' : 'border-b border-slate-600'
              }`}
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {mode === 'resetPassword' && (
              <input
                id="resetCode"
                name="resetCode"
                type="text"
                required
                minLength={6}
                maxLength={6}
                className="block w-full border-b border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:outline-none sm:text-sm"
                placeholder="Codigo de 6 digitos"
                value={resetCode}
                onChange={(event) => setResetCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            )}

            {mode !== 'requestReset' && (
              <PasswordField
                id="password"
                placeholder={mode === 'resetPassword' ? 'Nova senha' : 'Senha'}
                value={password}
                visible={showPassword}
                onChange={setPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
            )}

            {(mode === 'register' || mode === 'resetPassword') && (
              <PasswordField
                id="confirmPassword"
                placeholder="Confirmar senha"
                value={confirmPassword}
                visible={showConfirmPassword}
                onChange={setConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />
            )}
          </div>

          {previewCode && mode === 'resetPassword' && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Codigo de demonstracao: <span className="font-semibold tracking-[0.3em]">{previewCode}</span>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-slate-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Carregando...' : buttonLabelByMode[mode]}
          </button>

          {mode === 'login' && (
            <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
              <button
                type="button"
                onClick={() => changeMode('register')}
                className="font-medium text-white underline underline-offset-4"
              >
                Criar conta
              </button>
              <button
                type="button"
                onClick={() => changeMode('requestReset')}
                className="font-medium text-white underline underline-offset-4"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {mode === 'register' && (
            <p className="text-center text-sm text-slate-400">
              Ja tem conta?{' '}
              <button
                type="button"
                onClick={() => changeMode('login')}
                className="font-medium text-white underline underline-offset-4"
              >
                Fazer login
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
