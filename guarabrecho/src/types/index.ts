export interface AdvancedSearchFilters {
  search?: string;
  category?: string;
  type?: string;
  condition?: string;
  neighborhood?: string;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[] | string
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

// Importar bairros da lista completa
import { GUARAPUAVA_NEIGHBORHOODS } from '@/lib/data/neighborhoods';

export const NEIGHBORHOODS = GUARAPUAVA_NEIGHBORHOODS;

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
