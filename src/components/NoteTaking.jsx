import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Download,
  FileSpreadsheet, 
  Search,
  Check,
  Calendar,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTasks } from '../context/TaskContext';

const NOTE_COLORS = [
  { name: 'Indigo', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500' },
  { name: 'Teal', bg: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30 text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
  { name: 'Amber', bg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  { name: 'Rose', bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  { name: 'Emerald', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' }
];

export default function NoteTaking() {
  const { addToast } = useTasks();
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('office_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('Indigo');

  // Persistence
  useEffect(() => {
    localStorage.setItem('office_notes', JSON.stringify(notes));
  }, [notes]);

  const handleOpenAdd = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setSelectedColor('Indigo');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Validation Error', 'error', 'Both title and content are required.');
      return;
    }

    const noteDate = new Date().toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (editingNote) {
      // Edit
      setNotes(prev => prev.map(n => n.id === editingNote.id ? {
        ...n,
        title,
        content,
        color: selectedColor,
        date: noteDate
      } : n));
      addToast('Note Updated', 'success', 'Changes saved successfully.');
    } else {
      // Create
      const newNote = {
        id: `note-${Date.now()}`,
        title,
        content,
        color: selectedColor,
        date: noteDate
      };
      setNotes(prev => [newNote, ...prev]);
      addToast('Note Created', 'success', 'New sticky note added.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      addToast('Note Deleted', 'success', 'The sticky note has been removed.');
    }
  };

  // Export Individual Note to Word (.doc)
  const exportNoteToWord = (note) => {
    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${note.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; color: #334155; }
          h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 5px; font-size: 24px; }
          .meta { color: #64748b; font-size: 11px; margin-bottom: 25px; font-style: italic; }
          .content { white-space: pre-wrap; font-size: 14px; color: #1e293b; background: #f8fafc; border-left: 4px solid #818cf8; padding: 15px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <h1>${note.title}</h1>
        <div class="meta">Last Updated: ${note.date}</div>
        <div class="content">${note.content.replace(/\n/g, '<br/>')}</div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Word Document Downloaded', 'success', `Saved "${note.title}" to downloads.`);
  };

  // Export All Notes to Excel (.xlsx)
  const exportAllToExcel = () => {
    if (notes.length === 0) {
      addToast('No Notes Available', 'warning', 'Create notes before exporting to Excel.');
      return;
    }

    const data = notes.map(n => ({
      'Note ID': n.id,
      'Title': n.title,
      'Content Body': n.content,
      'Color Category': n.color,
      'Last Modified': n.date
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Office Notes');
    XLSX.writeFile(workbook, `office_notes_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast('Excel Sheet Exported', 'success', 'All notes exported to spreadsheet.');
  };

  // Filter Notes
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header Panel */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-500" /> Note Taking Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Capture sudden thoughts, drafts, or meeting briefs, and export them directly to Word or Excel files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAllToExcel}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-55 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet size={14} className="text-emerald-500" /> Export Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> New Note
          </button>
        </div>
      </motion.div>

      {/* Search Filter Box */}
      <motion.div variants={itemVariants} className="relative w-full">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search sticky notes titles or body..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
        />
      </motion.div>

      {/* Grid List rendering */}
      {filteredNotes.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNotes.map((note) => {
            const colorObj = NOTE_COLORS.find(c => c.name === note.color) || NOTE_COLORS[0];
            
            return (
              <motion.div
                variants={itemVariants}
                key={note.id}
                className={`p-5 rounded-2xl border bg-white/40 dark:bg-slate-900/40 hover:scale-[1.01] hover:border-indigo-500/20 transition-all flex flex-col justify-between min-h-[200px] relative overflow-hidden`}
              >
                {/* Color tag top indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorObj.dot}`} />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 pt-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                      {note.title}
                    </h4>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${colorObj.bg}`}>
                      {note.color}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans line-clamp-5 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {note.date.split(',')[0]}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportNoteToWord(note)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-500 transition-colors"
                      title="Download as Word doc (.doc)"
                    >
                      <FileText size={12} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                      title="Edit note"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 rounded-lg border border-rose-500/10 hover:bg-rose-500/10 text-rose-500 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-slate-450 dark:text-slate-550">
          <FileText size={42} className="stroke-[1.5] mb-2 text-slate-400/80" />
          <span className="text-xs font-semibold">No sticky notes found. Create your first note desk block!</span>
        </div>
      )}

      {/* Add/Edit Notes Drawer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Edit3 size={16} className="text-indigo-500" /> {editingNote ? 'Modify Sticky Note' : 'Draft Sticky Note'}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Note Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter short title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-550 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Content Details</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Type details, summaries, code, or checkmarks..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-550 text-slate-800 dark:text-slate-100 font-sans resize-none"
                  />
                </div>

                {/* Colors Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tag Category Color</label>
                  <div className="flex gap-2">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${c.dot} ${
                          selectedColor === c.name ? 'border-indigo-500 scale-110 shadow-md shadow-indigo-500/10' : 'border-transparent hover:scale-105'
                        }`}
                        title={c.name}
                      >
                        {selectedColor === c.name && <Check size={12} className="text-white font-bold" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
