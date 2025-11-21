import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Subject } from '@/lib/models/Subject';
import { Task } from '@/lib/models/Task';
import { Topic } from '@/lib/models/Topic';
import { Note } from '@/lib/models/Note';
import { PomodoroSession } from '@/lib/models/PomodoroSession';
import { DailyProgress } from '@/lib/models/DailyProgress';

async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await connectDB();
    console.log('✅ Conexión exitosa a MongoDB Atlas!');

    console.log('\n📊 Verificando colecciones...');
    
    // Verificar que los modelos están registrados
    const models = [
      { name: 'User', model: User },
      { name: 'Subject', model: Subject },
      { name: 'Task', model: Task },
      { name: 'Topic', model: Topic },
      { name: 'Note', model: Note },
      { name: 'PomodoroSession', model: PomodoroSession },
      { name: 'DailyProgress', model: DailyProgress },
    ];

    for (const { name, model } of models) {
      const count = await model.countDocuments();
      console.log(`✓ ${name}: ${count} documentos`);
    }

    console.log('\n✨ Base de datos inicializada correctamente!');
    console.log('📍 Base de datos: studyflow');
    console.log('🌐 Cluster: cluster0.yhrjd.mongodb.net');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase();
