'use client';

import { useState, useEffect } from 'react';
import { Subject, Topic } from '@/types';
import { getSubjects, createSubject, getTopics, createTopic, updateTopic, deleteSubject as apiDeleteSubject, deleteTopic as apiDeleteTopic } from '@/lib/api-client';
import { Plus, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SubjectTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: COLORS[0] });
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      // Initialize topics as empty array since API doesn't return them nested by default
      const subjectsWithTopics = data.map(s => ({ ...s, topics: s.topics || [] }));
      setSubjects(subjectsWithTopics);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = async (subjectId: string) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
      return;
    }
    setExpandedSubject(subjectId);
    
    // Fetch topics if they haven't been loaded yet (or refresh them)
    try {
      const topics = await getTopics(subjectId);
      setSubjects(prev => prev.map(s => 
        s.id === subjectId ? { ...s, topics } : s
      ));
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const addSubject = async () => {
    if (!newSubject.name) return;

    try {
      const created = await createSubject({
        ...newSubject,
        progress: 0,
      });

      setSubjects([...subjects, { ...created, topics: [] }]);
      setNewSubject({ name: '', color: COLORS[0] });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create subject:', error);
    }
  };

  const addTopic = async (subjectId: string) => {
    if (!newTopic) return;

    try {
      const subject = subjects.find(s => s.id === subjectId);
      const order = subject ? subject.topics.length : 0;

      const created = await createTopic({
        subjectId,
        name: newTopic,
        order,
        isCompleted: false
      });

      setSubjects(prev => prev.map(s => {
        if (s.id === subjectId) {
          return { ...s, topics: [...s.topics, created] };
        }
        return s;
      }));
      setNewTopic('');
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const toggleTopic = async (subjectId: string, topicId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    if (!topic) return;

    try {
      const updated = await updateTopic(topicId, {
        isCompleted: !topic.completed
      });

      setSubjects(prev => prev.map(s => {
        if (s.id === subjectId) {
          const updatedTopics = s.topics.map(t => 
            t.id === topicId ? { ...t, completed: updated.completed } : t
          );
          // Recalculate progress locally or fetch from server
          // For now, simple local calculation
          const completedCount = updatedTopics.filter(t => t.completed).length;
          const progress = Math.round((completedCount / updatedTopics.length) * 100);
          
          return { ...s, topics: updatedTopics, progress };
        }
        return s;
      }));
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta materia?')) return;
    try {
      await apiDeleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  const deleteTopic = async (subjectId: string, topicId: string) => {
    try {
      await apiDeleteTopic(topicId);
      setSubjects(prev => prev.map(s => {
        if (s.id === subjectId) {
          const updatedTopics = s.topics.filter(t => t.id !== topicId);
          const completedCount = updatedTopics.filter(t => t.completed).length;
          const progress = updatedTopics.length > 0 ? Math.round((completedCount / updatedTopics.length) * 100) : 0;
          return { ...s, topics: updatedTopics, progress };
        }
        return s;
      }));
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando materias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Mis Materias</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Materia
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Crear Nueva Materia</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la materia"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewSubject({ ...newSubject, color })}
                    className={`w-10 h-10 rounded-full transition-all ${
                      newSubject.color === color ? 'ring-4 ring-gray-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addSubject}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Crear Materia
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tienes materias registradas</p>
            <p className="text-sm">¡Agrega tu primera materia para comenzar!</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="p-5" style={{ borderTop: `4px solid ${subject.color}` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-500">{subject.topics.length} temas</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span className="font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {expandedSubject === subject.id ? 'Ocultar temas' : 'Ver temas'}
                </button>

                {expandedSubject === subject.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                      {subject.topics.map(topic => (
                        <div key={topic.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => toggleTopic(subject.id, topic.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                topic.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {topic.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                            <span className={topic.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {topic.name}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTopic(subject.id, topic.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nuevo tema..."
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTopic(subject.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => addTopic(subject.id)}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
