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

    // VALIDAÇÃO

    if (
      nome.trim() === "" ||
      email.trim() === "" ||
      telefone.trim() === "" ||
      evento === "Selecione" ||
      data.trim() === "" ||
      local.trim() === ""
    ) {
      alert("Preencha todos os campos!");

      return;
    }

    const pedido = {
      nome,
      email,
      telefone,
      evento,
      data,
      local,
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
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos.forEach((pedido, index) => {
    tabela.innerHTML += `

      <tr>

        <td>${pedido.nome}</td>

        <td>${pedido.evento}</td>

        <td>${pedido.data}</td>

        <td>${pedido.local}</td>

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

  // ===============================
  // ESTATÍSTICAS
  // ===============================

  const totalPedidos = pedidos.length;

  const totalCasamentos = pedidos.filter((pedido) => pedido.evento === "Casamento").length;

  const totalFormaturas = pedidos.filter((pedido) => pedido.evento === "Formatura").length;

  const cardTotal = document.getElementById("totalPedidos");
  const cardCasamentos = document.getElementById("totalCasamentos");
  const cardFormaturas = document.getElementById("totalFormaturas");

  if (cardTotal) {
    cardTotal.textContent = totalPedidos;
  }

  if (cardCasamentos) {
    cardCasamentos.textContent = totalCasamentos;
  }

  if (cardFormaturas) {
    cardFormaturas.textContent = totalFormaturas;
  }
}

// ===============================
// EXCLUIR PEDIDO
// ===============================

function excluirPedido(index) {
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos.splice(index, 1);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  location.reload();
}
