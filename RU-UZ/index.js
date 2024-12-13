const iframeRU = document.getElementById('chapter_iframe_ru');
const iframeUZ = document.getElementById('chapter_iframe_uz');
const iframeBookList = document.getElementById('book_list');

iframeRU.onload = function () {
    iframeRU.style.height = iframeRU.contentWindow.document.body.scrollHeight + 'px';
    iframeUZ.onload = function () {
        iframeUZ.style.height = iframeUZ.contentWindow.document.body.scrollHeight + 'px';
        attachHoverHandler(iframeRU, iframeUZ);
    };
};

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
            },10);
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

function addHighlightStyle(doc) {
    const style = doc.createElement('style');
    style.textContent = `
        .highlight {
            background-color: #FDEDB8 !important; /* Подсветка */
        }
        em {
            margin: 0;
            padding: 0;
            border: 0px;
            box-sizing: border-box;
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
