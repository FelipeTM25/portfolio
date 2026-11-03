export type Lang = 'es' | 'en'

/** The five layers a request crosses. Each section of the page is one layer. */
export const LAYERS = ['cliente', 'controller', 'dominio', 'persistencia', 'respuesta'] as const
export type LayerId = (typeof LAYERS)[number]

export type StackLayer = 'frontend' | 'backend' | 'datos' | 'infra'

export interface Highlight {
  value: string
  label: string
}

export interface CaseStudy {
  id: 'fuelix' | 'fitally'
  context: string
  name: string
  status: string
  tagline: string
  problemTitle: string
  problem: string
  approachTitle: string
  approach: string
  highlights: Highlight[]
  role: string
  stack: string[]
}

export interface FuelixDiagramText {
  title: string
  dispenser: string
  dispenserSub: string
  gateway: string
  gatewaySub: string
  station: string
  stationSub: string
  cloud: string
  cloudSub: string
  goOffline: string
  goOnline: string
  online: string
  offline: string
  queued: string
  sales: string
  synced: string
}

export interface FitallyDiagramText {
  title: string
  client: string
  clientSub: string
  api: string
  apiSub: string
  db: string
  ai: string
  food: string
  exercises: string
  boundary: string
  actions: { id: 'food' | 'ai' | 'exercise'; label: string; log: string }[]
  idle: string
}

export interface OtherProject {
  name: string
  summary: string
  tags: string[]
  href?: string
}

export interface StackRow {
  name: string
  layers: StackLayer[]
  usedIn: string
  /** 1–5 */
  relevance: number
}

export interface Content {
  ui: {
    switchLang: string
    langShort: string
    themeToLight: string
    themeToDark: string
    skip: string
    nav: Record<LayerId, string>
  }
  layers: Record<LayerId, { name: string; code: string }>
  hero: {
    eyebrow: string
    name: string
    lead: string
    sending: string
    received: string
    cue: string
  }
  experience: {
    title: string
    intro: string
    jobTitle: string
    company: string
    period: string
    program: string
    jobSummary: string
    jobPoints: string[]
    jobTags: string[]
    educationTitle: string
    school: string
    degree: string
    principlesTitle: string
    principles: { name: string; body: string }[]
  }
  projects: {
    title: string
    intro: string
    problemLabel: string
    roleLabel: string
    stackLabel: string
    cases: [CaseStudy, CaseStudy]
    fuelixDiagram: FuelixDiagramText
    fitallyDiagram: FitallyDiagramText
    othersTitle: string
    othersIntro: string
    others: OtherProject[]
    viewCode: string
    privateRepo: string
  }
  stack: {
    title: string
    intro: string
    all: string
    layerNames: Record<StackLayer, string>
    colName: string
    colLayer: string
    colUsedIn: string
    colRelevance: string
    rowsLabel: (n: number) => string
    rows: StackRow[]
  }
  contact: {
    title: string
    lead: string
    linkedin: string
    github: string
    facts: { label: string; value: string }[]
    footer: string
    backToTop: string
  }
}
