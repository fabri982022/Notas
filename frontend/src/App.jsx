import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })
const emptyForm = { title: '', content: '', categoryIds: [] }

function App() {
  const [notes, setNotes] = useState([])
  const [categories, setCategories] = useState([])
  const [archived, setArchived] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCategories() {
    const response = await api.get('/categories')
    setCategories(response.data)
  }

  async function loadNotes() {
    const response = await api.get('/notes', { params: { archived, categoryId: categoryFilter || undefined } })
    setNotes(response.data)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadNotes(), loadCategories()])
      .catch(() => setError('No se pudo conectar con el backend. Comprueba Spring Boot y MySQL.'))
      .finally(() => setLoading(false))
  }, [archived, categoryFilter])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function editNote(note) {
    setEditingId(note.id)
    setForm({ title: note.title, content: note.content, categoryIds: note.categories.map((category) => category.id) })
  }

  function toggleCategory(id) {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(id)
        ? current.categoryIds.filter((categoryId) => categoryId !== id)
        : [...current.categoryIds, id],
    }))
  }

  async function saveNote(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) await api.put(`/notes/${editingId}`, form)
      else await api.post('/notes', form)
      resetForm()
      await loadNotes()
    } catch {
      setError('No se pudo guardar la nota.')
    } finally {
      setSaving(false)
    }
  }

  async function archiveNote(note) {
    try {
      await api.patch(`/notes/${note.id}/archive`, null, { params: { archived: !note.archived } })
      await loadNotes()
    } catch {
      setError('No se pudo actualizar el estado de la nota.')
    }
  }

  async function deleteNote(id) {
    if (!window.confirm('Esta acción eliminará la nota. ¿Continuar?')) return
    try {
      await api.delete(`/notes/${id}`)
      await loadNotes()
    } catch {
      setError('No se pudo eliminar la nota.')
    }
  }

  async function createCategory(event) {
    event.preventDefault()
    if (!newCategory.trim()) return
    try {
      const response = await api.post('/categories', { name: newCategory.trim() })
      setCategories((current) => [...current, response.data])
      setNewCategory('')
    } catch {
      setError('No se pudo crear la categoría. Puede que ya exista.')
    }
  }

  let saveButtonLabel = 'Crear nota'
  if (saving) saveButtonLabel = 'Guardando...'
  else if (editingId) saveButtonLabel = 'Guardar cambios'
  let notesContent = <div className="empty-state">Cargando notas...</div>
  if (!loading) {
    if (notes.length === 0) {
      notesContent = <div className="empty-state"><strong>No hay notas aquí todavía.</strong><span>Empieza a escribir en el panel de la izquierda.</span></div>
    } else {
      notesContent = <div className="d-grid gap-3">{notes.map((note) => <article className="note-card p-4" key={note.id}><div className="d-flex justify-content-between gap-3 mb-3"><span className="badge text-bg-light">N-{String(note.id).padStart(2, '0')}</span><div className="d-flex gap-2"><button className="btn btn-sm btn-link p-0" type="button" onClick={() => editNote(note)}>Editar</button><button className="btn btn-sm btn-link text-danger p-0" type="button" onClick={() => deleteNote(note.id)}>Eliminar</button></div></div><h3 className="h5">{note.title}</h3><p className="text-secondary mb-3 text-break">{note.content || 'Sin contenido adicional.'}</p><div className="d-flex flex-wrap align-items-center gap-2"><div className="d-flex flex-wrap gap-2 me-auto">{note.categories.map((category) => <span className="badge rounded-pill text-bg-warning" key={category.id}>{category.name}</span>)}</div><button type="button" className="btn btn-sm btn-outline-dark" onClick={() => archiveNote(note)}>{archived ? 'Desarchivar' : 'Archivar'}</button></div></article>)}</div>
    }
  }

  return <main className="app-shell min-vh-100">
    <header className="container py-4"><nav className="navbar px-0 border-bottom border-dark border-opacity-25"><a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/"><span className="brand-mark">N</span> Ensolvers Notes</a><span className="badge rounded-pill text-bg-success">API conectada</span></nav></header>
    <section className="container py-5">
      <div className="row align-items-end g-4 mb-4"><div className="col-lg-8"><p className="text-uppercase small fw-semibold text-secondary mb-2">Tu espacio personal</p><h1 className="display-4 fw-bold mb-3">Notas claras, trabajo en movimiento.</h1><p className="lead text-secondary mb-0">Captura ideas, dales contexto y vuelve a ellas cuando lo necesites.</p></div><div className="col-lg-4 text-lg-end"><span className="display-5 fw-bold">{notes.length}</span><span className="text-secondary ms-2">{notes.length === 1 ? 'nota' : 'notas'}</span></div></div>
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 border-bottom pb-3 mb-4"><div className="btn-group" aria-label="Vista de notas"><button type="button" className={`btn ${!archived ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setArchived(false)}>Activas</button><button type="button" className={`btn ${archived ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setArchived(true)}>Archivadas</button></div><div className="ms-md-auto d-flex align-items-center gap-2 w-100 filter-row"><label className="small text-secondary text-nowrap" htmlFor="categoryFilter">Filtrar por etiqueta</label><select id="categoryFilter" className="form-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="">Todas</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div></div>
      {error && <div className="alert alert-danger alert-dismissible" role="alert">{error}<button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setError('')} /></div>}
      <div className="row g-4">
        <div className="col-lg-5"><form className="editor-panel p-4" onSubmit={saveNote}><h2 className="h4 mb-4">{editingId ? 'Editar nota' : 'Nueva nota'}</h2><div className="mb-3"><label className="form-label fw-semibold" htmlFor="title">Título</label><input id="title" className="form-control" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Una idea que merece espacio" maxLength="120" /></div><div className="mb-3"><label className="form-label fw-semibold" htmlFor="content">Contenido</label><textarea id="content" className="form-control" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Escribe los detalles aquí..." rows="7" /></div><fieldset className="mb-4"><legend className="form-label fw-semibold">Etiquetas</legend><div className="d-flex flex-wrap gap-2">{categories.map((category) => <button type="button" key={category.id} className={`btn btn-sm ${form.categoryIds.includes(category.id) ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => toggleCategory(category.id)}>{category.name}</button>)}</div></fieldset><div className="d-flex gap-2">{editingId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>}<button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>{saveButtonLabel}</button></div></form></div>
        <div className="col-lg-7"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h4 mb-0">{archived ? 'Notas archivadas' : 'Tu lista'}</h2>{loading && <span className="spinner-border spinner-border-sm text-primary" aria-label="Cargando" />}</div>{notesContent}</div>
      </div>
      <section className="category-panel mt-5 p-4"><div className="row align-items-center g-3"><div className="col-md-5"><p className="text-uppercase small fw-semibold text-secondary mb-1">Organización</p><h2 className="h5 mb-0">Añade una etiqueta</h2></div><form className="col-md-7 d-flex gap-2" onSubmit={createCategory}><input className="form-control" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="ej. Ideas, Trabajo" maxLength="40" /><button type="submit" className="btn btn-dark">Añadir</button></form></div></section>
    </section>
    <footer className="container py-4 border-top text-secondary small d-flex flex-column flex-sm-row justify-content-between gap-2"><span>Notes / Ensolvers challenge</span><span>Persistencia MySQL · API REST</span></footer>
  </main>
}

export default App
