const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Altınbaş Üniversitesi duyurular sayfasından veri çekme
async function scrapeAnnouncements() {
    try {
        const { data } = await axios.get('https://www.altinbas.edu.tr/tr/duyurular');
        const $ = cheerio.load(data);
        let announcements = [];

        $('.announcement-item').each((index, element) => {
            const title = $(element).find('.announcement-title').text().trim();
            const date = $(element).find('.announcement-date').text().trim();
            const link = $(element).find('a').attr('href');
            announcements.push({ title, date, link: `https://www.altinbas.edu.tr${link}` });
        });

        return announcements;
    } catch (error) {
        console.error('Error scraping announcements:', error);
        return [];
    }
}

// Yönetmelikler sayfasından veri çekme
async function scrapeRegulations() {
    try {
        const { data } = await axios.get('https://www.altinbas.edu.tr/tr/yonetmelikler');
        const $ = cheerio.load(data);
        let regulations = [];

        $('.regulation-item').each((index, element) => {
            const title = $(element).find('.regulation-title').text().trim();
            const link = $(element).find('a').attr('href');
            regulations.push({ title, link: `https://www.altinbas.edu.tr${link}` });
        });

        return regulations;
    } catch (error) {
        console.error('Error scraping regulations:', error);
        return [];
    }
}

// Bot komutları
bot.start((ctx) => ctx.reply('Merhaba! Altınbaş Üniversitesi duyuruları ve yönetmelikleri için buradayım. Komutlar:\n/duyurular - Son duyuruları göster\n/yonetmelikler - Yönetmelikleri listele'));

bot.command('duyurular', async (ctx) => {
    const announcements = await scrapeAnnouncements();
    if (announcements.length === 0) {
        ctx.reply('Duyuru bulunamadı.');
        return;
    }

    let response = 'Son Duyurular:\n';
    announcements.slice(0, 5).forEach((ann, index) => {
        response += `${index + 1}. ${ann.title} (${ann.date})\nLink: ${ann.link}\n\n`;
    });
    ctx.reply(response);
});

bot.command('yonetmelikler', async (ctx) => {
    const regulations = await scrapeRegulations();
    if (regulations.length === 0) {
        ctx.reply('Yönetmelik bulunamadı.');
        return;
    }

    let response = 'Yönetmelikler:\n';
    regulations.slice(0, 5).forEach((reg, index) => {
        response += `${index + 1}. ${reg.title}\nLink: ${reg.link}\n\n`;
    });
    ctx.reply(response);
});

// Express server
app.get('/', (ctx) => {
    ctx.send('Altınbaş Üniversitesi Chatbot Sunucusu');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Botu başlat
bot.launch();
console.log('Bot is running...');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));