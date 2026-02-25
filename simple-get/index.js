const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Path ke background
const backgroundPath = path.join(__dirname, 'assets', 'welcome-bg.jpg');

client.on('ready', () => {
    console.log(`Bot siap! Logged in sebagai ${client.user.tag}`);
});

client.on('guildMemberAdd', async member => {
    // -----------------------
    // 1️⃣ Kirim teks welcome di general
    // -----------------------
    const generalChannel = member.guild.channels.cache.get('1452775480120840265');
    if (generalChannel) {
        generalChannel.send(`🎉 Selamat datang, ${member}! Semoga betah di server ini!`);
    }

    // -----------------------
    // 2️⃣ Buat gambar avatar
    // -----------------------
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Load background
    const background = await Canvas.loadImage(backgroundPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Tambah teks username di gambar
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillText(member.user.username, 200, 100);

    // Load avatar
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.restore();

    // Tambah frame glowing
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#00ffea';
    ctx.shadowColor = '#00ffea';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Buat attachment
    const attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'welcome-image.png' });

    // -----------------------
    // 3️⃣ Kirim gambar ke channel khusus avatar
    // -----------------------
    const imageChannel = member.guild.channels.cache.get('1476123926613725246');
    if (imageChannel) {
        imageChannel.send({ content: `📸 Avatar baru masuk!`, files: [attachment] });
    }
});

// Login pakai env variable BOT_TOKEN (lebih aman untuk deploy)
client.login(process.env.BOT_TOKEN);