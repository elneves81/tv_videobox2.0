const NEON_API_KEY = 'napi_90airiia0cbgzn0a9wj609hap2v2j86seq64kqsw3drld0ikor34ynl2n4obmqxz';

async function getNeonProjects() {
  try {
    const response = await fetch('https://console.neon.tech/api/v2/projects', {
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Seus projetos Neon:');
    console.log(JSON.stringify(data, null, 2));

    if (data.projects && data.projects.length > 0) {
      const project = data.projects[0]; // Primeiro projeto
      console.log('\n--- INFORMAÇÕES DO PROJETO ---');
      console.log('Project ID:', project.id);
      console.log('Project Name:', project.name);
      console.log('Region:', project.region_id);
      
      // Buscar connection string
      await getConnectionString(project.id);
    }
  } catch (error) {
    console.error('Erro ao buscar projetos:', error.message);
  }
}

async function getConnectionString(projectId) {
  try {
    const response = await fetch(`https://console.neon.tech/api/v2/projects/${projectId}/connection_uri`, {
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('\n--- CONNECTION STRING ---');
    console.log('DATABASE_URL=', data.uri);
    console.log('\nCopie esta URL e cole no seu arquivo .env.local');
  } catch (error) {
    console.error('Erro ao buscar connection string:', error.message);
  }
}

getNeonProjects();
