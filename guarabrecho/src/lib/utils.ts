import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function generateWhatsAppURL(phone: string, productTitle: string): string {
  const message = `Olá! Tenho interesse no produto "${productTitle}" que vi no GuaraBrechó. Podemos conversar?`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodedMessage}`
}

export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '')
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
