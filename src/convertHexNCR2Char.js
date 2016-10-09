
const hex2char = (hex) => { 
  // converts a single hex number to a character
  // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
  // hex: string, the hex codepoint to be converted
  var result = '';
  var n = parseInt(hex, 16);
    if (n <= 0xFFFF) { result += String.fromCharCode(n); } 
  else if (n <= 0x10FFFF) {
    n -= 0x10000
    result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
      } 
  else { result += 'hex2Char error: Code point out of range: '+dec2hex(n); }
  return result;
}

const dec2hex = (textString) => { 
  return (textString+0).toString(16).toUpperCase();
}

const convertHexNCR2Char = (str) => { 
  str = str.replace(/&#x([A-Fa-f0-9]{1,6});/g, 
    (matchstr, parens) => {
      return hex2char(parens);
    }); 
  return str;
}


exports.convertHexNCR2Char = convertHexNCR2Char;
