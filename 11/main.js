'use strict';

let sourceLang = document.getElementById('sourceLang'),
    outputLang = document.getElementById('outputLang'),
    textToTranslate = document.getElementById("input");
const API_KEY = 'trnsl.1.1.20190206T105557Z.9296d8befb9d6a81.e7178a6deb27ebba4f1c49b39dc9c538e177de04';
const urlGetLangs = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=';
let optionElem, optionForSourceLangElem;
let langOnPage = '&ui=ru';
let outputTranslate = document.querySelector('.translate');
getListOfLanguages();
textToTranslate.addEventListener("input", translate);
translateBtn.addEventListener("click", translate);
changeBtn.addEventListener("click", changeLangs);

function changeLangs() {
    let bufSelectedIndex = sourceLang.selectedIndex;
    sourceLang.selectedIndex = outputLang.selectedIndex;
    outputLang.selectedIndex = bufSelectedIndex;
    let bufInputText = textToTranslate.value;
    textToTranslate.value = outputTranslate.innerText;
    outputTranslate.innerText = bufInputText;
    setFocusOnElem(textToTranslate);
}

(function () {
    textToTranslate.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            document.getElementById("translateBtn").click();
        }
    });
})();

function addLanguageToOption(optionElem, nameOfLang, languages) {
    optionElem = document.createElement('option');
    optionElem.textContent = languages[nameOfLang];
    optionElem.value = nameOfLang;
    return optionElem;
}

function setDefaultSelected(lang, languages, nameOfLang) {
    if (languages === nameOfLang) lang[lang.length - 1].defaultSelected = true;
}

function getListOfLanguages() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', urlGetLangs + API_KEY + langOnPage, false);
    xhr.send();

    if (xhr.status != 200) {
        let error = () => alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        error();
    } else {
        addToSelect(xhr.responseText);
    }
}

function addToSelect(xhr) {
    let languages = JSON.parse(xhr).langs;

    for (let nameOfLang in languages) {
        optionElem = addLanguageToOption(optionElem, nameOfLang, languages);
        optionForSourceLangElem = addLanguageToOption(optionForSourceLangElem, nameOfLang, languages);
        outputLang.appendChild(optionElem);
        setDefaultSelected(outputLang, languages[nameOfLang], 'Английский');
        sourceLang.appendChild(optionForSourceLangElem);
        setDefaultSelected(sourceLang, languages[nameOfLang], 'Русский');
    }

    sortSelect(sourceLang, "Русский");
    sortSelect(outputLang, 'Английский');
}

function sortSelect(wrapper, lang) {
    let nodes = wrapper.getElementsByTagName("option"),
        //возвращает коллекцию option
        len = nodes.length,
        //количество всех option
        sorted = []; //пустой массив

    let selectedIndex; //номер выбранного элемента

    while (nodes[0]) {
        //цикл пока в массиве есть строки
        sorted.push(new String(nodes[0].textContent)); //добавление в массив текста внутри option

        sorted[sorted.length - 1].element = nodes[0]; //изменение элемента. В данном случаке добавляется value

        wrapper.removeChild(nodes[0]); //удаление из массива option
    }

    sorted = sorted.sort(); //сортирует по алфавиту

    for (let i = 0; i < len; i++) {
        //цикл по добавление в исходный select отсортированный эелементов
        wrapper.appendChild(sorted[i].element); //добавление

        if (sorted[i].element.innerText === lang) //поиск нужного языка
            selectedIndex = wrapper.length - 1; //добавление в буферную переменную
    }

    wrapper.selectedIndex = selectedIndex; //номер выбранного option присваивается буферная переменная.
}

function getUrl(url) {
    url = 'https://translate.yandex.net/api/v1.5/tr.json/translate'; // Формируем полный адрес запроса:

    url += '?key=' + API_KEY; // добавляем к запросу ключ API

    url += '&text=' + textToTranslate.value; // текст для перевода

    url += '&lang=' + sourceLang.value + "-" + outputLang.value; // направление перевода: с русского на английский
    // Таким образом формируется строка вида:
    // https://translate.yandex.net/api/v1.5/tr.json/translate?key=example_api_key&text=кролики&lang=ru-en

    return url;
}

function translate() {
    // Создаем объект XMLHttpRequest, при помощи которого будем отправлять запрос
    let req = new XMLHttpRequest();
    let url;
    if (textToTranslate.value === "") outputTranslate.innerText = " ";else {
        url = getUrl(url); // Назначаем обработчик события load

        req.addEventListener('load', function () {
            console.log(req.response); // отображаем в консоли текст ответа сервера

            let response = JSON.parse(req.response); // парсим его из JSON-строки в JavaScript-объект
            // Проверяем статус-код, который прислал сервер
            // 200 — это ОК, остальные — ошибка или что-то другое

            if (response.code !== 200) {
                outputTranslate.innerText = 'Произошла ошибка при получении ответа от сервера:\n\n' + response.message;
                return;
            } // Проверяем, найден ли перевод для данного слова


            if (response.text.length === 0) {
                outputTranslate.innerText = 'К сожалению, перевод для данного слова не найден';
                return;
            } // Если все в порядке, то отображаем перевод на странице


            outputTranslate.innerText = response.text.join('<br>'); // вставляем его на страницу
        }); // Обработчик готов, можно отправлять запрос
        // Открываем соединение и отправляем

        req.open('get', url);
        req.send();
    }
    setFocusOnElem(textToTranslate);
}

function setFocusOnElem(el) {
    return el.focus();
}
