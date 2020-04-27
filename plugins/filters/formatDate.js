import dayjs from 'dayjs'

export function formatDate (date, format = 'MM/DD/YYYY') {
    return dayjs(date).format(format)
}
