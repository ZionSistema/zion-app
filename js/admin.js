/* =========================================================
   🔷 ADMIN.JS - CADASTRO DE CLIENTES
   Projeto: MegaEC App
   Objetivo: Capturar dados do formulário e enviar ao backend
   ========================================================= */
/* =========================================================
   🔷 LISTA GLOBAL DE CLIENTES (USADA PARA EDIÇÃO)
   ========================================================= */
let listaClientes = [];

function getEmpresaId() {
  return localStorage.getItem("empresa_id");
}

// =====================================
// 🔷 WHITE LABEL - EMPRESA
// =====================================
function aplicarWhiteLabelLocal() {
  const nome = localStorage.getItem("empresa_nome");
  const logo = localStorage.getItem("empresa_logo");

  const inputNome = document.getElementById("nomeEmpresa");

  if (inputNome && nome) {
    inputNome.value = nome;
  }

  // 🔷 CRIAR LOGO AO LADO DO INPUT (SEM QUEBRAR NADA)
  if (inputNome && logo) {
    const container = document.createElement("div");
    container.className = "empresa-box";

    const img = document.createElement("img");
    img.src = logo;
    img.className = "logo-empresa-inline";

    inputNome.parentNode.insertBefore(container, inputNome);
    container.appendChild(img);
    container.appendChild(inputNome);
  }

  // =====================================================
  // 🔷 BANNER LATERAL (WHITE LABEL)
  // =====================================================

  // pega caminho do banner salvo no login
  const banner = localStorage.getItem("empresa_banner");

  // pega elemento do HTML
  const bannerEl = document.getElementById("bannerEmpresa");

  // aplica imagem com proteção completa
  if (bannerEl && banner) {
    let bannerCorrigido = banner;

    // 🔥 corrige extensão antiga (.jpg → .png)
    bannerCorrigido = bannerCorrigido.replace(".jpg", ".png");

    // 🔥 garante barra no início
    if (!bannerCorrigido.startsWith("/")) {
      bannerCorrigido = "/" + bannerCorrigido;
    }

    bannerEl.src = bannerCorrigido;
  }
}

/* =========================================================
   🔷 FUNÇÃO: GERAR SENHA AUTOMÁTICA
   Gera uma senha numérica de 6 dígitos
   ========================================================= */
function gerarSenha() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =====================================
// 🔷 FORMATAR CPF/CNPJ (VISUAL)
// =====================================
function formatarCpfCnpj(valor) {
  valor = valor.replace(/\D/g, "");

  if (valor.length <= 11) {
    // CPF
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return valor;
}

// =====================================
// 🔷 VALIDAR CPF
// =====================================
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === parseInt(cpf[10]);
}

// =====================================
// 🔷 VALIDAR CNPJ
// =====================================
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);

  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos[0])) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);

  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  return resultado === parseInt(digitos[1]);
}

// =====================================
// 🔷 VALIDAR GERAL
// =====================================
function validarCpfCnpj(valor) {
  const limpo = limparCpfCnpj(valor);

  if (limpo.length === 11) return validarCPF(limpo);
  if (limpo.length === 14) return validarCNPJ(limpo);

  return false;
}

// =====================================
// 🔷 REMOVER MÁSCARA
// =====================================
function limparCpfCnpj(valor) {
  return valor.replace(/\D/g, "");
}

// =====================================
// 🔷 FORMATAR CAMPO BUSCA CPF/CNPJ
// =====================================
function formatarBusca(input) {
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
/* =========================================================
   🔷 FUNÇÃO PRINCIPAL: CADASTRAR CLIENTE
   ========================================================= */
async function cadastrarCliente() {
  console.log("🔥 BOTÃO CLICADO");
  const nome = document.getElementById("nomeCliente").value;
  const loginBruto = document.getElementById("loginCliente").value;
  const login = limparCpfCnpj(loginBruto);
  const tipo = document.getElementById("tipoCliente").value;
  const tabela = document.getElementById("tabelaCliente").value;

  if (!nome || !login || !tabela || !tipo) {
    mostrarAlerta("Preencha todos os campos");
    return;
  }
  // 🔍 BUSCAR CLIENTE EXISTENTE
  const urlBusca = `https://megaec-backend.vercel.app/api/clientes?login=${login}`;

  const resCliente = await fetch(urlBusca, {
    headers: {
      "x-empresa-id": getEmpresaId(),
    },
  });
  const clientesExistentes = await resCliente.json();

  let senha;

  // 🔥 SE JÁ EXISTE
  if (clientesExistentes.length > 0) {
    senha = clientesExistentes[0].senha;

    // 🔥 VALIDAR TIPO DUPLICADO
    /*const tipoJaExiste = clientesExistentes.find((c) => c.tipo === tipo);*/

    /* =========================================================
   🔷 VALIDAR DUPLICIDADE (COM SUPORTE A EDIÇÃO)
   ========================================================= */

    const tipoJaExiste = clientesExistentes.find((c) => {
      // 🔥 SE ESTIVER EDITANDO
      if (window.clienteEditando) {
        // ignora o próprio registro (mesmo ID)
        return c.tipo === tipo && c.id !== window.clienteEditando;
      }

      // 🔥 SE FOR NOVO CADASTRO
      return c.tipo === tipo;
    });

    if (tipoJaExiste) {
      mostrarAlerta(`⚠️ Cliente já possui tabela para ${tipo}`);
      return;
    }
  } else {
    // 🔥 NOVO CLIENTE
    senha = gerarSenha();
  }

  // 👇 cuidado com isso também
  const campoSenha = document.getElementById("senhaGerada");
  if (campoSenha) {
    campoSenha.innerText = "Senha: " + senha;
  }

  const dados = {
    cpf_cnpj: login,
    nome: nome,
    senha: senha,
    tabela_nome: tabela,
    tipo: tipo,
  };

  console.log("📤 ENVIANDO PARA API:", dados);

  /* =========================================================
   🔷 DEFINIR SE É NOVO OU EDIÇÃO
   ========================================================= */

  const url = `https://megaec-backend.vercel.app/api/clientes`;
  let metodo = "POST"; // padrão: criar

  /* 🔥 SE ESTIVER EDITANDO */
  if (window.clienteEditando) {
    metodo = "PUT";

    // 🔥 envia o ID para o backend
    dados.id = window.clienteEditando;
  }

  /* =========================================================
   🔷 ENVIO PARA API
   ========================================================= */

  // 🔍 DEBUG (VERIFICAR SE ESTÁ EM MODO EDIÇÃO)
  console.log("🚀 MÉTODO:", metodo);
  console.log("📦 DADOS:", dados);
  console.log("🆔 EDITANDO:", window.clienteEditando);

  fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      "x-empresa-id": getEmpresaId(),
    },
    body: JSON.stringify(dados),
  })
    .then((res) => res.json())
    .then((resposta) => {
      if (resposta.success) {
        mostrarAlerta(
          metodo === "POST"
            ? "✅ Cliente cadastrado com sucesso!"
            : "✏️ Cliente atualizado com sucesso!",
        );

        /* =========================================================
   🔷 LIMPAR FORMULÁRIO APÓS SALVAR
   ========================================================= */
        document.getElementById("nomeCliente").value = "";
        document.getElementById("loginCliente").value = "";
        document.getElementById("tipoCliente").value = "";
        document.getElementById("tabelaCliente").value = "";

        // 🔥 LIMPA MODO EDIÇÃO
        window.clienteEditando = null;
        // 🔥 RESETAR BOTÃO
        const btn = document.getElementById("btnCriar");
        btn.innerText = "CRIAR +";
        btn.classList.remove("edicao");
        carregarClientes();
      } else {
        mostrarAlerta("❌ Erro ao salvar cliente");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      mostrarAlerta("Erro na comunicação com servidor");
    });
}

// =====================================
// 🔷 RENDERIZAR CLIENTES
// =====================================
function renderizarClientes(lista) {
  const container = document.querySelector(".lista-clientes");

  if (!container) return;

  container.innerHTML = "";

  lista.forEach((cliente) => {
    const item = `
      <div class="cliente-item" onclick='copiarCredenciais(${JSON.stringify(cliente)})'>
        <span>${cliente.nome}</span>
        <span>${cliente.cpf_cnpj}</span>
        <span>${cliente.senha}</span>
        <span>${cliente.tabela_nome}</span>
        <span>${cliente.tipo}</span>

        <span class="acoes-linha">
          <button onclick="event.stopPropagation(); editarCliente(${cliente.id})" class="btn-editar">✏️</button>

          <button onclick="event.stopPropagation(); excluirCliente(${cliente.id})" class="btn-excluir">🗑️</button>
        </span>
      </div>
    `;

    container.innerHTML += item;
  });
}

async function carregarClientes() {
  try {
    const url = "https://megaec-backend.vercel.app/api/clientes";

    const res = await fetch(url, {
      headers: {
        "x-empresa-id": getEmpresaId(),
      },
    });
    /* 🔹 salva globalmente para uso no editarCliente */
    listaClientes = await res.json();

    console.log("📥 Clientes carregados:", listaClientes);

    if (!Array.isArray(listaClientes)) {
      console.error("Resposta inválida da API:", listaClientes);
      mostrarAlerta("Erro ao carregar clientes");
      return;
    }

    const container = document.querySelector(".lista-clientes");
    container.innerHTML = "";

    listaClientes.forEach((cliente) => {
      /* =========================================================
   🔷 RENDERIZAÇÃO DA LISTA DE CLIENTES (COM AÇÕES)
   ========================================================= */
      const item = `
  <div class="cliente-item" onclick='copiarCredenciais(${JSON.stringify(cliente)})'>
    <span>${cliente.nome}</span>
    <span>${cliente.cpf_cnpj}</span>
    <span>${cliente.senha}</span>
    <span>${cliente.tabela_nome}</span>
    <span>${cliente.tipo}</span>
    <span class="acoes-linha">
      <button onclick="event.stopPropagation(); editarCliente(${cliente.id})" class="btn-editar">✏️</button>
      <button onclick="event.stopPropagation(); excluirCliente(${cliente.id})" class="btn-excluir">🗑️</button>
    </span>
  </div>
`;

      container.innerHTML += item;
      // =====================================================
      // 🔷 MÉTRICAS (CLIENTES + TABELAS)
      // =====================================================

      // =====================================================
      // 🔷 MÉTRICAS (CLIENTES + TABELAS)
      // =====================================================

      // 🔷 SETS (controle de únicos)
      const cpfsUnicos = new Set();
      const tabelasUnicas = new Set();

      // 🔷 CONTADORES
      let totalMaquininha = 0;
      let totalLink = 0;

      listaClientes.forEach((item) => {
        console.log("ITEM COMPLETO:", item);
        // 🔷 pega CPF corretamente
        const doc = item.cpf_cnpj;

        if (doc) {
          cpfsUnicos.add(doc);
        }

        // 🔷 TABELAS ÚNICAS (nome + tipo)
        const chaveTabela = item.tabela_nome?.trim().toUpperCase();

        if (!tabelasUnicas.has(chaveTabela)) {
          tabelasUnicas.add(chaveTabela);

          // 🔷 conta tipo apenas UMA vez por tabela
          if (item.tipo === "maquininha") {
            totalMaquininha++;
          }

          if (item.tipo === "link") {
            totalLink++;
          }
        }
      });

      // 🔢 totais finais
      const totalClientes = cpfsUnicos.size;
      const totalTabelas = tabelasUnicas.size;

      // 🔷 joga na tela
      document.getElementById("totalClientes").innerText = totalClientes;
      document.getElementById("totalTabelas").innerText = totalTabelas;
      document.getElementById("totalMaquininha").innerText = totalMaquininha;
      document.getElementById("totalLink").innerText = totalLink;
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
}

/* =========================================================
   🔷 ABRIR SELETOR DE ARQUIVO
========================================================= */

function abrirUploadTabela() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx";

  input.onchange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    await enviarTabela(file);
  };

  input.click();
}

/* =========================================================
   🔷 ENVIAR TABELA PARA BACKEND
========================================================= */

async function enviarTabela(file) {
  /* 🔷 1. PEGAR O TIPO SELECIONADO */
  const tipo = document.getElementById("tipoCliente").value;

  /* 🔷 2. MONTAR FORM DATA */
  const formData = new FormData();
  formData.append("file", file);

  // 🔥 NOVO: envia o tipo junto
  formData.append("tipo", tipo);

  try {
    const response = await fetch(
      "https://megaec-backend.vercel.app/api/upload",
      {
        method: "POST",
        headers: {
          "x-empresa-id": getEmpresaId(),
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (response.ok) {
      mostrarAlerta("Tabela enviada com sucesso!");

      // 🔥 Atualiza lista automaticamente
      carregarTabelas();
    } else {
      mostrarAlerta(data.erro || "Erro ao enviar tabela");
    }
  } catch (error) {
    console.error("Erro:", error);
    mostrarAlerta("Erro na conexão");
  }
}

/* =========================================================
   🔷 ENVIAR TAXAS (UPLOAD VIA JSON - VERSÃO PROFISSIONAL)
   ========================================================= */
async function enviarTaxas() {
  try {
    // 🔷 1. CAPTURAR NOME DA TABELA

    let tabela = document.getElementById("tabelaTaxas").value;
    const novaTabela = document.getElementById("nomeTabela").value;

    // 🔷 PRIORIDADE: se digitou, usa ela
    if (novaTabela) {
      tabela = novaTabela.toUpperCase();
    }

    if (!tabela) {
      mostrarAlerta("Informe ou selecione uma tabela", "erro");
      return;
    }

    if (!tabela) {
      mostrarAlerta("Selecione uma tabela", "erro");
      return;
    }

    /* =========================================================
       🔷 FUNÇÃO DE NORMALIZAÇÃO (ANTI-ERRO HUMANO)
       ========================================================= */
    function normalizarValor(valor) {
      if (!valor) return 0;

      valor = valor.trim();

      // aceita vírgula e converte
      valor = valor.replace(",", ".");

      // remove caracteres inválidos
      valor = valor.replace(/[^0-9.]/g, "");

      // evita múltiplos pontos
      const partes = valor.split(".");
      if (partes.length > 2) {
        valor = partes[0] + "." + partes.slice(1).join("");
      }

      let numero = parseFloat(valor);

      if (isNaN(numero)) return 0;

      // força 2 casas decimais
      numero = parseFloat(numero.toFixed(2));

      return numero;
    }

    /* =========================================================
       🔷 CAPTURAR DADOS DA TABELA DINÂMICA
       ========================================================= */

    const modalidades = [
      "pix",
      "debito",
      "1x",
      "2x",
      "3x",
      "4x",
      "5x",
      "6x",
      "7x",
      "8x",
      "9x",
      "10x",
      "11x",
      "12x",
      "13x",
      "14x",
      "15x",
      "16x",
      "17x",
      "18x",
      "19x",
      "20x",
      "21x",
    ];

    const taxas = modalidades.map((mod) => {
      return {
        modalidade: mod,
        visa: normalizarValor(
          document.getElementById(`visa_${mod}`)?.value || "",
        ),
        master: normalizarValor(
          document.getElementById(`master_${mod}`)?.value || "",
        ),
        elo: normalizarValor(
          document.getElementById(`elo_${mod}`)?.value || "",
        ),
        outros: normalizarValor(
          document.getElementById(`outros_${mod}`)?.value || "",
        ),
      };
    });

    /* =========================================================
       🔷 VALIDAÇÃO DE SEGURANÇA
       ========================================================= */

    for (let taxa of taxas) {
      if (
        taxa.visa > 100 ||
        taxa.master > 100 ||
        taxa.elo > 100 ||
        taxa.outros > 100
      ) {
        mostrarAlerta("Valor inválido! Use até 99.99", "erro");
        return;
      }
    }

    /* =========================================================
       🔷 MONTAR OBJETO FINAL
       ========================================================= */

    // 🔷 CAPTURA TIPO (TOPO)
    const tipo = document.getElementById("tipoTaxa").value;

    const dados = {
      tabela_nome: tabela,
      tipo: tipo,
      taxas: taxas,
    };
    console.log("📤 Enviando taxas:", dados);

    /* =========================================================
       🔷 ENVIAR PARA API
       ========================================================= */

    const response = await fetch(
      "https://megaec-backend.vercel.app/api/taxas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-empresa-id": getEmpresaId(),
        },
        body: JSON.stringify(dados),
      },
    );

    const res = await response.json();

    /* =========================================================
       🔷 TRATAMENTO
       ========================================================= */

    if (res.sucesso) {
      mostrarAlerta("✅ Taxas salvas com sucesso!", "sucesso");

      // 🔷 LIMPAR INPUT NOME TABELA
      document.getElementById("nomeTabela").value = "";

      // 🔷 RESET SELECT PARCELAMENTO
      document.getElementById("limiteParcelamento").value = "21";

      // 🔷 REAPLICAR REGRA (zera/desbloqueia corretamente)
      aplicarLimiteParcelamento();

      // 🔷 LIMPAR TODOS INPUTS DA TABELA
      // 🔷 LIMPA CAMPOS DE FORMA SEGURA (SEM QUEBRAR A TELA)
      limparCamposTaxas();

      // 🔷 limpa nome da tabela (se digitado)
      document.getElementById("nomeTabela").value = "";

      resetarEstadoTabela();
      carregarTabelas();

      // 🔥 LIMPA TABELA VISUAL
    } else {
      mostrarAlerta("❌ Erro ao salvar taxas", "erro");
    }
  } catch (error) {
    console.error("Erro:", error);
    mostrarAlerta("Erro na conexão com servidor", "erro");
  }
}

// =====================================
// 🔷 EXCLUIR TABELA
// =====================================
async function excluirTabela(nomeTabela) {
  confirmarAcao(
    `Tem certeza que deseja excluir a tabela "${nomeTabela}"?<br><br>
     ⚠️ Essa ação não pode ser desfeita.`,
    async () => {
      try {
        const response = await fetch(
          `https://megaec-backend.vercel.app/api/taxas?tabela=${nomeTabela}`,
          {
            method: "DELETE",
            headers: {
              "x-empresa-id": getEmpresaId(),
            },
          },
        );

        const res = await response.json();

        if (res.sucesso) {
          mostrarAlerta("✅ Tabela excluída com sucesso!");

          resetarEstadoTabela();
          // 🔥 ATUALIZA OS SELECTS AUTOMATICAMENTE
          carregarTabelas();
        } else {
          mostrarAlerta("❌ Erro ao excluir tabela", "erro");
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
        mostrarAlerta("Erro na comunicação com servidor", "erro");
      }
    },
  );
}

function mostrarAlerta(mensagem, tipo = "sucesso") {
  const antigo = document.querySelector(".alerta");
  if (antigo) antigo.remove();

  const alerta = document.createElement("div");
  alerta.className = `alerta ${tipo}`;

  const icone = tipo === "sucesso" ? "✅" : "❌";
  alerta.innerHTML = `${icone} ${mensagem}`;

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.classList.add("show");
  }, 100);

  setTimeout(() => {
    alerta.classList.remove("show");
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}

function confirmarAcao(mensagem, onConfirm) {
  const modal = document.createElement("div");
  modal.className = "modal-confirm";

  modal.innerHTML = `
    <div class="modal-box">
      <p>${mensagem}</p>
      <div class="modal-acoes">
        <button id="btnOk">Confirmar</button>
        <button id="btnCancel">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const btnOk = document.getElementById("btnOk");
  const btnCancel = document.getElementById("btnCancel");

  // 🔒 BLOQUEIA SCROLL DO FUNDO
  document.body.style.overflow = "hidden";

  // 🔷 FUNÇÃO DE FECHAMENTO PADRÃO
  function fecharModal() {
    modal.remove();
    document.body.style.overflow = "auto";
    document.removeEventListener("keydown", escHandler);
  }

  // 🔷 CONFIRMAR (COM PROTEÇÃO CONTRA DUPLO CLIQUE)
  btnOk.onclick = () => {
    btnOk.disabled = true;
    btnOk.innerText = "Processando...";

    fecharModal();
    onConfirm();
  };

  // 🔷 CANCELAR
  btnCancel.onclick = () => {
    fecharModal();
  };

  // 🔷 ESC PARA FECHAR
  function escHandler(e) {
    if (e.key === "Escape") {
      fecharModal();
    }
  }

  document.addEventListener("keydown", escHandler);

  // 🔷 CLIQUE FORA DO MODAL FECHA
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });

  // 🔷 FOCO NO CANCELAR (SEGURANÇA UX)
  btnCancel.focus();
}
/* =========================================================
   🔷 GERAR TABELA DINÂMICA DE TAXAS
========================================================= */
function gerarTabelaTaxas() {
  const container = document.getElementById("tabelaContainer");

  const modalidades = [
    "pix",
    "debito",
    "1x",
    "2x",
    "3x",
    "4x",
    "5x",
    "6x",
    "7x",
    "8x",
    "9x",
    "10x",
    "11x",
    "12x",
    "13x",
    "14x",
    "15x",
    "16x",
    "17x",
    "18x",
    "19x",
    "20x",
    "21x",
  ];

  let html = `
  <table class="tabela-taxas">
    <thead>
      <tr>
        <th>Modalidade</th>
        <th class="col-visa">Visa</th>
        <th class="col-master">Master</th>
        <th class="col-elo">Elo</th>
        <th class="col-outros">Outros</th>
      </tr>
    </thead>
    <tbody>
`;
  modalidades.forEach((mod) => {
    let texto = mod;

    // 🔷 ajustes visuais (SEM IMPACTAR O SISTEMA)
    if (mod === "pix") {
      texto = "Pix";
    }

    if (mod === "debito") {
      texto = "Débito";
    }

    if (mod === "1x") {
      texto = "Crédito à vista";
    }

    html += `
    <tr>
      <td>${texto}</td>

      <td>
        <input type="text" inputmode="decimal" id="visa_${mod}">
      </td>

      <td>
        <input type="text" inputmode="decimal" id="master_${mod}">
      </td>

      <td>
        <input type="text" inputmode="decimal" id="elo_${mod}">
      </td>

      <td>
        <input type="text" inputmode="decimal" id="outros_${mod}">
      </td>

    </tr>
  `;
  });

  html += `</tbody></table>`;

  container.innerHTML = html;
  // 🔷 APLICAR MÁSCARA EM TODOS OS INPUTS
  const inputs = document.querySelectorAll(".tabela-taxas input");

  // 🔷 INSERIR LOGOS NAS COLUNAS (SEGURO)
  setTimeout(() => {
    const mapa = [
      { cls: "col-visa", img: "visa.svg", nome: "Visa" },
      { cls: "col-master", img: "master.svg", nome: "Master" },
      { cls: "col-elo", img: "elo.svg", nome: "Elo" },
      { cls: "col-outros", img: "amex.svg", nome: "Outros" },
    ];

    mapa.forEach((item) => {
      const el = document.querySelector("." + item.cls);
      if (el) {
        el.innerHTML = `
        <img src="img/${item.img}" class="logo-bandeira"><br>
        <span class="label-bandeira">${item.nome}</span>
      `;
      }
    });
  }, 100);

  inputs.forEach((input) => {
    aplicarMascaraFinanceira(input);
    destacarZero(input); // 🔥 NOVO
  });
}

// 🔷 DESTACAR CAMPOS ZERADOS
function destacarZero(input) {
  let valor = input.value.replace(",", ".").trim();

  let numero = parseFloat(valor);

  // 🔥 só destaca ZERO REAL (não vazio)
  if (valor !== "" && !isNaN(numero) && numero === 0) {
    input.classList.add("valor-zero");
  } else {
    input.classList.remove("valor-zero");
  }
}
/* =========================================================
   🔷 MÁSCARA FINANCEIRA COMPLETA (DIGITAÇÃO + SAÍDA)
========================================================= */
function aplicarMascaraFinanceira(input) {
  // 🔷 DIGITAÇÃO (tempo real)
  input.addEventListener("input", () => {
    let valor = input.value;

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");

    if (!valor) {
      input.value = "";
      return;
    }

    let numero = parseFloat(valor) / 100;

    input.value = numero.toFixed(2).replace(".", ",");
  });

  // 🔷 AO SAIR DO CAMPO (BLUR)
  input.addEventListener("blur", () => {
    let valor = input.value;

    if (!valor) return;

    // troca vírgula por ponto
    valor = valor.replace(",", ".");

    let numero = parseFloat(valor);

    if (isNaN(numero)) {
      input.value = "";
      return;
    }

    // 🔥 FORÇA FORMATO FINAL
    input.value = numero.toFixed(2).replace(".", ",");
  });
  // 🔥 🔥 AQUI (NO FINAL DA FUNÇÃO)
  input.addEventListener("input", () => destacarZero(input));
  input.addEventListener("blur", () => destacarZero(input));
}
function aplicarLimiteParcelamento() {
  const limite = parseInt(document.getElementById("limiteParcelamento").value);

  for (let i = 1; i <= 21; i++) {
    const campos = ["visa", "master", "elo", "outros"];

    campos.forEach((bandeira) => {
      const input = document.getElementById(`${bandeira}_${i}x`);

      if (input) {
        if (i > limite) {
          // 🔴 BLOQUEIA E PREENCHE
          input.value = "0,00";
          input.disabled = true;
          input.dataset.auto = "true"; // 🔥 marca como automático
          input.classList.add("bloqueado");
          destacarZero(input); // 🔥 ADICIONE AQUI
        } else {
          // 🟢 LIBERA
          input.disabled = false;
          input.style.background = "#fff";

          // 🔥 LIMPA SOMENTE SE FOI AUTO
          if (input.dataset.auto === "true") {
            input.value = "";
            delete input.dataset.auto;
          }
          destacarZero(input); // 🔥
        }
      }
    });
    ativarPDFPorDuploClique();
  }
}

// =====================================
// 🔷 LIMPAR CAMPOS DE TAXAS
// =====================================
function limparCamposTaxas() {
  const bandeiras = ["visa", "master", "elo", "outros"];

  const modalidades = [
    "pix",
    "debito",
    "1x",
    "2x",
    "3x",
    "4x",
    "5x",
    "6x",
    "7x",
    "8x",
    "9x",
    "10x",
    "11x",
    "12x",
    "13x",
    "14x",
    "15x",
    "16x",
    "17x",
    "18x",
    "19x",
    "20x",
    "21x",
  ];

  modalidades.forEach((mod) => {
    bandeiras.forEach((bandeira) => {
      const input = document.getElementById(`${bandeira}_${mod}`);

      if (input) {
        input.value = "";
      }
    });
  });
}

// =====================================
// 🔷 RESETAR ESTADO DA TELA (PADRÃO)
// =====================================
function resetarEstadoTabela() {
  // 🔷 limpa select
  const select = document.getElementById("tabelaTaxas");
  if (select) select.value = "";

  // 🔷 limpa tabela visual
  limparCamposTaxas();

  // 🔷 esconde botões
  const btnEditar = document.getElementById("btnEditar");
  const btnExcluir = document.getElementById("btnExcluir");
  const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");

  if (btnEditar) btnEditar.style.display = "none";
  if (btnExcluir) btnExcluir.style.display = "none";
  if (btnSalvarEdicao) btnSalvarEdicao.style.display = "none";

  // 🔷 bloqueia edição
  setModoEdicao(false);
}

// =====================================
// 🔷 INICIAR NOVA TABELA
// =====================================
function iniciarNovaTabela() {
  // 🔷 limpa nome da tabela
  document.getElementById("nomeTabela").value = "";

  // 🔷 limpa select da tabela (parte de baixo)
  const selectTabela = document.getElementById("tabelaTaxas");
  if (selectTabela) selectTabela.value = "";

  // 🔷 limpa tipo da taxa
  const tipo = document.getElementById("tipoTaxa");
  if (tipo) tipo.value = "";

  // 🔷 limpa TODOS inputs da tabela
  const inputs = document.querySelectorAll(".tabela-taxas input");

  inputs.forEach((input) => {
    input.value = "";
    input.disabled = false;
    input.classList.remove("valor-zero"); // remove vermelho
  });

  // 🔷 libera edição
  setModoEdicao(true);

  console.log("🆕 Nova tabela iniciada");
}

// =====================================
// 🔷 CONTROLE DE EDIÇÃO (OBRIGATÓRIA)
// =====================================
function setModoEdicao(ativo) {
  const bandeiras = ["visa", "master", "elo", "outros"];

  const modalidades = [
    "pix",
    "debito",
    "1x",
    "2x",
    "3x",
    "4x",
    "5x",
    "6x",
    "7x",
    "8x",
    "9x",
    "10x",
    "11x",
    "12x",
    "13x",
    "14x",
    "15x",
    "16x",
    "17x",
    "18x",
    "19x",
    "20x",
    "21x",
  ];

  modalidades.forEach((mod) => {
    bandeiras.forEach((b) => {
      const input = document.getElementById(`${b}_${mod}`);
      if (input) {
        input.disabled = !ativo;
      }
    });
  });
}

// =====================================
// 🔷 CARREGAR TAXAS POR TABELA
// =====================================
async function carregarTaxasPorTabela(nomeTabela) {
  try {
    limparCamposTaxas(); // 🔥 ESSENCIAL
    const response = await fetch(
      `https://megaec-backend.vercel.app/api/taxas?tabela=${nomeTabela}`,
      {
        headers: {
          "x-empresa-id": getEmpresaId(),
        },
      },
    );

    const dados = await response.json();
    // 🔥 AJUSTAR TIPO AUTOMATICAMENTE
    if (dados.length > 0 && dados[0].tipo) {
      console.log("🎯 Tipo identificado:", dados[0].tipo);
      ajustarTipo(dados[0].tipo);
    }

    console.log("📥 TAXAS CARREGADAS:", dados);

    dados.forEach((t) => {
      const idVisa = `visa_${t.modalidade}`;
      const idMaster = `master_${t.modalidade}`;
      const idElo = `elo_${t.modalidade}`;
      const idOutros = `outros_${t.modalidade}`;

      // 🔷 FUNÇÃO SEGURA DE FORMATAÇÃO
      const formatar = (valor) => {
        if (valor === null || valor === undefined || valor === "") {
          return "";
        }
        return Number(valor).toFixed(2).replace(".", ",");
      };

      const inputVisa = document.getElementById(idVisa);
      if (inputVisa) {
        inputVisa.value = formatar(t.visa);
        destacarZero(inputVisa); // 🔥 AQUI
      }

      const inputMaster = document.getElementById(idMaster);
      if (inputMaster) {
        inputMaster.value = formatar(t.master);
        destacarZero(inputMaster);
      }

      const inputElo = document.getElementById(idElo);
      if (inputElo) {
        inputElo.value = formatar(t.elo);
        destacarZero(inputElo);
      }

      const inputOutros = document.getElementById(idOutros);
      if (inputOutros) {
        inputOutros.value = formatar(t.outros);
        destacarZero(inputOutros);
      }
    });

    // 🔥 REAPLICA LIMITE + CORES DEPOIS DO CARREGAMENTO
    aplicarLimiteParcelamento();

    // 🔒 BLOQUEIA APÓS CARREGAR (CORRETO AQUI)
    setModoEdicao(false);
  } catch (error) {
    console.error("Erro ao carregar taxas:", error);
  }
}
// =====================================
// 🔷 CARREGAR TABELAS NO SELECT
// =====================================
async function carregarTabelas() {
  try {
    limparCamposTaxas(); // 🔥 ADICIONADO
    const res = await fetch(`https://megaec-backend.vercel.app/api/tabelas`, {
      headers: {
        "x-empresa-id": getEmpresaId(),
      },
    });
    const dados = await res.json();

    console.log("📦 DADOS COMPLETOS:", dados);

    console.log("📦 TABELAS:", dados);

    const selectTaxas = document.getElementById("tabelaTaxas");
    const selectCliente = document.getElementById("tabelaCliente");

    // limpa antes
    selectTaxas.innerHTML = '<option value="">Selecione uma tabela</option>';
    selectCliente.innerHTML = '<option value="">Selecione uma tabela</option>';

    dados.forEach((tabela) => {
      // 🔷 SELECT TAXAS
      const optionTaxas = document.createElement("option");
      optionTaxas.value = tabela;
      optionTaxas.textContent = tabela;

      // 🔷 SELECT CLIENTE
      const optionCliente = document.createElement("option");
      optionCliente.value = tabela;
      optionCliente.textContent = tabela;

      selectTaxas.appendChild(optionTaxas);
      selectCliente.appendChild(optionCliente);
    });

    // =====================================
    // 🔥 AUTO SELECIONAR PRIMEIRA TABELA
    // =====================================
  } catch (error) {
    console.error("Erro ao carregar tabelas:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  aplicarWhiteLabelLocal();

  gerarTabelaTaxas();
  resetarEstadoTabela();
  carregarClientes(); // 👈 aqui sim

  // =====================================
  // 🔷 EVENTO PRINCIPAL DAS TABELAS (FALTAVA ISSO)
  // =====================================
  const tabelaTaxas = document.getElementById("tabelaTaxas");

  if (tabelaTaxas) {
    tabelaTaxas.addEventListener("change", async function () {
      const nomeTabela = this.value;

      const btnEditar = document.getElementById("btnEditar");
      const btnExcluir = document.getElementById("btnExcluir");
      const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");

      if (!nomeTabela) {
        // 🔒 ESCONDE TODOS
        btnEditar.style.display = "none";
        btnExcluir.style.display = "none";
        btnSalvarEdicao.style.display = "none";
        return;
      }

      console.log("📊 Carregando tabela:", nomeTabela);

      // 🔥 MOSTRA TODOS (COMPORTAMENTO ORIGINAL RESTAURADO)
      btnEditar.style.display = "inline-block";
      btnExcluir.style.display = "inline-block";
      btnSalvarEdicao.style.display = "inline-block";

      await carregarTaxasPorTabela(nomeTabela);
    });
  }

  // 🔥 AGORA SIM — DEPOIS DO EVENTO
  carregarTabelas();

  // 🔷 BOTÃO EDITAR
  const btnEditar = document.getElementById("btnEditar");
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      console.log("✏️ Editando tabela");
      setModoEdicao(true);
    });

    btnEditar.style.display = "none";
  }

  // =====================================
  // 🔷 BOTÃO SALVAR NOVA TABELA (FALTAVA)
  // =====================================
  const btnSalvarNova = document.getElementById("btnSalvar");

  if (btnSalvarNova) {
    btnSalvarNova.addEventListener("click", async () => {
      console.log("💾 Salvando nova tabela");

      await enviarTaxas();
    });
  }

  // 🔷 BOTÃO SALVAR EDIÇÃO
  const btnSalvar = document.getElementById("btnSalvarEdicao");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", async () => {
      console.log("💾 Salvando alteração");

      await enviarTaxas();

      setModoEdicao(false);
    });

    btnSalvar.style.display = "none";
  }

  // 🔷 BOTÃO EXCLUIR
  const btnExcluir = document.getElementById("btnExcluir");
  if (btnExcluir) {
    // 🔥 ESCONDE AO INICIAR (AQUI 👇)
    btnExcluir.style.display = "none";

    btnExcluir.addEventListener("click", () => {
      const select = document.getElementById("tabelaTaxas");
      const tabela = select ? select.value : "";

      if (!tabela) {
        mostrarAlerta("Selecione uma tabela para excluir", "erro");
        return;
      }

      excluirTabela(tabela);
    });
  }

  // 🔷 CARREGAR TABELAS AO INICIAR
  // exclluido caregartabela()

  // =====================================
  // 🔷 TOPO → SINCRONIZA COM SISTEMA
  // =====================================
  const tabelaCliente = document.getElementById("tabelaCliente");

  if (tabelaCliente) {
    tabelaCliente.addEventListener("change", function () {
      const tabela = this.value;

      if (!tabela) return;

      // 🔥 1. Atualiza o select de baixo
      const selectTaxas = document.getElementById("tabelaTaxas");
      if (selectTaxas) {
        selectTaxas.value = tabela;

        // 🔥 DISPARA O MESMO COMPORTAMENTO DO DE BAIXO
        selectTaxas.dispatchEvent(new Event("change"));
      }
    });
  }

  const tipoCliente = document.getElementById("tipoCliente");
  const tipoTaxa = document.getElementById("tipoTaxa");

  // 🔷 Quando muda no topo → atualiza embaixo
  if (tipoCliente && tipoTaxa) {
    // 🔷 TOPO → BAIXO
    tipoCliente.addEventListener("change", () => {
      tipoTaxa.value = tipoCliente.value;
      atualizarEstadoCampo(tipoTaxa);
    });

    // 🔷 BAIXO → TOPO
    tipoTaxa.addEventListener("change", () => {
      tipoCliente.value = tipoTaxa.value;
      atualizarEstadoCampo(tipoCliente);
    });

    // 🔥 🔥 FORÇA SINCRONIZAÇÃO INICIAL
    tipoTaxa.value = tipoCliente.value;
    atualizarEstadoCampo(tipoTaxa);
  }

  // 🔷 APLICA EM TODOS
  document;
  document
    .querySelectorAll(
      ".bloco-esquerda input, .bloco-esquerda select, .linha-topo-taxas input, .linha-topo-taxas select, #limiteParcelamento, #tipoTaxa",
    )
    .forEach((el) => {
      // 🔄 Aplica estado inicial
      atualizarEstadoCampo(el);

      // 🔷 Se for INPUT → usa input
      if (el.tagName === "INPUT") {
        el.addEventListener("input", () => atualizarEstadoCampo(el));
      }

      // 🔷 Se for SELECT → usa change
      if (el.tagName === "SELECT") {
        el.addEventListener("change", () => atualizarEstadoCampo(el));
      }
    });

  // 🔷 BOTÃO NOVA TABELA
  const btnNovaTabela = document.getElementById("btnNovaTabela");

  if (btnNovaTabela) {
    btnNovaTabela.addEventListener("click", iniciarNovaTabela);
  }

  // =====================================
  // 🔷 EVENTO LIMITE PARCELAMENTO (COLOCA AQUI)
  // =====================================
  const limiteParcelamento = document.getElementById("limiteParcelamento");

  if (limiteParcelamento) {
    limiteParcelamento.addEventListener("change", () => {
      console.log("📊 Limite alterado:", limiteParcelamento.value);

      aplicarLimiteParcelamento();
    });
  }

  // =====================================
  // 🔷 MÁSCARA + VALIDAÇÃO CPF/CNPJ
  // =====================================
  const inputLogin = document.getElementById("loginCliente");

  if (inputLogin) {
    inputLogin.addEventListener("input", (e) => {
      e.target.value = formatarCpfCnpj(e.target.value);
    });

    inputLogin.addEventListener("blur", (e) => {
      const valor = e.target.value;

      if (valor && !validarCpfCnpj(valor)) {
        mostrarAlerta("CPF ou CNPJ inválido", "erro");
        e.target.focus();
      }
    });
  }
});

// =====================================
// 🔷 AJUSTAR TIPO AUTOMATICAMENTE (RESTAURADO)
// =====================================
function ajustarTipo(tipo) {
  if (!tipo) return;

  const tipoNormalizado = tipo.toLowerCase();

  const selectTaxas = document.getElementById("tipoTaxa");
  const selectCliente = document.getElementById("tipoCliente");

  // 🔷 TAXAS
  if (selectTaxas) {
    selectTaxas.value = tipoNormalizado;
    selectTaxas.dispatchEvent(new Event("change")); // 🔥 VOLTA ISSO
  }

  // 🔷 CLIENTE
  if (selectCliente) {
    selectCliente.value = tipoNormalizado;
    selectCliente.dispatchEvent(new Event("change")); // 🔥 VOLTA ISSO
  }
}
// =====================================
// 🔷 CONTROLE AUTOMÁTICO DE COR DOS CAMPOS
// =====================================

function atualizarEstadoCampo(el) {
  if (el.value && el.value !== "") {
    el.classList.add("preenchido");
  } else {
    el.classList.remove("preenchido");
  }
}

async function excluirCliente(id) {
  confirmarAcao(
    `Tem certeza que deseja excluir este cliente?<br><br>
     ⚠️ Essa ação não pode ser desfeita.`,
    async () => {
      try {
        // 🔒 evita múltiplos cliques
        if (window.excluindoCliente) return;
        window.excluindoCliente = true;

        const res = await fetch(
          `https://megaec-backend.vercel.app/api/clientes?id=${id}`,
          {
            method: "DELETE",
            headers: {
              "x-empresa-id": getEmpresaId(),
            },
          },
        );

        const resposta = await res.json();

        if (resposta.success) {
          mostrarAlerta("🗑️ Cliente excluído com sucesso");
          carregarClientes();
        } else {
          mostrarAlerta("❌ Erro ao excluir");
        }
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        mostrarAlerta("Erro na comunicação com servidor", "erro");
      } finally {
        window.excluindoCliente = false;
      }
    },
  );
}
/* =========================================================
   🔷 FUNÇÃO: EDITAR CLIENTE (PLACEHOLDER)
   ========================================================= */
/* =========================================================
   🔷 FUNÇÃO: EDITAR CLIENTE (PREENCHER FORMULÁRIO)
   ========================================================= */
function editarCliente(id) {
  /* =========================================================
     🔷 ATIVAR MODO EDIÇÃO (COLOCAR AQUI — PRIMEIRA COISA)
     ========================================================= */

  // 🔥 salva o ID do cliente sendo editado
  window.clienteEditando = id;

  // 🔥 muda o botão para modo edição
  const btn = document.getElementById("btnCriar");
  btn.innerText = "💾 Salvar Alteração";
  btn.classList.add("edicao");

  /* =========================================================
     🔷 CONTINUAÇÃO DA SUA FUNÇÃO (NÃO ALTERAR)
     ========================================================= */

  const cliente = listaClientes.find((c) => c.id === id);

  if (!cliente) {
    mostrarAlerta("Cliente não encontrado");
    return;
  }

  // 🔥 preencher formulário
  document.getElementById("nomeCliente").value = cliente.nome;
  document.getElementById("loginCliente").value = cliente.cpf_cnpj;
  document.getElementById("tipoCliente").value = cliente.tipo;
  document.getElementById("tabelaCliente").value = cliente.tabela_nome;

  mostrarAlerta("✏️ Editando cliente...");
}
// =====================================
// 📋 COPIAR CREDENCIAIS + GUIA PWA
// =====================================
function copiarCredenciais(cliente) {
  const texto = `📲 Bem-vindo ao Simulador Zion!

Seu acesso já está liberado.

Acesse agora e instale seu aplicativo:

https://zion-app-ten.vercel.app

━━━━━━━━━━━━━━━━━━━━

🏢 Cliente: ${cliente.nome}

🔐 Login: ${cliente.cpf_cnpj}
🔑 Senha: ${cliente.senha}

━━━━━━━━━━━━━━━━━━━━

📱 INSTALAÇÃO ANDROID

1. Abra o link no Google Chrome
2. Toque nos 3 pontos (⋮)
3. Toque em "Adicionar à tela inicial"

🍎 INSTALAÇÃO iPhone (iOS)

1. Abra o link no Safari
2. Toque em "Compartilhar"
3. Toque em "Adicionar à Tela de Início"

━━━━━━━━━━━━━━━━━━━━

✨ Após a instalação, o ícone do aplicativo ficará disponível na tela inicial do seu celular, funcionando como um app profissional, com acesso rápido sempre que precisar.`;

  navigator.clipboard.writeText(texto);

  mostrarAlerta("📋 Credenciais + guia de instalação copiados!");
}

function cancelarEdicao() {
  // 🔥 limpa campos
  document.getElementById("nomeCliente").value = "";
  document.getElementById("loginCliente").value = "";
  document.getElementById("tipoCliente").value = "";
  document.getElementById("tabelaCliente").value = "";

  // 🔥 sai do modo edição
  window.clienteEditando = null;

  // 🔥 reseta botão
  const btn = document.getElementById("btnCriar");
  btn.innerText = "CRIAR +";
  btn.classList.remove("edicao");

  mostrarAlerta("Edição cancelada");
}
// =====================================================
// 🔷 TÍTULO DINÂMICO (WHITE LABEL)
// =====================================================

const nomeEmpresaTitulo = localStorage.getItem("empresa_nome");

if (nomeEmpresaTitulo) {
  document.title = `Painel Administrativo - ${nomeEmpresaTitulo}`;
}
// =====================================================
// 🔷 BOAS-VINDAS DINÂMICO NO MESMO LUGAR
// =====================================================

const nomeEmpresa = localStorage.getItem("empresa_nome");
const nomeEmpresaEl = document.getElementById("nomeEmpresa");

if (nomeEmpresaEl && nomeEmpresa) {
  nomeEmpresaEl.innerHTML = `Olá, <strong>${nomeEmpresa}</strong>. Seja bem-vindo à gestão de acessos e taxas do simulador.`;
}
// =====================================================
// 🔷 FAVICON DINÂMICO (WHITE LABEL)
// =====================================================

const logoEmpresa = localStorage.getItem("empresa_logo");
const faviconEl = document.getElementById("faviconEmpresa");

if (faviconEl) {
  if (logoEmpresa) {
    const caminho = logoEmpresa.startsWith("/")
      ? logoEmpresa
      : "/" + logoEmpresa;
    faviconEl.href = caminho;
  } else {
    faviconEl.href = "img/sistema/favicon.png";
  }
}
// =====================================
// 🚪 LOGOUT EMPRESA
// =====================================
function logoutEmpresa() {
  // 🔷 limpa sessão da empresa
  localStorage.removeItem("empresa_id");
  localStorage.removeItem("empresa_nome");
  localStorage.removeItem("empresa_logo");
  localStorage.removeItem("empresa_banner");
  localStorage.removeItem("empresa_logo_simulador");

  // 🔷 volta para login
  window.location.href = "login-empresa.html";
}

// =====================================
// 🔍 BUSCAR CLIENTE POR CPF/CNPJ
// =====================================
function buscarCliente(input) {
  console.log("BUSCA DISPAROU:", input.value);

  // remove máscara
  const termoDigitado = limparCpfCnpj(input.value);

  // se apagar campo → volta tudo
  if (!termoDigitado) {
    renderizarClientes(listaClientes);
    return;
  }

  // busca no cache real do sistema
  const clientesFiltrados = listaClientes.filter((cliente) =>
    cliente.cpf_cnpj.includes(termoDigitado),
  );

  // renderiza resultado
  renderizarClientes(clientesFiltrados);
}
