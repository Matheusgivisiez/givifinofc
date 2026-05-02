import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Givifin | Gestao financeira inteligente',
  description:
    'Controle entradas, despesas e metas em um painel simples, seguro e pensado para sua rotina.',
}

const featurePills = [
  'Sem cartao de credito',
  'Dados protegidos',
  'Configuracao em 2 minutos',
]

const resources = [
  {
    title: 'Painel claro e objetivo',
    description:
      'Visualize saldo, metas e movimentacoes recentes em uma interface pronta para o dia a dia.',
  },
  {
    title: 'Lancamentos rapidos',
    description:
      'Registre receitas e despesas em poucos cliques, sem sair do fluxo e sem burocracia.',
  },
  {
    title: 'Conta com cara de produto real',
    description:
      'Landing publica, login dedicado e area autenticada alinhados em uma experiencia mais profissional.',
  },
]

const steps = [
  {
    title: 'Crie sua conta',
    description: 'Entre pelo login do projeto e comece a organizar tudo em um unico lugar.',
  },
  {
    title: 'Registre o que importa',
    description: 'Adicione entradas, gastos e acompanhe o impacto de cada movimento no saldo.',
  },
  {
    title: 'Tome decisoes melhores',
    description: 'Use o resumo mensal para entender seu ritmo financeiro e ajustar rotas com mais rapidez.',
  },
]

const plans = [
  {
    name: 'Acesso imediato',
    price: 'Gratis',
    description: 'Ideal para testar o fluxo do sistema e comecar a usar agora.',
    features: ['Tela inicial profissional', 'Login e cadastro no mesmo fluxo', 'Dashboard com movimentacoes'],
  },
]

const transactions = [
  {
    label: 'Supermercado',
    detail: 'Hoje, 14:32 | Alimentacao',
    amount: '-R$ 245,80',
    tone: 'expense',
    icon: 'bag',
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

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M9 12.75 11.25 15 15.5 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 21s7-3.5 7-9.5V5.8L12 3 5 5.8v5.7C5 17.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="m13 2-2.8 7.2L3 12l7.2 2.8L13 22l2.8-7.2L23 12l-7.2-2.8L13 2Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 19h16M7 15l3-3 3 2 4-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="15" r="1.25" fill="currentColor" />
      <circle cx="10" cy="12" r="1.25" fill="currentColor" />
      <circle cx="13" cy="14" r="1.25" fill="currentColor" />
      <circle cx="17" cy="8" r="1.25" fill="currentColor" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h10.1A2.4 2.4 0 0 1 19 7.4v.1H8.2a1.8 1.8 0 0 0 0 3.6H20v5.4a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11.1h-4a1.8 1.8 0 1 0 0 3.6h4v-3.6Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarRow() {
  return (
    <div className="flex items-center gap-1 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="m12 2.75 2.86 5.79 6.39.93-4.62 4.5 1.09 6.36L12 17.31l-5.72 3.02 1.1-6.36-4.63-4.5 6.4-.93L12 2.75Z" />
        </svg>
      ))}
    </div>
  )
}

function TransactionIcon({ type }: { type: 'bag' | 'coin' | 'screen' }) {
  if (type === 'coin') {
    return <BrandIcon />
  }

  if (type === 'screen') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m6 3-2 4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-2-4H6Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 7h16M9 11.5a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex items-center gap-3 text-slate-950 no-underline">
            <span className={styles.logoBadge}>
              <BrandIcon />
            </span>
            <span className={`${styles.displayFont} text-xl font-extrabold tracking-[-0.04em]`}>
              Givifin
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#recursos" className={styles.navLink}>
              Recursos
            </a>
            <a href="#como-funciona" className={styles.navLink}>
              Como funciona
            </a>
            <a href="#contato" className={styles.navLink}>
              Contato
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className={styles.secondaryButton}>
              Fazer login
            </Link>
            <Link href="/login" className={styles.primaryButton}>
              Acessar painel
              <ArrowIcon />
            </Link>
          </div>

          <details className="relative lg:hidden">
            <summary className={styles.mobileTrigger}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="sr-only">Abrir menu</span>
            </summary>

            <div className="absolute right-0 top-full mt-3 w-64 rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_22px_55px_rgba(10,15,13,0.12)] backdrop-blur">
              <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <a href="#recursos" className={styles.mobileLink}>
                  Recursos
                </a>
                <a href="#como-funciona" className={styles.mobileLink}>
                  Como funciona
                </a>
                <a href="#precos" className={styles.mobileLink}>
                  Precos
                </a>
                <a href="#contato" className={styles.mobileLink}>
                  Contato
                </a>
              </nav>

              <div className="mt-4 grid gap-2">
                <Link href="/login" className={styles.secondaryButton}>
                  Fazer login
                </Link>
                <Link href="/login" className={styles.primaryButton}>
                  Acessar painel
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </details>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center lg:pb-24 lg:pt-20">
          <div className={`${styles.fadeUp} ${styles.delay1}`}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Gestao financeira inteligente
            </div>

            <h1
              className={`${styles.displayFont} mt-7 max-w-xl text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl`}
            >
              Controle suas financas com mais clareza.
            </h1>

            <p className={`${styles.fadeUp} ${styles.delay2} mt-6 max-w-2xl text-lg leading-8 text-slate-600`}>
              A GIFIN e uma empresa especializada em gerenciamento financeiro pessoal, criada para ajudar pessoas a organizarem melhor
              suas finanças e tomarem decisoes mais inteligentes com o dinheiro, Por meio de ferramentas praticas e acompanhamento estrategico.
              </p>
              

            <div className={`${styles.fadeUp} ${styles.delay3} mt-10 flex flex-wrap items-center gap-4`}>
              <Link href="/login" className={styles.primaryButton}>
                Entrar agora
                <ArrowIcon />
              </Link>
              <a href="#recursos" className={styles.secondaryButton}>
                Ver recursos
              </a>
            </div>

            <div className={`${styles.fadeUp} ${styles.delay4} mt-10 flex flex-wrap gap-3`}>
              {featurePills.map((pill) => (
                <span key={pill} className={styles.featurePill}>
                  <CheckIcon />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.fadeRight} ${styles.delay2} relative`}>
            <div className={styles.cardGlow} aria-hidden="true" />

            <div className={styles.dashboardCard}>
              <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(34,197,94,0.16)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700">
                    Visao geral | Abril 2026
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Saldo total</p>
                  <p
                    className={`${styles.displayFont} mt-2 text-[2.9rem] font-extrabold leading-none tracking-[-0.06em] text-slate-950`}
                  >
                    R$ 45.830
                    <span className="text-2xl text-slate-500">,00</span>
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        d="m5 15 7-7 7 7"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    12,5% vs. mes anterior
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Meta mensal</span>
                    <span className="font-semibold text-emerald-700">78%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-700" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={styles.statCard}>
                    <div className="mb-3 flex items-center gap-2 text-emerald-700">
                      <ChartIcon />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Receitas
                      </span>
                    </div>
                    <p className={`${styles.displayFont} text-3xl font-extrabold tracking-[-0.04em] text-emerald-700`}>
                      R$ 8.500
                    </p>
                  </div>

                  <div className={`${styles.statCard} border-rose-100 bg-rose-50/90`}>
                    <div className="mb-3 flex items-center gap-2 text-rose-600">
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                        <path
                          d="m19 9-7 7-7-7"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Despesas
                      </span>
                    </div>
                    <p className={`${styles.displayFont} text-3xl font-extrabold tracking-[-0.04em] text-rose-600`}>
                      R$ 3.200
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Transacoes recentes
                    </p>
                    <span className="text-sm font-semibold text-emerald-700">Ver tudo</span>
                  </div>

                  <div className="space-y-2">
                    {transactions.map((transaction) => (
                      <div key={transaction.label} className={styles.transactionRow}>
                        <span
                          className={`${styles.transactionIcon} ${
                            transaction.icon === 'screen' ? styles.transactionIconBlue : ''
                          }`}
                        >
                          <TransactionIcon type={transaction.icon} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{transaction.label}</p>
                          <p className="truncate text-xs text-slate-500">{transaction.detail}</p>
                        </div>

                        <span
                          className={`text-sm font-bold ${
                            transaction.tone === 'income' ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.trustBar}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-6 text-center sm:gap-10 sm:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Confiado por +50.000 usuarios
            </span>

            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <StarRow />
              <span>4,9 / 5,0</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldIcon />
              Criptografia ponta a ponta
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <SparkIcon />
              Atualizacao em tempo real
            </div>
          </div>
        </section>

        <section id="recursos" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className={styles.sectionTag}>Recursos</span>
            <h2 className={`${styles.displayFont} mt-5 text-4xl font-extrabold tracking-[-0.05em] text-slate-950`}>
              A givifin chegou para mudar a sua vida.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Com mais controle estrategico e profissional de suas finanças.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <article
                key={resource.title}
                className={`${styles.featureCard} ${styles.fadeUp} ${index === 0 ? styles.delay1 : index === 1 ? styles.delay2 : styles.delay3}`}
              >
                <span className={styles.featureIcon}>
                  {index === 0 ? <ChartIcon /> : index === 1 ? <WalletIcon /> : <SparkIcon />}
                </span>
                <h3 className={`${styles.displayFont} mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950`}>
                  {resource.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{resource.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-8 rounded-[2rem] border border-emerald-100 bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div>
              <span className={styles.sectionTag}>Como funciona</span>
              <h2 className={`${styles.displayFont} mt-5 text-4xl font-extrabold tracking-[-0.05em] text-slate-950`}>
                Fluxo simples para sair do zero e entrar no painel.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A landing entrega contexto, prova visual e direciona para a autenticacao com menos atrito.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div key={step.title} className={styles.stepCard}>
                  <div className="flex items-start gap-4">
                    <span className={styles.stepNumber}>0{index + 1}</span>
                    <div>
                      <h3 className={`${styles.displayFont} text-2xl font-bold tracking-[-0.03em] text-slate-950`}>
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="precos" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className={styles.sectionTag}>Precos</span>
              <h2 className={`${styles.displayFont} mt-5 text-4xl font-extrabold tracking-[-0.05em] text-slate-950`}>
                Um ponto de entrada honesto para apresentar o sistema.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Mantive a secao de precos enxuta para combinar com o estado atual do projeto e ainda assim dar
                acabamento de produto real para a pagina inicial.
              </p>
            </div>

            {plans.map((plan) => (
              <article key={plan.name} className={styles.pricingCard}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{plan.name}</p>
                    <p className={`${styles.displayFont} mt-3 text-5xl font-extrabold tracking-[-0.06em] text-slate-950`}>
                      {plan.price}
                    </p>
                  </div>
                 
                </div>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{plan.description}</p>

                

                
              </article>
            ))}
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-6xl px-6 pb-24">
          <div className={styles.contactCard}>
            <div>
              <span className={styles.sectionTag}>Contato</span>
              <h2 className={`${styles.displayFont} mt-5 max-w-2xl text-4xl font-extrabold tracking-[-0.05em] text-white`}>
                A GIVIFIN ESTA AQUI POR VOCE.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">
                Qualquer erro em nosso sistema, entre em contato e reporte o erro, que logo ira ser atendido e resolvido.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/login" className={styles.lightButton}>
                Fazer login
              </Link>
              <a href="mailto:contato@givifin.local" className={styles.contactLink}>
                matheusnalon89@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
