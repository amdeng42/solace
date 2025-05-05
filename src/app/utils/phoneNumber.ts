import toString from "lodash/toString";


export const formatPhoneNumber = (number: number): string => {
  const str = toString(number);

  if(str.length === 10){
    // format as (123) 123-1234
    return str.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  return str;
}