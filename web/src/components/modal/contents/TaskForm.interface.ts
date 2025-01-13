
interface IDoneDetail {
    key: "done"
    value: boolean
}

interface IDescriptionDetail {
    key: "description"
    value: string
}

export type HandleChecklistItemChange = (itemId: string, detail: IDoneDetail | IDescriptionDetail) => void