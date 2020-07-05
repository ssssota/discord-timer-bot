import DiscordBot from 'dbsc';
import ShellQuote from 'shell-quote';
import Discord from 'discord.js';

const bot = new DiscordBot(process.env.TOKEN || '');

bot.client.on('ready', () => console.log('i\'m ready.'));
bot.client.on('error', console.error);

const queue: NodeJS.Timeout[] = [];

bot.on('command', async (command, msg) => {
  if (msg.author.bot) return;
  const firstCommand = command.shift();
  if (typeof(firstCommand) === 'string' && firstCommand.startsWith('/t')) {
    command.map((timeText) => {
      if (typeof timeText !== 'string') return;
      if (timeText === 'clear') {
        queue.map(timeoutId => {
          if (!timeoutId) return;
          clearTimeout(timeoutId);
        });
        queue.length = 0;
        msg.channel.send('💥 Cleared');
      }
      const times = timeText.match(/(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)m)?(?:(?<seconds>\d+)s)?/i);
      const time = (((Number(times?.groups?.hours) || 0) * 60 + (Number(times?.groups?.minutes) || 0)) * 60 + (Number(times?.groups?.seconds) || 0)) * 1000;
      if (time === 0) return;
      msg.channel.send(`🕐 Start ${timeText} timer`);
      queue.push(setTimeout(() => {
        msg.channel.send(`🔔 ${timeText} passed`);
      }, time));
    })
  }
});
bot.run();