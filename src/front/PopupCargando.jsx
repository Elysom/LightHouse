import React, { useEffect, useState } from "react";

function PopupCargando({ progress, texto }) {
  const TOTAL_SECONDS = 120;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  // Reinicia el tiempo cada vez que progress vuelve a 0
  useEffect(() => {
    if (progress === 0) {
      setTimeLeft(TOTAL_SECONDS);
    }
  }, [progress]);

  // Resta segundos reales
  useEffect(() => {
    if (progress < 100 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [progress, timeLeft]);

  // Mensajes según el progreso
  let mensaje = "";
  if (progress >= 0 && progress <= 50) {
    mensaje = "Este proceso puede tardar unos minutos";
  } else if (progress >= 51 && progress <= 84) {
    mensaje = "Queda poco";
  } else if (progress >= 85 && progress <= 100) {
    mensaje = "Un momento";
  }

  const minutos = Math.floor(timeLeft / 60);
  const segundos = timeLeft % 60;

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

        {progress < 100 && (
          <div
            style={{
              marginTop: "8px",
              fontWeight: "500",
              color: "#2563EB",
              fontSize: "16px",
            }}
          >
            Tiempo estimado restante:{" "}
            {minutos > 0
              ? `${minutos}m ${segundos}s`
              : `${segundos} ${segundos === 1 ? "segundo" : "segundos"}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupCargando;
