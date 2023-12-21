import { isValidDate } from "./date-util";

export function isString(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    input.trim() === ""
  )
    return false;
  return true;
}

export function isNumber(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }
  input = Number.parseInt(input, 10);

  if (Number.isNaN(input) || input === null || input === undefined)
    return false;
  return true;
}

export function isArray(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  if (
    input === null ||
    input === undefined ||
    !Array.isArray(input) ||
    input.length <= 0
  )
    return false;
  return true;
}

export function isEmail(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  const checkEmailInput = input
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    !checkEmailInput
  )
    return false;
  return true;
}

export function isEnum(Enum, input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  return Object.values(Enum).includes(input);
}

export function isPhone(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    !input
    .toLowerCase()
    .match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  )
    return false;
  return true;
}

export function isDate(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    !isValidDate(input)
  )
    return false;
  return true;
}

export function isObject(input, isOptional = false) {
  if(isOptional && !input){
    return true;
  }

  if (
    typeof input !== "object" ||
    input === null ||
    input === undefined ||
    Object.keys(input).length <= 0
  )
    return false;
  return true;
}

export function minLength(input, min) {
  const inputLength = input.length;
  return inputLength >= min;
}

export function maxLength(input, max) {
  const inputLength = input.length;
  return inputLength <= max;
}

export function isUrl(url, isOptional = false){
  if(isOptional && !url){
      return true;
  }

  return url.match(/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/);
}
