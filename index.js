const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { QuickDB } = require('quick.db');
const path = require('path');
const fs = require('fs');

const config = require('./config.js');
const cooldownUtil = require('./src/utils/cooldown.js');
const companies = require('./src/commands/companiesData');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],

    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

const db = new QuickDB();


// ================================
// تحميل الأوامر
// ================================

client.commands = new Map();

const commandsPath = path.join(__dirname, 'src', 'commands');

try {
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (!command || !command.name || typeof command.execute !== 'function') {
                console.warn(`⚠️ تم تجاهل الملف ${file} لأنه ليس أمرًا صالحًا.`);
                continue;
            }

            client.commands.set(command.name, command);

            console.log(`✅ تم تحميل الأمر: ${command.name}`);

        } catch (error) {
            console.error(`❌ خطأ في تحميل الأمر ${file}:`, error);
        }
    }

} catch (error) {
    console.error('❌ تعذر قراءة مجلد الأوامر:', error);
}


// ================================
// عند تشغيل البوت
// ================================

client.once('ready', async () => {
    try {

        // تحميل بيانات الشركات من قاعدة البيانات
        for (const company of companies) {

            company.owner =
                await db.get(`company_${company.id}_owner`) || null;

            company.price =
                await db.get(`company_${company.id}_price`) || company.price;
        }


        // شعار البوت
        console.log(`
            ██╗    ██╗██╗ ██████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
            ██║    ██║██║██╔════╝██║ ██╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
            ██║ █╗ ██║██║██║     █████╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
            ██║███╗██║██║██║     ██╔═██╗     ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
            ╚███╔███╔╝██║╚██████╗██║  ██╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
             ╚══╝╚══╝ ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
        `);

        console.log(`🤖 Bot is Ready! ${client.user.tag}`);
        console.log(`📦 Commands Loaded: ${client.commands.size}`);
        console.log(`💾 Database: QuickDB`);
        console.log(`⚙️ Environment: ${process.env.ENVIRONMENT || 'development'}`);
        console.log(`🚀 System started successfully!`);

    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});


// ================================
// استقبال الأوامر
// ================================

client.on('messageCreate', async message => {

    // تجاهل البوتات
    if (message.author.bot) return;


    // التأكد من أن الأمر داخل الروم المسموح
    if (
        config.allowedChannelId &&
        message.channel.id !== config.allowedChannelId
    ) {
        return;
    }


    // التأكد من وجود محتوى
    if (!message.content || !message.content.trim()) {
        return;
    }


    // تقسيم الرسالة
    const args = message.content.trim().split(/\s+/);

    const commandName = args.shift();

    if (!commandName) return;


    console.log(
        `📩 Command: "${commandName}" | User: ${message.author.tag}`
    );


    // البحث عن الأمر
    if (!client.commands.has(commandName)) {
        return;
    }


    const command = client.commands.get(commandName);


    // ================================
    // نظام Cooldown
    // ================================

    if (
        command.name &&
        config.cooldowns &&
        config.cooldowns[command.name] &&
        cooldownUtil.isInCooldown(
            command.name,
            message.author.id,
            config
        )
    ) {

        return message.reply(
            `⏳ يرجى الانتظار قبل استخدام أمر **${command.name}** مرة أخرى.`
        );
    }


    // ================================
    // تنفيذ الأمر
    // ================================

    try {

        await command.execute(
            message,
            db,
            config,
            args
        );


        // تسجيل الـ Cooldown بعد نجاح الأمر
        if (
            command.name &&
            config.cooldowns &&
            config.cooldowns[command.name]
        ) {

            cooldownUtil.setCooldown(
                command.name,
                message.author.id,
                config.cooldowns[command.name]
            );
        }


    } catch (error) {

        console.error(
            `❌ Error executing command ${command.name}:`,
            error
        );

        try {

            if (!message.replied && !message.deferred) {

                await message.reply(
                    '❌ حدث خطأ أثناء تنفيذ هذا الأمر.'
                );

            }

        } catch (replyError) {

            console.error(
                '❌ Failed to send error message:',
                replyError
            );
        }
    }
});


// ================================
// تسجيل الدخول
// ================================

if (!config.token) {

    console.error(
        '❌ DISCORD_BOT_TOKEN غير موجود!'
    );

    console.error(
        '📌 أضف التوكن في ملف .env بهذا الشكل:'
    );

    console.error(
        'DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN'
    );

    process.exit(1);
}


client.login(config.token)
    .then(() => {
        console.log('🔐 جاري تسجيل دخول البوت...');
    })
    .catch(error => {

        console.error(
            '❌ فشل تسجيل دخول البوت:',
            error
        );

        process.exit(1);
    });


// ================================
// معالجة الأخطاء العامة
// ================================

process.on('unhandledRejection', error => {
    console.error(
        '❌ Unhandled Promise Rejection:',
        error
    );
});


process.on('uncaughtException', error => {
    console.error(
        '❌ Uncaught Exception:',
        error
    );
});
