export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__ambient" />
      <div className="backdrop__tilt">
        <div className="backdrop__orbit backdrop__orbit--glow" />
        <div className="backdrop__orbit backdrop__orbit--core" />
      </div>
    </div>
  );
}
