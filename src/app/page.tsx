export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-blue-900 dark:bg-black text-white">
      <div className="flex flex-col items-center justify-center gap-12 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center">
          <p className="text-5xl font-bold mb-2">Givifin</p>
          <p className="text-gray-300 text-sm">Gerenciamento Financeiro Pessoal</p>
        </div>

        {/* Main Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo ao Givifin
          </h1>
          <p className="text-gray-300 mb-8">
            Organize suas finanças de forma simples e eficiente
          </p>
        </div>

        {/* Login Button */}
        <a
          href="/login"
          className="w-full group rounded-lg border border-blue-600 dark:border-gray-600 px-6 py-4 transition-colors hover:border-blue-500 dark:hover:border-gray-500 hover:bg-blue-800 dark:hover:bg-gray-800"
        >
          <h2 className="text-2xl font-semibold text-center">
            Login{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-center mt-3 text-gray-300 text-sm">
            Acesse sua conta para gerenciar suas transações
          </p>
        </a>
      </div>
    </main>
  )
}