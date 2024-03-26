

async function convertCurrency(currencyInput, currencyOutput, amount, callback) {
  try {
    const response = await fetch(`https://anyapi.io/api/v1/exchange/convert?apiKey=pc76lgve32g8242ktqlmaotbqspgn7idv997d82vh8gr69374jb0co`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from currency conversion API');
    }
    const data = await response.json();
    
    
    const result = {
      currencyInput,
      currencyOutput,
      amount,
      convertedAmount,
    };
    const convertedAmount = data.result; 
    callback( result,null);
  } catch (error) {
    callback(error, null);
  }
}



module.exports = { convertCurrency };
