/*
Simple Express backend (mock). Stores users & servers in db.json.
JWT authentication for signup/login.
This is a development/demo server — do NOT use in production without hardening.
*/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const DB = './db.json';
const SECRET = 'change_this_secret_in_production';

app.use(cors());
app.use(bodyParser.json());

async function readDB(){ try{ const raw = await fs.readFile(DB,'utf8'); return JSON.parse(raw);}catch(e){return {users:[],servers:[]};}}
async function writeDB(obj){ await fs.writeFile(DB, JSON.stringify(obj,null,2),'utf8'); }

app.post('/auth/signup', async (req,res)=>{
  const {username,email,password} = req.body;
  if(!email || !password) return res.json({message:"email and password required"});
  const db = await readDB();
  if(db.users.find(u=>u.email===email)) return res.json({message:"User exists"});
  const user = {id:Date.now(),username,email,password};
  db.users.push(user);
  await writeDB(db);
  res.json({message:"Signup successful"});
});

app.post('/auth/login', async (req,res)=>{
  const {email,password} = req.body;
  const db = await readDB();
  const user = db.users.find(u=>u.email===email && u.password===password);
  if(!user) return res.json({message:"Invalid credentials"});
  const token = jwt.sign({id:user.id,email:user.email},SECRET,{expiresIn:'7d'});
  res.json({token});
});

// Protected endpoints
function authMiddleware(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({message:"Missing token"});
  const token = header.split(' ')[1];
  try{ const p = jwt.verify(token,SECRET); req.user = p; next(); }catch(e){ return res.status(401).json({message:"Invalid token"}); }
}

app.get('/servers', authMiddleware, async (req,res)=>{
  const db = await readDB();
  const servers = db.servers.filter(s=>s.ownerId===req.user.id);
  res.json({servers});
});

app.post('/servers', authMiddleware, async (req,res)=>{
  const db = await readDB();
  const s = {id:Date.now(), ownerId:req.user.id, name:req.body.name||'Server', ram:req.body.ram||'1GB', cpu:req.body.cpu||'1 vCPU', slots:req.body.slots||10, status:'stopped'};
  db.servers.push(s);
  await writeDB(db);
  res.json({message:'server created', server:s});
});

// Admin endpoints (simple)
app.get('/admin/stats', async (req,res)=>{ const db = await readDB(); res.json({users:db.users.length, servers:db.servers.length}); });

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend listening on',PORT));
