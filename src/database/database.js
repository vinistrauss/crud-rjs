const { readFile, writeFile } = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
class Database {
  constructor() {
    this.NOME_ARQUIVO = __dirname + "/Mock/" + "herois.json";
  }

  async index() {
    const dados = await readFileAsync(this.NOME_ARQUIVO);
    return JSON.parse(dados);
  }

  async create(item) {
    const dados = await this.index();
    dados.push(item);
    return this.updateFile(dados);
  }

  async update(id, req) {
    const dados = await this.index();

    const newItem = dados.filter(item => item.id === id);

    if (JSON.stringify(newItem).length <= 2) {
      return "Id não encontrado";
    }

    newItem.map(item => {
      if (req.nome !== null) {
        item.nome = req.nome;
      }
      if (req.poder !== null) {
        item.poder = req.poder;
      }
    });

    return this.updateFile(newItem);
  }

  async remove(id) {
    const dados = await this.index();
    //iteramos em cima da lista, procurando todo mundo que não tenha id
    //aquele id
    // o != -> sompara somente o valor
    // o !== -> compara o valor e o tipo
    const newItem = dados.filter(item => item.id !== id);
    return this.updateFile(newItem);
  }

  async updateFile(item) {
    return writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(item));
  }
}

module.exports = new Database();
