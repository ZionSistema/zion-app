// ===============================
// FUNÇÃO MOSTRAR ALERTA
// ===============================
function mostrarAlerta(texto, tipo = "sucesso") {
  const alerta = document.getElementById("alerta");

  alerta.innerText = texto;
  alerta.className = "alerta mostrar";

  if (tipo === "erro") {
    alerta.classList.add("erro");
  }

  setTimeout(() => {
    alerta.classList.remove("mostrar");
  }, 2500);
}

// ===============================
// FUNÇÃO LOGIN
// ===============================
// =====================================
// FUNÇÃO DE LOGIN REAL (CONECTADA AO BACKEND)
// =====================================

async function login() {
  // Captura os valores digitados
  const cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senha").value;

  // Validação básica
  if (!cpf || !senha) {
    mostrarAlerta("Preencha todos os campos", "erro");
    return;
  }

  try {
    // =====================================
    // REQUISIÇÃO PARA O BACKEND (VERCEL)
    // =====================================
    const resposta = await fetch(
      "https://megaec-backend.vercel.app/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf_cnpj: cpf,
          senha: senha,
        }),
      },
    );

    const dados = await resposta.json();

    // =====================================
    // TRATAMENTO DE RESPOSTA
    // =====================================
    if (!resposta.ok) {
      mostrarAlerta(dados.erro || "Erro no login", "erro");
      return;
    }

    // =====================================
    // LOGIN OK
    // =====================================
    mostrarAlerta("Login realizado com sucesso!");

    console.log("Usuário:", dados.nome);
    console.log("Tabela:", dados.tabela);

    // 👉 Aqui depois vamos redirecionar pro simulador
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("Erro ao conectar com o servidor", "erro");
  }
}
