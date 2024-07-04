import $ from 'jquery';
import 'turn.js';

declare global {
    interface JQuery {
        turn(parameter: object): void;
    }
}

$(function() {
    pageSplit()
    toBook()
});

export function pageSplit(className: string = ".whole-page") {
    const wholePages = $(className);
    for (let index = 0; index < wholePages.length; index++) {
        const jqObject = $(wholePages[index])
        jqObject.removeClass("page")
        const cloneObject = jqObject.clone()
        jqObject.after(cloneObject)
        jqObject.wrap(
            '<div style="width: 50%; overflow: hidden">'
            + '<div style="width: 200%;margin-left: 0;">'
        )
        cloneObject.wrap(
            '<div style="width: 50%; overflow: hidden">'
            + '<div style="width: 200%;margin-left: -100%;">'
        )
    }
}

export function toBook(idName: string = "#book") {
    const parentElement = $(idName).parent()
    const WIDTH_PER_PAGE = 210
    const HEIGHT_PER_PAGE = 297
    const maxWidth = parentElement.width()
    const maxHeight = parentElement.height()

    if (maxWidth == undefined || maxHeight == undefined) {
        return
    }

    // 縦を合わせる
    let bookWidth = (maxHeight / HEIGHT_PER_PAGE) * WIDTH_PER_PAGE * 2
    let bookHeight = maxHeight;

    if (bookWidth > maxWidth) {
        bookWidth = maxWidth
        bookHeight = (maxWidth / (WIDTH_PER_PAGE * 2)) * HEIGHT_PER_PAGE
    }

    console.log(bookWidth, bookHeight)
    bookWidth = Math.ceil(bookWidth / 2) * 2
    bookHeight = Math.ceil(bookHeight / 2) * 2

    $("#book").turn({
        width: bookWidth,
        height: bookHeight
    })
}