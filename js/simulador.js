// =====================================
// CARREGAR DADOS DA SESSÃO
// =====================================

const dadosCliente = JSON.parse(sessionStorage.getItem("clienteLogado"));

// =====================================
// SEGURANÇA
// =====================================

if (!dadosCliente) {
  window.location.href = "login-cliente.html";
}

// =====================================
// PREENCHER INTERFACE
// =====================================

document.getElementById("nomeCliente").textContent =
  `Olá, ${dadosCliente.nome}!`;
document.getElementById("empresaCliente").innerHTML =
  `Empresa: <strong>${dadosCliente.nome_empresa}</strong>`;

document.getElementById("logoEmpresa").src = dadosCliente.logo_simulador;

// DEBUG
console.log("CLIENTE LOGADO:", dadosCliente);

// =====================================
// TABS DO PRODUTO
// =====================================

const grupoTabs = document.getElementById("grupoTabs");

const btnTabLink = document.getElementById("btnTabLink");

const btnTabMaquininha = document.getElementById("btnTabMaquininha");

// eventos tabs
// eventos tabs
btnTabMaquininha.addEventListener("click", () => {
  btnTabMaquininha.classList.add("ativo");

  btnTabLink.classList.remove("ativo");

  console.log("PRODUTO:", "maquininha");

  carregarTaxasCliente();
});

btnTabLink.addEventListener("click", () => {
  btnTabLink.classList.add("ativo");

  btnTabMaquininha.classList.remove("ativo");

  console.log("PRODUTO:", "link");

  carregarTaxasCliente();
});

// controlar quais tabs aparecem
if (dadosCliente.tabela_maquininha && dadosCliente.tabela_link) {
  // cliente possui os dois produtos
  btnTabMaquininha.style.display = "block";
  btnTabLink.style.display = "block";
} else if (dadosCliente.tabela_maquininha) {
  // cliente só maquininha
  btnTabMaquininha.style.display = "block";
  btnTabLink.style.display = "none";
} else if (dadosCliente.tabela_link) {
  // cliente só link
  btnTabMaquininha.style.display = "none";
  btnTabLink.style.display = "block";

  // deixa link selecionado
  btnTabLink.classList.add("ativo");
}

// =====================================
// TIPO DE CÁLCULO
// =====================================

let modoCalculo = "pagar";

const btnPagarTaxa = document.getElementById("btnPagarTaxa");

const btnRepassarTaxa = document.getElementById("btnRepassarTaxa");

// pagar taxa
btnPagarTaxa.addEventListener("click", () => {
  modoCalculo = "pagar";

  btnPagarTaxa.classList.add("ativo");

  btnRepassarTaxa.classList.remove("ativo");

  console.log("MODO:", modoCalculo);

  calcularSimulacao();
});

// repassar taxa
btnRepassarTaxa.addEventListener("click", () => {
  modoCalculo = "repassar";

  btnRepassarTaxa.classList.add("ativo");

  btnPagarTaxa.classList.remove("ativo");

  console.log("MODO:", modoCalculo);

  calcularSimulacao();
});
// =====================================
// MODALIDADES
// =====================================

const botoesModalidade = document.querySelectorAll(".btn-modalidade");

const grupoParcelas = document.querySelector(".grupo-parcelas");
const grupoBandeiras = document.querySelector(".grupo-bandeiras");

function atualizarVisualModalidade() {
  const modalidade = document.querySelector(".btn-modalidade.ativa")?.dataset
    .modalidade;

  if (modalidade === "pix") {
    grupoBandeiras.style.display = "none";
    grupoParcelas.style.display = "none";
  } else if (modalidade === "debito") {
    grupoBandeiras.style.display = "flex";
    grupoParcelas.style.display = "none";
  } else if (modalidade === "credito") {
    grupoBandeiras.style.display = "flex";
    grupoParcelas.style.display = "block";
  }
}

botoesModalidade.forEach((botao) => {
  botao.addEventListener("click", () => {
    // remove seleção anterior
    botoesModalidade.forEach((b) => b.classList.remove("ativa"));

    // ativa botão clicado
    botao.classList.add("ativa");

    // atualiza interface visual
    atualizarVisualModalidade();

    // recalcula
    calcularSimulacao();
  });
});
// executa uma única vez ao abrir
atualizarVisualModalidade();

// =====================================
// CONTROLE DINÂMICO DE PARCELAS
// =====================================

let parcelaAtual = 1;

let maxParcelas = 12;

// elementos
const btnMaisParcela = document.getElementById("btnMaisParcela");

const btnMenosParcela = document.getElementById("btnMenosParcela");

const numeroParcela = document.getElementById("numeroParcela");

// atualiza visual
function atualizarParcelas() {
  numeroParcela.textContent = `${parcelaAtual}x`;
}

// buscar limite da tabela
async function carregarLimiteParcelas() {
  try {
    const response = await fetch(
      `https://megaec-backend.vercel.app/api/parcelas?empresa_id=${dadosCliente.empresa_id}&tabela_nome=${dadosCliente.tabela_nome}`,
    );

    const dados = await response.json();

    if (dados.sucesso) {
      maxParcelas = dados.max_parcelas;

      console.log("LIMITE DA TABELA:", maxParcelas);
    }
  } catch (error) {
    console.error("ERRO AO BUSCAR PARCELAS:", error);
  }
}

// botão +
btnMaisParcela.addEventListener("click", () => {
  if (parcelaAtual < maxParcelas) {
    parcelaAtual++;

    atualizarParcelas();

    // recalcula imediatamente
    calcularSimulacao();
  }
});

// botão -
btnMenosParcela.addEventListener("click", () => {
  if (parcelaAtual > 1) {
    parcelaAtual--;

    atualizarParcelas();

    // recalcula imediatamente
    calcularSimulacao();
  }
});

// iniciar
carregarLimiteParcelas();

atualizarParcelas();
// =====================================
// CARREGAR TAXAS DO CLIENTE
// =====================================

let taxasCliente = [];

async function carregarTaxasCliente() {
  try {
    let tabelaAtual = btnTabMaquininha.classList.contains("ativo")
      ? dadosCliente.tabela_maquininha
      : dadosCliente.tabela_link;

    const response = await fetch(
      `https://megaec-backend.vercel.app/api/taxas?tabela=${tabelaAtual}`,
      {
        headers: {
          "x-empresa-id": dadosCliente.empresa_id,
        },
      },
    );

    const dados = await response.json();

    taxasCliente = dados;

    console.log("TABELA ATIVA:", tabelaAtual);

    console.log("TAXAS CARREGADAS:", taxasCliente);

    calcularSimulacao();
  } catch (error) {
    console.error("ERRO AO CARREGAR TAXAS:", error);
  }
}

// iniciar
carregarTaxasCliente();

// =====================================
// BUSCAR TAXA ATIVA
// =====================================

function obterTaxaAtual() {
  // modalidade selecionada
  const modalidadeSelecionada = document.querySelector(".btn-modalidade.ativa")
    ?.dataset.modalidade;

  // bandeira selecionada
  const bandeiraSelecionada = document.querySelector(".bandeira-card.ativa")
    ?.dataset.bandeira;

  // converter modalidade
  let modalidadeBusca = modalidadeSelecionada;

  if (modalidadeSelecionada === "debito") {
    modalidadeBusca = "debito";
  } else if (modalidadeSelecionada === "pix") {
    modalidadeBusca = "pix";
  } else {
    modalidadeBusca = `${parcelaAtual}x`;
  }

  // procurar no array
  const taxaEncontrada = taxasCliente.find(
    (item) =>
      item.modalidade?.trim().toLowerCase() ===
      modalidadeBusca.trim().toLowerCase(),
  );

  if (!taxaEncontrada) {
    return 0;
  }

  const taxa = Number(taxaEncontrada[bandeiraSelecionada]) || 0;

  console.log("TAXA ATIVA:", taxa);

  return taxa;
}
// =====================================
// SELEÇÃO DE BANDEIRAS
// =====================================

const botoesBandeira = document.querySelectorAll(".bandeira-card");

botoesBandeira.forEach((botao) => {
  botao.addEventListener("click", () => {
    // remove seleção anterior
    botoesBandeira.forEach((b) => b.classList.remove("ativa"));

    // ativa selecionado
    botao.classList.add("ativa");

    console.log("BANDEIRA:", botao.dataset.bandeira);

    calcularSimulacao();
  });
});
// =====================================
// CAMPO VALOR + MÁSCARA MONETÁRIA
// =====================================

const inputValorVenda = document.getElementById("valorVenda");

let valorNumerico = 0;

// formatar moeda BR
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// digitação monetária
inputValorVenda.addEventListener("input", (e) => {
  // manter só números
  let numeros = e.target.value.replace(/\D/g, "");

  if (!numeros) {
    valorNumerico = 0;

    e.target.value = "";

    return;
  }

  // converter centavos
  valorNumerico = Number(numeros) / 100;

  // mostrar máscara
  e.target.value = formatarMoeda(valorNumerico);

  console.log("VALOR DIGITADO:", valorNumerico);

  calcularSimulacao();
});
// =====================================
// CÁLCULO DA SIMULAÇÃO
// =====================================

function calcularSimulacao() {
  if (valorNumerico <= 0) {
    valorNumerico = 0;
  }

  // captura estados atuais
  const modalidadeSelecionada = document.querySelector(".btn-modalidade.ativa")
    ?.dataset.modalidade;

  const bandeiraSelecionada = document.querySelector(".bandeira-card.ativa")
    ?.dataset.bandeira;

  const tipoProduto = btnTabLink.classList.contains("ativo")
    ? "link"
    : "maquininha";

  const taxa = obterTaxaAtual();

  // elementos da tela
  const resultadoTaxa = document.getElementById("resultadoTaxa");

  const resultadoPrincipal = document.getElementById("resultadoPrincipal");

  const resultadoSecundario = document.getElementById("resultadoSecundario");

  const labelPrincipal = document.getElementById("labelResultadoPrincipal");

  const labelSecundario = document.getElementById("labelResultadoSecundario");

  // filipeta
  const tituloOperacao = document.getElementById("tituloOperacao");

  const subtituloOperacao = document.getElementById("subtituloOperacao");

  const valorVendaResumo = document.getElementById("valorVendaResumo");

  // taxa zerada
  if (taxa === 0) {
    resultadoTaxa.textContent = "0,00%";

    resultadoPrincipal.textContent = "R$ 0,00";

    resultadoSecundario.textContent = "R$ 0,00";

    return;
  }

  // monta tipo do produto
  const nomeTipo = tipoProduto === "link" ? "Link de Pagamento" : "Maquininha";

  // monta título
  let nomeOperacao = "";

  if (modalidadeSelecionada === "pix") {
    nomeOperacao = "PIX";
  } else if (modalidadeSelecionada === "debito") {
    nomeOperacao = "DÉBITO";
  } else {
    if (parcelaAtual <= 1) {
      nomeOperacao = "CRÉDITO À VISTA";
    } else {
      nomeOperacao = `CRÉDITO PARCELADO ${parcelaAtual}X`;
    }
  }

  // bandeira
  const nomeBandeira = bandeiraSelecionada?.toUpperCase() || "";

  // atualiza filipeta
  tituloOperacao.textContent = nomeOperacao;

  if (modalidadeSelecionada === "pix") {
    subtituloOperacao.textContent = `Tipo: ${nomeTipo}`;
  } else {
    subtituloOperacao.textContent = `Bandeira: ${nomeBandeira} | Tipo: ${nomeTipo}`;
  }

  valorVendaResumo.textContent = formatarMoeda(valorNumerico);

  let valorTaxa = 0;

  let resultadoFinal = 0;

  // taxa
  resultadoTaxa.textContent = `${taxa.toFixed(2).replace(".", ",")}%`;

  // PAGAR TAXA
  if (modoCalculo === "pagar") {
    valorTaxa = (valorNumerico * taxa) / 100;

    resultadoFinal = valorNumerico - valorTaxa;

    labelPrincipal.textContent = "Valor líquido";

    labelSecundario.textContent = "Valor da taxa";

    resultadoPrincipal.textContent = formatarMoeda(resultadoFinal);

    resultadoSecundario.textContent = formatarMoeda(valorTaxa);
  }

  // REPASSAR TAXA
  if (modoCalculo === "repassar") {
    resultadoFinal = valorNumerico / (1 - taxa / 100);

    valorTaxa = resultadoFinal - valorNumerico;

    labelPrincipal.textContent = "Valor a cobrar";

    labelSecundario.textContent = "Valor adicional";

    resultadoPrincipal.textContent = formatarMoeda(resultadoFinal);

    resultadoSecundario.textContent = formatarMoeda(valorTaxa);
  }

  console.log("TAXA:", taxa + "%");
}
// ======================================
// COPIAR SIMULAÇÃO AO TOCAR NO RESULTADO
// ======================================

const blocoResultado = document.querySelector(".bloco-resultado");

if (blocoResultado) {
  blocoResultado.style.cursor = "pointer";

  blocoResultado.addEventListener("click", async () => {
    try {
      // monta texto da simulação
      const texto = `
SIMULAÇÃO ZIONPAY

${document.getElementById("tituloOperacao").innerText}
${document.getElementById("subtituloOperacao").innerText}

Valor da venda: ${document.getElementById("valorVendaResumo").innerText}
${document.getElementById("labelResultadoPrincipal").innerText}: ${document.getElementById("resultadoPrincipal").innerText}

Taxa aplicada: ${document.getElementById("resultadoTaxa").innerText}
${document.getElementById("labelResultadoSecundario").innerText}: ${document.getElementById("resultadoSecundario").innerText}
      `.trim();

      // copia
      await navigator.clipboard.writeText(texto);

      // toast visual
      mostrarToastCopiado();
    } catch (erro) {
      console.error("Erro ao copiar:", erro);
    }
  });
}

// ======================================
// FEEDBACK VISUAL
// ======================================

function mostrarToastCopiado() {
  let toast = document.querySelector(".toast-copiado");

  if (!toast) {
    toast = document.createElement("div");

    toast.className = "toast-copiado";

    toast.textContent = "✓ Copiado";

    document.body.appendChild(toast);
  }

  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 1800);
}
