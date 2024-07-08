import { Attribute, BookObject, BookSize, Cover, ElementId } from "./book_object";

export class ElementAttribute {
    private book: BookObject
    private bookSize: BookSize

    constructor(book: BookObject, bookSize: BookSize) {
        this.book = book
        this.bookSize = bookSize
    }

    public splittedCover(coverType: Cover): Attribute {
        const coverId = (coverType == Cover.front)
            ? ElementId.FRONT_COVER : ElementId.BACK_COVER

        return new Attribute({
            id: coverId,
            classes:['cover-page', 'hard', 'own-size'],
            styles: {
                width: `${this.bookSize.cover.width / 2}px`,
                height: `${this.bookSize.cover.height}px`
            }
        })
    }

    public insideCover(pageType: Cover): Attribute {
        const coverId = (pageType == Cover.front)
                ? ElementId.INSIDE_FRONT_COVER : ElementId.INSIDE_BACK_COVER

        const attribute = new Attribute({
            id: coverId,
            classes: ['inside-cover-page', 'hard', 'own-size'],
            styles: {
                width: `${this.bookSize.cover.width / 2}px`,
                height: `${this.bookSize.cover.height}px`,
                position: "relative",
                "background-color": this.book.cover.paperColor
        }})

        if (pageType == Cover.back) {
            attribute.addClass('fixed')
        }

        return attribute
    }

    public insideCoverPage(pageType: Cover): Attribute{
        const attribute = new Attribute({
            classes: ['single-page'],
            styles: {
                width: `${this.bookSize.width / 2}px`,
                height: `${this.bookSize.height}px`,
                "background-color": this.book.general.paperColor,
                "margin-top": `${this.bookSize.coverMargin.vertical / 2}px`,
            }
        })

        attribute.addClass((pageType == Cover.front) ? "even" : "odd")
        attribute.addStyles((pageType == Cover.front)
            ? {"margin-left": `${this.bookSize.coverMargin.horizontal / 2}px`}
            : {"margin-right": `${this.bookSize.coverMargin.horizontal / 2}px`}
        )
        return attribute
    }

    public pageDepth(pageType: Cover): Attribute {
        const attribute = new Attribute({
            classes: ['depth'],
            styles: {
                width: `${(this.bookSize.coverMargin.horizontal) * 2}px`,
                height: `${this.bookSize.height}px`,
                position: "absolute",
                top: "0",
                "margin-top": `${this.bookSize.coverMargin.vertical / 2}px`,
                'overflow': 'hidden'
            }
        })

        attribute.addStyles(
            (pageType == Cover.front) ? {left: "0"} : {right: "0"})
        return attribute
    }

    public pageDepthImage(pageType: Cover): Attribute {
        const attribute = new Attribute({
            classes: ['page-depth'],
            styles: {
                width: '50%',
                height: `${this.bookSize.height}px`,
                "margin-left": (pageType == Cover.front) ? '12.5%' : '37.5%'
            }
        })

        return attribute
    }
}