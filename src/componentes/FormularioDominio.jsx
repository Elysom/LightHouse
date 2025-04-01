function FormularioDominio({ dominio, setDominio, handleSubmit, analizando, textoAnimado }) {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        placeholder="Ingrese un https (ej. https://ejemplo.com)"
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="submit-btn" disabled={analizando}>
        {analizando ? textoAnimado : "Analizar"}
      </button>
    </form>
  );
}

export default FormularioDominio;