# 🚀 Configuración de MongoDB Atlas para StudyFlow

## ✅ Configuración Completada

### 📊 Base de Datos
- **Proveedor**: MongoDB Atlas
- **Cluster**: cluster0.yhrjd.mongodb.net
- **Base de datos**: studyflow
- **Usuario**: Unimarket

### 📝 Modelos Creados (7 colecciones)

1. **users** - Usuarios de la aplicación
   - name, email, password (hashed)
   - preferences (theme, pomodoro settings)
   - avatar, timestamps

2. **subjects** - Materias universitarias
   - name, color, icon
   - professor, schedule
   - progress, totalTopics, completedTopics

3. **tasks** - Tareas y actividades
   - title, description
   - dueDate, priority, status
   - estimatedPomodoros, completedPomodoros
   - tags, subjectId (ref)

4. **topics** - Temas por materia
   - name, description
   - isCompleted, order
   - resources, subjectId (ref)

5. **notes** - Notas académicas
   - title, content (markdown/rich text)
   - tags, isFavorite
   - subjectId (ref)

6. **pomoodorosessions** - Sesiones de Pomodoro
   - type (work/break/longBreak)
   - duration, completedAt
   - wasCompleted
   - taskId, subjectId (refs)

7. **dailyprogresses** - Estadísticas diarias
   - date (unique per user)
   - tasksCompleted, pomodorosCompleted
   - totalFocusMinutes, topicsCompleted

## 🔍 Verificar Conexión

### Opción 1: Endpoint de API
Visita: `http://localhost:3000/api/db-status`

Deberías ver algo como:
```json
{
  "status": "success",
  "database": {
    "state": "connected",
    "name": "studyflow",
    "host": "cluster0.yhrjd.mongodb.net"
  },
  "message": "✅ Conexión exitosa a MongoDB Atlas"
}
```

### Opción 2: Crear una cuenta
1. Ve a: `http://localhost:3000/auth/register`
2. Crea una cuenta con tus datos
3. Si se crea exitosamente, la BD está funcionando

### Opción 3: MongoDB Atlas Dashboard
1. Entra a [MongoDB Atlas](https://cloud.mongodb.com)
2. Ve a tu cluster "cluster0"
3. Click en "Browse Collections"
4. Deberías ver la base de datos "studyflow" con las colecciones

## 🎯 Próximos Pasos

1. **Crear tu cuenta** en `/auth/register`
2. **Login** en `/auth/login`
3. **Empezar a usar** la aplicación

Todas las operaciones (crear tareas, materias, notas, etc.) se guardarán automáticamente en MongoDB Atlas.

## 🔒 Seguridad

- Las contraseñas se hashean con bcryptjs (12 rounds)
- Las sesiones usan JWT tokens seguros
- Todas las rutas están protegidas con middleware
- Los datos se validan con Zod antes de guardar

## 📍 Archivos Importantes

- `.env.local` - Credenciales de MongoDB
- `src/lib/db.ts` - Conexión a MongoDB
- `src/lib/models/*` - Schemas de Mongoose
- `src/app/api/*` - Endpoints REST
- `src/middleware.ts` - Protección de rutas

---

**¡La base de datos está lista para usar!** 🎉
