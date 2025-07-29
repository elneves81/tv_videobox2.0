import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com Railway...')
    console.log('📝 URL sendo usada:', process.env.DATABASE_URL || 'NENHUMA URL ENCONTRADA')
    
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão com Railway estabelecida!')
    
    // Testar se as tabelas existem
    console.log('🔍 Verificando tabelas...')
    
    // Testar tabela User
    const userCount = await prisma.user.count()
    console.log(`✅ Tabela User existe! Total de usuários: ${userCount}`)
    
    // Testar tabela Category
    const categoryCount = await prisma.category.count()
    console.log(`✅ Tabela Category existe! Total de categorias: ${categoryCount}`)
    
    // Testar tabela Product
    const productCount = await prisma.product.count()
    console.log(`✅ Tabela Product existe! Total de produtos: ${productCount}`)
    
    console.log('🎉 Banco Railway funcionando perfeitamente!')
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Railway:', error)
    
    if (error.code === 'P1001') {
      console.error('💡 Problema de conexão - Verifique a DATABASE_URL')
    } else if (error.code === 'P2021') {
      console.error('💡 Tabela não existe - Execute as migrations')
    } else {
      console.error('💡 Erro desconhecido:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
