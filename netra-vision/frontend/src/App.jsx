import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import AnalyseView from './components/AnalyseView.jsx'
import HistoryView from './components/HistoryView.jsx'
import StatsView from './components/StatsView.jsx'

export default function App() {
  const [view, setView] = useState('analyse')

  return (
    <div className="layout">
      <Sidebar view={view} onChange={setView} />
      <main className="content">
        {view === 'analyse' && <AnalyseView />}
        {view === 'history' && <HistoryView />}
        {view === 'stats' && <StatsView />}
      </main>
    </div>
  )
}
