const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Unimarket:root@cluster0.yhrjd.mongodb.net/studyflow?retryWrites=true&w=majority';

async function createDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...\n');
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Conexión exitosa a MongoDB Atlas!\n');
    console.log('📊 Información de la base de datos:');
    console.log('   - Cluster: cluster0.yhrjd.mongodb.net');
    console.log('   - Database: studyflow');
    console.log('   - Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
    
    // Crear las colecciones con índices
    console.log('\n🔨 Creando colecciones e índices...\n');
    
    const db = mongoose.connection.db;
    
    const collections = [
      'users',
      'subjects', 
      'tasks',
      'topics',
      'notes',
      'pomoodorosessions',
      'dailyprogresses'
    ];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✓ Colección '${collectionName}' creada`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`✓ Colección '${collectionName}' ya existe`);
        } else {
          throw error;
        }
      }
    }
    
    // Crear índices importantes
    console.log('\n📑 Creando índices...\n');
    
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✓ Índice único en users.email');
    
    await db.collection('tasks').createIndex({ userId: 1, createdAt: -1 });
    console.log('✓ Índice compuesto en tasks (userId, createdAt)');
    
    await db.collection('subjects').createIndex({ userId: 1 });
    console.log('✓ Índice en subjects.userId');
    
    await db.collection('notes').createIndex({ userId: 1, updatedAt: -1 });
    console.log('✓ Índice compuesto en notes (userId, updatedAt)');
    
    await db.collection('dailyprogresses').createIndex({ userId: 1, date: 1 }, { unique: true });
    console.log('✓ Índice único compuesto en dailyprogresses (userId, date)');
    
    // Mostrar estadísticas
    console.log('\n📈 Estadísticas de colecciones:\n');
    
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   ${collectionName}: ${count} documentos`);
    }
    
    console.log('\n✨ Base de datos inicializada correctamente!');
    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Inicia la aplicación: npm run dev');
    console.log('   2. Regístrate en: http://localhost:3000/auth/register');
    console.log('   3. ¡Empieza a usar StudyFlow!');
    
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();
