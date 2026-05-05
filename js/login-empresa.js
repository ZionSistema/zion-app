// =====================================
// 🔐 LOGIN EMPRESA (FRONTEND)
// =====================================

async function logarEmpresa() {
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!login || !senha) {
    mostrarAlerta("Preencha login e senha", "erro");
    return;
  }

  try {
    const res = await fetch(
      "https://megaec-backend.vercel.app/api/login-empresa",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      },
    );

    const data = await res.json();

    if (data.sucesso) {
      console.log("RETORNO BACKEND:", data);
      console.log("BANNER BACKEND:", data.banner_admin);
      // 🔐 SALVAR SESSÃO
      localStorage.setItem("empresa_id", data.empresa_id);

      // 🔷 padronização correta
      localStorage.setItem("empresa_nome", data.nome_empresa || data.nome);
      localStorage.setItem("empresa_logo", data.logo_admin);
      localStorage.setItem("empresa_banner", data.banner_admin);
      localStorage.setItem("empresa_logo_simulador", data.logo_simulador);

      mostrarAlerta("Login realizado com sucesso!", "sucesso");

      // 🔥 pequeno delay para UX
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 800);
    } else {
      mostrarAlerta("Login inválido", "erro");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    mostrarAlerta("Erro na conexão com servidor", "erro");
  }
}

// =====================================
// 🔷 ALERTA VISUAL
// =====================================

function mostrarAlerta(mensagem, tipo = "sucesso") {
  const el = document.getElementById("alerta");

  if (!el) return;

  el.innerText = mensagem;
  el.className = `alerta ${tipo} mostrar`;

  setTimeout(() => {
    el.className = "alerta";
    el.innerText = "";
  }, 4000);
}
// =====================================================
// 🔷 TÍTULO DINÂMICO LOGIN (WHITE LABEL)
// =====================================================

const nomeEmpresa = localStorage.getItem("empresa_nome");

if (nomeEmpresa) {
  document.title = `${nomeEmpresa} | Acesso`;
}
// =====================================================
// 🔐 RECUPERAR SENHA (EMPRESA)
// =====================================================
async function recuperarSenha() {
  try {
    const login = document.getElementById("login").value.trim();

    // 🔷 validação
    if (!login) {
      mostrarAlerta("Informe o login da empresa", "erro");
      return;
    }

    const resposta = await fetch(
      "https://megaec-backend.vercel.app/api/recuperar-senha",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login }),
      },
    );

    const dados = await resposta.json();
    // console.log("RESPOSTA BACKEND:", dados);

    if (!resposta.ok) {
      mostrarAlerta(dados.erro || "Erro ao recuperar senha", "erro");
      return;
    }

    mostrarAlerta("Nova senha enviada para o e-mail da empresa", "sucesso");
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarAlerta("Erro de conexão com servidor", "erro");
  }
}
// =====================================================
// 👁 MOSTRAR / OCULTAR SENHA COM TROCA DE ÍCONE
// =====================================================

function toggleSenha() {
  const input = document.getElementById("senha");
  const icone = document.getElementById("icone-olho");

  // Ícone Olho Aberto (Visualizar)
  const olhoAberto = `<svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

  // Ícone Olho Riscado (Ocultar)
  const olhoRiscado = `<svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  if (input.type === "password") {
    input.type = "text";
    icone.innerHTML = olhoAberto; // Volta para o olho comum
  } else {
    input.type = "password";
    icone.innerHTML = olhoRiscado; // Agora exibe o olho com a barra
  }
}
