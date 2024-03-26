
function convertCurrency(currencyInput, currencyOutput, amount, callback) {
    
    const result = {
      currencyInput,
      currencyOutput,
      amount,
      convertedAmount: amount /85, 
    };
    callback(result);
  }
  
  module.exports = { convertCurrency };
  