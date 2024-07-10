import { Book } from './book';
import { BookAction } from './book_action';
import { BookBinder } from './book_binder';
import { BookScheme } from './book_object';

declare global {
    interface JQuery {
        turn(param1: object | string, param2?: object): void;
    }
}

function bookMode(book: Book) {
    book.create()
    const bookBinder = new BookBinder(book)
    bookBinder.initializeArea()
    bookBinder.applyShadows()
    bookBinder.applyRadius()
    bookBinder.appendPages()
    $("#book").turn({
        autoCenter: true,
        elevation: 50,
        duration: 1500,
        when:{
            turning: function(event: JQuery<Event>, page: number, viewPages: Array<number>){
                const pages: number = $(this).turn("pages") as unknown as number
                BookAction.updateInsideCover(page, pages)
                BookAction.updatePageDepth(page, pages)
                console.log(`${viewPages}/${pages}`)
            }
        }
    })
}

function developMode(book: Book) {
    book.isDevelop = true
    book.create()
    const bookBinder = new BookBinder(book)
    bookBinder.initializeArea(true)
    bookBinder.appendPages()
}

$(function() {
    const filePath = [
        './book/made_in_taiwan.json',
        './book/memory_in_2023-07.json'
    ]
    const isDevelop = false
    $.getJSON(filePath[0] , function(scheme: BookScheme) {
        const book = new Book(scheme)
        if (isDevelop) {
            developMode(book)
        } else {
            bookMode(book)
        }
    });
});
