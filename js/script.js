document.addEventListener('DOMContentLoaded', () => {

    // -------------------- Logout --------------------
    function logout(){ window.location.href = "index.html"; }
    document.querySelector('.logout')?.addEventListener('click', logout);

    // -------------------- Data/Hora --------------------
    const datetime = document.getElementById('datetime');
    function updateDateTime() {
        if(!datetime) return;
        const now = new Date();
        datetime.innerText = now.toLocaleString('pt-BR', {dateStyle:'full', timeStyle:'medium'});
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // -------------------- Submenus --------------------
    document.querySelectorAll('.menu-item.has-submenu > .menu-link').forEach(menu => {
        const submenu = menu.nextElementSibling;
        if(!submenu) return;
        submenu.style.overflow = 'hidden';
        submenu.style.maxHeight = '0';
        submenu.style.display = 'none';
        submenu.style.transition = 'max-height 0.3s ease';
        menu.addEventListener('click', e=>{
            e.preventDefault();
            document.querySelectorAll('.submenu').forEach(sm => {
                if(sm !== submenu){ sm.style.maxHeight='0'; setTimeout(()=>sm.style.display='none',300);}
            });
            if(submenu.style.maxHeight==='0px'||submenu.style.maxHeight===''){
                submenu.style.display='flex';
                submenu.style.flexDirection='column';
                submenu.style.maxHeight = submenu.scrollHeight+'px';
            } else {
                submenu.style.maxHeight='0';
                setTimeout(()=>submenu.style.display='none',300);
            }
        });
    });

    // -------------------- Dados --------------------
    let moradores = [
        { nome:"Morador 1", apt:"101", torre:"Mykonos", veiculo:"Carro", contato:"(11) 99999-8888"},
        { nome:"Morador 2", apt:"202", torre:"Santorini", veiculo:"Moto", contato:"morador2@email.com"},
        { nome:"Morador 3", apt:"303", torre:"Mykonos", veiculo:"Carro", contato:"(11) 98888-7777"}
    ];
    let veiculos = [
        {tipo:"Carro", marca:"Chevrolet", modelo:"Onix", placa:"ABC-1234", apt:"101"},
        {tipo:"Moto", marca:"Honda", modelo:"CG 160", placa:"XYZ-5678", apt:"202"},
        {tipo:"Carro", marca:"Wolks", modelo:"Gol", placa:"QWE-7890", apt:"303"}
    ];
    let funcionarios = [
        {nome:"João Silva", funcao:"Portaria", dias:"Seg a Sex", horario:"07:00-15:00"},
        {nome:"Maria Souza", funcao:"Limpeza", dias:"Todos os dias", horario:"08:00-16:00"},
        {nome:"Carlos Lima", funcao:"Segurança", dias:"Seg a Sex", horario:"15:00-23:00"}
    ];
    let entregas = { Mykonos: [], Santorini: [], Creta: [], Paros: [] };

    // -------------------- Modais --------------------
    const modais = {
        morador: document.getElementById('moradorModal'),
        veiculo: document.getElementById('veiculoModal'),
        funcionario: document.getElementById('funcionarioModal'),
        entrega: document.getElementById('entregaModal'),
        mensagem: document.getElementById('mensagemModal')
    };
    let editRow = null;
    let currentTorre = '';

    function openModal(type, mode, row=null){
        editRow = row;
        const modal = modais[type];
        if(!modal) return;
        modal.style.display='block';
        const titleId = modal.querySelector('h2').id;
        document.getElementById(titleId).innerText = mode==='add'?`Adicionar ${type}`:`Alterar ${type}`;
        const form = modal.querySelector('form');
        if(mode==='edit' && row){
            Array.from(row.children).forEach((td,i)=>{
                const input = form[i];
                if(input) input.value = td.innerText;
            });
        } else form?.reset();
    }

    document.querySelectorAll('.modal .close').forEach(btn=> btn.onclick = ()=> btn.closest('.modal').style.display='none');
    window.addEventListener('click', e=>{
        Object.values(modais).forEach(modal=>{ if(e.target===modal) modal.style.display='none'; });
    });

    // -------------------- Dashboard --------------------
    function loadDashboard(){
        const content = document.getElementById('content-area');
        if(!content) return;
        content.innerHTML = `<div class="cards"><div class="card">Aviso 1</div><div class="card">Aviso 2</div><div class="card">Aviso 3</div></div>`;
    }
    loadDashboard();

    // -------------------- Funções de renderização --------------------
    function renderTabela(dataArray, columns, title, type, searchIds=[]){
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>${title}</h2>
            <div class="moradores-actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAdd${type}" class="action-btn">Adicionar</button>
                    <button id="btnEdit${type}" class="action-btn">Alterar</button>
                </div>
                <div><button id="btnBack${type}" class="action-btn" style="background:#95a5a6;">Voltar</button></div>
            </div>
            <div class="moradores-search">
                ${searchIds.map(id=>`<input type="text" id="${id}" placeholder="Pesquisar...">`).join('')}
            </div>
            <div class="tabela-container animate">
                <table class="tabela-moradores">
                    <thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
                    <tbody>${dataArray.map(d=>`<tr>${columns.map(c=>`<td>${d[c.toLowerCase()]}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        document.getElementById(`btnAdd${type}`)?.addEventListener('click', ()=>openModal(type,'add'));
        document.getElementById(`btnEdit${type}`)?.addEventListener('click', ()=>{
            const selected = document.querySelector('.tabela-moradores tr.selected');
            if(!selected) return alert(`Selecione um ${type} para alterar`);
            openModal(type,'edit',selected);
        });
        document.getElementById(`btnBack${type}`)?.addEventListener('click', loadDashboard);
        searchIds.forEach(id=>{
            document.getElementById(id)?.addEventListener('input', ()=>{
                const value = document.getElementById(id).value.toLowerCase();
                document.querySelectorAll('.tabela-moradores tbody tr').forEach(row=>{
                    row.style.display = Array.from(row.children).some(td=>td.innerText.toLowerCase().includes(value))?'':'none';
                });
            });
        });
        document.querySelectorAll('.tabela-moradores tbody tr').forEach(row=>{
            row.addEventListener('click', ()=>{
                document.querySelectorAll('.tabela-moradores tr').forEach(r=>r.classList.remove('selected'));
                row.classList.add('selected');
            });
        });
    }

    // -------------------- Eventos dos links --------------------
    document.getElementById('link-moradores')?.addEventListener('click', e=>{ e.preventDefault(); renderTabela(moradores,['Nome','Apt','Torre','Veiculo','Contato'],'Moradores','Morador',['searchNome','searchTorre','searchVeiculo']); });
    document.getElementById('link-veiculos')?.addEventListener('click', e=>{ e.preventDefault(); renderTabela(veiculos,['Tipo','Marca','Modelo','Placa','Apt'],'Veículos','Veiculo',['searchTipo','searchMarca','searchModelo','searchPlaca','searchApto']); });
    document.getElementById('link-funcionarios')?.addEventListener('click', e=>{ e.preventDefault(); renderTabela(funcionarios,['Nome','Funcao','Dias','Horario'],'Funcionários','Func',['searchNomeFunc','searchFuncao','searchDias','searchHorario']); });

    // -------------------- Entregas --------------------
    document.getElementById('link-registrar-entrega')?.addEventListener('click', e=>{
        e.preventDefault();
        abrirTorres('entrega');
    });

    document.getElementById('link-enviar-mensagem')?.addEventListener('click', e=>{
        e.preventDefault();
        abrirTorres('mensagem');
    });

    function abrirTorres(tipo){
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>Selecione a torre - ${tipo==='entrega'?'Registrar Entrega':'Enviar Mensagem'}</h2>
            <div class="cards">
                <div class="card" data-torre="Mykonos">Mykonos</div>
                <div class="card" data-torre="Santorini">Santorini</div>
                <div class="card" data-torre="Creta">Creta</div>
                <div class="card disabled" data-torre="Paros" style="opacity:0.5; cursor:not-allowed;">Paros</div>
            </div>
        `;
        document.querySelectorAll('#content-area .card').forEach(card=>{
            if(card.classList.contains('disabled')) return;
            card.addEventListener('click', ()=>{
                const torre = card.dataset.torre;
                currentTorre = torre;
                if(tipo==='entrega') renderEntregas(torre);
                else renderMensagens(torre);
            });
        });
    }

    function renderEntregas(torre){
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>Entregas - ${torre}</h2>
            <div class="moradores-actions">
                <button id="btnAddEntrega" class="action-btn">Registrar Entrega</button>
                <button id="btnBackEntrega" class="action-btn" style="background:#95a5a6;">Voltar</button>
            </div>
            <div class="tabela-container animate">
                <table class="tabela-moradores">
                    <thead><tr><th>Morador</th><th>Apt</th><th>Entrega</th><th>Data/Hora</th></tr></thead>
                    <tbody>
                        ${entregas[torre].map(e=>`<tr><td>${e.nome}</td><td>${e.apt}</td><td>${e.tipo}</td><td>${e.data}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('btnBackEntrega')?.addEventListener('click', ()=>abrirTorres('entrega'));
        document.getElementById('btnAddEntrega')?.addEventListener('click', ()=>{
            modais['entrega'].style.display='block';
            document.getElementById('entregaForm').reset();
            document.getElementById('entregaData').value = new Date().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
        });
    }

    function renderMensagens(torre){
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>Enviar Mensagem - ${torre}</h2>
            <div class="moradores-actions">
                <div>
                    <input type="checkbox" id="checkAll"> Selecionar Todos
                </div>
                <div>
                    <button id="btnBackMsg" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <form id="mensagemForm">
                <div class="tabela-container animate">
                    <table class="tabela-moradores">
                        <thead><tr><th>Selecionar</th><th>Nome</th><th>Apt</th><th>Torre</th><th>Enviado Aviso</th></tr></thead>
                        <tbody>
                            ${moradores.filter(m=>m.torre===torre).map((m,i)=>`
                                <tr>
                                    <td><input type="checkbox" class="chkMorador" data-index="${i}"></td>
                                    <td>${m.nome}</td>
                                    <td>${m.apt}</td>
                                    <td>${m.torre}</td>
                                    <td>${Object.values(entregas).flat().some(e=>e.nome===m.nome)?'Sim':'Não'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <button type="submit" class="action-btn">Enviar Mensagem</button>
            </form>
        `;
        document.getElementById('btnBackMsg')?.addEventListener('click', loadDashboard);
        document.getElementById('checkAll')?.addEventListener('change', function(){
            document.querySelectorAll('.chkMorador').forEach(chk=>chk.checked=this.checked);
        });
        document.getElementById('mensagemForm')?.addEventListener('submit', e=>{
            e.preventDefault();
            const selected = Array.from(document.querySelectorAll('.chkMorador')).filter(c=>c.checked).map(c=>moradores[c.dataset.index].nome);
            if(selected.length===0) return alert("Selecione pelo menos um morador");
            alert("Mensagem enviada para: " + selected.join(', '));
        });
    }

    // -------------------- Salvar Entrega --------------------
    document.getElementById('entregaForm')?.addEventListener('submit', e=>{
        e.preventDefault();
        const data = {
            nome: document.getElementById('entregaNome').value,
            apt: document.getElementById('entregaApto').value,
            tipo: document.getElementById('entregaTipo').value,
            data: document.getElementById('entregaData').value
        };
        entregas[currentTorre].push(data);
        modais['entrega'].style.display='none';
        renderEntregas(currentTorre);
    });

});
