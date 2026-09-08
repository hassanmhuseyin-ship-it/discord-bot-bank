/*
            ██╗    ██╗██╗ ██████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
            ██║    ██║██║██╔════╝██║ ██╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
            ██║ █╗ ██║██║██║     █████╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
            ██║███╗██║██║██║     ██╔═██╗     ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
            ╚███╔███╔╝██║╚██████╗██║  ██╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
             ╚══╝╚══╝ ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
             Wick® Studio | discord.gg/wicks
*/

require('dotenv').config();
const ms = require('ms');

module.exports = {
  token: process.env.DISCORD_BOT_TOKEN,
            
  // اوقات التجميد لكل امر
  cooldowns: {
    راتب: ms('1d'),
    حظ: ms('2h'),
    استثمار: ms('4h'),
    تداول: ms('4h'),
    قرض: ms('2h'),
    توب: ms('30s'),
    نرد: ms('4h'),
    قمار: ms('4h'),
    نهب: ms('4h'),
    حماية: ms('4h'),
    يومي: ms('2d'),
    شراء: ms('1m'),
    منازل: ms('1m'),
    شركات: ms('1m'),
    شراء_شركة: ms('1m'),
    بيع_شركة: ms('1m'),
  },

  startingSalary: 500,
  investmentMultiplier: 1.1,
  transferTaxRate: 0.20,
  gambleMultiplier: 1.5,
  rentInterval: ms('1h'),

  // إعدادات قائمة الأوامر
  commandsListTitle: '📜 قائمة الأوامر الخاصة بالبوت 📜',
  commandsListDescription: 'هذه هي جميع الأوامر المتاحة في البوت:',
  embedColor: '#00AAFF',

  // إعدادات قائمة أغنى الأشخاص بالسيرفر
  topPlayersLimit: 6,
  topPlayersTitle: '🏆 قائمة أغنى الأشخاص بالسرفر 🏆',
  topPlayersDescription: 'هؤلاء هم أغنى الأشخاص بالسرفر حسب رصيدهم الحالي:',
  topPlayersEmbedColor: '#FFD700',

  // إعدادات الحظ
  luckMinAmount: 500,
  luckMaxAmount: 2500,

  // إعدادات الحماية
  shieldMaxHours: 3,
  shieldCostPerHour: 500000,

  // الوظائف
  jobTitles: [
    { name: 'ملك', cost: 50000, salary: 5000 },
    { name: 'امير', cost: 45000, salary: 4500 },
    { name: 'طيار', cost: 40000, salary: 4000 },
    { name: 'قاضي', cost: 35000, salary: 3500 },
    { name: 'مبرمج', cost: 30000, salary: 3000 },
    { name: 'دكتور', cost: 30000, salary: 3000 },
    { name: 'مهندس', cost: 25000, salary: 2500 },
    { name: 'معلم', cost: 20000, salary: 2000 },
    { name: 'جندي', cost: 15000, salary: 1500 },
    { name: 'طباخ', cost: 10000, salary: 1000 },
    { name: 'رسام', cost: 8000, salary: 800 },
  ],

  pointsPerWin: 5,
  pointsPerLoss: -2,
  baseSalary: 10000,

  // قائمة المنازل المتاحة
  houses: [
    { price: 1000000, income: 200000, ownerId: null },
    { price: 1000000, income: 200000, ownerId: null },
    { price: 1000000, income: 200000, ownerId: null },
    { price: 1000000, income: 200000, ownerId: null },
    { price: 1000000, income: 200000, ownerId: null },
  ],
};
