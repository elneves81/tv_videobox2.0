import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar categorias iniciais
  const categories = [
    {
      name: "Roupas e Acessórios",
      slug: "roupas-acessorios",
      description: "Roupas, sapatos, bolsas, joias e acessórios em geral"
    },
    {
      name: "Eletrônicos",
      slug: "eletronicos",
      description: "Celulares, tablets, notebooks, TVs, videogames e eletrônicos"
    },
    {
      name: "Móveis e Decoração",
      slug: "moveis-decoracao",
      description: "Móveis, objetos de decoração, utensílios domésticos"
    },
    {
      name: "Livros e Educação",
      slug: "livros-educacao",
      description: "Livros, materiais escolares, cursos e educação"
    },
    {
      name: "Esportes e Lazer",
      slug: "esportes-lazer",
      description: "Equipamentos esportivos, brinquedos, jogos e lazer"
    },
    {
      name: "Beleza e Saúde",
      slug: "beleza-saude",
      description: "Cosméticos, produtos de beleza e cuidados pessoais"
    },
    {
      name: "Casa e Jardim",
      slug: "casa-jardim",
      description: "Itens para casa, jardim, ferramentas e utensílios"
    },
    {
      name: "Automóveis e Peças",
      slug: "automoveis-pecas",
      description: "Peças, acessórios e itens automotivos"
    },
    {
      name: "Instrumentos Musicais",
      slug: "instrumentos-musicais",
      description: "Instrumentos musicais, equipamentos de som e áudio"
    },
    {
      name: "Outros",
      slug: "outros",
      description: "Outros itens não classificados nas categorias acima"
    }
  ]

  console.log('Criando categorias...')
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('Categorias criadas com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
