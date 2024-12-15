const iframeRU = document.getElementById('chapter_iframe_ru');
const iframeUZ = document.getElementById('chapter_iframe_uz');
const iframeBookList = document.getElementById('book_list');
const iframeMkBook = document.getElementById('mk_book_iframe');

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');

        trigger.addEventListener('click', () => {
            dropdown.classList.toggle('is-active');
            document.querySelector("._curtain-for-clicking").classList.toggle('is-active');
        });
    });
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target) && dropdown.classList.contains("is-active")) {
                dropdown.classList.remove('is-active');
                document.querySelector("._curtain-for-clicking").classList.remove('is-active');
            }
        });
    });



    // ========================================== MODAL
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
    // ==========================================
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
