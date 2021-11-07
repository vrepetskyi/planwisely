export default function makeTwoDigit(number) {
    return number.toString().length == 1 ? '0' + number : number
}