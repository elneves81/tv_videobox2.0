const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📦 Total de produtos no banco: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ Nenhum produto encontrado no banco de dados.');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. 📋 ${product.title}`);
        console.log(`   💰 Tipo: ${product.type}`);
        console.log(`   📂 Categoria: ${product.category.name}`);
        console.log(`   👤 Usuário: ${product.user.name} (${product.user.email})`);
        console.log(`   📍 Bairro: ${product.neighborhood}`);
        console.log(`   📅 Criado em: ${new Date(product.createdAt).toLocaleString('pt-BR')}`);
        console.log(`   🔗 ID: ${product.id}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar produtos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
