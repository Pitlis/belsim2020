import moment from "moment";

export function formatDate(date: Date) {
    return moment.utc(date).local().format('DD/MM/YYYY HH:mm');
}