export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions){
    /**
     * the undefined here will default to user's current locale
     * example: user website is in english, it shows English format
     * if youre in spain, it will change the "Sunday" to spanish version
     * can try and replace "undefined" to "es"
     */
    return new Intl.DateTimeFormat(undefined, options).format(date)
}