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

export interface BookObject {
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
    pageType: string
    paperColor: string
}

export interface Layout {
    layoutType: string
    split: string | null
    children: Array<string | Layout>
    src: string
    position: string
}

type AttributeArgument = {
    id?: string | null,
    src?: string | null,
    classes?: Array<string>,
    styles?: Style
}

type AttributeObject = {
    id?: string,
    src?: string,
    class?: string,
    style?: string
}

export class Attribute {
    id: string | null
    private src: string | null
    private classes: Array<string>
    private styles: Style

    public static create(width: number, height: number) {
        return new Attribute({styles: {
            width: `${width}px`,
            height: `${height}px`
            }
        })
    }

    constructor(
        {id = null, src = null, classes = [], styles = {}}: AttributeArgument = {}) {
            this.id = id
            this.src = src
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

        if (this.classes.length != 0) {
            attribute.class = this.classes.join(' ')
        }

        if (Object.entries(this.styles).length != 0) {
            attribute.style = ""
            for (const [key, value] of Object.entries(this.styles)) {
                attribute.style += `${key}: ${value}; `
            }
        }

        return attribute
    }
}
