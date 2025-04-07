import React from "react";

function PopupCargando({ progress }) {
  // Determinar el mensaje según el rango del progreso
  let mensaje = "";
  if (progress >= 0 && progress <= 50) {
    mensaje = "Este proceso puede tardar unos minutos";
  } else if (progress >= 51 && progress <= 84) {
    mensaje = "Queda poco";
  } else if (progress >= 85 && progress <= 100) {
    mensaje = "Un momento";
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
            fontWeight: "600",
            color: "#2563EB",
            fontSize: "18px",
          }}
        >
          {progress}% cargado
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "#D1D5DB",
            borderRadius: "9999px",
            height: "12px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#3B82F6",
              height: "100%",
              borderRadius: "9999px",
              transition: "width 0.15s ease",
            }}
          ></div>
        </div>
        {/* Mostrar el mensaje debajo de la barra de progreso si se definió */}
        {mensaje && (
          <div
            style={{
              marginTop: "12px",
              fontWeight: "500",
              color: "#2563EB",
              fontSize: "16px",
            }}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupCargando;
