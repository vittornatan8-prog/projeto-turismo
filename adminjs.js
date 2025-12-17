


  const USER = 'admin';
  const PASS = '1234';

  function login(){
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if(u === USER && p === PASS){
      document.getElementById('login').classList.add('hidden');
      document.getElementById('painel').classList.remove('hidden');
      render();
    } else {
      alert('Usuário ou senha inválidos');
    }
  }

  function logout(){
    location.reload();
  }

  function getDestinos(){
    return JSON.parse(localStorage.getItem('destinosAdmin')) || [];
  }

  function setDestinos(data){
    localStorage.setItem('destinosAdmin', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }

  function salvarDestino(){
    const nome = document.getElementById('nome').value;
    const duracao = document.getElementById('duracao').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
    const editIndex = document.getElementById('editIndex').value;

    if(!nome || !duracao || !preco){
      alert('Preencha todos os campos');
      return;
    }

    const destinos = getDestinos();

    if(editIndex === ''){
      destinos.push({ nome, duracao, preco, imagem });
    } else {
      destinos[editIndex] = { nome, duracao, preco, imagem };
    }

    setDestinos(destinos);
    limpar();
    render();
  }

  function editar(index){
    const destinos = getDestinos();
    const d = destinos[index];

    document.getElementById('nome').value = d.nome;
    document.getElementById('duracao').value = d.duracao;
    document.getElementById('preco').value = d.preco;
    document.getElementById('imagem').value = d.imagem;
    document.getElementById('editIndex').value = index;
  }

  function excluir(index){
    if(confirm('Deseja excluir este destino?')){
      const destinos = getDestinos();
      destinos.splice(index,1);
      setDestinos(destinos);
      render();
    }
  }

  function limpar(){
    document.getElementById('nome').value = '';
    document.getElementById('duracao').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('imagem').value = '';
    document.getElementById('editIndex').value = '';
  }

  function render(){
    const lista = document.getElementById('lista');
    const destinos = getDestinos();

    lista.innerHTML = '';

    destinos.forEach((d,i)=>{
      lista.innerHTML += `
        <tr>
          <td>${d.nome}</td>
          <td>${d.duracao}</td>
          <td>${d.preco}</td>
          <td class="actions">
            <button class="edit" onclick="editar(${i})">Editar</button>
            <button class="delete" onclick="excluir(${i})">Excluir</button>
          </td>
        </tr>`;
    });
  }




