// write or paste code here

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- Logout --------------------
    function logout() {
        window.location.href = "index.html";
    }
    document.querySelector('.logout')?.addEventListener('click', logout);

    // -------------------- Data/Hora --------------------
    const datetime = document.getElementById('datetime');

    function updateDateTime() {
        if (!datetime) return;
        const now = new Date();
        datetime.innerText = now.toLocaleString('pt-BR', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();



    // -------------------- Submenus --------------------
    document.querySelectorAll('.menu-item.has-submenu > .menu-link').forEach(menu => {
        const submenu = menu.nextElementSibling;
        if (!submenu) return;
        submenu.style.overflow = 'hidden';
        submenu.style.maxHeight = '0';
        submenu.style.display = 'none';
        submenu.style.transition = 'max-height 0.3s ease';
        menu.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm !== submenu) {
                    sm.style.maxHeight = '0';
                    setTimeout(() => sm.style.display = 'none', 300);
                }
            });
            if (submenu.style.maxHeight === '0px' || submenu.style.maxHeight === '') {
                submenu.style.display = 'flex';
                submenu.style.flexDirection = 'column';
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            } else {
                submenu.style.maxHeight = '0';
                setTimeout(() => submenu.style.display = 'none', 300);
            }
        });
    });

    // -------------------- Dados --------------------
    let moradores = [{
            nome: "Morador 1",
            apt: "101",
            torre: "Mykonos",
            veiculo: "Carro",
            contato: "(11) 99999-8888"
        },
        {
            nome: "Morador 2",
            apt: "202",
            torre: "Santorini",
            veiculo: "Moto",
            contato: "morador2@email.com"
        },
        {
            nome: "Morador 3",
            apt: "303",
            torre: "Mykonos",
            veiculo: "Carro",
            contato: "(11) 98888-7777"
        }
    ];
    let veiculos = [{
            tipo: "Carro",
            marca: "Chevrolet",
            modelo: "Onix",
            placa: "ABC-1234",
            apt: "101"
        },
        {
            tipo: "Moto",
            marca: "Honda",
            modelo: "CG 160",
            placa: "XYZ-5678",
            apt: "202"
        },
        {
            tipo: "Carro",
            marca: "Wolks",
            modelo: "Gol",
            placa: "QWE-7890",
            apt: "303"
        }
    ];
    let funcionarios = [{
            nome: "João Silva",
            funcao: "Portaria",
            dias: "Seg a Sex",
            horario: "07:00-15:00"
        },
        {
            nome: "Maria Souza",
            funcao: "Limpeza",
            dias: "Todos os dias",
            horario: "08:00-16:00"
        },
        {
            nome: "Carlos Lima",
            funcao: "Segurança",
            dias: "Seg a Sex",
            horario: "15:00-23:00"
        }
    ];
    let entregas = {
        Mykonos: [],
        Santorini: [],
        Creta: [],
        Paros: []
    };

    let pets = [{
            nome: "Rex",
            tipo: "Cachorro",
            dono: "João",
            contato: "(11) 99999-8888",
            obs: "--"
        },
        {
            nome: "Mimi",
            tipo: "Gato",
            dono: "Maria",
            contato: "morador2@email.com",
            obs: "--"
        },
        {
            nome: "Bolt",
            tipo: "Cachorro",
            dono: "Carlos",
            contato: "(11) 98888-7777",
            obs: "--"
        }
    ]

    // -------------------- Modais --------------------



    const modais = {
        morador: document.getElementById('moradorModal'),
        veiculo: document.getElementById('veiculoModal'),
        pets: document.getElementById('petModal'),
        funcionario: document.getElementById('funcionarioModal'),
        entrega: document.getElementById('entregaModal'),
        mensagem: document.getElementById('mensagemModal')
    };
    let editRow = null;
    let currentTorre = '';

    function openModal(type, mode, row = null) {
        editRow = row;
        const modal = modais[type];
        if (!modal) return alert("Modal não encontrado: " + type);
        modal.style.display = 'block';
        const titleId = modal.querySelector('h2').id;
        document.getElementById(titleId).innerText = mode === 'add' ? `Adicionar ${type}` : `Alterar ${type}`;
        const form = modal.querySelector('form');
        if (mode === 'edit' && row) {
            Array.from(row.children).forEach((td, i) => {
                const input = form[i];
                if (input) input.value = td.innerText;
            });
        } else form?.reset();
    }

    document.querySelectorAll('.modal .close').forEach(btn => btn.onclick = () => btn.closest('.modal').style.display = 'none');
    window.addEventListener('click', e => {
        Object.values(modais).forEach(modal => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // -------------------- Dashboard --------------------
    function loadDashboard() {
        const content = document.getElementById('content-area');
        if (!content) return;
        content.innerHTML = `<div class="cards"><div class="card">Aviso 1</div><div class="card">Aviso 2</div><div class="card">Lembrete</div></div>`;
    }
    loadDashboard();

    // -------------------- Funções de renderização --------------------
    function renderTabela(dataArray, columns, title, type, searchIds = []) {
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>${title}</h2>
            <div class=".actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAdd${type}" class="action-btn">Adicionar</button>
                    <button id="btnEdit${type}" class="action-btn">Alterar</button>
                </div>
                <div><button id="btnBack${type}" class="action-btn" style="background:#95a5a6;">Voltar</button></div>
            </div>
            <div class="busca">
                ${searchIds.map(id=>`<input type="text" id="${id}" placeholder="Pesquisar...">`).join('')}
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
                    <tbody>${dataArray.map(d=>`<tr>${columns.map(c=>`<td>${d[c.toLowerCase()]}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        document.getElementById(`btnAdd${type}`)?.addEventListener('click', () => openModal(type, 'add'));
        document.getElementById(`btnEdit${type}`)?.addEventListener('click', () => {
            const selected = document.querySelector('.tabelas tr.selected');
            if (!selected) return alert(`Selecione um ${type} para alterar`);
            openModal(type, 'edit', selected);
        });
        document.getElementById(`btnBack${type}`)?.addEventListener('click', loadDashboard);
        searchIds.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => {
                const value = document.getElementById(id).value.toLowerCase();
                document.querySelectorAll('.tabelas tbody tr').forEach(row => {
                    row.style.display = Array.from(row.children).some(td => td.innerText.toLowerCase().includes(value)) ? '' : 'none';
                });
            });
        });
        document.querySelectorAll('.tabelas tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                document.querySelectorAll('.tabelas tr').forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            });
        });
    }

    // -------------------- Eventos dos links --------------------
    // -------------------- Moradores --------------------
    document.getElementById('link-moradores')?.addEventListener('click', e => {
        e.preventDefault();
        renderMoradores();
    });

    function renderMoradores() {
        const content = document.getElementById('content-area');
        if (!content) return;

        content.innerHTML = `
            <h2>Moradores</h2>
            <div class=".actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAddMorador" class="action-btn">Adicionar</button>
                    <button id="btnEditMorador" class="action-btn">Alterar</button>
                </div>
                <div>
                    <button id="btnBackMorador" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <div class="busca">
                <input type="text" id="searchNome" placeholder="Pesquisar por nome">
                <input type="text" id="searchTorre" placeholder="Pesquisar por torre">
                <input type="text" id="searchVeiculo" placeholder="Pesquisar por veículo">
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead>
                        <tr><th>Nome</th><th>Apartamento</th><th>Torre</th><th>Veículo</th><th>Contato</th></tr>
                    </thead>
                    <tbody id="moradoresBody">
                        ${moradores.map(m=>`<tr>
                            <td>${m.nome}</td><td>${m.apt}</td><td>${m.torre}</td><td>${m.veiculo}</td><td>${m.contato}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
        `;

        const rows = document.querySelectorAll('.tabelas tbody tr');
        rows.forEach(row => row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }));

        document.getElementById('btnAddMorador')?.addEventListener('click', () => openModal('morador', 'add'));
        document.getElementById('btnEditMorador')?.addEventListener('click', () => {
            const selected = document.querySelector('.tabelas tr.selected');
            if (!selected) return alert('Selecione um morador para alterar');
            openModal('morador', 'edit', selected);
        });
        document.getElementById('btnBackMorador')?.addEventListener('click', loadDashboard);

        ['searchNome', 'searchTorre', 'searchVeiculo'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', filterMoradores);
        });
    }
    // -------------------- Salvar Morador --------------------
    document.getElementById('moradorForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            nome: document.getElementById('morNome').value,
            apt: document.getElementById('morApto').value,
            torre: document.getElementById('morTorre').value,
            veiculo: document.getElementById('morVeiculo').value,
            contato: document.getElementById('morContato').value
        };
        if (editRow) {
            // modo editar → atualiza linha
            Array.from(editRow.children).forEach((td, i) => td.innerText = Object.values(data)[i]);
            editRow = null;
        } else {
            // modo adicionar → insere no array e renderiza de novo
            moradores.push(data);
            renderMoradores();
        }
        modais['morador'].style.display = 'none';
    });

    function filterMoradores() {
        const nome = document.getElementById('searchNome')?.value.toLowerCase() || '';
        const torre = document.getElementById('searchTorre')?.value.toLowerCase() || '';
        const veiculo = document.getElementById('searchVeiculo')?.value.toLowerCase() || '';
        document.querySelectorAll('.tabelas tbody tr').forEach(row => {
            const c = row.children;
            row.style.display = (c[0].innerText.toLowerCase().includes(nome) && c[2].innerText.toLowerCase().includes(torre) && c[3].innerText.toLowerCase().includes(veiculo)) ? '' : 'none';
        });
    }




    // -------------------- PETS --------------------
    document.getElementById('link-pets')?.addEventListener('click', e => {
        e.preventDefault();
        renderPets();
    });

    function renderPets() {
        const content = document.getElementById('content-area');
        if (!content) return;

        content.innerHTML = `
            <h2>Pets</h2>
            <div class=".actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAddPet" class="action-btn">Adicionar</button>
                    <button id="btnEditPet" class="action-btn">Alterar</button>
                </div>
                <div>
                    <button id="btnBackPet" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <div class="busca">
                <input type="text" id="searchNome" placeholder="Pesquisar por nome do morador">
                <input type="text" id="searchPet" placeholder="Pesquisar por nome do pet">
                
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead>
                        <tr><th>nome</th><th>tipo</th><th>dono</th><th>contato</th><th>obs</th></tr>
                    </thead>
                    <tbody id="PetsBody">
                        ${pets.map(m=>`<tr>
                            <td>${m.nome}</td><td>${m.tipo}</td><td>${m.dono}</td><td>${m.contato}</td><td>${m.obs}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
        `;

        const rows = document.querySelectorAll('.tabelas tbody tr');
        rows.forEach(row => row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }));

        document.getElementById('btnAddPet')?.addEventListener('click', () => openModal('pets', 'add'));
        document.getElementById('btnEditPet')?.addEventListener('click', () => {
            const selected = document.querySelector('.tabelas tr.selected');
            if (!selected) return alert('Selecione um pet para alterar');
            openModal('pets', 'edit', selected);
        });
        document.getElementById('btnBackPet')?.addEventListener('click', loadDashboard);

        ['searchNome', 'searchPet'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', filterPets);
        });
    }
    // -------------------- Salvar Pet --------------------
    document.getElementById('petForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            nome: document.getElementById('petNome').value,
            tipo: document.getElementById('petTipo').value,
            dono: document.getElementById('petDono').value,
            contato: document.getElementById('petContato').value,
            obs: document.getElementById('petObs').value
        };
        if (editRow) {
            // modo editar → atualiza linha
            Array.from(editRow.children).forEach((td, i) => td.innerText = Object.values(data)[i]);
            editRow = null;
        } else {
            // modo adicionar → insere no array de pets e renderiza de novo
            pets.push(data);
            renderPets();
        }
        modais['pets'].style.display = 'none';
    });


    function filterPets() {
        const nomePet = document.getElementById('searchPet')?.value.toLowerCase() || '';
        const nomeDono = document.getElementById('searchNome')?.value.toLowerCase() || '';
        document.querySelectorAll('.tabelas tbody tr').forEach(row => {
            const c = row.children;
            row.style.display = (c[0].innerText.toLowerCase().includes(nomePet) && c[2].innerText.toLowerCase().includes(nomeDono)) ? '' : 'none';
        });
    }

    // -------------------- Veículos --------------------




    document.getElementById('link-veiculos')?.addEventListener('click', e => {
        e.preventDefault();
        renderVeiculos();
    });

    function renderVeiculos() {
        const content = document.getElementById('content-area');
        if (!content) return;
        content.innerHTML = `
            <h2>Veículos</h2>
            <div class=".actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAddVeiculo" class="action-btn">Adicionar</button>
                    <button id="btnEditVeiculo" class="action-btn">Alterar</button>
                </div>
                <div>
                    <button id="btnBackVeiculo" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <div class="busca">
                <input type="text" id="searchTipo" placeholder="Pesquisar por tipo">
                <input type="text" id="searchMarca" placeholder="Pesquisar por marca">
                <input type="text" id="searchModelo" placeholder="Pesquisar por modelo">
                <input type="text" id="searchPlaca" placeholder="Pesquisar por placa">
                <input type="text" id="searchApto" placeholder="Pesquisar por apartamento">
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead>
                        <tr><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Placa</th><th>Apartamento</th></tr>
                    </thead>
                    <tbody id="veiculosBody">
                        ${veiculos.map(v=>`<tr>
                            <td>${v.tipo}</td><td>${v.marca}</td><td>${v.modelo}</td><td>${v.placa}</td><td>${v.apt}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
        `;
        const rows = document.querySelectorAll('.tabelas tbody tr');
        rows.forEach(row => row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }));
        document.getElementById('btnAddVeiculo')?.addEventListener('click', () => openModal('veiculo', 'add'));
        document.getElementById('btnEditVeiculo')?.addEventListener('click', () => {
            const selected = document.querySelector('.tabelas tr.selected');
            if (!selected) return alert('Selecione um veículo para alterar');
            openModal('veiculo', 'edit', selected);
        });
        document.getElementById('btnBackVeiculo')?.addEventListener('click', loadDashboard);
        ['searchTipo', 'searchMarca', 'searchModelo', 'searchPlaca', 'searchApto'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', filterVeiculos);
        });
    }

    function filterVeiculos() {
        const tipo = document.getElementById('searchTipo')?.value.toLowerCase() || '';
        const marca = document.getElementById('searchMarca')?.value.toLowerCase() || '';
        const modelo = document.getElementById('searchModelo')?.value.toLowerCase() || '';
        const placa = document.getElementById('searchPlaca')?.value.toLowerCase() || '';
        const apt = document.getElementById('searchApto')?.value.toLowerCase() || '';
        document.querySelectorAll('.tabelas tbody tr').forEach(row => {
            const c = row.children;
            row.style.display = (c[0].innerText.toLowerCase().includes(tipo) && c[1].innerText.toLowerCase().includes(marca) && c[2].innerText.toLowerCase().includes(modelo) && c[3].innerText.toLowerCase().includes(placa) && c[4].innerText.toLowerCase().includes(apt)) ? '' : 'none';
        });
    }
    // -------------------- Salvar Veículo --------------------
    document.getElementById('veiculoForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            tipo: document.getElementById('veiTipo').value,
            marca: document.getElementById('veiMarca').value,
            modelo: document.getElementById('veiModelo').value,
            placa: document.getElementById('veiPlaca').value,
            apt: document.getElementById('veiApto').value
        };
        if (editRow) {
            Array.from(editRow.children).forEach((td, i) => td.innerText = Object.values(data)[i]);
            editRow = null;
        } else {
            veiculos.push(data);
            renderVeiculos();
        }
        modais['veiculo'].style.display = 'none';
    });


    // -------------------- Funcionários --------------------
    document.getElementById('link-funcionarios')?.addEventListener('click', e => {
        e.preventDefault();
        renderFuncionarios();
    });

    function renderFuncionarios() {
        const content = document.getElementById('content-area');
        if (!content) return;
        content.innerHTML = `
            <h2>Funcionários</h2>
            <div class=".actions" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <button id="btnAddFunc" class="action-btn">Adicionar</button>
                    <button id="btnEditFunc" class="action-btn">Alterar</button>
                </div>
                <div>
                    <button id="btnBackFunc" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <div class="busca">
                <input type="text" id="searchNomeFunc" placeholder="Pesquisar por nome">
                <input type="text" id="searchFuncao" placeholder="Pesquisar por função">
                <input type="text" id="searchDias" placeholder="Pesquisar por dias">
                <input type="text" id="searchHorario" placeholder="Pesquisar por horário">
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead>
                        <tr><th>Nome</th><th>Função</th><th>Dias</th><th>Horário</th></tr>
                    </thead>
                    <tbody id="funcionariosBody">
                        ${funcionarios.map(f=>`<tr>
                            <td>${f.nome}</td><td>${f.funcao}</td><td>${f.dias}</td><td>${f.horario}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
        `;
        const rows = document.querySelectorAll('.tabelas tbody tr');
        rows.forEach(row => row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }));
        document.getElementById('btnAddFunc')?.addEventListener('click', () => openModal('funcionario', 'add'));
        document.getElementById('btnEditFunc')?.addEventListener('click', () => {
            const selected = document.querySelector('.tabelas tr.selected');
            if (!selected) return alert('Selecione um funcionário para alterar');
            openModal('funcionario', 'edit', selected);
        });
        document.getElementById('btnBackFunc')?.addEventListener('click', loadDashboard);
        ['searchNomeFunc', 'searchFuncao', 'searchDias', 'searchHorario'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', filterFuncionarios);
        });
    }

    function filterFuncionarios() {
        const nome = document.getElementById('searchNomeFunc')?.value.toLowerCase() || '';
        const funcao = document.getElementById('searchFuncao')?.value.toLowerCase() || '';
        const dias = document.getElementById('searchDias')?.value.toLowerCase() || '';
        const horario = document.getElementById('searchHorario')?.value.toLowerCase() || '';
        document.querySelectorAll('.tabelas tbody tr').forEach(row => {
            const c = row.children;
            row.style.display = (c[0].innerText.toLowerCase().includes(nome) && c[1].innerText.toLowerCase().includes(funcao) && c[2].innerText.toLowerCase().includes(dias) && c[3].innerText.toLowerCase().includes(horario)) ? '' : 'none';
        });
    }
    // -------------------- Salvar Funcionário --------------------
    document.getElementById('funcionarioForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            nome: document.getElementById('funcNome').value,
            funcao: document.getElementById('funcFuncao').value,
            dias: document.getElementById('funcDias').value,
            horario: document.getElementById('funcHorario').value
        };
        if (editRow) {
            Array.from(editRow.children).forEach((td, i) => td.innerText = Object.values(data)[i]);
            editRow = null;
        } else {
            funcionarios.push(data);
            renderFuncionarios();
        }
        modais['funcionario'].style.display = 'none';
    });

    // -------------------- Entregas --------------------
    document.getElementById('link-registrar-entrega')?.addEventListener('click', e => {
        e.preventDefault();
        abrirTorres('entrega');
    });

    document.getElementById('link-enviar-mensagem')?.addEventListener('click', e => {
        e.preventDefault();
        abrirTorres('mensagem');
    });

    function abrirTorres(tipo) {
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
        document.querySelectorAll('#content-area .card').forEach(card => {
            if (card.classList.contains('disabled')) return;
            card.addEventListener('click', () => {
                const torre = card.dataset.torre;
                currentTorre = torre;
                if (tipo === 'entrega') renderEntregas(torre);
                else renderMensagens(torre);
            });
        });
    }

    function renderEntregas(torre) {
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>Entregas - ${torre}</h2>
            <div class=".actions">
                <button id="btnAddEntrega" class="action-btn">Registrar Entrega</button>
                <button id="btnBackEntrega" class="action-btn" style="background:#95a5a6;">Voltar</button>
            </div>
            <div class="tabela-container animate">
                <table class="tabelas">
                    <thead><tr><th>Morador</th><th>Apt</th><th>Entrega</th><th>Data/Hora</th></tr></thead>
                    <tbody>
                        ${entregas[torre].map(e=>`<tr><td>${e.nome}</td><td>${e.apt}</td><td>${e.tipo}</td><td>${e.data}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('btnBackEntrega')?.addEventListener('click', () => abrirTorres('entrega'));
        document.getElementById('btnAddEntrega')?.addEventListener('click', () => {
            modais['entrega'].style.display = 'block';
            document.getElementById('entregaForm').reset();
            document.getElementById('entregaData').value = new Date().toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            });
        });
    }

    function renderMensagens(torre) {
        const content = document.getElementById('content-area');
        content.innerHTML = `
            <h2>Enviar Mensagem - ${torre}</h2>
            <div class=".actions">
                <div>
                    <input type="checkbox" id="checkAll"> Selecionar Todos
                </div>
                <div>
                    <button id="btnBackMsg" class="action-btn" style="background:#95a5a6;">Voltar</button>
                </div>
            </div>
            <form id="mensagemForm">
                <div class="tabela-container animate">
                    <table class="tabelas">
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
        document.getElementById('checkAll')?.addEventListener('change', function() {
            document.querySelectorAll('.chkMorador').forEach(chk => chk.checked = this.checked);
        });
        document.getElementById('mensagemForm')?.addEventListener('submit', e => {
            e.preventDefault();
            const selected = Array.from(document.querySelectorAll('.chkMorador')).filter(c => c.checked).map(c => moradores[c.dataset.index].nome);
            if (selected.length === 0) return alert("Selecione pelo menos um morador");
            alert("Mensagem enviada para: " + selected.join(', '));
        });
    }

    // -------------------- Salvar Entrega --------------------
    document.getElementById('entregaForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            nome: document.getElementById('entregaNome').value,
            apt: document.getElementById('entregaApto').value,
            tipo: document.getElementById('entregaTipo').value,
            data: document.getElementById('entregaData').value
        };
        entregas[currentTorre].push(data);
        modais['entrega'].style.display = 'none';
        renderEntregas(currentTorre);
    });

});


  window.diego = function() {
    console.log("O Diego quem fez!");
  };


// Bloqueia menu de contexto (botão direito)
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);

    // Bloqueia seleção e arrastar (opcional)
    document.addEventListener('selectstart', e => e.preventDefault()); // impede seleção de texto
    document.addEventListener('dragstart', e => e.preventDefault());   // impede arrastar imagens

    // Bloqueia teclas como F12, Ctrl+Shift+I/C/J, Ctrl+U
    document.addEventListener('keydown', function (e) {
      // tecla F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J  (abrir devtools)
      if (e.ctrlKey && e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === 'i' || k === 'c' || k === 'j') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl+u (ver fonte da página)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+S / Ctrl+S (salvar página) — opcional
      if (e.ctrlKey && (e.key.toLowerCase() === 's' || (e.shiftKey && e.key.toLowerCase() === 's'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, false);

    document.getElementById("foto").addEventListener("change", function(e){
  const preview = document.getElementById("imgPreview");
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(ev){
      preview.src = ev.target.result;
      preview.style.display = "block";
    }
    reader.readAsDataURL(file);
  }
});
