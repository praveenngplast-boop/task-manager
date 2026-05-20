import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  setDarkMode,
  setIsCommandPaletteOpen,
  setActiveTab,
  selectedTask,
  editTask,
  deleteTask,
  exportToExcel,
  exportToPDF,
  addToast,
  setIsNewTaskModalOpen,
  setIsNewDeptModalOpen,
  setShowAdvancedFilters,
  setShowShortcutsHelp,
  setIsSidebarCollapsed,
  undo,
  redo
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = document.activeElement.tagName === 'INPUT' || 
                      document.activeElement.tagName === 'TEXTAREA' ||
                      document.activeElement.isContentEditable;

      // Global Escape key close preview modal
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        if (setShowShortcutsHelp) setShowShortcutsHelp(false);
        return;
      }

      // If active focus is on input/textarea, only capture Ctrl+Z / Ctrl+Y undo redo
      if (isInput) {
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
          // Allow regular undo inside inputs, don't preventDefault unless focused out of text inputs
          // But if they are just pressing ctrl+z, they want native input undo.
        }
        return;
      }

      // Ctrl + Z -> Global Undo
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl + Y -> Global Redo
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl + D -> Toggle Dark Mode
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDarkMode(prev => !prev);
        addToast('Theme Toggled', 'info', 'Switched visual display theme.');
        return;
      }

      // Ctrl + K -> Command Palette
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Ctrl + N -> New Task Composer
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewTaskModalOpen(true);
        return;
      }

      // Ctrl + Shift + N -> New Department Modal
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewDeptModalOpen(true);
        return;
      }

      // Ctrl + F -> Focus search input
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-bar-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // Ctrl + Shift + F -> Toggle Advanced Filters
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowAdvancedFilters(prev => !prev);
        addToast('Filters Toggled', 'info', 'Advanced filters overlay switched.');
        return;
      }

      // Ctrl + E -> Export tasks to Excel
      if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        exportToExcel();
        return;
      }

      // Ctrl + I -> Import tasks from Excel
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        const inputEl = document.getElementById('excel-file-import-input');
        if (inputEl) {
          inputEl.click();
        } else {
          addToast('Import Initiator Missing', 'error', 'No Excel loader detected on screen.');
        }
        return;
      }

      // Ctrl + P -> Print dashboard
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
        return;
      }

      // Ctrl + Shift + D -> Download PDF Report
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        exportToPDF();
        return;
      }

      // Ctrl + / -> Open shortcuts help dialog
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        if (setShowShortcutsHelp) {
          setShowShortcutsHelp(prev => !prev);
        }
        return;
      }

      // Ctrl + G -> Go to Dashboard
      if (e.ctrlKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setActiveTab('dashboard');
        addToast('Tab Switched', 'info', 'Opened Executive Dashboard.');
        return;
      }

      // Ctrl + B -> Toggle sidebar collapse
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (setIsSidebarCollapsed) {
          setIsSidebarCollapsed(prev => !prev);
        }
        return;
      }

      // Ctrl + Shift + C -> Complete selected preview task
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (selectedTask) {
          editTask(selectedTask.id, { status: 'Completed', progress: 100 });
        }
        return;
      }

      // Delete -> Delete highlighted task
      if (e.key === 'Delete') {
        if (selectedTask) {
          deleteTask(selectedTask.id);
        }
        return;
      }

      // Alt + 1-5 -> Switch workspace tabs
      if (e.altKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const tabs = ['dashboard', 'tasks', 'kanban', 'notes', 'settings'];
        const idx = parseInt(e.key, 10) - 1;
        if (idx < tabs.length) {
          setActiveTab(tabs[idx]);
          addToast(`Tab Switched`, 'info', `Navigated to ${tabs[idx].toUpperCase()}`);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setDarkMode,
    setIsCommandPaletteOpen,
    setActiveTab,
    selectedTask,
    editTask,
    deleteTask,
    exportToExcel,
    exportToPDF,
    addToast,
    setIsNewTaskModalOpen,
    setIsNewDeptModalOpen,
    setShowAdvancedFilters,
    setShowShortcutsHelp,
    setIsSidebarCollapsed,
    undo,
    redo
  ]);
};
