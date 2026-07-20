// ===============================
// PROTEÇÃO ADMIN
// ===============================

const paginaAdmin = window.location.pathname.includes("admin.html");

if (paginaAdmin) {
  const senha = prompt("Digite a senha do painel administrativo:");

  if (senha !== "festapronta123") {
    alert("Senha incorreta!");

    window.location.href = "index.html";
  }
}

// ===============================
// MÁSCARA TELEFONE
// ===============================

const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", (e) => {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");

    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

    e.target.value = valor;
  });
}

// ===============================
// FORMULÁRIO
// ===============================

const form = document.getElementById("formEvento");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const evento = document.getElementById("evento").value;
    const data = document.getElementById("data").value;
    const local = document.getElementById("local").value;
    const tipoLocal = document.getElementById("tipoLocal").value;
    const prioridade = document.getElementById("prioridade").value;

    // VALIDAÇÃO

    // ===============================
    // VALIDAÇÃO DOS CAMPOS
    // ===============================

    if (nome.trim() === "") {
      alert("Informe o nome completo.");
      return;
    }

    if (email.trim() === "") {
      alert("Informe o e-mail.");
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      alert("Informe um e-mail válido.");
      return;
    }

    if (telefone.trim() === "") {
      alert("Informe o telefone.");
      return;
    }

    if (telefone.replace(/\D/g, "").length !== 11) {
      alert("Informe um telefone válido.");
      return;
    }

    if (evento === "Selecione") {
      alert("Selecione o tipo do evento.");
      return;
    }

    if (data.trim() === "") {
      alert("Informe a data do evento.");
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataEvento = new Date(data);

    if (dataEvento < hoje) {
      alert("A data do evento deve ser futura.");
      return;
    }

    if (local.trim() === "") {
      alert("Informe o local do evento.");
      return;
    }

    if (local.trim().length < 3) {
      alert("Informe um local válido.");
      return;
    }

    const pedido = {
      nome,
      email,
      telefone,
      evento,
      data,
      local,
      tipoLocal,
      prioridade,
      status: "Pendente",
    };

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("Solicitação enviada com sucesso!");

    form.reset();
  });
}

// ===============================
// PAINEL ADMIN
// ===============================

const tabela = document.getElementById("tabelaPedidos");

if (tabela) {
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  function renderizarTabela(lista) {
    tabela.innerHTML = "";

    lista.forEach((pedido, index) => {
      tabela.innerHTML += `

      <tr>

        <td>${pedido.nome}</td>

        <td>${pedido.evento}</td>

        <td>${pedido.data}</td>

        <td>${pedido.local}</td>

        <td>${pedido.tipoLocal || "-"}</td>

        <td>${pedido.prioridade || "Baixa"}</td>

        <td>
          <span class="status">
            ${pedido.status}
          </span>
        </td>

        <td>

          <button
            class="btn-delete"
            onclick="excluirPedido(${index})"
          >
            Excluir
          </button>

        </td>

      </tr>

      `;
    });
  }

  renderizarTabela(pedidos);

  // ESTATÍSTICAS

  document.getElementById("totalPedidos").textContent = pedidos.length;

  document.getElementById("totalCasamentos").textContent = pedidos.filter(
    (p) => p.evento === "Casamento",
  ).length;

  document.getElementById("totalFormaturas").textContent = pedidos.filter(
    (p) => p.evento === "Formatura",
  ).length;

  const pendentes = document.getElementById("totalPendentes");

  if (pendentes) pendentes.textContent = pedidos.filter((p) => p.status === "Pendente").length;

  const alta = document.getElementById("totalAlta");

  if (alta) alta.textContent = pedidos.filter((p) => p.prioridade === "Alta").length;

  // ======================
  // PESQUISA
  // ======================

  const pesquisa = document.getElementById("pesquisa");

  const filtroStatus = document.getElementById("filtroStatus");

  const filtroPrioridade = document.getElementById("filtroPrioridade");

  function aplicarFiltros() {
    let resultado = pedidos;

    if (pesquisa.value !== "") {
      resultado = resultado.filter((p) =>
        p.nome.toLowerCase().includes(pesquisa.value.toLowerCase()),
      );
    }

    if (filtroStatus.value !== "") {
      resultado = resultado.filter((p) => p.status === filtroStatus.value);
    }

    if (filtroPrioridade.value !== "") {
      resultado = resultado.filter((p) => p.prioridade === filtroPrioridade.value);
    }

    renderizarTabela(resultado);
  }

  if (pesquisa) pesquisa.addEventListener("input", aplicarFiltros);

  if (filtroStatus) filtroStatus.addEventListener("change", aplicarFiltros);

  if (filtroPrioridade) filtroPrioridade.addEventListener("change", aplicarFiltros);

  // ======================
  // BACKUP
  // ======================

  const backup = document.getElementById("btnBackup");

  if (backup) {
    backup.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(pedidos, null, 2)], { type: "application/json" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = "backup_festa_pronta.json";

      a.click();

      URL.revokeObjectURL(url);
    });
  }
}
