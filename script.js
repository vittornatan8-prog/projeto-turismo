
 
    // Carrega destinos do localStorage
function carregarDestinos(){
const stored = JSON.parse(localStorage.getItem('destinosAdmin')) || [];
return stored.length ? stored : initial;
}




    // Renderiza cards
    function render(){
      const grid = document.getElementById('gridDestinos');
      const itens = carregarDestinos();
      grid.innerHTML = '';
      itens.forEach((d,idx)=>{
        const el = document.createElement('article');
        el.className = 'card';
        el.innerHTML = `
          <img src="${d.imagem}">
          <div class="card-body">
            <h3>${d.nome}</h3>
            <div class="meta">${d.duracao}</div>
            <div class="price">R$ ${d.preco}</div>
            <div class="card-actions">
              <button class="btn btn-details" onclick="abrirDetalhe(${idx})">Detalhes</button>
              <button class="btn btn-reserve" onclick="abrirReserva(${idx})">Reservar Agora</button>
              <button class="btn btn-wpp" onclick="abrirWhats(${idx})">WhatsApp</button>
            </div>
          </div>`;
        grid.appendChild(el);
      });
    }


    



    // Pesquisa / filtro
    document.getElementById('searchInput').addEventListener('input', ()=>{
      aplicarFiltros();
    });
    document.getElementById('filterPrice').addEventListener('change', aplicarFiltros);
    document.getElementById('clearFilters').addEventListener('click', ()=>{document.getElementById('searchInput').value='';document.getElementById('filterPrice').value='';render();});

    function aplicarFiltros(){
      const q = document.getElementById('searchInput').value.toLowerCase();
      const pv = document.getElementById('filterPrice').value;
      const itens = carregarDestinos();
      const filtrados = itens.filter(d=>{
        const matchQ = d.nome.toLowerCase().includes(q) || d.duracao.toLowerCase().includes(q);
        const matchP = !pv || d.preco <= Number(pv);
        return matchQ && matchP;
      });
      const grid = document.getElementById('gridDestinos');grid.innerHTML='';
      filtrados.forEach((d,idx)=>{
        const el = document.createElement('article');el.className='card';el.innerHTML=`<img src="${d.imagem}"><div class="card-body"><h3>${d.nome}</h3><div class="meta">${d.duracao}</div><div class="price">US$ ${d.preco}</div><div class="card-actions"><button class="btn btn-details" onclick="abrirDetalheFiltered(${idx})">Detalhes</button><button class="btn btn-reserve" onclick="abrirReservaFiltered(${idx})">Reservar Agora</button><button class="btn btn-wpp" onclick="abrirWhatsFiltered(${idx})">WhatsApp</button></div></div>`;grid.appendChild(el);
      });
    }

    // Detalhe (modal)
    function abrirDetalhe(index){
      const itens = carregarDestinos();
      const d = itens[index];
      const modal = document.getElementById('modalDetalhe');
      document.getElementById('modalContent').innerHTML = `
        <span class="close" onclick="fecharModal()">×</span>
        <img src="${d.imagem}" style="width:100%;height:320px;object-fit:cover">
        <h2>${d.nome}</h2>
        <p>${d.duracao}</p>
        <p><strong>US$ ${d.preco}</strong></p>
        <p><button class='btn btn-reserve' onclick='abrirReserva(${index})'>Reservar</button> <button class='btn btn-wpp' onclick='abrirWhats(${index})'>WhatsApp</button></p>
      `;
      modal.classList.add('active');
    }
    function fecharModal(){document.getElementById('modalDetalhe').classList.remove('active');}

    // Versão filtrada (necessário mapear índice para destino real)
    function abrirDetalheFiltered(i){
      const q = document.getElementById('searchInput').value.toLowerCase();
      const pv = document.getElementById('filterPrice').value;
      const itens = carregarDestinos().filter(d=> (d.nome.toLowerCase().includes(q)||d.duracao.toLowerCase().includes(q)) && (!pv||d.preco<=Number(pv)));
      abrirDetalheByObj(itens[i]);
    }
    function abrirDetalheByObj(d){
      const modal = document.getElementById('modalDetalhe');
      document.getElementById('modalContent').innerHTML = `
        <span class="close" onclick="fecharModal()">×</span>
        <img src="${d.imagem}" style="width:100%;height:320px;object-fit:cover">
        <h2>${d.nome}</h2>
        <p>${d.duracao}</p>
        <p><strong>US$ ${d.preco}</strong></p>
        <p><button class='btn btn-reserve' onclick='abrirReservaByObj(${encodeURIComponent(JSON.stringify(d))})'>Reservar</button></p>
      `;
      modal.classList.add('active');
    }

    // Reserva
    function abrirReserva(index){
      const itens = carregarDestinos();
      const d = itens[index];
      openReservationForm(d);
    }
    function abrirReservaFiltered(i){
      const q = document.getElementById('searchInput').value.toLowerCase();
      const pv = document.getElementById('filterPrice').value;
      const itens = carregarDestinos().filter(d=> (d.nome.toLowerCase().includes(q)||d.duracao.toLowerCase().includes(q)) && (!pv||d.preco<=Number(pv)));
      openReservationForm(itens[i]);
    }
    function openReservationForm(d){
      const modal = document.getElementById('modalDetalhe');
      document.getElementById('modalContent').innerHTML = `
        <span class="close" onclick="fecharModal()">×</span>
        <h2>Reservar: ${d.nome}</h2>
        <p>${d.duracao} • R$ ${d.preco}</p>
        <label>Nome</label><input id='resNome'>
        <label>Email</label><input id='resEmail'>
        <label>Telefone</label><input id='resTel'>
        <p><button class='btn btn-reserve' onclick='confirmarReserva(${encodeURIComponent(JSON.stringify(d))})'>Confirmar e Pagar</button></p>
      `;
      modal.classList.add('active');
    }

    function confirmarReserva(objStr){
      // objStr vem codificado como JSON string; decodificar
      const d = JSON.parse(decodeURIComponent(objStr));
      document.getElementById('modalDetalhe').classList.remove('active');
      document.getElementById('modalPg').classList.add('active');
      document.getElementById('pgInfo').innerText = `Reserva: ${d.nome} — US$ ${d.preco}`;
    }

    function fecharPg(){document.getElementById('modalPg').classList.remove('active');}

    function simularPagamento(){
      alert('Pagamento simulado com sucesso! Reserva confirmada.');
      fecharPg();
    }

    // WhatsApp por destino
    function abrirWhats(index){
      const d = carregarDestinos()[index];
      const phone = '+5500000000000'; // substitua pelo seu número
      const text = encodeURIComponent(d.whatsapp || `Olá, tenho interesse no pacote ${d.nome}`);
      window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
    }
    function abrirWhatsFiltered(i){
      const q = document.getElementById('searchInput').value.toLowerCase();
      const pv = document.getElementById('filterPrice').value;
      const itens = carregarDestinos().filter(d=> (d.nome.toLowerCase().includes(q)||d.duracao.toLowerCase().includes(q)) && (!pv||d.preco<=Number(pv)));
      const d = itens[i];
      const phone = '+5500000000000';
      const text = encodeURIComponent(d.whatsapp || `Olá, tenho interesse no pacote ${d.nome}`);
      window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
    }

  

    // Menu mobile + header behavior
    document.getElementById('menuToggle').addEventListener('click',()=>{document.getElementById('navMenu').classList.toggle('active')});
    window.addEventListener('scroll',()=>{const h=document.querySelector('.site-header');if(window.scrollY>60){h.style.boxShadow='0 10px 30px rgba(0,0,0,.4)'}else{h.style.boxShadow='none'}});

    // Atalho para abrir admin (CTRL+ALT+A)
    document.addEventListener('keydown', function (e) {if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {window.location.href='admin.html';}});

    // Inicializa
    render();


   


  