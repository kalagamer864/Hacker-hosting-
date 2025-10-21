// Minimal frontend JS: signup/login + mock API calls to backend (http://localhost:4000)
const API = "http://localhost:4000";

async function signupFormHandler(e){
  e.preventDefault();
  const f = e.target;
  const body = {username:f.username.value, email:f.email.value, password:f.password.value};
  const res = await fetch(API + "/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await res.json();
  alert(data.message || JSON.stringify(data));
}
async function loginFormHandler(e){
  e.preventDefault();
  const f = e.target;
  const body = {email:f.email.value, password:f.password.value};
  const res = await fetch(API + "/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await res.json();
  if(data.token){ localStorage.setItem("token",data.token); alert("Logged in"); window.location.href="dashboard.html"; }
  else alert(data.message || JSON.stringify(data));
}

document.addEventListener('submit', (ev)=>{
  if(ev.target.id==="signupForm"){ ev.preventDefault(); signupFormHandler(ev); }
  if(ev.target.id==="loginForm"){ ev.preventDefault(); loginFormHandler(ev); }
});

async function fetchServers(){
  const token = localStorage.getItem("token");
  if(!token) { document.getElementById("serverList") && (document.getElementById("serverList").innerText="Please login to see servers."); return; }
  const res = await fetch(API + "/servers",{headers:{"Authorization":"Bearer "+token}});
  const data = await res.json();
  const list = document.getElementById("serverList");
  if(!list) return;
  if(data.servers && data.servers.length){
    list.innerHTML = data.servers.map(s=>`<div class="server-item"><strong>${s.name}</strong><div>${s.ram} RAM · ${s.cpu} CPU · ${s.slots} slots</div></div>`).join("");
  } else list.innerText = "No servers yet.";
}
document.addEventListener('DOMContentLoaded', ()=>{ fetchServers(); const cb = document.getElementById('createBtn'); if(cb) cb.onclick=createMockServer; });

async function createMockServer(){
  const token = localStorage.getItem("token");
  if(!token){ alert("Login first"); return; }
  const body = {name:"My Server " + Math.floor(Math.random()*1000), ram:"1GB",cpu:"1 vCPU",slots:10};
  const res = await fetch(API + "/servers",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(body)});
  const data = await res.json();
  alert(data.message || "Created");
  fetchServers();
}

async function serverAction(action){
  alert("Action '"+action+"' executed (mock).");
}
