# StudyFlow - Plataforma Profesional para Estudiantes Universitarios

Una aplicación web elegante y profesional con diseño estilo Apple, diseñada para ayudar a estudiantes universitarios a organizarse mejor. StudyFlow centraliza todas las herramientas necesarias para gestionar tu vida académica de manera eficiente, con autenticación completa y persistencia en MongoDB.

## 🚀 Características

### 📋 Planificación de Tareas
- Crea y organiza tus tareas académicas
- Establece fechas límite y prioridades
- Rastrea el estado de cada tarea (pendiente, en progreso, completada)
- Filtra tareas por materia

### 📚 Seguimiento por Materias
- Registra todas tus materias con colores personalizados
- Crea temas y subtemas para cada materia
- Visualiza tu progreso con barras de progreso
- Marca temas como completados

### 📝 Editor de Notas Académicas
- Crea notas con formato rico
- Organiza notas por materia
- Añade etiquetas para mejor búsqueda
- Búsqueda rápida entre todas tus notas

### ⏰ Temporizador Pomodoro
- Técnica Pomodoro integrada (25 min trabajo, 5 min descanso)
- Estadísticas de sesiones diarias y semanales
- Timer visual con indicador circular de progreso
- Notificaciones sonoras al completar sesiones

### 📊 Dashboard Centralizado
- Vista general de todas tus actividades
- Tareas de hoy y próximas
- Progreso en materias
- Estadísticas de Pomodoro
- Notas recientes

## 🛠️ Tecnologías

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático completo
- **MongoDB + Mongoose** - Base de datos NoSQL
- **NextAuth.js** - Autenticación (Google, GitHub, Credentials)
- **Tailwind CSS** - Estilos estilo Apple minimalistas
- **Framer Motion** - Animaciones fluidas
- **Zod** - Validación de esquemas
- **React Hot Toast** - Notificaciones elegantes
- **Lucide React** - Iconos modernos
- **date-fns** - Manejo de fechas

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd enginnering
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` con:
```env
MONGODB_URI=mongodb://localhost:27017/studyflow
NEXTAUTH_SECRET=tu-clave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

GITHUB_ID=tu-github-id
GITHUB_SECRET=tu-github-secret
```

4. Inicia MongoDB localmente o usa MongoDB Atlas

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000) y crea tu cuenta

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea la versión de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📱 Características de Diseño

- **Diseño Estilo Apple**: Minimalista, limpio, con atención al detalle
- **Glassmorphism**: Efectos de vidrio con backdrop-blur
- **Responsive**: Funciona perfectamente en móviles, tablets y escritorio
- **Dark Mode**: Modo oscuro automático según preferencias del sistema
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Sidebar Colapsable**: Maximiza el espacio de trabajo
- **Tipografía SF Pro**: Fuente elegante similar a productos Apple

## 🎯 Casos de Uso

1. **Estudiante de Ingeniería**: Organiza proyectos complejos, registra avance en múltiples materias técnicas
2. **Estudiante de Medicina**: Toma notas detalladas, usa Pomodoro para sesiones de estudio intensivo
3. **Estudiante de Derecho**: Gestiona fechas de entrega, organiza notas por asignaturas
4. **Estudiante General**: Mantén todas tus responsabilidades académicas en un solo lugar

## 🔒 Seguridad

- **Autenticación robusta** con NextAuth.js
- **Contraseñas hasheadas** con bcryptjs
- **Validación de datos** con Zod
- **Rutas protegidas** con middleware
- **Sesiones JWT** seguras
- Datos almacenados de forma segura en MongoDB

## 🚧 Próximas Características

- Exportar/importar datos
- Temas claro/oscuro
- Calendario integrado
- Recordatorios y notificaciones
- Sincronización en la nube (opcional)

## 📄 Licencia

ISC

## 👨‍💻 Autor

Creado con ❤️ para estudiantes universitarios

---

**¡Empieza a organizar tu vida universitaria hoy mismo!** 🎓✨
