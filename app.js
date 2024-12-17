const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");
const beautify = require("js-beautify").html;

const SRC_PATH = path.join(__dirname, 'src');
const DIST_PATH = path.join(__dirname, "RU-UZ")
const RU_PATH = path.join(SRC_PATH, 'RU');
const UZ_PATH = path.join(SRC_PATH, 'UZ');
const RU_UZ_PATH = path.join(DIST_PATH, 'chapters');
const MK_PATH = path.join(SRC_PATH, "MK-kito");

const UZ_CHAPTERS_NAME = [
    "Ibtido",
    "Chiqish",
    "Levilar",
    "Sahroda",
    "Qonunlar",
    "Yoshua",
    "Hakamlar",
    "Rut",
    "Shohlar (birinchi kitob)",
    "Shohlar (ikkinchi kitob)",
    "Shohlar (uchinchi kitob)",
    "Shohlar (to‘rtinchi kitob)",
    "Solnomalar (birinchi kitob)",
    "Solnomalar (ikkinchi kitob)",
    "Ezra",
    "Naximiyo",
    "Ester",
    "Ayub",
    "Zabur",
    "Sulaymonning hikmatlari",
    "Voiz",
    "Sulaymonning go‘zal qo‘shig‘i",
    "Ishayo",
    "Yeremiyo",
    "Yeremiyoning marsiyasi",
    "Hizqiyo",
    "Doniyor",
    "Xo‘sheya",
    "Yo‘el",
    "Amos",
    "Obodiyo",
    "Yunus",
    "Mixo",
    "Noxum",
    "Xabaqquq",
    "Zafaniyo",
    "Xaggey",
    "Zakariyo",
    "Malaki",
    "Matto Muqaddas xushxabar",
    "Mark Muqaddas xushxabar",
    "Luqo Muqaddas xushxabar",
    "Yuhanno Muqaddas xushxabar",
    "Havoriylarning faoliyati",
    "Yoqubning maktubi",
    "Butrusning birinchi maktubi",
    "Butrusning ikkinchi maktubi",
    "Yuhannoning birinchi maktubi",
    "Yuhannoning ikkinchi maktubi",
    "Yuhannoning uchinchi maktubi",
    "Yahudoning maktubi",
    "Rimliklarga maktub",
    "Korinfliklarga birinchi maktub",
    "Korinfliklarga ikkinchi maktub",
    "Galatiyaliklarga maktub",
    "Efesliklarga maktub",
    "Filippiliklarga maktub",
    "Kolosaliklarga maktub",
    "Salonikaliklarga birinchi maktub",
    "Salonikaliklarga ikkinchi maktub",
    "Timo‘tiyga birinchi maktub",
    "Timo‘tiyga ikkinchi maktub",
    "Titusga maktub",
    "Filimo‘nga maktub",
    "Ibroniylarga maktub",
    "Yuhannoga ko‘rsatilgan vahiy"
]

const RU_CHAPTERS_NAME = [
    "Бытие",
    "Исход",
    "Левит",
    "Числа",
    "Второзаконие",
    "Иисус Навин",
    "Судьи",
    "Руфь",
    "1 Царств",
    "2 Царств",
    "3 Царств",
    "4 Царств",
    "1 Паралипоменон",
    "2 Паралипоменон",
    "Ездра",
    "Неемия",
    "Есфирь",
    "Иов",
    "Псалтирь",
    "Притчи",
    "Екклесиаст",
    "Песня Песней",
    "Исаия",
    "Иеремия",
    "Плач Иеремии",
    "Иезекииль",
    "Даниил",
    "Осия",
    "Иоиль",
    "Амос",
    "Авдий",
    "Иона",
    "Михей",
    "Наум",
    "Аввакум",
    "Софония",
    "Аггей",
    "Захария",
    "Малахия",
    "От Матфея",
    "От Марка",
    "От Луки",
    "От Иоанна",
    "Деяния",
    "Иакова",
    "1 Петра",
    "2 Петра",
    "1 Иоанна",
    "2 Иоанна",
    "3 Иоанна",
    "Иуды",
    "Римлянам",
    "1 Коринфянам",
    "2 Коринфянам",
    "Галатам",
    "Ефесянам",
    "Филиппийцам",
    "Колоссянам",
    "1 Фессалоникийцам",
    "2 Фессалоникийцам",
    "1 Тимофею",
    "2 Тимофею",
    "Титу",
    "Филимону",
    "Евреям",
    "Откровение",
]

