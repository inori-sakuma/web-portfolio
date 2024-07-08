import { ElementId } from "./book_object";

export class BookAction {
    public static updateInsideCover(page: number, pages: number) {
        const firstPageSelector = "#book .p2"
        const lastPageSelector = `#book .p${pages - 1}`

        if (page >= 2) {
            $(firstPageSelector).addClass("fixed");
        } else {
            $(firstPageSelector).removeClass("fixed");
        }

        if (page < pages) {
            $(lastPageSelector).addClass("fixed");
        } else {
            $(lastPageSelector).removeClass("fixed");
        }
    }

    public static updatePageDepth(
            page: number, pages: number) {
        const pagePercent = 12.5 / (pages - 2) * page

        const insideFrontCoverSelector =
            ElementId.getSelector(ElementId.INSIDE_FRONT_COVER)
        const insideBackCoverSelector =
            ElementId.getSelector(ElementId.INSIDE_BACK_COVER)

        if (page >= 6 ) {
            $(`${insideFrontCoverSelector} .depth`).show()
        } else {
            $(`${insideFrontCoverSelector} .depth`).hide()
        }

        $(`${insideFrontCoverSelector} .page-depth`).css("margin-left", `${25 - pagePercent}%`)

        if (page < pages - 4) {
            $(`${insideBackCoverSelector} .depth`).show()
        } else {
            $(`${insideBackCoverSelector} .depth`).hide()
        }

        $(`${insideBackCoverSelector} .page-depth`).css("margin-left", `${37.5 - pagePercent}%`)
    }
}
