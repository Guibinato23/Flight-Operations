// Adiciona usuários padrão se não existirem
(() => {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Adiciona super admin
  if (!users.find(u => u.email === 'guilherme@poitav.com')) {
    users.push({ name: 'Guilherme', email: 'guilherme@poitav.com', password: 'admin123', approved: true });
  }
  
  // Adiciona bot
  if (!users.find(u => u.email === 'bot@poitav.com')) {
    users.push({ name: 'Bot', email: 'bot@poitav.com', password: 'bot123', approved: true });
  }
  
  localStorage.setItem('users', JSON.stringify(users));
})();
// login.js - Simulação de autenticação localStorage

function showBox(box) {
  document.getElementById('loginBox').style.display = box === 'login' ? '' : 'none';
  document.getElementById('registerBox').style.display = box === 'register' ? '' : 'none';
}

document.getElementById('showRegister').onclick = () => showBox('register');
document.getElementById('showLogin').onclick = () => showBox('login');


// Corrige usuários antigos no localStorage para garantir que todos tenham o campo 'approved'
let usersFix = JSON.parse(localStorage.getItem('users') || '[]');
let changed = false;
usersFix = usersFix.map(u => {
  if (typeof u.approved === 'undefined') { u.approved = false; changed = true; }
  return u;
});
if (changed) localStorage.setItem('users', JSON.stringify(usersFix));

// Cadastro
const registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  const error = document.getElementById('registerError');
  error.style.display = 'none';
  if (!name || !email || !password) {
    error.textContent = 'Preencha todos os campos.';
    error.style.display = 'block';
    return;
  }
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === email)) {
    error.textContent = 'E-mail já cadastrado.';
    error.style.display = 'block';
    return;
  }
  // Cadastro pendente de aprovação
  users.push({ name, email, password, approved: false });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Cadastro enviado! Aguarde aprovação do administrador.');
  showBox('login');
};

// Login
const loginForm = document.getElementById('loginForm');
loginForm.onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const error = document.getElementById('loginError');
  error.style.display = 'none';
  
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  console.log('[LOGIN DEBUG] Tentando login com:', email);
  console.log('[LOGIN DEBUG] Usuários cadastrados:', users);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('[LOGIN DEBUG] Usuário não encontrado ou senha incorreta');
    error.textContent = 'E-mail ou senha inválidos.';
    error.style.display = 'block';
    return;
  }
  
  console.log('[LOGIN DEBUG] Usuário encontrado:', user);
  
  if (user.email !== 'guilherme@poitav.com' && !user.approved) {
    console.log('[LOGIN DEBUG] Usuário não aprovado');
    error.textContent = 'Cadastro pendente de aprovação pelo administrador.';
    error.style.display = 'block';
    return;
  }
  
  // Salva usuário logado apenas se aprovado ou for super admin
  if(user.email === 'guilherme@poitav.com' || user.approved) {
    console.log('[LOGIN DEBUG] Login aprovado, redirecionando...');
    localStorage.setItem('loggedUser', JSON.stringify(user));
    window.location.href = 'index.new.html';
  }
};

// Se já estiver logado, redireciona
if (localStorage.getItem('loggedUser')) {
  window.location.href = 'index.new.html';
}

// Aprovação de usuários (apenas para super admin)


function renderPendingUsers() {
  const pendingList = document.getElementById('pendingList');
  if (!pendingList) return;
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  const pendentes = users.filter(u=>!u.approved && u.email!=='guilherme@poitav.com');
  // Debug logs
  console.log('[DEBUG] users:', users);
  console.log('[DEBUG] pendentes:', pendentes);
  if(pendentes.length === 0) {
    pendingList.innerHTML = '<div style="color:#16a34a;text-align:center">Nenhum cadastro pendente.</div>';
    return;
  }
  pendingList.innerHTML = pendentes.map((u,i)=>
    `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee">
      <div>
        <strong>${u.name}</strong><br><span style="font-size:13px;color:#7b7b8a">${u.email}</span>
      </div>
      <div style="display:flex;gap:8px;">
        <button data-approve="${u.email}" style="background:#16a34a;color:#fff;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:14px">Aprovar</button>
        <button data-deny="${u.email}" style="background:#b91c1c;color:#fff;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:14px">Negar</button>
      </div>
    </div>`
  ).join('');
  // Adiciona listeners Aprovar
  Array.from(pendingList.querySelectorAll('button[data-approve]')).forEach(btn=>{
    btn.onclick = function() {
      const email = this.getAttribute('data-approve');
      users = users.map(u=>u.email===email ? {...u, approved:true} : u);
      localStorage.setItem('users', JSON.stringify(users));
      renderPendingUsers();
      alert('Usuário aprovado!');
    };
  });
  // Adiciona listeners Negar
  Array.from(pendingList.querySelectorAll('button[data-deny]')).forEach(btn=>{
    btn.onclick = function() {
      const email = this.getAttribute('data-deny');
      users = users.filter(u=>u.email!==email);
      localStorage.setItem('users', JSON.stringify(users));
      renderPendingUsers();
      alert('Usuário negado e removido!');
    };
  });
}
window.renderPendingUsers = renderPendingUsers;

window.addEventListener('DOMContentLoaded', ()=>{
  const logged = JSON.parse(localStorage.getItem('loggedUser')||'null');
  const adminBox = document.getElementById('adminApprovalBox');
  // Exibe interface de aprovação se:
  // - usuário logado for admin OU
  // - url contém #admin e usuário logado for admin
  if(logged && logged.email === 'guilherme@poitav.com' && adminBox) {
    if(window.location.hash === '#admin' || document.getElementById('loginBox').style.display === 'none' || document.getElementById('registerBox').style.display === 'none') {
      adminBox.style.display = '';
      renderPendingUsers();
      document.getElementById('refreshPending').onclick = renderPendingUsers;
      // Esconde login/cadastro
      document.getElementById('loginBox').style.display = 'none';
      document.getElementById('registerBox').style.display = 'none';
    }
  }
});
