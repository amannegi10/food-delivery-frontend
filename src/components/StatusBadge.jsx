const LABELS = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function StatusBadge({ status }) {
  const cls = status === 'CANCELLED' ? 'cancelled' : status === 'PLACED' ? 'placed' : '';
  return (
    <span className={`status-badge ${cls}`}>
      <span className="status-dot" />
      {LABELS[status] || status}
    </span>
  );
}
