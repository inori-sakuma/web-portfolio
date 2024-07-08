import { Attribute, BookObject, Layout, Page } from "./book_object"

export class PageCreator {
    private baseImagePath: string

    constructor(book: BookObject) {
        this.baseImagePath = book.general.baseImagePath
    }

    public create(
            layout: Page | Layout,
            attribute: Attribute = new Attribute()): JQuery<HTMLElement>  {
        const element = this.createWrapperElement(layout, attribute)

        const childrenAttribute: Array<Attribute> = []
        for (let index = 0; index < layout.children.length; index++) {
            childrenAttribute.push(new Attribute())
        }
    
        // 子要素で対応するsplit ratio
        if (layout.split != null) {
            if (layout.split.startsWith('ratio')) {
                PageCreator.parseRatio(layout.split, childrenAttribute)
            }
        }

        for (let index = 0; index < layout.children.length; index++) {
            const child = layout.children[index]
            const childAttribute = childrenAttribute[index]

            if (typeof child === "string" || child.src != null) {
                const childElement= this.createImageElement(child)
                element.append(childElement)
                // frameの場合の特別処理
                if (layout.layoutType == "frame") {
                    childElement.wrap("<div>")
                }
            } else {
                element.append(this.create(child, childAttribute))
            }
        }
        return element
    }

    private createImageElement(
            imageItem: string | Layout): JQuery<HTMLElement>  {

        let imagePath: string
        const styles: Array<string> = []
        if (typeof imageItem == "string") {
            imagePath = imageItem
        } else {
            imagePath = imageItem.src
            styles.push(
                `object-position: ${imageItem.position};`
            )
        }
        return $("<img>", {
            "src": this.baseImagePath + imagePath,
            "style": styles.join(' ') 
        })
    }

    private createWrapperElement(
            layout: Page | Layout,
            wrapperAttribute: Attribute): JQuery<HTMLElement> {
        const isPage = ("index" in layout)

        if (isPage) {
            wrapperAttribute.addClass(`${layout.pageType}-page`)
        }

        if (["frame", "fill", "border"].indexOf(layout.layoutType) != -1) {
            wrapperAttribute.addClass(`layout_${layout.layoutType}`)
        } else {
            wrapperAttribute.addClass(`split-${layout.layoutType}`)
        }

        // wrapperで対応するsplit ratio
        if (layout.split == "equal" || layout.split == null) {
            if (layout.children.length > 1) {
                wrapperAttribute.addClass(`equal-split-${layout.children.length}`)
            }
        }

        return $( isPage ? "<section>": "<div>", wrapperAttribute.toObject)
    }

    private static parseRatio(
            split: string, attribute: Array<Attribute>) {
        const ratioString = split.match(/([0-9]+:)+[0-9]+/);
        if (ratioString == null) {
            console.error("Ratio Error.")
        } else {
            const ratioArray: Array<string> = ratioString[0].split(':')
            for (let index = 0; index < ratioArray.length; index++) {
                attribute[index].addStyles({"width": `${ratioArray[index]}%;`})
            }
        }
    }
}