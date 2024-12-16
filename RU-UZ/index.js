const iframeRU = document.getElementById('chapter_iframe_ru');
const iframeUZ = document.getElementById('chapter_iframe_uz');
const iframeBookList = document.getElementById('book_list');
const iframeMkBook = document.getElementById('mk_book_iframe');

document.addEventListener('DOMContentLoaded', () => {
    let dataActiveChapter = document.querySelector("[data-active-chapter]");
    let bookOrder = +dataActiveChapter.getAttribute("data-active-chapter");
    console.log(bookOrder);
    let activeChapter = dataActiveChapter.querySelectorAll("a")[bookOrder - 1];
    activeChapter.classList.add("is-active");

    // document.title = 

});




iframeRU.onload = function () {
    iframeRU.style.height = iframeRU.contentWindow.document.body.scrollHeight + 'px';
};
iframeUZ.onload = function () {
    iframeUZ.style.height = iframeUZ.contentWindow.document.body.scrollHeight + 'px';
    attachHoverHandler(iframeRU, iframeUZ);
};

if (iframeMkBook) {
    iframeMkBook.onload = function () {
        iframeMkBook.style.height = iframeMkBook.contentWindow.document.body.scrollHeight + 'px';
        iframeMkBook.contentWindow.document.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const url = event.target.href;
                window.top.location.href = url;
            }
        });
    }
}

function attachHoverHandler(iframe1, iframe2) {
    const doc1 = iframe1.contentWindow.document;
    const doc2 = iframe2.contentWindow.document;

    addHighlightStyle(doc1);
    addHighlightStyle(doc2);

    doc1.addEventListener("mouseover", (event) => {
        let element = event.target;

        if (element.parentElement !== doc1.body) {
            return;
        };

        const elementIndex = getElementIndex(element);
        const matchingElement = findMatchingElementByIndex(doc2, elementIndex);

        if (matchingElement) {
            highlightElement(element);
            highlightElement(matchingElement);
        }
    });

    doc1.addEventListener("mouseout", (event) => {
        const element = event.target;

        if (element.parentElement !== doc1.body) return;

        const elementIndex = getElementIndex(element);
        const matchingElement = findMatchingElementByIndex(doc2, elementIndex);

        if (matchingElement) {
            setTimeout(() => {
                unhighlightElement(element);
                unhighlightElement(matchingElement);
            }, 10);
        }
    });
}
function highlightElement(element) {
    if (element) {
        element.classList.add("highlight");
    }
}
function unhighlightElement(element) {
    if (element) {
        element.classList.remove("highlight");
    }
}

function getElementIndex(element) {
    const parent = element.parentElement;
    if (!parent) return -1; // Убедимся, что элемент имеет родителя
    return Array.from(parent.children).indexOf(element);
}

function findMatchingElementByIndex(iframe2Doc, elementIndex) {
    const elements = iframe2Doc.body.children; // Берем только прямых детей <body>
    if (elementIndex >= 0 && elementIndex < elements.length) {
        return elements[elementIndex];
    }
    return null; // Если индекс выходит за пределы
}

// Получить путь элемента в DOM
function getElementPath(element) {
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.previousElementSibling) {
            let sibling = element.previousElementSibling;
            let index = 1;
            while (sibling) {
                if (sibling.nodeName === element.nodeName) {
                    index++;
                }
                sibling = sibling.previousElementSibling;
            }
            selector += `:nth-of-type(${index})`;
        }
        path.unshift(selector);
        element = element.parentElement;
    }
    return path.join(" > ");
}

// Найти элемент в другом документе по пути
function getElementByPath(doc, path) {
    try {
        return doc.querySelector(path);
    } catch {
        return null;
    }
}

// Подсветка элемента 
function addHighlightStyle(doc) {
    const style = doc.createElement('style');
    style.textContent = `
        .highlight {
            background-color: #FDEDB8 !important; 
        }
    `;
    doc.head.appendChild(style);
}

// Проверка, что элемент подходящий
function isValidElement(element) {
    if (!element) return false; // Если элемента нет
    const invalidTags = ['html', 'body', 'iframe']; // Нежелательные теги
    return !invalidTags.includes(element.tagName.toLowerCase());
}

// Проверка, что элемент — дочерний для <body>
function isDirectChildOfBody(element, doc) {
    return element.parentElement === doc.body;
}




// ======================================================================
// ......................................................................
// ......................................................................
// ............................... POPUP ................................
// ......................................................................
// ......................................................................
// ======================================================================

// Вспомогательные модули блокировки прокрутки и скочка ====================================================================================================================================================================================================================================================================================
let bodyLockStatus = true;
let bodyLockToggle = (delay = 0) => {
    if (document.documentElement.classList.contains('lock')) {
        bodyUnlock(delay);
    } else {
        bodyLock(delay);
    }
}
let bodyUnlock = (delay = 0) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = '0px';
            }
            body.style.paddingRight = '0px';
            document.documentElement.classList.remove("lock");
        }, delay);
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
}
let bodyLock = (delay = 100) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
        }
        body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
        document.documentElement.classList.add("lock");

        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
}

// Класс Popup
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            // Для кнопок 
            attributeOpenButton: 'data-popup', // Атрибут для кнопки, которая вызывает попап
            attributeCloseButton: 'data-close', // Атрибут для кнопки, которая закрывает попап
            // Для сторонних объектов
            fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (которые fixed)
            // Для объекта попапа
            youtubeAttribute: 'data-popup-youtube', // Атрибут для кода youtube
            youtubePlaceAttribute: 'data-popup-youtube-place', // Атрибут для вставки ролика youtube
            setAutoplayYoutube: true,
            // Изменение классов
            classes: {
                popup: 'popup',
                // popupWrapper: 'popup__wrapper',
                popupContent: 'popup__content',
                popupActive: 'is-active', // Добавляется для попапа, когда он открывается
                bodyActive: 'popup-show', // Добавляется для боди, когда попап открыт
            },
            focusCatch: true, // Фокус внутри попапа зациклен
            closeEsc: true, // Закрытие по ESC
            bodyLock: true, // Блокировка скролла
            hashSettings: {
                location: false, // Хэш в адресной строке
                goHash: true, // Переход по наличию в адресной строке
            },
            on: { // События
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { },
            },
        }
        this.youTubeCode;
        this.isOpen = false;
        // Текущее окно
        this.targetOpen = {
            selector: false,
            element: false,
        }
        // Предыдущее открытое
        this.previousOpen = {
            selector: false,
            element: false,
        }
        // Последнее закрытое
        this.lastClosed = {
            selector: false,
            element: false,
        }
        this._dataValue = false;
        this.hash = false;

        this._reopen = false;
        this._selectorOpen = false;

        this.lastFocusEl = false;
        this._focusEl = [
            'a[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'area[href]',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];
        //this.options = Object.assign(config, options);
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes,
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings,
            },
            on: {
                ...config.on,
                ...options?.on,
            }
        }
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null
    }
    initPopups() {
        this.popupLogging(`Проснулся`);
        this.eventsPopup();
    }
    eventsPopup() {
        // Клик на всем документе
        document.addEventListener("click", function (e) {
            // Клик по кнопке "открыть"
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ?
                    buttonOpen.getAttribute(this.options.attributeOpenButton) :
                    'error';
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ?
                    buttonOpen.getAttribute(this.options.youtubeAttribute) :
                    null;
                if (this._dataValue !== 'error') {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;

                } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);

                return;
            }
            // Закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        // Закрытие по ESC
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this))

        // Открытие по хешу
        if (this.options.hashSettings.goHash) {
            // Проверка изменения адресной строки
            window.addEventListener('hashchange', function () {
                if (window.location.hash) {
                    this._openToHash();
                } else {
                    this.close(this.targetOpen.selector);
                }
            }.bind(this))

            window.addEventListener('load', function () {
                if (window.location.hash) {
                    this._openToHash();
                }
            }.bind(this))
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            // Если перед открытием попапа был режим lock
            this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;

            // Если ввести значение селектора (селектор настраивается в options)
            if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;

            this.targetOpen.element = document.querySelector(this.targetOpen.selector);

            if (this.targetOpen.element) {
                // YouTube
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('allowfullscreen', '');

                    const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
                    iframe.setAttribute('allow', `${autoplay}; encrypted-media`);

                    iframe.setAttribute('src', urlVideo);

                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        const youtubePlace = this.targetOpen.element.querySelector('.popup__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                if (this.options.hashSettings.location) {
                    // Получение хэша и его выставление 
                    this._getHash();
                    this._setHash();
                }

                // До открытия
                this.options.on.beforeOpen(this);
                // Создаем свое событие после открытия попапа
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));

                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);

                if (!this._reopen) {
                    !this.bodyLock ? bodyLock() : null;
                }
                else this._reopen = false;

                this.targetOpen.element.setAttribute('aria-hidden', 'false');

                // Запоминаю это открытое окно. Оно будет последним открытым
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;

                this._selectorOpen = false;

                this.isOpen = true;

                setTimeout(() => {
                    this._focusTrap();
                }, 50);

                // После открытия
                this.options.on.afterOpen(this);
                // Создаем свое событие после открытия попапа
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.popupLogging(`Открыл попап`);

            } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
        }
    }
    close(selectorValue) {
        if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
            this.previousOpen.selector = selectorValue;
        }
        if (!this.isOpen || !bodyLockStatus) {
            return;
        }
        // До закрытия
        this.options.on.beforeClose(this);
        // Создаем свое событие перед закрытием попапа
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));

        // YouTube
        if (this.youTubeCode) {
            if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`))
                this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
        }
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        // aria-hidden
        this.previousOpen.element.setAttribute('aria-hidden', 'true');
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        // Очищение адресной строки
        this._removeHash();
        if (this._selectorOpen) {
            this.lastClosed.selector = this.previousOpen.selector;
            this.lastClosed.element = this.previousOpen.element;

        }
        // После закрытия
        this.options.on.afterClose(this);
        // Создаем свое событие после закрытия попапа
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));

        setTimeout(() => {
            this._focusTrap();
        }, 50);

        this.popupLogging(`Закрыл попап`);
    }
    // Получение хэша 
    _getHash() {
        if (this.options.hashSettings.location) {
            this.hash = this.targetOpen.selector.includes('#') ?
                this.targetOpen.selector : this.targetOpen.selector.replace('.', '#')
        }
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` :
            document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` :
                null;

        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }
    // Утсановка хэша
    _setHash() {
        history.pushState('', '', this.hash);
    }
    _removeHash() {
        history.pushState('', '', window.location.href.split('#')[0])
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
    _focusTrap() {
        const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
        if (!this.isOpen && this.lastFocusEl) {
            this.lastFocusEl.focus();
        } else {
            focusable[0].focus();
        }
    }
    // Функция вывода в консоль
    popupLogging(message) {
        this.options.logging ? console.log(`[Попапос]: ${message}`) : null;
    }
}
// Запускаем и добавляем в объект модулей
let popup = new Popup({});