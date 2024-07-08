import $ from 'jquery';
import { Attribute, BookObject, BookSize, Cover, ElementId, PageSide } from "./book_object";
import { ElementAttribute } from './book_element_attribute';
import { PageCreator } from './pager_creator';

export class Book {
    private book: BookObject
    private bookSize: BookSize
    private elementAttr: ElementAttribute
    private pageCreator: PageCreator
    private _pages: Array<JQuery<HTMLElement>> = []

    get size(): BookSize {
        return this.bookSize
    }

    get pages(): Array<JQuery<HTMLElement>> {
        return this._pages
    }

    constructor(book: BookObject, bookAreaId: string = 'book_area') {
        this.book = book
        this.bookSize = this.calculateBookSize(bookAreaId)
        this.elementAttr = new ElementAttribute(this.book, this.bookSize)
        this.pageCreator = new PageCreator(this.book)

    }

    private calculateBookSize(bookAreaId: string): BookSize {
        const odd = function(value: number) {return Math.floor(value / 2) * 2}
        const widthPerPage = this.book.general.width * 2
        const heightPerPage = this.book.general.height

        const maxWidth = $(ElementId.getSelector(bookAreaId)).width()
        const maxHeight = $(ElementId.getSelector(bookAreaId)).height()

        if (maxWidth == undefined || maxHeight == undefined) {
            throw "error"
        }

        // 縦を合わせる
        let coverWidth = (maxHeight / heightPerPage) * widthPerPage
        let coverHeight = maxHeight;

        if (coverWidth > maxWidth) {
            coverWidth = maxWidth
            coverHeight = (maxWidth / widthPerPage) * heightPerPage
        }

        // 整数(偶数化)
        coverWidth = odd(coverWidth)
        coverHeight = odd(coverHeight)
        const bookWidth = odd(coverWidth * 0.97)
        const bookHeight = odd(coverHeight * 0.97)

        console.info(
            `max size: ${maxWidth} x ${maxHeight}\n`
            + `page size: ${widthPerPage} x ${heightPerPage}\n`
            + `cover size: ${coverWidth} x ${coverHeight}\n`
            + `book size: ${bookWidth} x ${bookHeight}`
        )

        return {
            width: bookWidth,
            height: bookHeight,
            cover: {
                width: coverWidth,
                height: coverHeight
            },
            coverMargin:{
                horizontal: coverWidth - bookWidth,
                vertical: coverHeight - bookHeight
            }
        }
    }

    public create(): void {
        this.generateCover()
        this.generatePages()
    }

    /**
     * 表紙、裏表紙を追加する
     */
    public generateCover(): void {
        const coverAttribute = Attribute.create(
            this.bookSize.cover.width,
            this.bookSize.cover.height
        )

        let frontCover = this.pageCreator.create(
            this.book.cover, coverAttribute)

        // Coverを複製
        let backCover = frontCover.clone()

        // Coverを分割
        frontCover = Book.wrapSplittedPage(frontCover, Cover.front,
            this.elementAttr.splittedCover(Cover.front))
        backCover = Book.wrapSplittedPage(backCover, Cover.back,
            this.elementAttr.splittedCover(Cover.back))

        // 見返しを作成
        const frontInsideCover = this.createInsideCover(Cover.front)
        const backInsideCover = this.createInsideCover(Cover.back)

        // ページを追加
        this._pages.push(frontCover)
        this._pages.push(frontInsideCover)
        this._pages.push(backInsideCover)
        this._pages.push(backCover)
    }

    /**
     * 見返しを作成する
     * @param pageType Cover.Front | Back
     * @returns 見返しのHTML Element
     */
    private createInsideCover(pageType: Cover): JQuery<HTMLElement> {
        const insideCover = $("<section>",
            this.elementAttr.insideCover(pageType).toObject)
        const insideCoverBlank = $("<div>",
            this.elementAttr.insideCoverPage(pageType).toObject)
        const pageDepth = $('<div>',
            this.elementAttr.pageDepth(pageType).toObject)
        const pageDepthImage = $('<div>',
            this.elementAttr.pageDepthImage(pageType).toObject)

        insideCover.append(insideCoverBlank)
        insideCover.append(pageDepth)
        pageDepth.append(pageDepthImage)
        return insideCover
    }

    /**
     * ページを作成する
     */
    public generatePages(): void {
        const pageElements: Array<JQuery<HTMLElement>> = []

        console.info(`Generate ${this.book.pages.length} page(s).`)

        for (const page of this.book.pages) {
            console.info(`Generate ${page.index} page.`)
            const attribute = new Attribute({
                styles: {
                    "background-color": (page.paperColor == null)
                        ? this.book.general.paperColor : page.paperColor
                }
            })
            const pageElement = this.pageCreator.create(page, attribute)
            if (page.pageType == "single") {
                pageElements.push(pageElement)
            } else {
                const page2Element = pageElement.clone()
                pageElements.push(
                    Book.wrapSplittedPage(page2Element, PageSide.Left))
                pageElements.push(
                    Book.wrapSplittedPage(pageElement, PageSide.Right))
            }
        }
        this._pages.splice(2, 0, ...pageElements)
    }

    /**
     * ページを分割し、指定された側を返却する
     * @param targetElement 対象HTML Element
     * @param pageType ページタイプ([Cover.Front|Back], [PageSide.Left|Right])
     * @param outerAttribute 外部に付与するHTML属性
     * @returns 分割後のElement
     */
    private static wrapSplittedPage(
            targetElement: JQuery<HTMLElement>,
            pageType: Cover | PageSide,
            outerAttribute: Attribute | null = null
        ): JQuery<HTMLElement> {

        if (outerAttribute == null) {
            outerAttribute = new Attribute(
                {classes: ["single-page"]}
            )
        }

        const innerAttribute = new Attribute({styles: {
            'width': '200%',
            'margin-left': (pageType == PageSide.Left) ? "0" : "-100%"
        }})

        const outerElement = $("<section>", outerAttribute.toObject)
        const innerElement = $("<div>", innerAttribute.toObject)

        outerElement.append(innerElement.append(targetElement))
        return outerElement
    }
}