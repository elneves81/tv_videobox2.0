const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    id: 'roupas',
    name: 'Roupas e Acessórios',
    description: 'Roupas masculinas, femininas, infantis, sapatos, bolsas e acessórios',
    slug: 'roupas-e-acessorios'
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos',
    description: 'Celulares, tablets, notebooks, TVs, videogames e outros eletrônicos',
    slug: 'eletronicos'
  },
  {
    id: 'moveis',
    name: 'Móveis e Decoração',
    description: 'Móveis para casa, decoração, eletrodomésticos e utensílios domésticos',
    slug: 'moveis-e-decoracao'
  },
  {
    id: 'livros',
    name: 'Livros e Material Escolar',
    description: 'Livros, apostilas, material escolar e universitário',
    slug: 'livros-e-material-escolar'
  },
  {
    id: 'esportes',
    name: 'Esportes e Lazer',
    description: 'Equipamentos esportivos, bicicletas, jogos e instrumentos musicais',
    slug: 'esportes-e-lazer'
  },
  {
    id: 'casa',
    name: 'Casa e Jardim',
    description: 'Itens para casa, jardim, ferramentas e materiais de construção',
    slug: 'casa-e-jardim'
  },
  {
    id: 'bebes',
    name: 'Bebês e Crianças',
    description: 'Roupas infantis, brinquedos, carrinho de bebê e artigos para crianças',
    slug: 'bebes-e-criancas'
  },
  {
    id: 'veiculos',
    name: 'Veículos e Peças',
    description: 'Carros, motos, bicicletas, peças e acessórios automotivos',
    slug: 'veiculos-e-pecas'
  }
];

async function main() {
  console.log('🌱 Iniciando população de categorias...');

  for (const category of categories) {
    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: category.id }
      });

      if (existingCategory) {
        console.log(`⚠️  Categoria "${category.name}" já existe, pulando...`);
        continue;
      }

      await prisma.category.create({
        data: category
      });

      console.log(`✅ Categoria "${category.name}" criada com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao criar categoria "${category.name}":`, error);
    }
  }

  console.log('🎉 População de categorias concluída!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a população:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
