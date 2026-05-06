// =====================================================
// 📄 MÁSCARA CPF / CNPJ
// =====================================================

function formatarDocumento(input) {
  let valor = input.value.replace(/\D/g, "");

  // CPF
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // CNPJ
  else {
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
  }

  input.value = valor;
}

// =====================================================
// 👁 MOSTRAR / OCULTAR SENHA
// =====================================================

function toggleSenhaCliente() {
  const input = document.getElementById("senhaCliente");
  const icone = document.getElementById("icone-olho");

  const olhoAberto = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">

      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"></path>

      <circle cx="12" cy="12" r="3"></circle>

    </svg>
  `;

  const olhoRiscado = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">

      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>

      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>

      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>

      <line x1="1" y1="1" x2="23" y2="23"></line>

    </svg>
  `;

  if (input.type === "password") {
    input.type = "text";
    icone.innerHTML = olhoAberto;
  } else {
    input.type = "password";
    icone.innerHTML = olhoRiscado;
  }
}

// =====================================================
// 🔔 ALERTA PREMIUM LOGIN CLIENTE
// =====================================================

function mostrarAlertaCliente(mensagem) {
  const alerta = document.getElementById("alertaCliente");

  alerta.innerHTML = mensagem;

  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 3500);
}
// Controle de tentativas de login
let tentativasLoginCliente = 0;
// =====================================================
// 🔐 LOGIN CLIENTE
// =====================================================

async function entrarCliente() {
  let loginSucesso = false;

  try {
    sessionStorage.removeItem("clienteLogado");
    // =====================================
    // CAPTURA E LIMPEZA DOS DADOS
    // =====================================
    const documento = document
      .getElementById("documentoCliente")
      .value.replace(/\D/g, "");

    const senha = document.getElementById("senhaCliente").value.trim();
    // Salvar preferência do usuário
    const lembrar = document.getElementById("lembrarCliente").checked;

    // =====================================
    // DEBUG TEMPORÁRIO
    // =====================================
    console.log("===== LOGIN CLIENTE =====");

    console.log(
      "DOCUMENTO RAW:",
      document.getElementById("documentoCliente").value,
    );

    console.log("DOCUMENTO LIMPO:", documento);

    console.log("SENHA:", senha);

    // =====================================
    // VALIDAÇÃO SIMPLES
    // =====================================
    if (!documento || !senha) {
      mostrarAlertaCliente(
        "<span style='color:#d97706;'>Preencha login e senha.</span>",
      );
      return;
    }

    // =====================================
    // LOGIN NO BACKEND (VERCEL)
    // =====================================
    const response = await fetch(
      "https://megaec-backend.vercel.app/api/login-cliente",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          documento,
          senha,
        }),
      },
    );

    const dados = await response.json();

    console.log("RETORNO BACKEND:", dados);

    // =====================================
    // TRATAMENTO DE ERRO
    // =====================================
    if (!response.ok) {
      throw new Error(dados.erro || "Falha no login");
    }

    // =====================================
    // SALVAR SESSÃO DO CLIENTE
    // =====================================

    sessionStorage.setItem("clienteLogado", JSON.stringify(dados));

    tentativasLoginCliente = 0;
    loginSucesso = true;

    // =====================================
    // REDIRECIONAR PARA O SIMULADOR
    // =====================================

    window.location.href = "simulador.html";

    if (lembrar) {
      localStorage.setItem(
        "cliente_documento",
        document.getElementById("documentoCliente").value,
      );
    } else {
      localStorage.removeItem("cliente_documento");
    }
    // Próxima fase:
    // window.location.href = "simulador.html";
  } catch (error) {
    console.error("ERRO LOGIN:", error);

    if (!loginSucesso) {
      tentativasLoginCliente = tentativasLoginCliente + 1;
    }

    if (tentativasLoginCliente === 1) {
      mostrarAlertaCliente(
        "<span style='color:#dc2626;'>Login ou senha inválidos.</span>",
      );
    } else {
      mostrarAlertaCliente(
        "<span style='color:#dc2626;'>Login ou senha inválidos.</span><br><strong>Entre em contato com sua rede credenciada.</strong>",
      );
    }
  }
}
// =====================================================
// 💾 RECUPERAR LOGIN SALVO
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  const documentoSalvo = localStorage.getItem("cliente_documento");

  if (documentoSalvo) {
    document.getElementById("documentoCliente").value = documentoSalvo;

    document.getElementById("lembrarCliente").checked = true;
  }
});
