/**
 * Lista completa dos bairros de Guarapuava - PR
 * Atualizada em 2025
 */
export const GUARAPUAVA_NEIGHBORHOODS = [
  // Região Central
  'Centro',
  'Vila Bela',
  'Santana',
  'Morro Alto',
  'Coronel Matos',
  
  // Região Norte
  'Bonsucesso',
  'Parque das Águas',
  'Jardim das Américas',
  'Jardim Primavera',
  'Jardim Europa',
  'Recanto Feliz',
  'Parque do Som',
  'Bairro dos Estados',
  'Vila Carli',
  'Parque Universitário',
  'Alto da XV',
  'Cascavel',
  'Bairro Industrial',
  'Jardim Paineiras',
  
  // Região Sul
  'Trianon',
  'Bairro dos Pioneiros',
  'Xarquinho',
  'Vila Esperança',
  'Jardim Araucária',
  'Parque Industrial',
  'Distrito Industrial',
  'Parque São Jorge',
  'Jardim Porto Alegre',
  'Bairro Palmeirinha',
  'Bairro Feroz',
  'Bairro das Pedras',
  'Jardim Bela Vista',
  
  // Região Leste
  'Conradinho',
  'Bairro Santarém',
  'Jardim São Cristóvão',
  'Parque Verde',
  'Alto da Colina',
  'Jardim Paraná',
  'Vila Nova',
  'Bairro Carambei',
  'Jardim Campestre',
  'Alto Cascavel',
  
  // Região Oeste
  'Virgínia',
  'Bairro Bokel',
  'Jardim Boa Vista',
  'Bairro Peacaes',
  'Vila Sete',
  'Parque Itamaraty',
  'Bairro Jardim Quintal',
  'Alto da Vila',
  'Jardim Imperial',
  'Jardim Santa Cruz',
  
  // Conjuntos Habitacionais
  'Conjunto Habitacional Concórdia',
  'Conjunto Habitacional Mauá',
  'Conjunto Habitacional Parigot de Souza',
  'Conjunto Habitacional Primavera',
  'Conjunto Habitacional Vila Carli',
  'Conjunto Habitacional Batel',
  'Conjunto Residencial Village',
  'Conjunto Residencial Golden Park',
  'Residencial Guairacá',
  'Residencial Panorama',
  
  // Bairros Novos/Loteamentos
  'Loteamento Cidade Nova',
  'Loteamento Parque dos Pássaros',
  'Loteamento Alto da Boa Vista',
  'Residencial Portal do Sol',
  'Residencial Morada do Sol',
  'Residencial das Flores',
  'Loteamento Ouro Verde',
  'Jardim Guairacá',
  'Portal de Versalhes',
  'Residencial Parque das Araucárias',
  
  // Vilas e Localidades
  'Vila São Francisco',
  'Vila Maria',
  'Vila São José',
  'Vila Antônio',
  'Vila Rica',
  'Vila Industrial',
  'Vila Operária',
  'Vila Becker',
  'Vila Segismundo',
  'Vila Marumbi',
  
  // Bairros Rurais/Periféricos
  'Campo do Fogo',
  'Morro da Cruz',
  'Linha Anta Gorda',
  'São Luiz',
  'Entre Rios',
  'Guará',
  'Palmital',
  'Curitibanos',
  'Água Amarela',
  'Cará-Cará',
  
  'Outros' // Para casos não listados
].sort(); // Ordenar alfabeticamente

/**
 * Função para validar se um bairro existe na lista
 */
export function isValidNeighborhood(neighborhood: string): boolean {
  return GUARAPUAVA_NEIGHBORHOODS.includes(neighborhood);
}

/**
 * Função para buscar bairros por nome (autocomplete)
 */
export function searchNeighborhoods(query: string, limit = 10): string[] {
  if (!query) return GUARAPUAVA_NEIGHBORHOODS.slice(0, limit);
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return GUARAPUAVA_NEIGHBORHOODS
    .filter(neighborhood => 
      neighborhood.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}

/**
 * Grupos de bairros por região (para organização)
 */
export const NEIGHBORHOODS_BY_REGION = {
  'Centro': [
    'Centro',
    'Vila Bela', 
    'Santana',
    'Morro Alto',
    'Coronel Matos'
  ],
  'Norte': [
    'Bonsucesso',
    'Parque das Águas',
    'Jardim das Américas',
    'Jardim Primavera',
    'Jardim Europa',
    'Recanto Feliz',
    'Parque do Som',
    'Bairro dos Estados',
    'Vila Carli',
    'Parque Universitário'
  ],
  'Sul': [
    'Trianon',
    'Bairro dos Pioneiros',
    'Xarquinho',
    'Vila Esperança',
    'Jardim Araucária',
    'Parque Industrial',
    'Distrito Industrial'
  ],
  'Leste': [
    'Conradinho',
    'Bairro Santarém',
    'Jardim São Cristóvão',
    'Parque Verde',
    'Alto da Colina',
    'Jardim Paraná'
  ],
  'Oeste': [
    'Virgínia',
    'Bairro Bokel',
    'Jardim Boa Vista',
    'Bairro Peacaes',
    'Vila Sete',
    'Parque Itamaraty'
  ]
};
