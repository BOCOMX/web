const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const proyectosDir = path.join(__dirname, '_proyectos');
const outputFile = path.join(__dirname, 'proyectos.json');

const proyectos = [];

fs.readdirSync(proyectosDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(proyectosDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    proyectos.push({
      title: data.title,
      slug: file.replace('.md', ''),
      main_image: data.main_image,
      authors: data.participants || [],
      tipo: data.tipo || 'boco',
      destacado: data.destacado || false
    });
  }
});

fs.writeFileSync(outputFile, JSON.stringify(proyectos, null, 2));
console.log('¡proyectos.json generado con éxito!'); 