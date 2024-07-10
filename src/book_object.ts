export type Style = {[name: string]: string}

export enum PageSide {
    Left = 'left',
    Right = 'right'
}

export enum Cover {
    front = PageSide.Right,
    back = PageSide.Left
}

export class ElementId {
    public static FRONT_COVER = "front-cover"
    public static BACK_COVER = "back-cover"
    public static INSIDE_FRONT_COVER = "inside-front-cover"
    public static INSIDE_BACK_COVER = "inside-back-cover"

    public static getSelector(id: string) {
        return `#${id}`
    }
}

export interface BookSize {
    width: number
    height: number
    cover: {
        width: number
        height: number
    }
    coverMargin: {
        horizontal: number
        vertical: number
    }
}

// ===== Book Schemeに関する定義 =====
export enum PageType {
    single = 'single',
    whole = 'whole'
}

export enum LayoutType {
    frame = 'frame',
    fill = 'fill',
    border = 'border',
    horizontal = 'horizontal',
    vertical = 'vertical'
}

export enum SplitRatio {
    justification = 'justification',
    framedJustification = 'framed-justification',
    spacedJustification = 'spaced-justification',
    borderedJustification = 'bordered-justification',
    relative = 'relative'
}

export interface BookScheme {
    general: General
    cover: Page
    pages: Array<Page>
}

export interface General {
    width: number
    height: number
    baseImagePath: string
    paperColor: string
}

export interface Page extends Layout {
    index: string
    pageType: PageType
    paperColor?: string
}

export interface Layout {
    layoutType?: LayoutType
    splitRatio?: SplitRatio | string
    children?: Array<string | Layout | Image>
    position?: string
}

export interface Image {
    src: string
    align?: string
}

type AttributeArgument = {
    id?: string | null,
    src?: string | null,
    depth?: number | null,
    classes?: Array<string>,
    styles?: Style
}

type AttributeObject = {
    id?: string,
    src?: string,
    class?: string,
    style?: string,
    depth?: number
}

export class Attribute {
    id: string | null
    public src: string | null
    private classes: Array<string>
    public styles: Style
    private depth: number | null

    public static create(width: number, height: number): Attribute {
        return new Attribute({styles: {
            width: `${width}px`,
            height: `${height}px`
            }
        })
    }

    public static createImage(src: string): Attribute {
        return new Attribute({src: src})
    }

    constructor(
        {id = null, src = null, depth = null, classes = [], styles = {}}: AttributeArgument = {}) {
            this.id = id
            this.src = src
            this.depth = depth
            this.classes = classes
            this.styles = styles
    }

    public addClass(classValue: string) {
        this.classes.push(classValue)
    }

    public addStyles(styles: Style) {
        Object.assign(this.styles, styles)
    }

    public isStyleExist(styleName: string) {
        return (styleName in this.styles)
    }

    get toObject(): AttributeObject {
        const attribute: AttributeObject = {}

        if (this.id != null) {
            attribute.id = this.id
        }

        if (this.src != null) {
            attribute.src = this.src
        }

        if (this.depth != null) {
            attribute.depth = this.depth
        }

        if (this.classes.length != 0) {
            attribute.class = this.classes.join(' ')
        }

        if (Object.entries(this.styles).length != 0) {
            attribute.style = ""
            for (const [key, value] of Object.entries(this.styles)) {
                const keyName = key.split(/(?=[A-Z])/).join('-').toLowerCase()
                attribute.style += `${keyName}: ${value}; `
            }
        }

        return attribute
    }
}
