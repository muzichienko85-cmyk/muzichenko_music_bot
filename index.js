import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('❌ BOT_TOKEN не знайдено у .env або Secrets');

const entryPoint = process.env.ENTRY_POINT
  ? JSON.parse(process.env.ENTRY_POINT)
  : { type: 'message', message: '/start' };

let nodes = [];
if (process.env.NODES) nodes = JSON.parse(process.env.NODES);
else nodes = JSON.parse(fs.readFileSync(path.join(process.cwd(),'config','nodes.json'),'utf8'));

const bot = new Telegraf(BOT_TOKEN);
const getNode = id => nodes.find(n => n.id === id);

bot.start(ctx => {
  const start = getNode('start');
  ctx.reply(start.message, {
    reply_markup: {
      inline_keyboard: (start.buttons || []).map(b => [{ text: b.text, callback_data: b.callback }])
    }
  });
});

bot.on('callback_query', ctx => {
  const id = ctx.callbackQuery.data;
  const node = getNode(id);
  if (!node) { ctx.answerCbQuery('Невідома дія'); return ctx.reply('⚠️ Невідома команда.'); }
  const kb = (node.buttons || []).map(b => [{ text: b.text, callback_data: b.callback }]);
  ctx.reply(node.message, { reply_markup: { inline_keyboard: kb } });
  ctx.answerCbQuery();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
bot.launch();
console.log('🤖 Muzichenko_music_bot запущено');
