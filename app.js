const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");
const beautify = require("js-beautify").html;

const SRC_PATH = path.join(__dirname, 'src');
const RU_PATH = path.join(SRC_PATH, 'RU');
const UZ_PATH = path.join(SRC_PATH, 'UZ');
const RU_UZ_PATH = path.join(__dirname, 'RU-UZ', 'chapters');

const MK_PATH = path.join(__dirname, "MK-kito");


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

const createIFrameHTML = (ruPath, uzPath, mkPath, prevLink, nextLink, chapterIndex, verseIndex) => `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../../bulma.min.css">
        <link rel="stylesheet" href="../../style.css">
        <title>${path.basename(ruPath)}</title>
    </head>
    <body>
        <div class="wrapper">
            <div class="row">
                <div class="chapter_item">
                    <h2 class="title is-3" >Русский с комментариями</h2>
                    <iframe id="chapter_iframe_ru" style="height:100%;width:100%;" src="${ruPath}" frameborder="0"></iframe>
                </div>
                <div class="chapter_item">
                    <h2 class="title is-3" >UZBEK (google translate)</h2>
                    <iframe id="chapter_iframe_uz" style="height:100%;width:100%;" src="${uzPath}" frameborder="0"></iframe>
                </div>
                ${mkPath ? `
                    <div class="chapter_item">
                        <h2 class="title is-3" >Uzbek Kitobook</h2>
                        <iframe id="mk_book_iframe" style="height:100%;width:100%;" src="${mkPath}" frameborder="0"></iframe>
                    </div>  
                    ` : ""}
            </div>
            
            <div class="container">
                <nav class="prev_next__links">
                    ${prevLink ? `<a class="button is-info is-medium" href="${prevLink}">← Previous</a>`: '' }
                    ${nextLink ? `<a class="button is-info is-medium" href="${nextLink}">Next →</a>`: '' }
                </nav>
            </div>

            <div class="book_list">
                <div class="container">
                    <div class="listing">
                        <h3 class="title">Новый Завет</h3>
                        <div class="listing-main">
                            <div><a href="./../40/00.html">От Матфея</a></div>
                            <div><a href="./../41/00.html">От Марка</a></div>
                            <div><a href="./../42/00.html">От Луки</a></div>
                            <div><a href="./../43/00.html">От Иоанна</a></div>
                            <div><a href="./../44/00.html">Деяния апостолов</a></div>
                            <div><a href="./../45/00.html">Иакова</a></div>
                            <div><a href="./../46/00.html">1 Петра</a></div>
                            <div><a href="./../47/00.html">2 Петра</a></div>
                            <div><a href="./../48/00.html">1 Иоанна</a></div>
                            <div><a href="./../49/00.html">2 Иоанна</a></div>
                            <div><a href="./../50/00.html">3 Иоанна</a></div>
                            <div><a href="./../51/00.html">Иуды</a></div>
                            <div><a href="./../52/00.html">Римлянам</a></div>
                            <div><a href="./../53/00.html">1 Коринфянам</a></div>
                            <div><a href="./../54/00.html">2 Коринфянам</a></div>
                            <div><a href="./../55/00.html">Галатам</a></div>
                            <div><a href="./../56/00.html">Ефесянам</a></div>
                            <div><a href="./../57/00.html">Филиппийцам</a></div>
                            <div><a href="./../58/00.html">Колоссянам</a></div>
                            <div><a href="./../59/00.html">1 Фессалоникийцам</a></div>
                            <div><a href="./../60/00.html">2 Фессалоникийцам</a></div>
                            <div><a href="./../61/00.html">1 Тимофею</a></div>
                            <div><a href="./../62/00.html">2 Тимофею</a></div>
                            <div><a href="./../63/00.html">Титу</a></div>
                            <div><a href="./../64/00.html">Филимону</a></div>
                            <div><a href="./../65/00.html">Евреям</a></div>
                            <div><a href="./../66/00.html">Откровение</a></div>
                        </div>
                    </div>
                    <div class="listing">
                        <h3 class="title">Ветхий Завет</h3>
                        <div class="listing-main listing-second">
                            <div><a href="./../01/00.html">Бытие</a></div>
                            <div><a href="./../02/00.html">Исход</a></div>
                            <div><a href="./../03/00.html">Левит</a></div>
                            <div><a href="./../04/00.html">Числа</a></div>
                            <div><a href="./../05/00.html">Второзаконие</a></div>
                            <div><a href="./../06/00.html">Иисус Навин</a></div>
                            <div><a href="./../07/00.html">Судьи</a></div>
                            <div><a href="./../08/00.html">Руфь</a></div>
                            <div><a href="./../09/00.html">1 Царств</a></div>
                            <div><a href="./../10/00.html">2 Царств</a></div>
                            <div><a href="./../11/00.html">3 Царств</a></div>
                            <div><a href="./../12/00.html">4 Царств</a></div>
                            <div><a href="./../13/00.html">1 Паралипоменон</a></div>
                            <div><a href="./../14/00.html">2 Паралипоменон</a></div>
                            <div><a href="./../15/00.html">Ездра</a></div>
                            <div><a href="./../16/00.html">Неемия</a></div>
                            <div><a href="./../17/00.html">Есфирь</a></div>
                            <div><a href="./../18/00.html">Иов</a></div>
                            <div><a href="./../19/00.html">Псалтирь</a></div>
                            <div><a href="./../20/00.html">Притчи</a></div>
                            <div><a href="./../21/00.html">Екклесиаст</a></div>
                            <div><a href="./../22/00.html">Песни Песней</a></div>
                            <div><a href="./../23/00.html">Исаия</a></div>
                            <div><a href="./../24/00.html">Иеремия</a></div>
                            <div><a href="./../25/00.html">Плач Иеремии</a></div>
                            <div><a href="./../26/00.html">Иезекииль</a></div>
                            <div><a href="./../27/00.html">Даниил</a></div>
                            <div><a href="./../28/00.html">Осия</a></div>
                            <div><a href="./../29/00.html">Иоиль</a></div>
                            <div><a href="./../30/00.html">Амос</a></div>
                            <div><a href="./../31/00.html">Авдий</a></div>
                            <div><a href="./../32/00.html">Иона</a></div>
                            <div><a href="./../33/00.html">Михей</a></div>
                            <div><a href="./../34/00.html">Наум</a></div>
                            <div><a href="./../35/00.html">Аввакум</a></div>
                            <div><a href="./../36/00.html">Софония</a></div>
                            <div><a href="./../37/00.html">Аггей</a></div>
                            <div><a href="./../38/00.html">Захария</a></div>
                            <div><a href="./../39/00.html">Малахия</a></div>
                        </div>
                    </div>
                </div>
            </div><div class="book_list">
            </div>
            <div class="container">
                <h1 class="title is-3 has-text-centered" >Комментарии к библии МакДональда на Узбекском языке.</h1>
                <h2 class="title is-3 has-text-centered" >MakDonald Injiliga o'zbek tilida sharhlar.</h2>
            </div>


        </div>
        <script src="../../index.js"></script>
        </body>
    </html>`;


async function fetchChapterFromURL(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(response.ok);
            throw new Error(`Ошибка при загрузке: ${response.status}`);
        }

        const text = await response.text();
        const parser = new JSDOM(text);
        const doc = parser.window.document;

        const element = doc.querySelectorAll(`.pager`)[1].previousElementSibling;

        if (!element) {
            let err = url.replace(MK_PATH, "");
            throw new Error(`Элемент в главе "${err}" не найден.`);
        }

        const prefixLink = "https://www.kitobook.com";
        element.querySelectorAll('a').forEach(link => {
            if (link.href) {
                link.href = prefixLink + link.href;
            }
        });

        const formattedHTML = beautify(element.outerHTML, {
            indent_size: 2,
            space_in_empty_paren: true
        });


        return formattedHTML;
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
}



function removeEmandSpanHTML(uzVersePath) {
    if (!fs.existsSync(uzVersePath)) {
        console.error(`Файл по пути ${uzVersePath} не найден.`);
        return;
    }

    fs.readFile(uzVersePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Ошибка при чтении файла: ${err.message}`);
            return;
        }

        const cleanedHtml = data
            .replace(/<em[^>]*>/gi, '')
            .replace(/<\/em>/gi, '')
            .replace(/<span[^>]*>/gi, '')
            .replace(/<\/span>/gi, '');

        fs.writeFile(uzVersePath, cleanedHtml, 'utf8', (err) => {
            if (err) {
                console.error(`Ошибка при записи файла: ${err.message}`);
            }
        });

        return cleanedHtml;
    });
}

// Функция для обработки глав
const processChapters = () => {
    // Создаем папку RU-UZ, если ее нет
    if (!fs.existsSync(RU_UZ_PATH)) {
        fs.mkdirSync(RU_UZ_PATH);
    }

    // Считываем все главы из RU
    const chapters = fs.readdirSync(RU_PATH).filter((item) =>
        fs.statSync(path.join(RU_PATH, item)).isDirectory()
    );

    for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
        const chapter = chapters[chapterIndex];
        const ruChapterPath = path.join(RU_PATH, chapter);
        const uzChapterPath = path.join(UZ_PATH, chapter);
        const ruUzChapterPath = path.join(RU_UZ_PATH, chapter);

        // Создаем папку для главы в RU-UZ
        if (!fs.existsSync(ruUzChapterPath)) {
            fs.mkdirSync(ruUzChapterPath);
        }

        // Обрабатываем стихи внутри главы
        const verses = fs.readdirSync(ruChapterPath).filter((file) =>
            file.endsWith('.html')
        );

        

        for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
            const verse = verses[verseIndex];
            const ruVersePath = path.join(ruChapterPath, verse);
            const uzVersePath = path.join(uzChapterPath, verse);
            const ruUzVersePath = path.join(ruUzChapterPath, verse);
            const mkVersePath = path.join(MK_PATH, chapter, verse);

            // Проверяем, существует ли соответствующий файл в UZ
            if (fs.existsSync(uzVersePath)) {
                const relativeRuPath = path.relative(
                    path.dirname(ruUzVersePath),
                    ruVersePath
                );
                const relativeUzPath = path.relative(
                    path.dirname(ruUzVersePath),
                    uzVersePath
                );

                const relativeMkPath = verseIndex == 0 ? null : path.relative(
                    path.dirname(ruUzVersePath),
                    mkVersePath
                );

                // Определяем ссылки на предыдущий и следующий стих
                const prevLink =
                    verseIndex > 0
                        ? `./${verses[verseIndex - 1]}`
                        : chapterIndex > 0
                        ? `../${chapters[chapterIndex - 1]}/${fs
                              .readdirSync(
                                  path.join(RU_PATH, chapters[chapterIndex - 1])
                              )
                              .filter((file) => file.endsWith('.html'))
                              .pop()}`
                        : null;

                const nextLink =
                    verseIndex < verses.length - 1
                        ? `./${verses[verseIndex + 1]}`
                        : chapterIndex < chapters.length - 1
                        ? `../${chapters[chapterIndex + 1]}/${fs
                              .readdirSync(
                                  path.join(RU_PATH, chapters[chapterIndex + 1])
                              )
                              .filter((file) => file.endsWith('.html'))[0]}`
                        : null;

                // Генерируем HTML с iframe и сохраняем
                const combinedHTML = createIFrameHTML(relativeRuPath, relativeUzPath, relativeMkPath, prevLink, nextLink, chapterIndex, verseIndex);
                // removeEmandSpanHTML(uzVersePath)
                fs.writeFileSync(ruUzVersePath, combinedHTML, 'utf8');
            } else {
                console.warn(`Файл отсутствует: ${uzVersePath}`);
            }
        }
    }

    console.log('Генерация завершена!');
    // console.log('Удаление тегов завершено!');
};

const loadMK = () => {
    const MAIN_LINK = "https://www.kitobook.com/category/book/muqaddas-kitob-injil";

    if (!fs.existsSync(MK_PATH)) {
        fs.mkdirSync(MK_PATH);
    }
    const chapters = fs.readdirSync(UZ_PATH).filter((item) =>
        fs.statSync(path.join(UZ_PATH, item)).isDirectory()
    );

    for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
        const chapter = chapters[chapterIndex];
        const ChapterPath = path.join(MK_PATH, chapter);
        const uzVersesPath = path.join(UZ_PATH, chapter)
        const verses = fs.readdirSync(uzVersesPath).filter((file) => file.endsWith('.html'));


        // Создаем папку для главы в RU-UZ
        if (!fs.existsSync(ChapterPath)) {
            fs.mkdirSync(ChapterPath);
        }

        for (let verseIndex = 1; verseIndex < verses.length; verseIndex++) {
            const verse = verses[verseIndex];
            const versePath = path.join(MAIN_LINK, chapter, verse.replace(".html", ""));
            const distVerse = path.join(MK_PATH, chapter, verse);

            if (fs.existsSync(distVerse)) continue;
            
            // Пример использования
            fetchChapterFromURL(versePath)
            .then(element => {
                if (element) {
                    fs.writeFileSync(distVerse, element, 'utf8');
                } else {
                    console.log('Элемент не найден.');
                }
            });
        }
    }
};


// Запускаем процесс копирования и обработки
processChapters();
// Load kitobook Muqaddas Kitob
// loadMK();
