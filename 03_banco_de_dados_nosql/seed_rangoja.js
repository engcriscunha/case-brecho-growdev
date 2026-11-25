// =============================================================
// RangoJá — seed do banco (cole no topo do script no myCompiler)
// Cada execução roda o script inteiro: mantenha este bloco no topo.
// =============================================================

// ---------- RESTAURANTES (cardápio EMBUTIDO) ----------
db.restaurantes.insertMany([
  {
    _id: 1,
    nome: "Cantina da Nonna",
    categoria: "Italiana",
    nota: 4.7,
    aberto: true,
    tags: ["massas", "vegetariano"],
    endereco: { rua: "Rua da República, 120", bairro: "Cidade Baixa", cidade: "Porto Alegre" },
    cardapio: [
      { codigo: "P1", nome: "Lasanha à bolonhesa", preco: 42.9, disponivel: true },
      { codigo: "P2", nome: "Nhoque ao sugo", preco: 34.5, disponivel: true },
      { codigo: "P3", nome: "Tiramisù", preco: 19.0, disponivel: false }
    ]
  },
  {
    _id: 2,
    nome: "Sushi Kaze",
    categoria: "Japonesa",
    nota: 4.4,
    aberto: true,
    tags: ["peixe", "sem glúten"],
    endereco: { rua: "Av. Independência, 800", bairro: "Independência", cidade: "Porto Alegre" },
    cardapio: [
      { codigo: "S1", nome: "Combo 20 peças", preco: 69.9, disponivel: true },
      { codigo: "S2", nome: "Temaki salmão", preco: 27.0, disponivel: true }
    ]
  },
  {
    _id: 3,
    nome: "Burger Lab",
    categoria: "Lanches",
    nota: 4.1,
    aberto: false,
    tags: ["hambúrguer", "vegano"],
    endereco: { rua: "Rua Padre Chagas, 55", bairro: "Moinhos de Vento", cidade: "Porto Alegre" },
    cardapio: [
      { codigo: "B1", nome: "Smash duplo", preco: 32.0, disponivel: true },
      { codigo: "B2", nome: "Burger de grão-de-bico", preco: 29.9, disponivel: true },
      { codigo: "B3", nome: "Batata rústica", preco: 15.0, disponivel: true }
    ]
  },
  {
    _id: 4,
    nome: "Verde Vivo",
    categoria: "Saudável",
    nota: 4.8,
    aberto: true,
    tags: ["vegano", "sem glúten", "vegetariano"],
    endereco: { rua: "Rua XV de Novembro, 300", bairro: "Centro", cidade: "Curitiba" },
    cardapio: [
      { codigo: "V1", nome: "Bowl de quinoa", preco: 38.0, disponivel: true },
      { codigo: "V2", nome: "Suco verde", preco: 12.0, disponivel: true }
    ]
  },
  {
    _id: 5,
    nome: "Pizzaria Forno Bravo",
    categoria: "Pizza",
    nota: 3.9,
    aberto: true,
    tags: ["pizza", "vegetariano"],
    endereco: { rua: "Rua das Flores, 77", bairro: "Centro", cidade: "Curitiba" },
    cardapio: [
      { codigo: "Z1", nome: "Pizza margherita", preco: 54.0, disponivel: true },
      { codigo: "Z2", nome: "Pizza calabresa", preco: 58.0, disponivel: true }
    ]
  }
]);


// ---------- CLIENTES (coleção própria) ----------
db.clientes.insertMany([
  { _id: "c1", nome: "Ana Souza",     email: "ana@email.com",    telefone: "51999990001", cidade: "Porto Alegre" },
  { _id: "c2", nome: "Bruno Lima",    email: "bruno@email.com",  telefone: null,          cidade: "Porto Alegre" },
  { _id: "c3", nome: "Carla Mendes",  email: "carla@email.com",                            cidade: "Curitiba" },
  { _id: "c4", nome: "Diego Rocha",   email: "diego@email.com",  telefone: "41988880004", cidade: "Curitiba" }
]);


// ---------- PEDIDOS (REFERENCIAM cliente e restaurante;
//            itens = incorporação parcial: "foto" do preço no momento da compra) ----------
db.pedidos.insertMany([
  { _id: 1001, clienteId: "c1", restauranteId: 1, status: "entregue",
    criadoEm: new Date("2026-11-20T19:30:00Z"),
    itens: [ { codigo: "P1", nome: "Lasanha à bolonhesa", preco: 42.9, qtd: 2 },
             { codigo: "P3", nome: "Tiramisù",            preco: 19.0, qtd: 1 } ] },

  { _id: 1002, clienteId: "c2", restauranteId: 2, status: "entregue",
    criadoEm: new Date("2026-11-21T20:10:00Z"),
    itens: [ { codigo: "S1", nome: "Combo 20 peças", preco: 69.9, qtd: 1 } ] },

  { _id: 1003, clienteId: "c3", restauranteId: 4, status: "em_preparo",
    criadoEm: new Date("2026-11-24T12:05:00Z"),
    itens: [ { codigo: "V1", nome: "Bowl de quinoa", preco: 38.0, qtd: 1 },
             { codigo: "V2", nome: "Suco verde",     preco: 12.0, qtd: 2 } ] },

  { _id: 1004, clienteId: "c1", restauranteId: 3, status: "cancelado",
    criadoEm: new Date("2026-11-24T21:40:00Z"),
    itens: [ { codigo: "B1", nome: "Smash duplo",    preco: 32.0, qtd: 3 },
             { codigo: "B3", nome: "Batata rústica", preco: 15.0, qtd: 1 } ] },

  { _id: 1005, clienteId: "c4", restauranteId: 5, status: "a_caminho",
    criadoEm: new Date("2026-11-25T18:00:00Z"),
    itens: [ { codigo: "Z2", nome: "Pizza calabresa", preco: 58.0, qtd: 1 } ] }
]);
