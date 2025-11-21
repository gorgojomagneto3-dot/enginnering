'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { getNotes, createNote, updateNote, deleteNote as apiDeleteNote } from '@/lib/api-client';
import { Plus, Search, StickyNote, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotesEditor() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateNote = async () => {
    if (!formData.title || !formData.content) return;

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      if (selectedNote && isEditing) {
        const updated = await updateNote(selectedNote.id, {
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
        });
        setNotes(notes.map(note => note.id === selectedNote.id ? updated : note));
      } else {
        const created = await createNote({
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
        });
        setNotes([...notes, created]);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const deleteNoteHandler = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
    try {
      await apiDeleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const editNote = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      subject: note.subject,
      tags: note.tags.join(', '),
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', subject: '', tags: '' });
    setSelectedNote(null);
    setIsEditing(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando notas...</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Lista de notas */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Notas</h2>
            <button
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay notas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedNote?.id === note.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {format(note.updatedAt, 'd MMM', { locale: es })}
                    </span>
                    {note.subject && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {note.subject}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visor/Editor de notas */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedNote ? 'Editar Nota' : 'Nueva Nota'}
              </h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Materia"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Etiquetas (separadas por coma)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <textarea
                placeholder="Escribe tu nota aquí..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[400px]"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-2">
              <button
                onClick={createOrUpdateNote}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {selectedNote ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedNote.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {selectedNote.subject && (
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {selectedNote.subject}
                      </span>
                    )}
                    <span>
                      Actualizado {format(selectedNote.updatedAt, "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  {selectedNote.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {selectedNote.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editNote(selectedNote)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteNoteHandler(selectedNote.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {selectedNote.content}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <StickyNote className="w-20 h-20 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Selecciona una nota para verla</p>
              <p className="text-sm">o crea una nueva nota</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
