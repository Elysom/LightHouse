function BotonModoOscuro({ modoOscuro, setModoOscuro }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={modoOscuro}
        onChange={() => setModoOscuro(!modoOscuro)}
      />
      <span className="slider"></span>
    </label>
  );
}

export default BotonModoOscuro;