class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this){ //for in -> índices de um array / atributos de um objeto (i = nome do atributo, this[i] = valor do atributo)
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			} 
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		} 
	}

	getProximoId() {
		//localStorage.getItem() - recupera um dado em local storage
		let proximoId = localStorage.getItem('id') //null ---> 0
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		//Acesso do recurso de localStorage-> retorna um objeto de manipulãção. setItem(identificaçãoDoObjetoQueVamosArmazenar, oObjetoQueQueremosEncaminharEmNotaçãoJSON) --- (Key, value)
		//JSON.stringify() - converte um objeto literal em uma string JSON
		//Não é possível transitar um objeto literal de uma aplicação para outra, assim para que essa comunicação seja feita utilizamos protocolos de comunicação como o JSON
		//localStorage é uma aplicação presente no browser, mas é externa em relação a nossa aplicação web.
		//let produtoJSON = '{"categoria": "Eletrodoméstico", "descricao": "Geladeira", "preco": 1999.00}'
		//JSON.parse(produtoJSON) - converte a string em um objeto instânciado dentro da aplicação

		
		let id = this.getProximoId()

		localStorage.setItem(id , JSON.stringify(d)) 

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperando todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			} 

			//adicionando o atributo id ao objeto despesa, para criar um atributo de identificação
			despesa.id = i 
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa) {

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()

		//console.log(despesa)
		//console.log(despesasFiltradas)

		//filter funciona como um foreach, assim, ele pega os elementos e filtra com um return de true or false.
		
		//ano
		if(despesa.ano != ''){
			//filter não modifica o array, para isso precisamos sobrepor o valor do array com o resultado do filter.
			console.log('filtro de ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano) 
		}

		//mes
		if(despesa.mes != ''){
			console.log('filtro de mes')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log('filtro de dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia) 
		}

		//tipo
		if(despesa.tipo != ''){
			console.log('filtro de tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo) 
		}

		//descricao
		if(despesa.descricao != ''){
			console.log('filtro de descricao')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao) 
		}

		//valor
		if(despesa.valor != ''){
			console.log('filtro de valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor) 
		}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	)

	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') //jquery - selecionando a div que contém o modal e exibindo o modal 

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação verifique se todos os campos foram preenchidos corretamente'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	
	//Se não receber parâmetro assumi o valor default que é um array vazio, logo devemos retornar todos os registros;
	//Caso receba parâmetro, estamos usando a função com o array filtrado.
	//O parâmetro filtro, nos ajuda a indêntificar se o array vazio é um array filtrado ou o array total. Caso seja um array vazio e filtrado, a lógica continua e a tabela fica vazia.   
	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() //array de objetos literais, com todos os registros
	} 

	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	//limpando o tbody
	listaDespesas.innerHTML =  ''

	/*
	<tr>
        0 = <td>15/03/2018</td>
        1 = <td>Alimentação</td>
        2 = <td>Compras do mês</td>
        3 = <td>444.75</td>
    </tr>
	*/

	//percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(function(d) {

		//console.log(d)

		//criando a linha (tr) no tbody
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` //interpolação com template string

		//ajustar o tipo
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Esporte'
				break
		}

		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		//cria um atributo id para btn, usando o atributo id do objeto despesa  
		btn.id = `id_despesa_${d.id}`

		btn.onclick = function() {
			let id = this.id.replace('id_despesa_', '')

			//remover de local storage
			bd.remover(id)
			
			window.location.reload()
		}

		linha.insertCell(4).append(btn)

		console.log(d)
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value 
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	//cria o objeto de pesquisa
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	//cria um array contendo os objetos filtrados na pesquisa
	let despesas = bd.pesquisar(despesa)

	//passamos o array com os objetos filtrados para a função 
	this.carregaListaDespesas(despesas, true)

}


