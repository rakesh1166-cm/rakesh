import { LABEL, STATUSES } from '../status.js'

/** preparing → picked_up → in_transit → delivered, with the current step lit. */
export default function StatusTrack({ status }) {
  const at = STATUSES.indexOf(status)
  return (
    <ol className="track">
      {STATUSES.map((s, i) => (
        <li key={s} className={i < at ? 'done' : i === at ? 'now' : ''}>
          {LABEL[s]}
        </li>
      ))}
    </ol>
  )
}
