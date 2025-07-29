const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_QqDK6Yeust0o@ep-odd-field-adutelrb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
})

async function testConnection() {
  try {
    console.log('🔌 Conectando ao Neon PostgreSQL...')
    
    // Teste de conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida')
    
    // Verificar tabelas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📋 Tabelas encontradas:', tables)
    
    // Verificar categorias
    try {
      const categories = await prisma.category.findMany()
      console.log('📝 Categorias encontradas:', categories.length)
      console.log('📝 Primeiras categorias:', categories.slice(0, 3))
    } catch (err) {
      console.error('❌ Erro ao buscar categorias:', err.message)
    }
    
    // Contar produtos
    try {
      const productCount = await prisma.product.count()
      console.log('📦 Total de produtos:', productCount)
    } catch (err) {
      console.error('❌ Erro ao contar produtos:', err.message)
    }
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
  } finally {
    await prisma.$disconnect()
    console.log('✅ Desconectado')
  }
}

testConnection()
