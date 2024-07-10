import { Book } from "./book";
import { ElementAttribute } from "./book_element_attribute";
import { ElementId } from "./book_object";

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

    public initializeArea(isDevelop: boolean = false): void {
        const bookAreaSelector = ElementId.getSelector(this.bookAreaId)
        $(bookAreaSelector).width(this.book.size.cover.width)
        $(bookAreaSelector).height(this.book.size.cover.height)
        $(bookAreaSelector).append($("<div>", {id: this.bookId}))

        const bookSelector = ElementId.getSelector(this.bookId)
        $(bookSelector).width(this.book.size.width)
        $(bookSelector).height(this.book.size.height)

        if (!isDevelop) {
            const bookAreaContainer = $('<div>', {"style": "overflow: hidden"})
            bookAreaContainer.append()
            $(bookAreaSelector).parent().append(bookAreaContainer)
            bookAreaContainer.append($(bookAreaSelector))
        }
    }

    public appendPages(bookId: string = 'book') {
        const bookSelector = ElementId.getSelector(bookId)

        for (const page of this.book.pages) {
            $(bookSelector).append(page)
        }
    }

    public applyShadows(): void {
        const elementAttr = new ElementAttribute(this.book.object, this.book.size)
        this.book.pages.forEach((page, index) => {
            const pageNo = index + 1
            const pageLength = this.book.pages.length
            const pageClasses = page.attr("class")?.split(' ')

            if (pageClasses?.includes('inside-cover-page')) {
                page.prepend($("<div>",
                    elementAttr.insideSpine(pageNo, pageLength).toObject
                ))
                page.append($("<div>", elementAttr.pageDepth().toObject
                ).append($("<div class='page-depth'>")))
            }

            if (pageClasses?.includes('inside-cover-page')
                    || pageClasses?.includes('single-page')) {
                page.append($("<div>",
                    elementAttr.depthShadow(pageNo, pageLength).toObject
                ))
            }

            if (pageClasses?.includes('cover-page')
                || pageClasses?.includes('inside-cover-page')) {
                page.prepend($("<div>",
                    elementAttr.coverEdge(pageNo, pageLength).toObject
                ))
            }
        });
    }

    public applyRadius(): void {
        const radiusStyle = {
            "odd": "0 10px 10px 0",
            "even": "10px 0 0 10px"
        }

        this.book.pages.forEach((page, index) => {
            const type = (((index + 1) % 2) == 1) ? "odd" : "even"
            const pageClasses = page.attr("class")?.split(' ')
            if (pageClasses?.includes('single-page')
                || pageClasses?.includes('cover-page')
                || pageClasses?.includes('inside-cover-page')) {
                page.css("border-radius", radiusStyle[type])
            }
            // page.find(".cover-page").css("border-radius", radiusStyle[type])
            page.find(".cover-edge").css("border-radius", radiusStyle[type])
            page.find(".single-page").css("border-radius", radiusStyle[type])
        })
    }
}