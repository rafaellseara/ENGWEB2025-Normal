# Exercício 1.1: Preparação do Dataset

1. **Dataset preparado e transformado**  
   - Convertido o JSON original num array de documentos com `_id` numérico (ano da edição).  
   - Padronizados campos como `anoEdicao` e removido redundâncias.

2. **Script de validação criado**  
   - `validate_dataset.py` verifica:
     - IDs duplicados (`_id`)  
     - Presença dos campos obrigatórios (`_id`, `anoEdicao`, `musicas`, `organizacao`)  
     - Estrutura e campos críticos em cada música (`id`, `link`, `título`, `país`, `intérprete`)  
     - Emite alertas para músicas sem `compositor`, edições sem `vencedor` e nomes de países com underscores.

3. **Ambiente MongoDB via Docker**  
   - Criado o container `engweb2025-normal-mongodb-1`.  
   - Copiado o ficheiro `dataset_clean.json` para dentro do container com `docker cp`.  
   - Importado os dados usando `mongoimport --jsonArray --drop` na base `eurovisao`, coleção `edicoes`.

4. **Verificação com mongosh**  
   - Acedido interativamente ao shell com `docker exec -it … mongosh`.  
   - Confirmado o número de documentos com `db.edicoes.countDocuments()`.  

# Exercício 1.2: Queries em MongoDB

Para o primeiro exercício criámos um ficheiro `ex1/queries.txt` contendo cinco consultas que respondem aos requisitos de “warm-up”:

1. **Contagem total de documentos**  
2. **Contagem de documentos por vencedor**  
3. **Lista alfabética de intérpretes sem repetições**
4. **Número de músicas por edição**
5. **Distribuição de vitórias por país**

# Exercício 1.3: API REST com Express e MongoDB

**Objetivo:** construir uma API na porta 25000 com operações CRUD para `edicoes` e endpoints para `paises` e `interpretes`.

1. **Preparação do projeto**  
   - Iniciei o backend com `express-generator --no-view`.  
   - Instalei dependências: `express`, `mongoose`, `body-parser`.

2. **Modelagem de dados**  
   - Defini os schemas Mongoose em `models/`:
     - **Musica** (`models/Musica.js`): esquema sem `_id`, com campos obrigatórios (`id`, `link`, `título`, `país`, `intérprete`) e opcionais (`compositor`, `letra`).  
     - **Edicao** (`models/Edicao.js`): esquema com `_id` numérico (ano), `anoEdicao`, `musicas` (array de `Musica`), `organizacao` e `vencedor`.

3. **Estrutura de aplicação**  
   - **app.js**: configura Express, body-parser, conexão MongoDB e importa as rotas.  
   - **routes/index.js**: define todas as rotas HTTP e encaminha para os controllers.  
   - **controllers/**:  
     - `edicao.js`: implementa `getAll`, `getById`, `create`, `update`, `remove` para `/edicoes`.  
     - `musica.js`: implementa `getPaises` e `getInterpretes` para `/paises` e `/interpretes`.

4. **Implementação das rotas**  
   - **Edicoes**  
     - `GET  /edicoes[?org=...]`  
     - `GET  /edicoes/:id`  
     - `POST /edicoes`  
     - `PUT  /edicoes/:id`  
     - `DELETE /edicoes/:id`  
   - **Paises & Interpretes**  
     - `GET /paises?papel=org|venc`  
     - `GET /interpretes`

6. **Testes manuais**  
   - URLs definidas para todos os endpoints (`localhost:25000/...`).  
   - Exemplos de bodies JSON para `POST` e `PUT` e procedimento para `DELETE` no Postman.

# Exercício 2: Serviço Web na Porta 25001

1. **Configurei o projeto**  
   - Gerei um novo serviço Express com suporte a Pug e W3.CSS.  
   - Instalei as dependências necessárias (`express`, `pug`, `axios`).

3. **Criei as rotas (routes/index.js)**  
   - `/` → obtém via Axios a lista de edições da API na porta 25000 e renderiza a tabela principal.  
   - `/:id` → busca detalhes de uma edição específica e renderiza a página de edição com a lista de músicas.  
   - `/paises/:pais` → agrega participações (como intérprete) e edições organizadas por país, depois renderiza essa visão.

4. **Desenvolvi as views em Pug**  
   - **layout.pug**: template base com include do W3.CSS.  
   - **index.pug**: tabela de edições com links para edição e país.  
   - **edicao.pug**: detalhes da edição, tabela de músicas e link de retorno.  
   - **pais.pug**: tabela de participações e de edições organizadas, com links de navegação.

5. **Testei localmente**  
   - Verifiquei no browser em `http://localhost:25001/`, `/1956` e `/paises/France` e mais alguns.