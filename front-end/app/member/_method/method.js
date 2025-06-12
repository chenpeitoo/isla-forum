// convert 2000.00 to 2,000
export const formatted = (number) => {
  if (typeof number == 'number')
    return Math.round(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
