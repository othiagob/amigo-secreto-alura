/**
 * Sorteador de Amigo Secreto - Versão Modernizada
 * Aplicação sofisticada com funcionalidades avançadas
 * Desenvolvido por: Thiago S. Borghardt
 */

class AmigoSecretoApp {
    constructor() {
        this.amigos = [];
        this.historico = [];
        this.resultadoAtual = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadFromStorage();
    }
    
    initializeElements() {
        this.elements = {
            input: document.getElementById('amigo'),
            inputValidation: document.getElementById('inputValidation'),
            listaAmigos: document.getElementById('listaAmigos'),
            resultado: document.getElementById('resultado'),
            sortearBtn: document.getElementById('sortearBtn'),
            participantsHeader: document.getElementById('participantsHeader'),
            participantCount: document.getElementById('participantCount'),
            resultContainer: document.getElementById('resultContainer'),
            toast: document.getElementById('toast')
        };
    }
    
    initializeEventListeners() {
        // Enter key no input
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.adicionarAmigo();
            }
        });
        
        // Validação em tempo real
        this.elements.input.addEventListener('input', () => {
            this.validarInput();
        });
        
        // Prevenir espaços duplos
        this.elements.input.addEventListener('keydown', (e) => {
            const value = this.elements.input.value;
            if (e.key === ' ' && (value.endsWith(' ') || value === '')) {
                e.preventDefault();
            }
        });
    }
    
    validarInput() {
        const nome = this.elements.input.value.trim();
        const validation = this.elements.inputValidation;
        
        validation.innerHTML = '';
        this.elements.input.classList.remove('error', 'success');
        
        if (!nome) return;
        
        if (nome.length < 2) {
            this.showInputValidation('Nome muito curto (mínimo 2 caracteres)', 'error');
            return false;
        }
        
        if (nome.length > 30) {
            this.showInputValidation('Nome muito longo (máximo 30 caracteres)', 'error');
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
            this.showInputValidation('Use apenas letras e espaços', 'error');
            return false;
        }
        
        if (this.amigos.some(amigo => amigo.toLowerCase() === nome.toLowerCase())) {
            this.showInputValidation('Este nome já foi adicionado', 'error');
            return false;
        }
        
        this.showInputValidation('Nome válido ✓', 'success');
        return true;
    }
    
    showInputValidation(message, type) {
        const validation = this.elements.inputValidation;
        validation.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
        validation.className = `input-validation ${type}`;
        this.elements.input.classList.add(type);
    }
    
    adicionarAmigo() {
        const nome = this.elements.input.value.trim();
        
        if (!nome) {
            this.showToast('Por favor, digite um nome!', 'error');
            this.elements.input.focus();
            return;
        }
        
        if (!this.validarInput()) {
            this.elements.input.focus();
            return;
        }
        
        // Capitalizar primeira letra de cada palavra
        const nomeFormatado = this.capitalizarNome(nome);
        
        this.amigos.push(nomeFormatado);
        this.atualizarListaAmigos();
        this.atualizarEstadoBotaoSortear();
        this.saveToStorage();
        
        this.elements.input.value = '';
        this.elements.inputValidation.innerHTML = '';
        this.elements.input.classList.remove('error', 'success');
        this.elements.input.focus();
        
        this.showToast(`${nomeFormatado} foi adicionado!`, 'success');
        
        // Animação de confetti leve
        if (this.amigos.length === 1) {
            this.createMiniConfetti();
        }
    }
    
    capitalizarNome(nome) {
        return nome.toLowerCase().split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }
    
    atualizarListaAmigos() {
        const lista = this.elements.listaAmigos;
        const header = this.elements.participantsHeader;
        const count = this.elements.participantCount;
        
        lista.innerHTML = '';
        
        if (this.amigos.length === 0) {
            header.style.display = 'none';
            return;
        }
        
        header.style.display = 'flex';
        count.textContent = this.amigos.length;
        
        this.amigos.forEach((amigo, index) => {
            const item = this.criarItemLista(amigo, index);
            lista.appendChild(item);
        });
    }
    
    criarItemLista(amigo, index) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="participant-name">
                <i class="fas fa-user"></i>
                ${amigo}
            </span>
            <button class="remove-btn" onclick="app.removerAmigo(${index})" title="Remover ${amigo}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Animação de entrada
        li.style.opacity = '0';
        li.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 50);
        
        return li;
    }
    
    removerAmigo(index) {
        const nomeRemovido = this.amigos[index];
        this.amigos.splice(index, 1);
        
        this.atualizarListaAmigos();
        this.atualizarEstadoBotaoSortear();
        this.saveToStorage();
        
        this.showToast(`${nomeRemovido} foi removido`, 'warning');
        
        // Esconder resultado se não há mais participantes suficientes
        if (this.amigos.length < 2) {
            this.elements.resultContainer.style.display = 'none';
        }
    }
    
    limparTodos() {
        if (this.amigos.length === 0) return;
        
        const confirmacao = confirm(`Tem certeza que deseja remover todos os ${this.amigos.length} participantes?`);
        if (!confirmacao) return;
        
        this.amigos = [];
        this.atualizarListaAmigos();
        this.atualizarEstadoBotaoSortear();
        this.elements.resultContainer.style.display = 'none';
        this.saveToStorage();
        
        this.showToast('Todos os participantes foram removidos', 'warning');
    }
    
    atualizarEstadoBotaoSortear() {
        const btn = this.elements.sortearBtn;
        const isEnabled = this.amigos.length >= 2;
        
        btn.disabled = !isEnabled;
        
        if (isEnabled) {
            btn.querySelector('span').textContent = 'Sortear Amigo Secreto';
        } else {
            const needed = 2 - this.amigos.length;
            btn.querySelector('span').textContent = `Adicione mais ${needed} ${needed === 1 ? 'participante' : 'participantes'}`;
        }
    }
    
    sortearAmigo() {
        if (this.amigos.length < 2) {
            this.showToast('Adicione pelo menos 2 participantes!', 'error');
            return;
        }
        
        // Animação do botão
        const btn = this.elements.sortearBtn;
        btn.classList.add('loading');
        btn.disabled = true;
        
        // Simular processo de sorteio com delay dramático
        this.animarSorteio(() => {
            const indiceSorteado = Math.floor(Math.random() * this.amigos.length);
            const amigoSorteado = this.amigos[indiceSorteado];
            
            this.resultadoAtual = {
                nome: amigoSorteado,
                data: new Date(),
                participantes: [...this.amigos]
            };
            
            this.historico.push(this.resultadoAtual);
            this.saveToStorage();
            
            this.mostrarResultado(amigoSorteado);
            
            btn.classList.remove('loading');
            btn.disabled = false;
        });
    }
    
    animarSorteio(callback) {
        let contador = 0;
        const maxContador = 15;
        const intervalo = 100;
        
        const animacao = setInterval(() => {
            // Mostrar nome aleatório
            const nomeAleatorio = this.amigos[Math.floor(Math.random() * this.amigos.length)];
            this.elements.resultado.textContent = nomeAleatorio;
            
            contador++;
            
            if (contador >= maxContador) {
                clearInterval(animacao);
                callback();
            }
        }, intervalo);
        
        // Efeito visual no botão
        const effect = this.elements.sortearBtn.querySelector('.button-effect');
        effect.style.width = '300px';
        effect.style.height = '300px';
        
        setTimeout(() => {
            effect.style.width = '0';
            effect.style.height = '0';
        }, 1000);
    }
    
    mostrarResultado(amigoSorteado) {
        this.elements.resultado.innerHTML = `
            <i class="fas fa-star"></i>
            <strong>${amigoSorteado}</strong>
        `;
        
        this.elements.resultContainer.style.display = 'block';
        
        // Scroll suave para o resultado
        setTimeout(() => {
            this.elements.resultContainer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
        
        // Confetti de celebração
        this.createConfetti();
        
        this.showToast(`🎉 ${amigoSorteado} foi sorteado!`, 'success');
    }
    
    novoSorteio() {
        this.elements.resultContainer.style.display = 'none';
        this.elements.resultado.textContent = '';
        
        // Scroll para o botão de sortear
        this.elements.sortearBtn.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    createConfetti() {
        const container = document.getElementById('confetti-container') || document.body;
        const colors = ['#ff6b6b', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#a8edea'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            const animation = confetti.animate([
                { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
            });
            
            container.appendChild(confetti);
            
            animation.addEventListener('finish', () => {
                confetti.remove();
            });
        }
    }
    
    createMiniConfetti() {
        const colors = ['#667eea', '#fa709a'];
        
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            const animation = confetti.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(${x - 50}%, ${y - 50}%) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            document.body.appendChild(confetti);
            
            animation.addEventListener('finish', () => {
                confetti.remove();
            });
        }
    }
    
    showToast(message, type = 'info') {
        const toast = this.elements.toast;
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    saveToStorage() {
        try {
            const data = {
                amigos: this.amigos,
                historico: this.historico.slice(-10) // Manter apenas os últimos 10
            };
            localStorage.setItem('amigoSecretoData', JSON.stringify(data));
        } catch (error) {
            console.warn('Erro ao salvar dados:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem('amigoSecretoData');
            if (data) {
                const parsed = JSON.parse(data);
                this.amigos = parsed.amigos || [];
                this.historico = parsed.historico || [];
                
                this.atualizarListaAmigos();
                this.atualizarEstadoBotaoSortear();
            }
        } catch (error) {
            console.warn('Erro ao carregar dados:', error);
        }
    }
}

// Inicializar aplicação
let app;

// Aguardar DOM estar carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new AmigoSecretoApp();
    });
} else {
    app = new AmigoSecretoApp();
}

// Funções globais para compatibilidade com HTML
window.adicionarAmigo = () => app?.adicionarAmigo();
window.sortearAmigo = () => app?.sortearAmigo();
window.limparTodos = () => app?.limparTodos();
window.novoSorteio = () => app?.novoSorteio();

// Debug helper (remover em produção)
window.debugApp = () => {
    console.log('Estado atual da aplicação:', {
        amigos: app.amigos,
        historico: app.historico,
        resultado: app.resultadoAtual
    });
};
