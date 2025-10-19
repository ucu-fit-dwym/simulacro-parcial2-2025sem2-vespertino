import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Country() {
  const { cca3 } = useParams(); // Código del país actual (ej: "URY")
  const navegar = useNavigate();

  const [pais, setPais] = useState(null); // Info del país actual
  const [todos, setTodos] = useState([]); // Lista de todos los países
  const [opciones, setOpciones] = useState([]); // 9 banderas mostradas
  const [cargando, setCargando] = useState(true);

  // Recuperar datos guardados
  const erroresRestantes = parseInt(localStorage.getItem("erroresRestantes")) || 0;
  const erroresPermitidos = parseInt(localStorage.getItem("erroresPermitidos")) || 0;
  const visitados = JSON.parse(localStorage.getItem("visitados")) || [];

  // Cargar el país actual y todos los países
  useEffect(() => {
    setCargando(true);
    Promise.all([
      fetch("/api/countries").then((r) => r.json()),
      fetch(`/api/countries/${cca3}`).then((r) => r.json())
    ])
      .then(([lista, info]) => {
        setTodos(lista);
        setPais(info);
        setCargando(false);
      })
      .catch((err) => console.error("Error cargando país:", err));
  }, [cca3]);

  // Elegir banderas (mezcla de fronterizos y aleatorios)
  useEffect(() => {
    if (!pais || todos.length === 0) return;

    const fronterizos = pais.borders || [];
    const aleatorios = todos.filter((p) => !fronterizos.includes(p) && p !== pais.id);

    const mezcla = [
      ...fronterizos,
      ...aleatorios.sort(() => Math.random() - 0.5).slice(0, 9 - fronterizos.length)
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    setOpciones(mezcla);
  }, [pais, todos]);

  // Manejar click en una bandera
  const elegirBandera = (codigo) => {
    const esFrontera = pais.borders?.includes(codigo);

    // Si el país no fue visitado, lo agregamos
    if (!visitados.includes(cca3)) {
      visitados.push(cca3);
      localStorage.setItem("visitados", JSON.stringify(visitados));
    }

    // Si es incorrecto → restamos error
    if (!esFrontera) {
      const nuevosErrores = erroresRestantes - 1;
      localStorage.setItem("erroresRestantes", nuevosErrores);
      if (nuevosErrores <= 0) {
        navegar("/end");
        return;
      }
    }

    navegar(`/${codigo}`);
  };

  // Opción “Ninguno”
  const ninguno = () => {
    const noVisitados = todos.filter((p) => !visitados.includes(p));
    const nuevoPais = noVisitados[Math.floor(Math.random() * noVisitados.length)];
    if (!visitados.includes(cca3)) {
      visitados.push(cca3);
      localStorage.setItem("visitados", JSON.stringify(visitados));
    }
    navegar(`/${nuevoPais}`);
  };

  if (cargando) return <p>Cargando país...</p>;
  if (!pais) return <p>Error cargando información.</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Flag Trivia</h1>
      <img src={pais.flag.svg} alt={pais.flag.alt} width="150" />

      <p>¿Cuál de los siguientes países es fronterizo?</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          justifyItems: "center",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        {opciones.map((codigo) => (
          <button
            key={codigo}
            onClick={() => elegirBandera(codigo)}
            style={{
              border: "1px solid #aaa",
              background: "#fff",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <img src={`/flags/${codigo}.svg`} alt={codigo} width="60" />
          </button>
        ))}
      </div>

      <button onClick={ninguno} style={{ marginTop: "20px" }}>
        Ninguno
      </button>

      <p style={{ marginTop: "10px" }}>
        Visitó {visitados.length} países. Puede errarle {erroresRestantes} veces.
      </p>
    </div>
  );
}
