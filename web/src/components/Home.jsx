import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [paises, setPaises] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();

  // 🔹 Cargar lista de países al inicio
  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => {
        setPaises(data);
        setCargando(false);
      })
      .catch((err) => console.error("Error cargando países:", err));
  }, []);

  // 🔹 Elegir dificultad y guardar en localStorage
  const elegirDificultad = (dificultad) => {
    let erroresPermitidos = 0;

    if (dificultad === "facil") erroresPermitidos = 8;
    if (dificultad === "medio") erroresPermitidos = 5;
    if (dificultad === "dificil") erroresPermitidos = 3;

    localStorage.setItem("erroresPermitidos", erroresPermitidos);
    localStorage.setItem("erroresRestantes", erroresPermitidos);
    localStorage.setItem("visitados", JSON.stringify([]));

    // Elegimos un país inicial al azar
    const paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
    navegar(`/${paisAleatorio}`);
  };

  if (cargando) return <p>Cargando países...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Flag Trivia</h1>
      <p>Elija la dificultad del juego:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <button onClick={() => elegirDificultad("facil")}>Fácil</button>
        <button onClick={() => elegirDificultad("medio")}>Medio</button>
        <button onClick={() => elegirDificultad("dificil")}>Difícil</button>
      </div>
    </div>
  );
}
