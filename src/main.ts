import { Book } from './book';
import { BookAction } from './book_action';
import { BookBinder } from './book_binder';
import { BookObject } from './book_object';

declare global {
    interface JQuery {
        turn(param1: object | string, param2?: object): void;
    }
}

$(function() {

    $.getJSON("./book/sample.json" , function(bookObject: BookObject) {
        const book = new Book(bookObject)
        book.create()
        const bookBinder = new BookBinder(book)
        bookBinder.initializeArea()
        bookBinder.appendPages()
        bookBinder.applyShadows()
        // return
        $("#book").turn({
            autoCenter: true,
            elevation: 50,
            duration: 1500,
            gradients: false,
            when:{
                turning: function(event: JQuery<Event>, page: number, viewPages: Array<number>){
                    const pages: number = $(this).turn("pages") as unknown as number
                    BookAction.updateInsideCover(page, pages)
                    BookAction.updatePageDepth(page, pages)
                    console.log(`${viewPages}/${pages}`)
                }
            }
        })

    });
});
