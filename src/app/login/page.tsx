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
    <div className="flex border-b border-emerald-500/20 bg-transparent last:border-b-0">
      <input
        id={props.id}
        name={props.id}
        type={props.visible ? 'text' : 'password'}
        required
        minLength={6}
        className="block w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm transition"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <button
        type="button"
        onClick={props.onToggle}
        className="border-l border-emerald-500/20 px-4 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {(mode === 'login' || mode === 'register') && (
          <div className="mx-auto flex w-full max-w-xs rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => changeMode('login')}
              className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'login' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50' 
                  : 'text-slate-300 hover:text-emerald-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => changeMode('register')}
              className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'register' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50' 
                  : 'text-slate-300 hover:text-emerald-300'
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
              className="text-sm font-medium text-emerald-300 underline underline-offset-4 transition hover:text-emerald-200"
            >
              ← Voltar para login
            </button>
          </div>
        )}

        {/* Logo */}
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Givifin</p>
            <p className="text-xs text-emerald-300">Gestão Financeira Inteligente</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-center text-2xl font-bold text-white">{titleByMode[mode]}</h2>
          <p className="text-center text-sm text-emerald-100/70">{descriptionByMode[mode]}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-lg border border-emerald-500/30 bg-slate-800/40 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
            {mode === 'register' && (
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                className="block w-full border-b border-emerald-500/20 bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-0 sm:text-sm transition"
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
              className={`block w-full bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-emerald-500/50 sm:text-sm transition ${
                mode === 'requestReset' ? '' : 'border-b border-emerald-500/20'
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
                className="block w-full border-b border-emerald-500/20 bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-0 sm:text-sm transition"
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
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 backdrop-blur-sm">
              Codigo de demonstracao: <span className="font-semibold tracking-[0.3em]">{previewCode}</span>
            </div>
          )}

          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 backdrop-blur-sm">{error}</p>}
          {success && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 backdrop-blur-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-emerald-500/30"
          >
            {loading ? 'Carregando...' : buttonLabelByMode[mode]}
          </button>

          {mode === 'login' && (
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400">
              <button
                type="button"
                onClick={() => changeMode('requestReset')}
                className="font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition"
              >
                Esqueci minha senha
              </button>
              <p className="text-slate-500">ou</p>
              <button
                type="button"
                onClick={() => changeMode('register')}
                className="font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition"
              >
                Criar nova conta
              </button>
            </div>
          )}

          {mode === 'register' && (
            <p className="text-center text-sm text-slate-400">
              Ja tem conta?{' '}
              <button
                type="button"
                onClick={() => changeMode('login')}
                className="font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition"
              >
                Fazer login
              </button>
            </p>
          )}
        </form>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-center text-xs text-slate-400 w-full">
        © 2024 Givifin. Todos os direitos reservados.
      </p>
    </div>
  )
}
