const {readFile, writeFile} = require('fs') 
const {promisify} = require('util')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
class Database{

    constructor(){
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDados(){
        const dados = await readFileAsync(this.NOME_ARQUIVO)
        return JSON.parse(dados)

    }
    async atualizarArquivos(dados){

        return writeFile(this.NOME_ARQUIVO, JSON.stringify(dados))
    }
    async cadastrar(item){
       const dados = await this.obterDados();
       dados.push(item)
       return this.atualizarArquivos(dados)
    }
    listar(){
        return this.obterDados()

    }

    async remove(id){
        const dados = await this.obterDados();
        //iteramos em cima da lista, procurando todo mundo que não tenha id
        //aquele id
        // o != -> sompara somente o valor
        // o !== -> compara o valor e o tipo
        const dadosFiltrados = dados.filter(item => item.id !== id)
        return this.atualizarArquivos(dadosFiltrados);
    }

}

module.exports = new Database()