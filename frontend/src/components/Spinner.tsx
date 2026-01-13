export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="relative">
        <div className="flame-container text-4xl">
          <span className="flame">🔥</span>
          <span className="flame2">🔥</span>
          <span className="flame3">🔥</span>
        </div>
      </div>
    </div>
  );
}
