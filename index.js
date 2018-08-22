
/** 
 * O node js é bem popular para trabalhar com APIs
 * 
 * A diferença para uma aplicação JAVA contra uma APlicação Java
 * 
 * Quando um Java recebe uma requisição, ele levanta uma thread, o limite de 
 * processamento, limite de usuarios é relativo a quantidade de recursos da máquina
 * 
 * Se eu quiser 10000000 de usuarios === MAQUINA PARRUDONA
 * 
 * Quando o node.js recebe uma requisição, ele delega ao sistema operacional, que 
 * enfilera essas requisições. Quanto mais usuarios, maior a fila. 
 * 
*/

/**
 * O HAPI JS trabalha seguindo a especificação Restfull
 * Dependendo da chamada, dependendo do código HTTP, ele retorna um Status diferente
 * E indentifica quem será chamado de acordo com método
 * 
 * CREATE - POST - /products -> dados no body da requisição
 * READ - GET - /products -> listar informações
 * READ - GET - /products/:id -> obter um recurso pelo id
 * READ - GET - /products/:id/colors -> obtem todas as cores de um produto especifico
 * UPDATE 
 *  1- forma => PUT - atualizar o objeto completo 
 *  PUT - /products/:id -> dados completos no body da requisição
 *  2 - forma => PATCH - atualizar o objeto parcial
 *  PATCH - /products/:id -> dados parciais (só nome, só cpf, ou opciais)
 * 
 * DELETE - DELETE - / products/:id -> remove um produto especifico
 */


// para subir um servidor do zero SEM FRAMEWORK
// const http = require('http')

// http.createServer((req, res) => {
//     res.end('Hello World!!!')
// })
//     // inicializamos nosso servidor
//     .listen(3000, () => {
//         console.log('servidor rodando!!')
//     })

// importamos nosso  classe de banco de dados
const Database = require('./database')

// para trabalhar com aplicações profissionais, instalaremos o Hapi.js na versão 16
// npm install --save hapi@16
//importamos o hapijs
const Hapi = require('hapi')
const server = new Hapi.Server()
// setamos a porta para expor nossa API
server.connection({ port: 3000 });

// para validar a requisição, sem precisar ficar fazendo um monte de if
// instamos o Joi
// npm i --save joi
const Joi = require('joi');

; (async () => {
    server.route([
        // criamos a rota de listar herois
        {
            // definir a URL
            path: '/heroes',
            method: 'GET',
            // quando o usuario chamar o localhost:3000/heroes -> GET
            // esta funçào vai manipular sua resposta
            handler: async (request, reply) => {
                try {
                    const dados = await Database.listar()
                    return reply(dados)

                }
                catch (error) {
                    console.error('DEU RUIM**', error)
                    return reply()
                }
            }
        },
        {
            path: '/heroes',
            method: 'POST',
            handler: async (request, reply) => {
                try {
                    const {payload} = request
                    const item = {
                        ...payload,
                        id: Date.now()
                    }
                    const result = await Database.cadastrar(item)
                    return reply('Cadastrado com sucesso!')

                }
                catch (error) {
                    console.error('DEU RUIM', error)
                    return reply('DEU RUIM')
                }
            },
            config: {
                // para validar a requisção
                validate: {
                    // podemos validar todos os tipos de requisições
                    // -> payload -> body da requisição
                    // -> params -> URL da requisição products/:id
                    // -> query -> URL products?nome=Erick&idade=13
                    // -> headers -> geralmente usado para validar token
                    payload: {
                        nome: Joi.string().max(10).min(2).required(),
                        poder: Joi.string().max(5).min(3).required(),
                        dataNascimento: Joi.date().required(),
                        namorada: Joi.string()
                    }
                }
            }
        },
        {
            path:'/heroes/{id}',
            method:'DELETE',
            config: {
                validate:{
                    params:{
                        id: Joi.number().required()
                    }
                }
            },
            handler: async (request, reply) =>{
                const{id} = request.params;
                const result = await Database.remove(id)
                return reply('removido com sucesso')
            }
        }
    ])

    // inicializamos nossa API
    // 1o startar a API
    await server.start()
    console.log('server running at 3000')
})()