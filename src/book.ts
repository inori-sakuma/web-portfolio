import $ from 'jquery';
import { Attribute, BookScheme, BookSize, Cover, ElementId, PageSide } from "./book_object";
import { ElementAttribute } from './book_element_attribute';
import { PageCreator } from './pager_creator';

export class Book {
    private bookScheme: BookScheme
    private bookSize: BookSize
    private elementAttr: ElementAttribute
    private pageCreator: PageCreator
    public pages: Array<JQuery<HTMLElement>> = []
    public isDevelop: boolean = false

    get size(): BookSize {
        return this.bookSize
    }

    get object(): BookScheme {
        return this.bookScheme
    }

    constructor(bookScheme: BookScheme, bookAreaId: string = 'book_area') {
        this.bookScheme = bookScheme
        this.bookSize = this.calculateBookSize(bookAreaId)
        this.elementAttr = new ElementAttribute(this.bookScheme, this.bookSize)
        this.pageCreator = new PageCreator(this.bookScheme)
    }

    private calculateBookSize(bookAreaId: string): BookSize {
        const odd = function(value: number) {return Math.floor(value / 2) * 2}
        const widthPerPage = this.bookScheme.general.width * 2
        const heightPerPage = this.bookScheme.general.height

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
        this.generatePages()
        if (!this.isDevelop) {
            this.wrapInsideCover()
        }
        this.generateCover()
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
            this.bookScheme.cover, coverAttribute)

        if (this.isDevelop) {
            this.pages.unshift(frontCover)
            return
        }
        // Coverを複製
        let backCover = frontCover.clone()

        // Coverを分割
        frontCover = Book.wrapSplittedPage(frontCover, Cover.front,
            this.elementAttr.splittedCover(Cover.front))
        backCover = Book.wrapSplittedPage(backCover, Cover.back,
            this.elementAttr.splittedCover(Cover.back))

        // ページを追加
        this.pages.unshift(frontCover)
        this.pages.push(backCover)
    }

    /**
     * 見返しを作成する
     * @param pageType Cover.Front | Back
     * @returns 見返しのHTML Element
     */
    private wrapInsideCover(): void {
        [Cover.front, Cover.back].forEach(pageType => {
            const insideCover = $("<section>",
                this.elementAttr.insideCover(pageType).toObject)
            const pageNo = (pageType == Cover.front) ? 0 : this.pages.length - 1
            this.pages[pageNo].css(this.elementAttr.insideCoverPage(pageType).styles)
            insideCover.append(this.pages[pageNo])
            this.pages[pageNo] = insideCover
        })
    }

    /**
     * ページを作成する
     */
    public generatePages(): void {
        console.info(`Generate ${this.bookScheme.pages.length} page(s).`)

        for (const page of this.bookScheme.pages) {
            console.info(`Generate ${page.index} page.`)
            const attribute = new Attribute({
                styles: {
                    "background-color": (page.paperColor == null)
                        ? this.bookScheme.general.paperColor : page.paperColor
                }
            })
            const pageElement = this.pageCreator.create(page, attribute)
            if (page.pageType == "single" || this.isDevelop) {
                this.pages.push(pageElement)
            } else {
                const page2Element = pageElement.clone()
                this.pages.push(
                    Book.wrapSplittedPage(page2Element, PageSide.Left))
                this.pages.push(
                    Book.wrapSplittedPage(pageElement, PageSide.Right))
            }
        }
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