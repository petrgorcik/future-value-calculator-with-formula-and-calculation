/*!
    *Future Value Calculator v1.0.0
    *Author:       Ing. Petr Gorčík
    *Author URI:   https://www.gorcik.cz
    *GitHub URI:   https://github.com/petrgorcik/future-value-calculator-with-formula-and-calculation/
    *Version: 	   1.0.0
    *License:      GNU General Public License v3
    *License URI:  http://www.gnu.org/licenses/gpl-3.0.html
    *Link to calculator: https://gorcik.cz/calculators/investing/future-value-calculator-with-formula-and-calculation/
*/

//Change format from number to currency USD.
function toUSDCurrencyFormat(UnformattedNumber){
return UnformattedNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); 	
}

//Change format from number to percent.
function toPercentFormat(UnformattedNumber){
return UnformattedNumber.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 4}); 
}

//Assign default value to form when page is loaded
jQuery(window).load(function($) {
  // Code using $ as usual goes here.
var NumberOfPeriods =  document.getElementById("FormControlNumberOfPeriods").value;
var StartingAmount =  document.getElementById("FormControlStartingAmount").value;
var InterestRate =  document.getElementById("FormControlInterestRate").value;
var PMTAmount =  document.getElementById("FormControlPMTAmount").value;

document.getElementById("FormControlNumberOfPeriods").value = 10;
document.getElementById("FormControlStartingAmount").value = toUSDCurrencyFormat(1000);
document.getElementById("FormControlInterestRate").value = toPercentFormat(0.05);
document.getElementById("FormControlPMTAmount").value = toUSDCurrencyFormat(1000);
});

// If inserted value is zero in Periodic Deposit(PMT) field, set value to 1. Inserted value is converted to currency with 2 decimal places. 
// Maximum value has 10 decimal places and is 9 999 999 999.0000
function toFinalCurrencyFormat(controlToCheck, typeOfInput) {
var enteredNumber = '' + controlToCheck.value;
enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ''); 
enteredNumber = Number(enteredNumber);
if(typeOfInput == "PMT" && enteredNumber == 0){
	enteredNumber = 1;
}
else if(enteredNumber > 9999999999){
	enteredNumber = 9999999999;
}	
// Convert to currency style with 2 decimal places.
controlToCheck.value = toUSDCurrencyFormat(enteredNumber);
}
	
// If inserted value is zero in Interest Rate (r) field, set value to 0.0001%. Inserted value is converted to percentages with 4 decimal places. 
// Maximum value has 9 decimal places and is 9 999 999 99.0000%		

function toFinalPercentFormat(controlToCheck) {
var enteredNumber = '' + controlToCheck.value;
enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, '');
//convert percentages to decimal format (without sign %)
enteredNumber = enteredNumber / 100 ;
if(enteredNumber == 0){
	enteredNumber = 0.000001;
} 
else if(enteredNumber > 999999999){
	enteredNumber = 99999999900;	
}
//convert decimal fotmat to percentage (with sign %) with 4 decimal places
controlToCheck.value = toPercentFormat(enteredNumber);
}

//Used for Number of Periods (n) inserted value. Minimum value is 1, maximum value is 36503.

function toFinalNumberFormat(controlToCheck) {
var enteredNumber = '' + controlToCheck.value;
enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ''); 
enteredNumber = Number(enteredNumber);
if(enteredNumber == 0){
	enteredNumber = 1;
}
else if (enteredNumber > 36503){
	enteredNumber = 36503;
}
controlToCheck.value = enteredNumber; 
}
		  		  
// If Future Value Calculator button CALCULATE is clicked, 
// calculate and show Result, Future Value Formula and Future Value Formula with Values.

jQuery("#FutureValueCalcutorCalculateButton").click(function($){
	
// Get values from form input fields.
// n means Number Of Periods.
var n =  document.getElementById('FormControlNumberOfPeriods').value;
// Starting Amount
var StartingAmount = document.getElementById('FormControlStartingAmount').value;
// r means Interest Rate
var r = document.getElementById('FormControlInterestRate').value;
// PMT means PTM Amount
var PMT = document.getElementById('FormControlPMTAmount').value;
// Periodic deposit made at the beginning or end of each period
var PeriodicDepositMadeAt = document.getElementById('FormControlPeriodicDepositMadeAt').value;


// Change data types of variables with values from form input fields.
n = Number(n);
StartingAmount = Number(StartingAmount.replace(/[^0-9.-]+/g,""));
r = Number(r.replace(/[^0-9.-]+/g,"")) / 100  ;
PMT = Number(PMT.replace(/[^0-9.-]+/g,""));

// Change data types to string.
var nStr = String(n);
var StartingAmountStr = String(StartingAmount);
var rStr = String(r);
var PMTStr = String(PMT);

// result Future Value 
var ResultFV;
// Show formula
var FormulaFV;
// Show formula for FV with assigned values. 
var FormulaWithValuesFV;

//FV formulas use convention 30/365.
// Calculate the Future Value (FV), if PMT made at the end of each period. 
// Used formula FV = starting amount * (1 + r)^n + PMT * ( (1 + r)^n - 1 ) / r. 

if(PeriodicDepositMadeAt == "end"){
FormulaFV = "PV * (1 + r)^n + PMT * ( (1 + r)^n - 1 ) / r";
ResultFV = StartingAmount * Math.pow((1 + r),n) + PMT * (  Math.pow((1+r), n) - 1 ) / r  ;
// Convert to currency style with 2 decimal places.
ResultFV = toUSDCurrencyFormat(ResultFV);
FormulaWithValuesFV = toUSDCurrencyFormat(StartingAmount)+ " * (1 + " + rStr + ")^" + nStr + " + " + toUSDCurrencyFormat(PMT) + " * ((1 + " + rStr + " )^" + nStr + " - 1) / " + rStr +" = <b>" + ResultFV + "</b>";

}
// Calculate the Future Value (FV), if PMT made at the beginning of each period. 
// Used formula FV = starting amount * (1 + r)^n + PMT * ( (1 + r)^(n-1) - 1 ) / r. 
else if (PeriodicDepositMadeAt == "beginning"){	

FormulaFV = "PV * (1 + r)^n + PMT * ((1 + r)^n - 1) * (1 + r) / r";
ResultFV = StartingAmount * Math.pow((1 + r),n) + PMT * (  Math.pow((1+r),n) - 1 ) * (1 + r) / r  ;
// Convert to currency style with 2 decimal places.
ResultFV = toUSDCurrencyFormat(ResultFV);
FormulaWithValuesFV = toUSDCurrencyFormat(StartingAmount)+ " * (1 + " + rStr + ")^" + nStr  + " + " + toUSDCurrencyFormat(PMT)+" * ((1 + " + rStr + " )^" + nStr + " - 1) * <br>\n (1 + " + rStr + ") / " + rStr +" = <b>" + ResultFV + "</b>";

}
// Show Result, Future Value Formula and Future Value Formula with Values.
document.getElementById('ResultFV').innerHTML = "The <b>result</b> is <b>" + ResultFV + "</b> <br>\n <br>\n <b>Future Value Formula:</b> <br>\n " + FormulaFV + "<br>\n<br>\n" + "<b>Future Value Formula with Values:</b> <br>\n"+ FormulaWithValuesFV + "<br>\n<br>\n" ;
});

//Disabling form submissions.
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  // slice - returns selected elements in an array, as a new array.
  
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
          event.preventDefault()
          event.stopPropagation()
      }, false);
    });
})();	
