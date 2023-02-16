<?php
 /**
 *
 * Template Name: future-value-calculator-template
 * @package WordPress
 * @subpackage gorcik
 * @since gorcik 1.0.0
 * Author:       Ing. Petr Gorčík
 * Author URI:   https://www.gorcik.cz
 * GitHub URI:   https://github.com/petrgorcik/future-value-calculator-with-formula-and-calculation/
 * Version: 	 1.1.1
 * License:      GNU General Public License v3
 * License URI:  http://www.gnu.org/licenses/gpl-3.0.html
 * Link to calculator: https://gorcik.cz/calculators/investing/future-value-calculator-with-formula-and-calculation/
 */

get_header();
 ?>
<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">		
		<?php
		// Start the loop.
		while ( have_posts() ) :
			the_post(); 						
		?>            
	
  				<div class="container">
  					<div class="row">
						<div class="col">
							<!-- Heading -->	
							<h1 id="future-value-calculator-heading"><?php single_post_title(); ?></h1>					
						</div>
					</div>
  					<div class="row">
						<div class="col-lg-8 col-md-8 mx-auto" >													  
							  <!-- Future Value Calculator -->
							  <form class="needs-validation" id="form-future-value-calculator">
  								<!-- Input number of periods and type of periods (years, months, days). -->		
								<div class="input-group" >
									<span class="input-group-text maxWidthFormFVC rounded-0" id="">Number of Periods (n)<span class="redAsterix">*</span></span>
									<input type="number" id="FormControlNumberOfPeriods" class="form-control rounded-0" onBlur="toFinalNumberFormat(this);"  min = "1" max = "36503" value="20" required>																										
  								</div>  
								
  								<!-- Input Starting Amount. -->		
  								<div class="input-group">
									<span class="input-group-text maxWidthFormFVC rounded-0" id="">Starting Amount (PV)</span>
									<input type="text" id="FormControlStartingAmount" class="form-control rounded-0" onBlur="toFinalCurrencyFormat(this, 'PV');" minlength = "1" maxlength = "10" value="$1,000.00" placeholder="$">
  								</div>  							
																	
  								<!-- Input interest rate and type of interest rate (yearly, monthly, daily)  add perecent behind input value. -->		
  								<div class="input-group">
									<span class="input-group-text maxWidthFormFVC rounded-0" id="">Interest Rate (r)<span class="redAsterix">*</span></span>
									
									<input type="text" id="FormControlInterestRate" class="form-control rounded-0" onBlur="toFinalPercentFormat(this);" placeholder="%" minlength = "1" maxlength = "9" value="5.0000%" required >					
  								</div> 								
																
  								<!-- Input periodic deposit amount.  -->		
  								<div class="input-group">
									<span class="input-group-text maxWidthFormFVC rounded-0" id="">Periodic Deposit (PMT)<span class="redAsterix">*</span></span>
									<input type="text" id="FormControlPMTAmount" class="form-control rounded-0" onBlur="toFinalCurrencyFormat(this,'PMT');" placeholder="$"  minlength = "1" maxlength = "10" value="$1,000.00" required >
  								</div>
								
	  							<!-- Choose, whether periodic deposits are made at the end or beginning of each period.  -->		
  								<div class="input-group">
	                             <span class="input-group-text rounded-0" id="">Periodic Deposit made at the</span>
									<select class="form-select rounded-0" id="FormControlPeriodicDepositMadeAt">
										<option>end</option>
										<option>beginning</option>
									</select>
								<span class="input-group-text rounded-0" id="">of each period.</span>
  								</div> 
							  <!-- Center calculate button.  -->	
							  <div class="d-flex justify-content-center">
							  <!-- Calculate button  -->
							  <button type="submit" class="btn btn-primary" id="FutureValueCalcutorCalculateButton">CALCULATE</button>
							  </div>
							  </form>
						</div>
						<div class="col-lg-4 col-md-4 mx-auto" >
							 <!-- Show result. -->
							 <div id="ResultFV"></div>
						</div>		
 					</div>
					<!-- FV charts -->							
					<div class="row">								
						<div class="col-lg-8 col-md-8 mx-auto">
							<div id='FVstackedColumnChartDiv'><!-- Plotly chart will be drawn inside this DIV. --></div>
						</div>
						<div class="col-lg-4 col-md-4 mx-auto">
							<div id='FVdonutChartDiv'><!-- Plotly chart will be drawn inside this DIV. --></div>
						</div>
					</div>
					<!-- FV charts 2 -->							
					<div class="row">								
						<div class="col-lg-12 col-md-12 mx-auto">
							<div id='FVdonutChartDiv2'><!-- Plotly chart will be drawn inside this DIV. --></div>
						</div>
					</div>
					<!-- FV table -->		
					<div class="row">
						<div class="col-lg-12 col-md-12 mx-auto">
							<div id="FVtableName"></div>
							<div id="FVtableDiv">
								<table id="FVtable">
								</table>
							</div>
							<div id="FVtablePrevNextDiv" class="d-flex justify-content-center">
							</div>	
						</div>
					</div>	
					<!-- FV table -->		
					<div class="row">
						<div class="col-lg-12 col-md-12 mx-auto">
							    <br><br>
								<b><a href="https://github.com/petrgorcik/future-value-calculator-with-formula-and-calculation/">GitHub code of Future Value Calculator</a></b>
						</div>
					</div>	
				</div>
	   <?php 
	 // End the loop.
	 endwhile;
	 ?>
	</main><!-- .site-main -->
</div>	 
<?php get_footer(); ?>	