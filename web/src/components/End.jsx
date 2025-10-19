import React from "react";
import { useNavigate } from "react-router-dom";

export default function End() {
  const navegar = useNavigate();

  // Recuperar los países visitados del localStorage
  const visitados = JSON.parse(localStorage.getItem("visitados")) || [];

  // Volver al inicio
  const volverAlInicio = () => {
    localStorage.clear(); // Limpia todo para reiniciar el juego
    navegar("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Fin del juego</h1>
      <p>Usted visitó los siguientes países:</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: "10px",
          justifyItems: "center",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {visitados.map((codigo) => (
          <img
            key={codigo}
            src={`/flags/${codigo}.svg`}
            alt={codigo}
            width="70"
            style={{ border: "1px solid #aaa", borderRadius: "6px" }}
          />
        ))}
      </div>

      <button
        onClick={volverAlInicio}
        style={{ marginTop: "20px", padding: "8px 20px", cursor: "pointer" }}
      >
        Continuar
      </button>
    </div>
  );
}
