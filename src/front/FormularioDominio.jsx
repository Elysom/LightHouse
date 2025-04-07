function FormularioDominio({ dominio, setDominio, handleSubmit, analizando }) {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        placeholder="Ingrese un https (ej. https://ejemplo.com)"
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        className="input-field"
        disabled={analizando}  // Desactiva el input mientras se está analizando
      />
      <button type="submit" className="submit-btn" disabled={analizando}>
        {analizando ? "Analizando" : "Analizar"}  {/* Cambia entre "Analizando" y "Analizar" */}
      </button>
    </form>
  );
}

export default FormularioDominio;