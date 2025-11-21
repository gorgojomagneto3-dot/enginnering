'use client';

import { useState, useEffect } from 'react';
import { Subject, Topic } from '@/types';
import { getSubjects, saveSubjects } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { Plus, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SubjectTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: COLORS[0] });
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const addSubject = () => {
    if (!newSubject.name) return;

    const subject: Subject = {
      id: generateId(),
      ...newSubject,
      progress: 0,
      topics: [],
    };

    const updatedSubjects = [...subjects, subject];
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    setNewSubject({ name: '', color: COLORS[0] });
    setShowForm(false);
  };

  const addTopic = (subjectId: string) => {
    if (!newTopic) return;

    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const topic: Topic = {
          id: generateId(),
          name: newTopic,
          completed: false,
          subjectId,
        };
        const topics = [...subject.topics, topic];
        const completedCount = topics.filter(t => t.completed).length;
        const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
        return { ...subject, topics, progress };
      }
      return subject;
    });

    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    setNewTopic('');
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const topics = subject.topics.map(topic =>
          topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
        );
        const completedCount = topics.filter(t => t.completed).length;
        const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
        return { ...subject, topics, progress };
      }
      return subject;
    });

    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
  };

  const deleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter(s => s.id !== id);
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const topics = subject.topics.filter(t => t.id !== topicId);
        const completedCount = topics.filter(t => t.completed).length;
        const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
        return { ...subject, topics, progress };
      }
      return subject;
    });

    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
  };

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
