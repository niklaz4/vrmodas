const produtos = [
    {
        id: 1,
        nome: 'Calça Social Classica',
        preco: 297.00,
        precoOriginal: 559.00,
        imagem: 'galeria/calca 1.jpg', 
        imagemThumb: 'galeria/calca 1.jpg', 
        tamanhos: ['P', 'M', 'G']
    },
    {
        id: 2,
        nome: 'Terno Linho Fino',
        preco: 888.00,
        precoOriginal: 1256.00,
        imagem: 'galeria/terno 1.jpg',
        imagemThumb: 'galeria/terno 1.jpg',
        tamanhos: ['P', 'M', 'G']
    },
    {
        id: 3,
        nome: 'Sapato de Couro',
        preco: 399.00,
        precoOriginal: 533.00,
        imagem: 'galeria/sapato 1.jpg',
        imagemThumb: 'galeria/sapato 1.jpg',
        tamanhos: ['39', '40', '41', '42']
    },
    {
        id: 4,
        nome: 'Relogio San Diego',
        preco: 279.00,
        precoOriginal: 493.00,
        imagem: 'galeria/relogio 1.jpg',
        imagemThumb: 'galeria/relogio 1.jpg',
        tamanhos: ['Único']
    }
];

// Carrinho de compras
let carrinho = [];
let favoritos = new Set();

// Função para pré-carregar imagens
function preCarregarImagens() {
    produtos.forEach(produto => {
        const img = new Image();
        img.src = produto.imagem;
        const thumbImg = new Image();
        thumbImg.src = produto.imagemThumb;
    });
}

// Função que será chamada quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    preCarregarImagens(); // Pré-carrega as imagens
    renderizarProdutos();
    // Recuperar favoritos do localStorage se existirem
    const favoritosLocalStorage = localStorage.getItem('favoritos');
    if (favoritosLocalStorage) {
        favoritos = new Set(JSON.parse(favoritosLocalStorage));
    }
});

function toggleFavorito(produtoId, element) {
    if (favoritos.has(produtoId)) {
        favoritos.delete(produtoId);
        element.classList.remove('bi-heart-fill', 'active');
        element.classList.add('bi-heart');
        mostrarMensagem('Produto removido dos favoritos!', 'info');
    } else {
        favoritos.add(produtoId);
        element.classList.remove('bi-heart');
        element.classList.add('bi-heart-fill', 'active');
        mostrarMensagem('Produto adicionado aos favoritos!', 'success');
    }
    
    // Salvar favoritos no localStorage
    localStorage.setItem('favoritos', JSON.stringify([...favoritos]));
}

// Renderiza os produtos com lazy loading
function renderizarProdutos() {
    const produtosContainer = document.getElementById('produtos');
    if (!produtosContainer) return;
    
    produtosContainer.innerHTML = '';

    produtos.forEach(produto => {
        const produtoElement = document.createElement('div');
        produtoElement.className = 'col-md-3';
        produtoElement.innerHTML = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${produto.imagemThumb}" 
                         data-src="${produto.imagem}" 
                         alt="${produto.nome}" 
                         class="lazy-image"
                         loading="lazy"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <div class="product-title-container">
                        <h5 class="product-title">${produto.nome}</h5>
                        <i class="bi ${favoritos.has(produto.id) ? 'bi-heart-fill active' : 'bi-heart'} favorite" 
                           onclick="toggleFavorito(${produto.id}, this)"></i>
                    </div>
                    <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
                    <div class="product-original-price">ou 3x de R$ ${(produto.preco/3).toFixed(2)}</div>
                    <div class="product-original-price">De: R$ ${produto.precoOriginal.toFixed(2)}</div>
                    <button class="btn btn-dark w-100 mt-3" onclick="adicionarAoCarrinho(${produto.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
        produtosContainer.appendChild(produtoElement);
    });

    // Implementa lazy loading para imagens
    implementarLazyLoading();
}

// Implementa lazy loading para imagens
function implementarLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Atualiza a exibição do carrinho com imagens otimizadas
function atualizarCarrinho() {
    const carrinhoContainer = document.getElementById('carrinho');
    if (!carrinhoContainer) return;
    
    let totalGeral = 0;
    carrinhoContainer.innerHTML = '';

    carrinho.forEach(item => {
        const total = item.preco * item.quantidade;
        totalGeral += total;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imagemThumb}"
                     data-src="${item.imagem}"
                     alt="${item.nome}"
                     class="lazy-image"
                     loading="lazy"
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="flex-grow-1">
                <h5>${item.nome}</h5>
                <p>Tamanho: ${item.tamanho}</p>
                <div class="quantity">
                    <button class="btn btn-sm btn-outline-dark" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn btn-sm btn-outline-dark" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="text-right">
                <p class="mb-0">R$ ${item.preco.toFixed(2)}</p>
                <p class="font-weight-bold">Total: R$ ${total.toFixed(2)}</p>
            </div>
        `;
        carrinhoContainer.appendChild(itemElement);
    });

    if (carrinho.length > 0) {
        const totalElement = document.createElement('div');
        totalElement.className = 'cart-total';
        totalElement.innerHTML = `
            <h4 class="text-right mt-4">Total Geral: R$ ${totalGeral.toFixed(2)}</h4>
        `;
        carrinhoContainer.appendChild(totalElement);
    }

    // Implementa lazy loading para imagens do carrinho
    implementarLazyLoading();
}

function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    // Criar modal para seleção de tamanho e quantidade
    const modalHtml = `
        <div class="modal fade" id="addToCartModal-${produtoId}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-transparent">
                    <div class="modal-body bg-dark bg-opacity-75 text-white rounded">
                        <h5 class="modal-title mb-3">${produto.nome}</h5>
                        <div class="mb-3">
                            <label class="form-label">Tamanho:</label>
                            <select class="form-select" id="tamanho-${produtoId}">
                                ${produto.tamanhos.map(tamanho => 
                                    `<option value="${tamanho}">${tamanho}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quantidade:</label>
                            <div class="input-group">
                                <button class="btn btn-outline-light" onclick="alterarQuantidadeModal(${produtoId}, -1)">-</button>
                                <input type="number" class="form-control text-center" id="quantidade-${produtoId}" value="1" min="1" max="10">
                                <button class="btn btn-outline-light" onclick="alterarQuantidadeModal(${produtoId}, 1)">+</button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span>Preço unitário:</span>
                            <span>R$ ${produto.preco.toFixed(2)}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span>Total:</span>
                            <span id="total-${produtoId}">R$ ${produto.preco.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-light w-100" onclick="confirmarAdicaoAoCarrinho(${produtoId})">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal anterior se existir
    const modalAnterior = document.querySelector(`#addToCartModal-${produtoId}`);
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Adicionar novo modal ao documento
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Inicializar e mostrar o modal
    const modal = new bootstrap.Modal(document.querySelector(`#addToCartModal-${produtoId}`));
    modal.show();
}

// Função para alterar quantidade no modal
function alterarQuantidadeModal(produtoId, delta) {
    const produto = produtos.find(p => p.id === produtoId);
    const quantidadeInput = document.querySelector(`#quantidade-${produtoId}`);
    let quantidade = parseInt(quantidadeInput.value) + delta;
    
    // Garantir que a quantidade esteja entre 1 e 10
    quantidade = Math.max(1, Math.min(10, quantidade));
    quantidadeInput.value = quantidade;
    
    // Atualizar total
    const totalElement = document.querySelector(`#total-${produtoId}`);
    const total = produto.preco * quantidade;
    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para confirmar adição ao carrinho
function confirmarAdicaoAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const tamanhoSelect = document.querySelector(`#tamanho-${produtoId}`);
    const quantidadeInput = document.querySelector(`#quantidade-${produtoId}`);
    
    const tamanho = tamanhoSelect.value;
    const quantidade = parseInt(quantidadeInput.value);
    
    // Verificar se já existe o mesmo produto com mesmo tamanho no carrinho
    const itemExistente = carrinho.find(item => 
        item.id === produtoId && item.tamanho === tamanho
    );
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            tamanho: tamanho,
            quantidade: quantidade,
            imagem: produto.imagem,
            imagemThumb: produto.imagemThumb
        });
    }
    
    // Fechar o modal
    const modal = bootstrap.Modal.getInstance(document.querySelector(`#addToCartModal-${produtoId}`));
    modal.hide();
    
    // Atualizar exibição do carrinho
    atualizarCarrinho();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Produto adicionado ao carrinho!', 'success');
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    const mensagem = document.createElement('div');
    mensagem.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    mensagem.role = 'alert';
    mensagem.innerHTML = `
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(mensagem);
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
        mensagem.remove();
    }, 3000);
}

//atualiza o carrinho
function atualizarCarrinho() {
    const carrinhoContainer = document.getElementById('carrinho');
    if (!carrinhoContainer) return;
    
    let totalGeral = 0;
    carrinhoContainer.innerHTML = '';

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio</p>';
        return;
    }

    carrinho.forEach(item => {
        const total = item.preco * item.quantidade;
        totalGeral += total;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imagemThumb}"
                     alt="${item.nome}"
                     class="img-fluid"
                     loading="lazy">
            </div>
            <div class="flex-grow-1">
                <h5>${item.nome}</h5>
                <p class="mb-1">Tamanho: ${item.tamanho}</p>
                <p class="mb-2">Preço unitário: R$ ${item.preco.toFixed(2)}</p>
                <div class="quantity">
                    <button class="btn btn-sm btn-outline-dark" onclick="alterarQuantidade(${item.id}, -1, '${item.tamanho}')">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn btn-sm btn-outline-dark" onclick="alterarQuantidade(${item.id}, 1, '${item.tamanho}')">+</button>
                </div>
            </div>
            <div class="text-right">
                <p class="font-weight-bold mb-1">Total: R$ ${total.toFixed(2)}</p>
                <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${item.id}, '${item.tamanho}')">
                    Remover
                </button>
            </div>
        `;
        carrinhoContainer.appendChild(itemElement);
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total bg-light p-3 mt-3';
    totalElement.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Total do Pedido:</h4>
            <h4 class="mb-0">R$ ${totalGeral.toFixed(2)}</h4>
        </div>
        <button class="btn btn-dark w-100 mt-3" onclick="finalizarCompra()">
            Finalizar Compra
        </button>
    `;
    carrinhoContainer.appendChild(totalElement);
}

// Função para remover item do carrinho
function removerDoCarrinho(produtoId, tamanho) {
    carrinho = carrinho.filter(item => !(item.id === produtoId && item.tamanho === tamanho));
    atualizarCarrinho();
    mostrarMensagem('Produto removido do carrinho!', 'warning');
}

// Atualizar a função alterarQuantidade para incluir o tamanho
function alterarQuantidade(produtoId, delta, tamanho) {
    const item = carrinho.find(item => item.id === produtoId && item.tamanho === tamanho);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId, tamanho);
        } else {
            atualizarCarrinho();
        }
    }
}

// Função para finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarMensagem('Seu carrinho está vazio!', 'warning');
        return;
    }
    alert('Redirecionando para o checkout...');
}

function sanitizeInput(input) {
    // Remove caracteres especiais e scripts, para evitar qualquer tipo de ataque. Vamos pensar em segurança, meu povo?
    input.value = input.value.replace(/<[^>]*>?/gm, '');
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
}

function validateForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }

    // Criar objeto com dados sanitizados
    const formData = {
        firstName: DOMPurify.sanitize(document.getElementById('firstName').value),
        lastName: DOMPurify.sanitize(document.getElementById('lastName').value),
        email: DOMPurify.sanitize(document.getElementById('email').value),
        cep: DOMPurify.sanitize(document.getElementById('cep').value),
        state: DOMPurify.sanitize(document.getElementById('state').value),
        city: DOMPurify.sanitize(document.getElementById('city').value),
        terms: document.getElementById('terms').checked
    };

    // Enviar dados para o servidor com token CSRF
    enviarDados(formData);
    return false;
}

function formatCEP(input) {
    // Formata o CEP enquanto digita
    let value = input.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substr(0, 5) + '-' + value.substr(5);
    }
    input.value = value;
}

async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        // Preenche os campos com os dados retornados
        document.getElementById('city').value = data.localidade;
        document.getElementById('state').value = data.uf;
        
        // Habilita os campos
        document.getElementById('city').disabled = false;
        document.getElementById('state').disabled = false;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('CEP não encontrado. Por favor, verifique o número informado.');
    }
}

async function enviarDados(formData) {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar dados');
        }

        const result = await response.json();
        if (result.success) {
            window.location.href = '/checkout/success';
        } else {
            alert('Erro ao processar checkout. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar checkout. Por favor, tente novamente.');
    }
}

// Carregar estados brasileiros
const estados = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' }
];

document.addEventListener('DOMContentLoaded', () => {
    const selectEstado = document.getElementById('state');
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.uf;
        option.textContent = estado.nome;
        selectEstado.appendChild(option);
    });
});

// Manipulador de imagem de perfil
document.addEventListener('DOMContentLoaded', function() {
    const profileImageInput = document.getElementById('profileImage');
    const imageError = document.getElementById('imageError');
    const preview = document.getElementById('profilePreview');
    const editProfileForm = document.getElementById('editProfileForm');

    // Verifica se os elementos existem antes de adicionar os listeners
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleImageSelect);
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleFormSubmit);
    }

    function handleImageSelect(e) {
        try {
            const file = e.target.files[0];
            
            if (imageError) {
                imageError.textContent = '';
            }
            
            if (!file) {
                return;
            }

            // Validação do tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Por favor, selecione apenas arquivos PNG ou JPG/JPEG.');
            }

            // Validação do tamanho (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; 
            if (file.size > maxSize) {
                throw new Error('A imagem deve ter no máximo 5MB.');
            }

            // Preview da imagem
            if (preview) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    preview.src = event.target.result;
                };
                reader.onerror = function() {
                    throw new Error('Erro ao ler o arquivo.');
                };
                reader.readAsDataURL(file);
            }

        } catch (error) {
            // Limpa o input
            e.target.value = '';
            
            // Exibe o erro
            if (imageError) {
                imageError.textContent = error.message;
            }
            console.error('Erro ao processar imagem:', error);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            
            const submitButton = e.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Atualizando...';
            }

            const response = await fetch('/api/update-profile', {
                method: 'POST',
                body: formData,
                headers: {
                    
                },
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Erro ao atualizar perfil');
            }

            alert('Perfil atualizado com sucesso!');

            const modalElement = document.getElementById('editProfileModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }

        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao atualizar perfil. Tente novamente.');
        } finally {
            // Restaura o botão
            const submitButton = e.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Salvar';
            }
        }
    }
});