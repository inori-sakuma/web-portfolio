import { Attribute, BookScheme, BookSize, Cover, ElementId } from "./book_object";

export class ElementAttribute {
    private bookScheme: BookScheme
    private bookSize: BookSize

    constructor(book: BookScheme, bookSize: BookSize) {
        this.bookScheme = book
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
                backgroundColor: this.bookScheme.cover.paperColor
                    ? this.bookScheme.cover.paperColor
                    : this.bookScheme.general.paperColor
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
                backgroundColor: this.bookScheme.general.paperColor,
                marginTop: `${this.bookSize.coverMargin.vertical / 2}px`,
            }
        })

        attribute.addClass((pageType == Cover.front) ? "even" : "odd")
        attribute.addStyles((pageType == Cover.front)
            ? {marginLeft: `${this.bookSize.coverMargin.horizontal / 2}px`}
            : {marginRight: `${this.bookSize.coverMargin.horizontal / 2}px`}
        )
        return attribute
    }

    public pageDepth(): Attribute {
        const attribute = new Attribute({
            classes: ['depth'],
            styles: {
                width: `${(this.bookSize.coverMargin.horizontal) * 2}px`,
                height: `${this.bookSize.height}px`,
                position: "absolute",
                top: "0",
                marginTop: `${this.bookSize.coverMargin.vertical / 2}px`,
                overflow: 'hidden'
            }
        })
        return attribute
    }

    public pageDepthImage(pageType: Cover): Attribute {
        const attribute = new Attribute({
            classes: ['page-depth'],
            styles: {
                width: '50%',
                height: `${this.bookSize.height}px`,
                marginLeft: (pageType == Cover.front) ? '12.5%' : '37.5%'
            }
        })

        return attribute
    }

    public insideSpine(pageNo: number, pageLength: number): Attribute {
        const isOdd = ((pageNo % 2) == 1)
        const pxPerPage = (this.bookSize.cover.width) / 2400
        const bookDepth = Math.floor((pageLength - 2) * pxPerPage)

        const boxShadow =
            `${bookDepth}px 0 ${bookDepth}px -${bookDepth * 0.75}px inset`
        return new Attribute({
            classes: ['inside-spine'],
            styles: isOdd
                ? {left: "0", boxShadow: `-${boxShadow}`}
                : {right: "0", boxShadow: boxShadow}})
    }

    public depthShadow(pageNo: number, pageLength: number): Attribute {
        const isOdd = ((pageNo % 2) == 1)
        const shadowWidth = Math.floor(this.bookSize.width * 0.015)

        const boxShadow =
            `${shadowWidth}px 0 ${shadowWidth}px -${shadowWidth}px inset`

        const attribute = new Attribute({
            classes: ['depth-shadow'],
            styles: isOdd
                ? {left: '0', boxShadow: boxShadow}
                : {right: '0', boxShadow: `-${boxShadow}`}})

        if (pageNo == 2 || pageNo == pageLength - 1) {
            attribute.addStyles({
                height: `${this.bookSize.height}px`,
                marginTop: `${this.bookSize.coverMargin.vertical / 2}px`
            })
        }

        return attribute
    }

    public coverEdge(pageNo: number, pageLength: number): Attribute {
        const isOdd = ((pageNo % 2) == 1)
        const width = Math.floor(this.bookSize.width * 0.015)
        const align = Math.floor(width / 1.5)

        if (pageNo == 1 || pageNo == pageLength) {
            return new Attribute({
                classes: ['cover-edge'],
                styles: {
                    boxShadow: `0 0 ${align}px 0 inset #ccc`
                }
            })
        } else {
            return new Attribute({
                classes: ['cover-edge'],
                styles: isOdd
                    ? { boxShadow:
                        `-${width}px 0 ${align}px -${align}px inset #ccc,`
                        + `0 ${width}px ${align}px -${align}px inset #ccc,`
                        + `0 -${width}px ${align}px -${align}px inset #ccc`
                    }
                    : { boxShadow:
                        `${width}px 0 ${align}px -${align}px inset #ccc,`
                        + `0 ${width}px ${align}px -${align}px inset #ccc,`
                        + `0 -${width}px ${align}px -${align}px inset #ccc`
                    }
            })
        }
    }
}