import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Função para validar e limpar imagens (versão mais permissiva)
    const validateAndCleanImages = (images: string): string => {
      if (!images || images.trim() === '') return '';
      
      const imageArray = images.split(',').filter(img => {
        const trimmed = img.trim();
        if (!trimmed) return false;
        
        // Se for data URL, fazer validação básica
        if (trimmed.startsWith('data:image/')) {
          // Apenas verificar se tem o formato básico
          return trimmed.includes('base64,');
        }
        
        // Se for URL externa, validar formato básico
        if (/^https?:\/\//i.test(trimmed)) {
          return true;
        }
        
        return false;
      });
      
      return imageArray.join(',');
    };

    // Verificar se as imagens são válidas (validação menos rigorosa)
    let validImages = product.images || '';

    const productResponse = {
      ...product,
      images: validImages
    };

    return NextResponse.json(productResponse);
  } catch (error) {
    console.warn('Erro ao buscar produto:', error instanceof Error ? error.message : 'Erro desconhecido');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      title,
      description,
      price,
      type,
      condition,
      categoryId,
      neighborhood,
      images,
    } = body;

    // Validate required fields
    if (!title || !description || !type || !condition || !categoryId || !neighborhood) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Validate transaction type and price
    if (type === 'VENDA' && (!price || price <= 0)) {
      return NextResponse.json(
        { error: 'Preço é obrigatório para vendas' },
        { status: 400 }
      );
    }

    // Importar função de compressão
    const { compressMultipleImages } = await import('@/lib/image-utils');
    
    // Comprimir imagens antes de atualizar no banco
    let imageString = '';
    if (images) {
      // Pode ser array ou string
      imageString = Array.isArray(images) ? images.join(',') : images;
      imageString = await compressMultipleImages(imageString);
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        price: type === 'VENDA' ? price : 0,
        type,
        condition,
        categoryId,
        neighborhood,
        images: imageString as any, // Cast forçado porque sabemos que o schema aceita string
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.warn('Erro ao atualizar produto:', error instanceof Error ? error.message : 'Erro desconhecido');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.warn('Erro ao deletar produto:', error instanceof Error ? error.message : 'Erro desconhecido');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
