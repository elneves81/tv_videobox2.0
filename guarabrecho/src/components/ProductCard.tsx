import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { formatPrice, generateWhatsAppURL } from '@/lib/utils'
import { Product, TRANSACTION_TYPE_LABELS, CONDITION_LABELS } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleWhatsAppContact = () => {
    const url = generateWhatsAppURL(product.user.phone, product.title)
    window.open(url, '_blank')
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            product.transactionType === 'VENDA' 
              ? 'bg-green-100 text-green-800'
              : product.transactionType === 'TROCA'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {TRANSACTION_TYPE_LABELS[product.transactionType]}
          </span>
        </div>
        {product.transactionType !== 'DOACAO' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
            {formatPrice(product.price)}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/produto/${product.id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {CONDITION_LABELS[product.condition]}
            </span>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{product.neighborhood}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Link href={`/produto/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver Detalhes
              </Button>
            </Link>
            <Button 
              onClick={handleWhatsAppContact}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
