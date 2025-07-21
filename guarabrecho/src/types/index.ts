export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: ProductCategory
  condition: ProductCondition
  transactionType: TransactionType
  neighborhood: string
  userId: string
  user: User
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
  products: Product[]
}

export enum ProductCategory {
  ROUPAS = 'ROUPAS',
  ELETRONICOS = 'ELETRONICOS',
  MOVEIS = 'MOVEIS',
  LIVROS = 'LIVROS',
  ESPORTES = 'ESPORTES',
  CASA_JARDIM = 'CASA_JARDIM',
  BRINQUEDOS = 'BRINQUEDOS',
  OUTROS = 'OUTROS',
}

export enum ProductCondition {
  NOVO = 'NOVO',
  SEMI_NOVO = 'SEMI_NOVO',
  USADO = 'USADO',
}

export enum TransactionType {
  VENDA = 'VENDA',
  TROCA = 'TROCA',
  DOACAO = 'DOACAO',
}

export const NEIGHBORHOODS = [
  'Centro',
  'Trianon',
  'Batel',
  'Santana',
  'Primavera',
  'Carli',
  'Boqueirão',
  'Paz',
  'Morro Alto',
  'Campo Belo',
  'Industrial',
  'Xarquinho',
  'Jardim América',
  'São Cristóvão',
  'Virmond',
  'Vila Carli',
  'Parque das Américas',
  'Santa Cruz',
  'Outro',
] as const

export const CATEGORY_LABELS = {
  [ProductCategory.ROUPAS]: 'Roupas & Acessórios',
  [ProductCategory.ELETRONICOS]: 'Eletrônicos',
  [ProductCategory.MOVEIS]: 'Móveis & Decoração',
  [ProductCategory.LIVROS]: 'Livros & Revistas',
  [ProductCategory.ESPORTES]: 'Esportes & Lazer',
  [ProductCategory.CASA_JARDIM]: 'Casa & Jardim',
  [ProductCategory.BRINQUEDOS]: 'Brinquedos & Jogos',
  [ProductCategory.OUTROS]: 'Outros',
}

export const CONDITION_LABELS = {
  [ProductCondition.NOVO]: 'Novo',
  [ProductCondition.SEMI_NOVO]: 'Semi-novo',
  [ProductCondition.USADO]: 'Usado',
}

export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.VENDA]: 'Venda',
  [TransactionType.TROCA]: 'Troca',
  [TransactionType.DOACAO]: 'Doação',
}
