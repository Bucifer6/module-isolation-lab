import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const secret=randomBytes(36).toString('hex');
const specs=[['provider/server.mjs',4301,{}],['consumer/server.mjs',4302,{PROVIDER_URL:'http://127.0.0.1:4301'}],['widget/server.mjs',4303,{}],['shell/server.mjs',4300,{WIDGET_URL:'http://127.0.0.1:4303'}]];
const children=specs.map(([file,port,extra])=>spawn(process.execPath,[file],{stdio:'inherit',env:{...process.env,LAB_SECRET:secret,PORT:String(port),...extra}}));
console.log('Synthetic shell: http://127.0.0.1:4300');
const stop=()=>{for(const c of children)c.kill('SIGTERM');process.exit(0);};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
