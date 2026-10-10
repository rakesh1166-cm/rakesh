import { useRef, useState } from 'react'

/** POST /contracts/upload — multipart file upload (PDF or TXT, max 10 MB). */
export default function UploadForm({ onUpload, busy }) {
  const [file, setFile] = useState(null)
  const input = useRef(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    const ok = await onUpload(file)
    if (ok) {
      setFile(null)
      input.current.value = ''
    }
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>New contract</h2>
        <code className="endpoint post">POST /contracts/upload</code>
      </header>
      <p className="hint block">
        The server saves the file under <code>uploads/</code>, extracts its text and stores a row in the{' '}
        <code>contracts</code> table. Try <code>samples/sample_nda.txt</code>.
      </p>

      <form className="form" onSubmit={submit}>
        <label>
          Contract file (.pdf or .txt)
          <input ref={input} type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0] ?? null)} />
        </label>
        {file && (
          <p className="hint">
            {file.name} · {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
        <div>
          <button className="btn primary" disabled={!file || busy}>
            {busy ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </section>
  )
}
