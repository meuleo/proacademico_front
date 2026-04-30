class Api {

  constructor(connection) {
    this.connection = connection;
  }

  async initDb(schema) {
    await this.connection.initDb(schema);
  }

  async inserir(tabela, dados) {
    return await this.connection.insert({
      into: tabela,
      values: Array.isArray(dados) ? dados : [dados]
    });
  }

  async listar(tabela) {
    return await this.connection.select({ from: tabela });
  }

  async detalhar(tabela, id) {
    return await this.connection.select({
      from: tabela,
      where: { id: Number(id) }
    });
  }

  async atualizar(tabela, id, novosDados) {
    return await this.connection.update({
      in: tabela,
      set: novosDados,
      where: { id: Number(id) }
    });
  }

  async remover(tabela, id) {
    return await this.connection.remove({
      from: tabela,
      where: { id: Number(id) }
    });
  }
}