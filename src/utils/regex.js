// https://www.regextester.com/112232
export const isoRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/

export const dateRegex = /^[a-zA-Z]{3} [a-zA-Z]{3} (0?[1-9]|[1][0-2]) [0-9]+$/i

export const usLocaleDateRegex =
  /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
