/*!
    *Future Value Calculator v1.1.2
    *Author:       Ing. Petr Gorčík
    *Author URI:   https://www.gorcik.cz
    *GitHub URI:   https://github.com/petrgorcik/future-value-calculator-with-formula-and-calculation/
    *Version: 	   1.1.2
    *License:      GNU General Public License v3
    *License URI:  http://www.gnu.org/licenses/gpl-3.0.html
    *Link to calculator: https://gorcik.cz/calculators/investing/future-value-calculator-with-formula-and-calculation/
*/

// ########## Global variables and constants ########## 
var jsDataLength;
const pageSize = 10;
var curPage;
var jsData;

// ########## FV form - check of entered values, etc. ########## 

// Change format from number to currency USD.
function toUSDCurrencyFormat(UnformattedNumber) {
	return UnformattedNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); 	
}

// Change format from number to percent.
function toPercentFormat(UnformattedNumber) {
	return UnformattedNumber.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 4}); 
}

// If inserted value is zero in Periodic Deposit(PMT) field, set value to 1. Inserted value is converted to currency with 2 decimal places. 
// Maximum value has 10 decimal places and is 9 999 999 999.0000
function toFinalCurrencyFormat(controlToCheck, typeOfInput) {
	var enteredNumber = '' + controlToCheck.value;
	enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ''); 
	enteredNumber = Number(enteredNumber);
	if(typeOfInput == "PMT" && enteredNumber == 0) {
		enteredNumber = 1;
	}
	else if(enteredNumber > 9999999999) {
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
	if(enteredNumber == 0) {
		enteredNumber = 0.000001;
	} 
	else if(enteredNumber > 999999999) {
		enteredNumber = 99999999900;	
	}
	// Convert decimal format to percentage (with sign %) with 4 decimal places.
	controlToCheck.value = toPercentFormat(enteredNumber);
}

// Used for Number of Periods (n) inserted value. Minimum value is 1, maximum value is 36503.
function toFinalNumberFormat(controlToCheck) {
	var enteredNumber = '' + controlToCheck.value;
	enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ''); 
	enteredNumber = Number(enteredNumber);
	if(enteredNumber == 0) {
		enteredNumber = 1;
	}
	else if (enteredNumber > 36503) {
		enteredNumber = 36503;
	}
	controlToCheck.value = enteredNumber; 
}
	
// Disabling form submissions.
(function() {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to.
	var forms = document.querySelectorAll('.needs-validation');

	// Loop over them and prevent submission.
	// slice - returns selected elements in an array, as a new array.
  
	Array.prototype.slice.call(forms)
    .forEach(function(form) {
      form.addEventListener('submit', function (event) {
          event.preventDefault()
          event.stopPropagation()
      }, false);
    });
})();
	
// ########## FV Calculator ########## 
// If Future Value Calculator button CALCULATE is clicked, 
// calculate and show Result, Future Value Formula, Future Value Formula with Values
// and call function to render table and charts.
jQuery("#FutureValueCalcutorCalculateButton").click(function($) {
	
	curPage = 1;	
	// Get values from form input fields.
	// n means Number Of Periods.
	var n =  document.getElementById('FormControlNumberOfPeriods').value;
	// Starting Amount.
	var StartingAmount = document.getElementById('FormControlStartingAmount').value;
	// r means Interest Rate.
	var r = document.getElementById('FormControlInterestRate').value;
	// PMT means PTM Amount.
	var PMT = document.getElementById('FormControlPMTAmount').value;
	// Periodic deposit made at the beginning or end of each period.
	var PeriodicDepositMadeAt = document.getElementById('FormControlPeriodicDepositMadeAt').value;
		
	// Change data types of variables with values from form input fields.
	n = Number(n);
	StartingAmount = Number(StartingAmount.replace(/[^0-9.-]+/g,""));
	r = Number(r.replace(/[^0-9.-]+/g,"")) / 100;
	PMT = Number(PMT.replace(/[^0-9.-]+/g,""));
		
	// Change data types to string.
	var nStr = String(n);
	var StartingAmountStr = String(StartingAmount);
	var rStr = String(r.toFixed(6));
	var PMTStr = String(PMT);
	
	// Result Future Value 
	var ResultFV;
	// Show formula.
	var FormulaFV;
	// Show formula for FV with assigned values. 
	var FormulaWithValuesFV;
	
	// FV formulas use convention 30/365.
	// Calculate the Future Value (FV), if PMT made at the end of each period. 
	// Used formula FV = starting amount * (1 + r)^n + PMT * ( (1 + r)^n - 1 ) / r. 
	
	if(PeriodicDepositMadeAt == "end") {
		FormulaFV = "PV * (1 + r)^n + PMT * ( (1 + r)^n - 1 ) / r";
		ResultFV = StartingAmount * Math.pow((1 + r),n) + PMT *  (  Math.pow((1+r), n) - 1 ) / r  ;
			
		// Convert to currency style with 2 decimal places.
		ResultFV = toUSDCurrencyFormat(ResultFV);
		FormulaWithValuesFV = toUSDCurrencyFormat(StartingAmount)+ " * (1 + " + rStr + ")^" + nStr + " + " + toUSDCurrencyFormat(PMT) + " * ((1 + " + rStr + " )^" + nStr + " - 1) / " + rStr +" = <b>" + ResultFV + "</b>";
		
	}
	// Calculate the Future Value (FV), if PMT made at the beginning of each period. 
	// Used formula FV = starting amount * (1 + r)^n + PMT * ( (1 + r)^(n-1) - 1 ) / r. 
	else if (PeriodicDepositMadeAt == "beginning") {	
	
		FormulaFV = "PV * (1 + r)^n + PMT * ((1 + r)^n - 1) * (1 + r) / r";
		ResultFV = StartingAmount * Math.pow((1 + r),n) + PMT * (  Math.pow((1+r),n) - 1 ) * (1 + r) / r  ;
		
		// Convert to currency style with 2 decimal places.
		ResultFV = toUSDCurrencyFormat(ResultFV);
		FormulaWithValuesFV = toUSDCurrencyFormat(StartingAmount)+ " * (1 + " + rStr + ")^" + nStr  + " + " + toUSDCurrencyFormat(PMT)+" * ((1 + " + rStr + " )^" + nStr + " - 1) * <br>\n (1 + " + rStr + ") / " + rStr +" = <b>" + ResultFV + "</b>";
	}
	// Show Result, Future Value Formula and Future Value Formula with Values.
	document.getElementById('ResultFV').innerHTML = "The <b>result</b> is <b>" + ResultFV + "</b> <br>\n <br>\n <b>Future Value Formula:</b> <br>\n " + FormulaFV + "<br>\n<br>\n" + "<b>Future Value Formula with Values:</b> <br>\n"+ FormulaWithValuesFV + "<br>\n<br>\n" ;
	
	
	// Create data for table and charts.
	jsData = new Array();
	
	// Data for 0. period.
	jsData[0] = {
		Period: 0,
		PMT: '',
		Interest: '',
		EndBalance: StartingAmount,
		CumulativePrincipal: StartingAmount,
		CumulativeInterest: ''
	};	
	
	// If periodic deposit made at the end of period.
	if(PeriodicDepositMadeAt=="end") {
						
		// Data for 1. period.		
		jsData[1] = {				
			Period: 1,
			PMT: PMT,
			//Formula – interest in single period – deposit at end of each period  - FIRST PERIOD FORMULA = PV * (1 + r) – PV.
			Interest: (StartingAmount*(1+r)-StartingAmount),	
			//Formula – End Balance in single period – deposit at end of each period – FIRST PERIOD FORMULA = PV * (1 + r) + PMT.					
			EndBalance: (StartingAmount*(1+r)+PMT),
			// Formula - cumulative principal in single period - deposit at end of each period - FIRST PERIOD FORMULA = PV + PMT.
			CumulativePrincipal: (StartingAmount+PMT),
			// Formula - cumulative interest in single period - deposit at end of each period - FIRST PERIOD FORMULA = PV * (1+r) - PV.
			CumulativeInterest: (StartingAmount*(1+r)-StartingAmount)
		};
		
		// Data for next periods.
		for (var i = 2; i <= n; i++) {			
			
			var x=i-1;
			jsData[i] = {				
				Period: i,
				PMT: PMT,
				// Formula – interest in single period – deposit at end of each period – 
				// NEXT PERIOD FORMULA = End Balance in previous period * (1+r) – End Balance in previous period.
				Interest: (jsData[x].EndBalance*(1+r)-jsData[x].EndBalance),
				// Formula – End Balance in single period – deposit at end of each period – 
				// NEXT PERIOD FORMULA = End Balance in previous period * ( 1 + r) + PMT.
				EndBalance: (jsData[x].EndBalance*(1+r)+PMT),
				// Formula - Cumulative Principal in single period - deposit at end of each period - 
				// NEXT PERIOD FORMULA = Cumulative principal in previous period + PMT.
				CumulativePrincipal: (jsData[x].CumulativePrincipal+PMT),
				// Formula - Cumulative Interest in single period - deposit at end of each period - 
				// NEXT PERIOD FORMULA = End Balance in previous period * (1+r) – End Balance in previous period + Cumulative Interest in previous period.
				CumulativeInterest: (jsData[x].EndBalance*(1+r)-jsData[x].EndBalance+jsData[x].CumulativeInterest)					
			};			
		}					
	}
	// If periodic deposit made at the end of period.
	else if(PeriodicDepositMadeAt=="beginning") {
			
				// Data for 1. period.		
				jsData[1] = {				
					Period: 1,
					PMT: PMT,
					// Formula – interest in single period – deposit at beginning of each period – 
					// FIRST PERIOD FORUMLA = (PV+PMT)*(1+r)-(PV+PMT).
					Interest: (StartingAmount+PMT)*(1+r)-(StartingAmount+PMT),	
					// Formula – End Balance in single period – deposit at beginning of each period – 
					// FIRST PERIOD FORMULA = (PV + PMT) * (1 + r).			
					EndBalance: (StartingAmount+PMT)*(1+r),
					// Formula - cumulative principal in single period - deposit at beginning of each period - 
					// FIRST PERIOD FORMULA = PV + PMT.
					CumulativePrincipal: (StartingAmount+PMT),
					// Formula - cumulative interest in single period - deposit at beginning of each period - 
					// FIRST PERIOD FORMULA = (PV+PMT)*(1+r) - (PV+PMT).
					CumulativeInterest: (StartingAmount+PMT)*(1+r)-(StartingAmount+PMT)
				};
		
			// Data for next periods.
			for (var i = 2; i <= n; i++) {			
				
				var x=i-1;
				jsData[i] = {				
					Period: i,
					PMT: PMT,
					// Formula – interest in single period – deposit at beginning of each period – 
					// NEXT PERIOD FORMULA = (End Balance in previous period + PMT) * (1+r) – (End Balance in previous period + PMT).
					Interest: ((jsData[x].EndBalance+PMT)*(1+r)-(jsData[x].EndBalance+PMT)),
					// Formula – End Balance in single period – deposit at beginning of each period – 
					// NEXT PERIOD FORMULA = (End Balance in previous period + PMT) * ( 1 + r).
					EndBalance: ((jsData[x].EndBalance+PMT)*(1+r)),
					// Formula - Cumulative Principal in single period - deposit at beginning of each period - 
					// NEXT PERIOD FORMULA = Cumulative principal in previous period + PMT.
					CumulativePrincipal: (jsData[x].CumulativePrincipal+PMT),
					// Formula - Cumulative Interest in single period - deposit at beginning of each period - 
					// NEXT PERIOD FORMULA = (End Balance in previous period + PMT) * (1+r) – (End Balance in previous period + PMT) + Cumulative Interest in previous period.
					CumulativeInterest: ((jsData[x].EndBalance+PMT)*(1+r)-(jsData[x].EndBalance+PMT)+jsData[x].CumulativeInterest)
						
				};			
			}					
	}

	// Render FV table.
	renderFVtable();
	jsDataLength = jsData.length;
	// Render FV charts.
	FVstackedColumnChart();
	FVdonutChart();	
});

////########## FV table previous, next page ########## 
function previousPage() {
	if(curPage > 1) curPage--;
	renderFVtable();
}

function nextPage() {
	if((curPage * pageSize) < jsDataLength) curPage++;
	renderFVtable();
}
////########## FV table ########## 
function renderFVtable() {
	
	var tableName = document.getElementById("FVtableName");	
	tableName.innerHTML = "<b>Future Value Schedule (in $)</b><br><br>";	
	var table = document.getElementById("FVtable");	
	var tbody = document.getElementById("FVtbody");
    // Remove table content if exists.
	if(tbody) {
		tbody.remove();	
		thead.remove();
	}
	
	tbody = document.createElement("TBODY");
	tbody.setAttribute("id", "FVtbody");
	table.appendChild(tbody);
	
	thead = document.createElement("THEAD");
	thead.setAttribute("id", "FVthead");
	table.appendChild(thead);
	
	var start = (curPage-1)*pageSize;
    var end = curPage*pageSize-1;
	
    var headerNames = ["Period", "PMT", "Interest", "Balance (at the end of period)", "Cumulative Principal (PMT + PV)",  "Cumulative Interest"];
	var columnCount = headerNames.length;
    // Add the header row.
    var row = thead.insertRow();
    for (var i = 0; i < columnCount; i++) {
		var headerCell = document.createElement("TH");
        headerCell.innerHTML = headerNames[i];
        row.appendChild(headerCell);
    }
    var tr, td;
	var tblInterest;
	var tblEndBalance;
	var tblCumulativePrincipal;
	var tblCumulativeInterest;
						
    // Loop through data source.
    for (var i = start; i <= end; i++) {
		// Check if value exists to avoid end row with null values.
		if(jsData[i]) {
			tr = tbody.insertRow();
			td = tr.insertCell();
			td.setAttribute("align", "center");				
			// First row of data contains null values, avoid parseFloat.
			if(i == 0) {
				tblInterest = jsData[i].Interest;
				tblEndBalance = jsData[i].EndBalance;
				tblCumulativePrincipal = jsData[i].CumulativePrincipal;
				tblCumulativeInterest = jsData[i].CumulativeInterest; 
			}  
			// Rounding of data in another rows to two decimal places.
			else {
				tblInterest = parseFloat(jsData[i].Interest).toFixed(2);
				tblEndBalance = parseFloat(jsData[i].EndBalance).toFixed(2);
				tblCumulativePrincipal = parseFloat(jsData[i].CumulativePrincipal).toFixed(2);
				tblCumulativeInterest = parseFloat(jsData[i].CumulativeInterest).toFixed(2);
			}
		
			// Add data to row of table.
			td.innerHTML = jsData[i].Period;
			td = tr.insertCell();
			td.innerHTML = jsData[i].PMT;
			td = tr.insertCell();
			td.innerHTML = tblInterest;
			td = tr.insertCell();
			td.innerHTML = tblEndBalance;
			td = tr.insertCell();
			td.innerHTML = tblCumulativePrincipal;
			td = tr.insertCell();
			td.innerHTML = tblCumulativeInterest;
			
		}
    }
		
	// Get div for previous and next button.
	var tablePrevNextDiv = document.getElementById("FVtablePrevNextDiv");	
	
	// Create previous button of FVtable.
	prevButton = document.getElementById("FVtablePrevButton");
	if(!prevButton) {			
		prevButton = document.createElement("BUTTON");
		prevButton.setAttribute("id", "FVtablePrevButton");
		prevButton.setAttribute("class", "btn btn-primary");
		prevButton.setAttribute("type", "submit");
		prevButton.innerHTML = "&laquo"+" Previous";
		prevButton.addEventListener("click", function () {
		previousPage();
		});
		tablePrevNextDiv.appendChild(prevButton);	
	}


	// Create next button of FVtable.	
	nextButton = document.getElementById("FVtableNextButton");
	if(!nextButton) {			
		nextButton = document.createElement("BUTTON");
		nextButton.setAttribute("id", "FVtableNextButton");
		nextButton.setAttribute("class", "btn btn-primary");
		nextButton.setAttribute("type", "submit");
		nextButton.innerHTML = "Next "+"&raquo";
		nextButton.addEventListener("click", function () {
		nextPage();
		});
		tablePrevNextDiv.appendChild(nextButton);
	}
}

////########## FV stacked column chart ########## 
function FVstackedColumnChart() {
	var jsDataPeriod = jsData.map(data => data.Period);
	var jsDataCumulativePrincipal = jsData.map(data => data.CumulativePrincipal);
	var jsDataCumulativeInterest = jsData.map(data => data.CumulativeInterest);
	var x;
	var y;
	var name;
	var type;
	var chartDiv = document.getElementById("FVstackedColumnChartDiv");
	chartDiv.innerHTML  = "";
	
	// If number of elements in array is higher than 100, 
	// warn user and stop execution of function.
	if(jsDataPeriod.length>101) {
		chartDiv.innerHTML  = "<br><i>First chart render only if Number of Periods (n) is up to 100.</i><br>";
		return; // Stop execution of function FVstackedColumnChart.
	}
		
	var trace1 = {
		x: jsDataPeriod,
		y: jsDataCumulativePrincipal,
		name: 'Cumulative Principal',
		type: 'bar',
		marker:{ color: '#118DFF' },
		hovertemplate: 'Period: %{x}<br>Cumulative Principal: %{y}<extra></extra> '
	};
	
	var trace2 = {
		x: jsDataPeriod,
		y: jsDataCumulativeInterest,
		name: 'Cumulative Interest',
		type: 'bar',
		marker:{ color: '#12239E' },
		hovertemplate: 'Period: %{x}<br>Cumulative Interest: %{y}<extra></extra> '		   
	};
	
	var tblData = [trace1, trace2];
	
	var layout = {barmode: 'stack',   
		title: 'Future Value',
		yaxis: {
		title: 'Balance',
		tickprefix: '$',
		hoverformat: ',.2f',
		fixedrange: true	
		},
		xaxis: {
		title: 'Period',
		fixedrange: true
		},
		showlegend: true,
        legend: {
		x: 0,
		y: 1
		}
	}
	
	Plotly.newPlot('FVstackedColumnChartDiv', tblData, layout, {displayModeBar: false, staticPlot: true});		
}

////########## FV donut chart ########## 
function FVdonutChart() { 

	var Period = jsData.map(data => data.Period);
	var CumulativePrincipal = jsData.map(data => data.CumulativePrincipal);
	var CumulativeInterest = jsData.map(data => data.CumulativeInterest);
	
	var lastIndexCumulativePrincipal = CumulativePrincipal.length - 1;
	var lastIndexCumulativeInterest = CumulativeInterest.length - 1;	

	var lastValueCumulativePrincipal = CumulativePrincipal[lastIndexCumulativePrincipal].toFixed(2);
	var lastValueCumulativeInterest = CumulativeInterest[lastIndexCumulativeInterest].toFixed(2);
    var SumInterestAndPrincipal = toUSDCurrencyFormat(CumulativePrincipal[lastIndexCumulativePrincipal]+CumulativeInterest[lastIndexCumulativeInterest]);
	var chartColors = ['#118DFF', '#12239E'];
		
	var data = [{
		values: [lastValueCumulativePrincipal, lastValueCumulativeInterest],
		labels: ["Cumulative Principal", "Cumulative Interest"],
		domain: {column: 0},
		hole: .4,
		type: 'pie',
		marker: {
			colors: chartColors
		},
		hovertemplate:'<b>%{label}</b><br>%{percent}<br>$%{value}<extra></extra>'
	}];
	
	const margin = {
		top: 30,
		right: 10,
		bottom: 10,
		left: 10
	}
	
	var layout = {
		margin: {
			r: margin.right,
			l: margin.left,
			pad: 0
		},
		title: 'Future Value',
		annotations: [
			{
			showarrow: false,
			text:  '100%'
		}],
		showlegend: false	
	};
	
	if(Period.length<=101) {
		var chartDiv2 = document.getElementById("FVdonutChartDiv2");
		chartDiv2.innerHTML  = "";
		Plotly.newPlot("FVdonutChartDiv", data, layout, {displayModeBar: false});
	} else {
		var chartDiv = document.getElementById("FVdonutChartDiv");
		chartDiv.innerHTML  = "";
		Plotly.newPlot("FVdonutChartDiv2", data, layout, {displayModeBar: false});
	}
}