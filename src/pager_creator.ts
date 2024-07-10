import { Attribute, BookScheme, Layout, Page, Image, Style, SplitRatio, LayoutType } from "./book_object"

export class PageCreator {
    private baseImagePath: string
    private static SPLIT_TYPE = [
        LayoutType.horizontal,
        LayoutType.vertical
    ]

    constructor(book: BookScheme) {
        this.baseImagePath = book.general.baseImagePath
    }

    public create(
            layout: Page | Layout,
            attribute: Attribute = new Attribute()): JQuery<HTMLElement>  {
        const element = this.createWrapperElement(layout, attribute)

        if (layout.children == null) {
            return element
        }

        const childrenAttribute: Array<Attribute> = []
        for (let index = 0; index < layout.children.length; index++) {
            childrenAttribute.push(new Attribute())
        }
    
        // 子要素で対応するsplit ratio
        if (layout.splitRatio != null) {
            if (layout.splitRatio.startsWith('ratio')) {
                PageCreator.parseRatio(layout, childrenAttribute)
            }
        }

        for (let index = 0; index < layout.children.length; index++) {
            const child = layout.children[index]
            const childAttribute = childrenAttribute[index]

            if (typeof child === "string" || "src" in child) {
                element.append(
                    this.createImageElement(child, childAttribute))
            } else {
                element.append(this.create(child, childAttribute))
            }
        }
        return element
    }

    private createImageElement(
            imageItem: string | Image,
            attribute: Attribute): JQuery<HTMLElement>  {

        attribute.addClass("image-wrapper")
        const src = (typeof imageItem == "string") ? imageItem : imageItem.src
        const imageAttribute = Attribute.createImage(src)

        if (typeof imageItem != "string") {
            if (imageItem.align != null) {
                imageAttribute.addStyles({objectPosition: imageItem.align})
            }
        }
        imageAttribute.src = this.baseImagePath + imageAttribute.src
        return $("<div>", attribute.toObject)
            .append($("<img>", imageAttribute.toObject))
    }

    private createWrapperElement(
            layout: Page | Layout,
            wrapperAttribute: Attribute): JQuery<HTMLElement> {
        const isPage = ("index" in layout)
        const tag = isPage ? "<section>": "<div>"

        if (isPage) {
            wrapperAttribute.addClass(`${layout.pageType}-page`)
        }

        if (layout.children == null) {
            return $(tag, wrapperAttribute.toObject)
        } else if (layout.layoutType == null) {
            throw Error("No Layout Type.")
        }

        if (PageCreator.SPLIT_TYPE.includes(layout.layoutType)) {
            wrapperAttribute.addClass(`split-${layout.layoutType}`)
        } else {
            wrapperAttribute.addClass(`layout-${layout.layoutType}`)
        }

        if (layout.splitRatio == SplitRatio.spacedJustification) {
            wrapperAttribute.addClass('layout-border')
        }

        // wrapperで対応するsplit ratio
        if (layout.splitRatio == SplitRatio.justification
                || layout.splitRatio == SplitRatio.spacedJustification
                || layout.splitRatio == null) {
            if (layout.children.length > 1) {
                wrapperAttribute.addClass(`equal-split-${layout.children.length}`)
            }
        }

        return $(tag, wrapperAttribute.toObject)
    }

    private static parseRatio(
            layout: Layout, attribute: Array<Attribute>) {
        const ratioString = layout.splitRatio?.match(/([0-9]+:)+[0-9]+/);
        if (ratioString == null) {
            throw new Error("Ratio Error.")
        }
        const ratio: Array<number> = []

        let total = 0
        for (const ratioItem of ratioString[0].split(':')) {
            ratio.push(Number(ratioItem))
            total += Number(ratioItem)
        }

        for (let index = 0; index < ratio.length; index++) {
            ratio[index] = (ratio[index] / total) * 100
        }

        for (let index = 0; index < ratio.length; index++) {
            const style: Style = (layout.layoutType == "horizontal")
                ? {width: `${ratio[index]}%;`}
                : {height: `${ratio[index]}%;`}
            attribute[index].addStyles(style)
        }
    }
}