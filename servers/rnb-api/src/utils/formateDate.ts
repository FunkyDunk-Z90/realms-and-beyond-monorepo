export const formatDate = (date?: Date | null) => {
    if (!date) return undefined
    return date.toLocaleDateString('en-GB') // DD/MM/YYYY
}
