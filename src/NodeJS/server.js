var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser')

/**
 * Variáveis de persistência para a geração do gráfico
 */
var value = new Array();
var index = new Array();
var indexChart = 0;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * Habilitando a rota para a página principal, carregando index.htm
 */
app.get("/", function(req, res) {
  var os = require("os");
  var hostname = os.hostname();
  res.sendFile(path.join(__dirname+'/index.htm'));
});

/**
 * Habilitando a rota para o script de require.js
 */
app.get("/require.js", function(req, res) {
  var os = require("os");
  var hostname = os.hostname();
  res.sendFile(path.join(__dirname+'/require.js'));
});

/**
 * Habilitando a rota para o envio de dados via POST
 * Recebimento de JSON pelo BODY da mensagem, como RAW
 * Content-Type: application/json
 * Ex:
 * { "value": 10 }
 */
app.post("/data", function(req, res) {
  value.push(req.body.value);
  index.push(indexChart);
  indexChart++;

  res.send('Valor Recebido: ' + req.body.value, { 'Content-Type': 'text/plain' }, 200);
});

/**
 * Habilitando a rota para a exibição do Array, que será utilizado para a
 * geração do gráfico, utilizando a biblioteca Charts do Google
 */
app.get("/show", function(req, res) {
  res.send({index, value});
});

/**
 * Habilitando a rota para a exclusão dos dados enviados para o servidor.
 */
app.get("/delete", function(req, res) {
    value = [];
    index = [];
    indexChart = 0;

    res.send('Valores Apagados', { 'Content-Type': 'text/plain' }, 200);
});

/**
 * Start do servidor
 */
app.listen(8080, function() {
  console.log("Servidor Rodando...");
});