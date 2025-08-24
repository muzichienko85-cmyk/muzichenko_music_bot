import fs from 'fs'; import path from 'path';
const file = path.join(process.cwd(),'config','nodes.json');
const raw = fs.readFileSync(file,'utf8'); let nodes;
try { nodes = JSON.parse(raw); } catch { console.error('❌ nodes.json не валідний'); process.exit(1); }
if (!Array.isArray(nodes)) { console.error('❌ nodes має бути масивом'); process.exit(1); }
for (const n of nodes) for (const k of ['id','type','name','message']) if (!(k in n)) {
  console.error(`❌ ${n.id||'?'}: відсутній ${k}`); process.exit(1);
}
console.log('✅ nodes.json валідний');
