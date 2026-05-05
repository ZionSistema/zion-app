/* =========================================================
   🔷 CONTROLE DO MODAL PDF
========================================================= */

function abrirModalPDF() {
  document.getElementById("modalPDF").style.display = "flex";
}

function fecharModalPDF() {
  document.getElementById("modalPDF").style.display = "none";
}

function confirmarPDF() {
  console.log("🔥 cliquei no SIM");

  fecharModalPDF();

  gerarPDF();
}
function ativarPDFPorDuploClique() {
  const thead = document.querySelector(".tabela-taxas thead");

  if (!thead) return;

  thead.ondblclick = () => {
    abrirModalPDF();
  };
}
function gerarPDF() {
  const elemento = document.querySelector(".tabela-taxas");

  if (!elemento) {
    mostrarAlerta("Tabela não encontrada", "erro");
    return;
  }

  const opcoes = {
    margin: 10,
    filename: "tabela-taxas.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(elemento).set(opcoes).save();
}
window.gerarPDF = gerarPDF;
