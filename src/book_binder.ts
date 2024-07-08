import { Book } from "./book";
import { Attribute, ElementId } from "./book_object";

export class BookBinder {
    private book: Book
    private bookId: string
    private bookAreaId: string

    constructor(
            book: Book,
            bookAreaId: string = 'book_area',
            bookId: string = 'book') {
        this.book = book
        this.bookId = bookId
        this.bookAreaId = bookAreaId
    }

    public initializeArea(): void {
        const bookAreaSelector = ElementId.getSelector(this.bookAreaId)
        $(bookAreaSelector).width(this.book.size.cover.width)
        $(bookAreaSelector).height(this.book.size.cover.height)
        $(bookAreaSelector).append($("<div>", {id: this.bookId}))

        const bookSelector = ElementId.getSelector(this.bookId)
        $(bookSelector).width(this.book.size.width)
        $(bookSelector).height(this.book.size.height)
    }

    public appendPages(bookId: string = 'book') {
        const bookSelector = ElementId.getSelector(bookId)

        for (const page of this.book.pages) {
            $(bookSelector).append(page)
        }
    }

    public applyShadows(): void {
        for (const page of this.book.pages) {
            const pageClasses = page.attr("class")
            // deboss
            if (pageClasses?.includes('cover-page')) {
                page.append('<div class="cover-edge">')
            }
            // emboss
            if (pageClasses?.includes('inside-cover-page')) {
                page.prepend('<div class="cover-shadow">')
            }

            // shadow
            if (pageClasses?.includes('inside-cover-page')) {
                const attribute = new Attribute({
                    classes: ['depth-shadow'],
                    styles: {
                        height: `${this.book.size.height}px`,
                        "margin-top": `${this.book.size.coverMargin.vertical / 2}px`,
                    }
                })
                page.append($("<div>", attribute.toObject))
            } else if(pageClasses?.includes('single-page')) {
                page.append('<div class="depth-shadow">')
            }
        }
    }
}