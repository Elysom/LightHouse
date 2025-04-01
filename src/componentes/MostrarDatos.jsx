function MostrarDatos({ mostrarValores, setMostrarValores }) {
    return (
      <button 
        className="boton-mostrar-datos" 
        onClick={() => setMostrarValores(!mostrarValores)}
      >
        {mostrarValores ? "Ocultar valores" : "Mostrar valores"}
      </button>
    );
  }
  
  export default MostrarDatos;
  