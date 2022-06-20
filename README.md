# MICROSERVIÇOS

**TypeScript**
**NodeJs**


## Docker build up para inicializar

```
docker-compose up -d --build

```
## Acessar as rotas

```
http://localhost:3000/

```
## Rotas

```
Cadastra informações pertinentes o cliente

http://localhost:3000/cliente

body

{
	"nome": "Fabio",
	"telefone": "94229068",
	"cpf": "123244288"
}

Listar todos os clientes

http://localhost:3000/cliente/

Pegar informações pertinentes o cliente (e o saldo atual)

http://localhost:3000/cliente/9

Consultar saldo do cliente

http://localhost:3000/saldo?id_do_cliente=9

Adiciona uma transação para um cliente (crédito ou débito)

http://localhost:3334/transacao/?id_do_cliente=9

body

{
	"valor": 2000,
	"tipo": "débito"
}

Listar todas as transações 

http://localhost:3000/transacao

Listar todas as transações de um cliente especifico

http://localhost:3000/transacao/9

```

```
## Docker down para finalizar

```
sudo docker-compose down | ctrl + c 
```