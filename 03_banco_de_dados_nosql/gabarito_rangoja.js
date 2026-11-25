// =============================================================
// RangoJá — GABARITO (uso do mentor). Rode SEMPRE depois do seed.
// =============================================================

// ---------------- HANDS-ON 1 · Modelagem (sem código: discussão) ----------------
//
// DIAGRAMA DO RELACIONAMENTO
//
//  ┌──────────────────────────────┐               ┌──────────────────────────────┐               ┌──────────────────────────────┐
//  │ restaurantes                 │     1 : N     │ pedidos                      │     N : 1     │ clientes                     │
//  ├──────────────────────────────┤               ├──────────────────────────────┤               ├──────────────────────────────┤
//  │ _id, nome, categoria         │ ◄──────────── │ _id, status, criadoEm        │ ────────────► │ _id, nome, email             │
//  │ nota, aberto, tags[ ]        │ restauranteId │ restauranteId  → restaurantes│   clienteId   │ telefone, cidade             │
//  │ endereco { }        (emb.)   │               │ clienteId      → clientes    │               │                              │
//  │ cardapio: [        (emb.)    │               │ itens: [     (emb. / cópia)  │               │                              │
//  │   {codigo, nome,             │               │   {codigo, nome,             │               │                              │
//  │    preco, disponivel} ]      │               │    preco, qtd} ]             │               │                              │
//  └──────────────────────────────┘               └──────────────────────────────┘               └──────────────────────────────┘
//
//  Legenda:  (emb.) = documento/array EMBUTIDO   ──► = REFERÊNCIA pelo _id (a seta sai de quem guarda o campo)
//
// DECISÕES E JUSTIFICATIVAS (critério: como cada tela lê os dados)
//  1. restaurantes.cardapio  → EMBUTIDO. A tela "Página do restaurante" lê restaurante + cardápio
//     de uma vez, e o cardápio tem tamanho controlado (dezenas de itens, não milhões).
//  2. restaurantes.endereco  → EMBUTIDO (1:1). Só existe dentro do restaurante.
//  3. clientes               → COLEÇÃO PRÓPRIA. O cliente existe sozinho e faz pedidos em vários restaurantes.
//  4. pedidos                → COLEÇÃO PRÓPRIA que REFERENCIA restaurante e cliente (1:N dos dois lados).
//     Pedidos crescem sem limite: embutir no cliente estouraria o documento (limite de 16 MB)
//     e deixaria a tela "Meus pedidos" pesada.
//  5. pedidos.itens          → INCORPORAÇÃO PARCIAL: copia codigo, nome e preco do prato no momento da compra.
//     Se o restaurante mudar o preço amanhã, o pedido de ontem continua com o valor pago.
//     Aqui a duplicação é regra de negócio, não desperdício.
//
// DOCUMENTOS DE EXEMPLO (os mesmos do seed_rangoja.js)
//  restaurantes: { _id: 1, nome: "Cantina da Nonna", categoria: "Italiana", nota: 4.7, aberto: true,
//                  tags: ["massas", "vegetariano"],
//                  endereco: { rua: "Rua da República, 120", bairro: "Cidade Baixa", cidade: "Porto Alegre" },
//                  cardapio: [ { codigo: "P1", nome: "Lasanha à bolonhesa", preco: 42.9, disponivel: true } ] }
//  clientes:     { _id: "c1", nome: "Ana Souza", email: "ana@email.com", telefone: "51999990001", cidade: "Porto Alegre" }
//  pedidos:      { _id: 1001, clienteId: "c1", restauranteId: 1, status: "entregue",
//                  criadoEm: new Date("2026-11-20T19:30:00Z"),
//                  itens: [ { codigo: "P1", nome: "Lasanha à bolonhesa", preco: 42.9, qtd: 2 } ] }
//
// MODELOS ALTERNATIVOS QUE TAMBÉM SÃO ACEITÁVEIS (se bem justificados)
//  - pratos em coleção separada, se o produto tiver busca global de pratos entre restaurantes;
//  - pedidos com uma cópia parcial do restaurante (ex.: nome) para a tela "Meus pedidos" não precisar de $lookup.
// SINAL DE ALERTA: pedidos embutidos dentro de clientes (array que cresce para sempre).

// ---------------- HANDS-ON 2 · Inserção ----------------
// 2.1 Novo restaurante deixando o Mongo gerar o _id (ObjectId)
db.restaurantes.insertOne({
  nome: "Taco Loco", categoria: "Mexicana", nota: 4.3, aberto: true,
  tags: ["picante"], endereco: { rua: "Rua Lima e Silva, 10", bairro: "Cidade Baixa", cidade: "Porto Alegre" },
  cardapio: [ { codigo: "T1", nome: "Burrito", preco: 31.0, disponivel: true } ]
});
// 2.2 Novo cliente com _id personalizado
db.clientes.insertOne({ _id: "c5", nome: "Eva Martins", email: "eva@email.com", cidade: "Curitiba" });
// 2.3 Novo pedido referenciando cliente c5 e restaurante 4
db.pedidos.insertOne({
  _id: 1006, clienteId: "c5", restauranteId: 4, status: "em_preparo", criadoEm: new Date(),
  itens: [ { codigo: "V1", nome: "Bowl de quinoa", preco: 38.0, qtd: 2 } ]
});

// ---------------- HANDS-ON 3 · Consultas (find) ----------------
// 3.1 Restaurantes da categoria "Japonesa"  (igualdade)
db.restaurantes.find({ categoria: "Japonesa" });
// 3.2 Restaurantes cujo nome começa com "Bur"  e  que contenham "pizza" (sem diferenciar maiúsculas)
db.restaurantes.find({ nome: { $regex: "^Bur" } });
db.restaurantes.find({ nome: { $regex: "pizza", $options: "i" } });
// 3.3 Clientes COM telefone preenchido  /  clientes SEM telefone (campo ausente ou null)
db.clientes.find({ telefone: { $exists: true, $ne: null } });
db.clientes.find({ telefone: null });               // pega ausente OU null
// 3.4 Restaurantes com tag "vegano"  /  com "vegano" E "sem glúten"  /  com "pizza" OU "massas"
db.restaurantes.find({ tags: "vegano" });
db.restaurantes.find({ tags: { $all: ["vegano", "sem glúten"] } });
db.restaurantes.find({ tags: { $in: ["pizza", "massas"] } });
// 3.5 Restaurantes de Curitiba  (campo de documento embutido → notação de ponto)
db.restaurantes.find({ "endereco.cidade": "Curitiba" });
// 3.6 Nota >= 4.5 e aberto agora  /  restaurantes com algum item abaixo de R$ 20
db.restaurantes.find({ nota: { $gte: 4.5 }, aberto: true });
db.restaurantes.find({ "cardapio.preco": { $lt: 20 } });

// ---------------- HANDS-ON 4 · Aggregate ----------------
// 4.1 "Tela de pedidos": cada pedido com o NOME do restaurante ($lookup + $unwind + $project)
db.pedidos.aggregate([
  { $lookup: { from: "restaurantes", localField: "restauranteId", foreignField: "_id", as: "restaurante" } },
  { $unwind: "$restaurante" },
  { $project: { status: 1, restaurante: "$restaurante.nome", qtdItens: { $sum: "$itens.qtd" } } }
]);
// 4.2 Pedidos "grandes": 3 ou mais unidades ($project com $sum + $match)
db.pedidos.aggregate([
  { $project: { clienteId: 1, status: 1, qtdItens: { $sum: "$itens.qtd" } } },
  { $match: { qtdItens: { $gte: 3 } } }
]);
// 4.3 Cardápio "achatado": um documento por item, só os disponíveis ($unwind + $match + $project)
db.restaurantes.aggregate([
  { $unwind: "$cardapio" },
  { $match: { "cardapio.disponivel": true } },
  { $project: { _id: 0, restaurante: "$nome", item: "$cardapio.nome", preco: "$cardapio.preco" } }
]);
// 4.★ DESAFIO EXTRA (além do EAD): faturamento por restaurante com $group
db.pedidos.aggregate([
  { $match: { status: { $ne: "cancelado" } } },
  { $unwind: "$itens" },
  { $group: { _id: "$restauranteId", faturamento: { $sum: { $multiply: ["$itens.preco", "$itens.qtd"] } } } },
  { $sort: { faturamento: -1 } }
]);

// ---------------- HANDS-ON 5 · Atualização e exclusão (tickets) ----------------
// T1 Pedido 1005 saiu para entrega → foi entregue
db.pedidos.updateOne({ _id: 1005 }, { $set: { status: "entregue", entregueEm: new Date() } });
// T2 Burger Lab abriu e ganhou a tag "artesanal"; removeu a tag "vegano"
db.restaurantes.updateOne({ _id: 3 }, { $set: { aberto: true }, $push: { tags: "artesanal" } });
db.restaurantes.updateOne({ _id: 3 }, { $pull: { tags: "vegano" } });
// T3 Novo item no cardápio da Cantina
db.restaurantes.updateOne({ _id: 1 },
  { $push: { cardapio: { codigo: "P4", nome: "Fettuccine Alfredo", preco: 39.9, disponivel: true } } });
// T4 Tiramisù voltou (disponivel: true) e com preço novo → arrayFilters no item certo
db.restaurantes.updateOne(
  { _id: 1 },
  { $set: { "cardapio.$[item].disponivel": true, "cardapio.$[item].preco": 21.0 } },
  { arrayFilters: [ { "item.codigo": "P3" } ] }
);
// T5 Sushi Kaze recebeu avaliação: contador +1 ($inc) e reajuste de 10% no combo ($mul)
db.restaurantes.updateOne({ _id: 2 }, { $inc: { totalAvaliacoes: 1 } });
db.restaurantes.updateOne({ _id: 2 },
  { $mul: { "cardapio.$[c].preco": 1.1 } }, { arrayFilters: [ { "c.codigo": "S1" } ] });
// T6 Cliente c3 pediu para não guardar o e-mail → $unset
db.clientes.updateOne({ _id: "c3" }, { $unset: { email: "" } });
// T7 Remover o pedido cancelado 1004 (sempre pelo _id!)
db.pedidos.deleteOne({ _id: 1004 });
// T8 (DISCUSSÃO) O que este comando faria? Por que é perigoso em produção?
// db.pedidos.deleteMany({ status: { $ne: "entregue" } });

// Conferência final
db.restaurantes.find({ _id: { $in: [1, 2, 3] } });
db.pedidos.find();
