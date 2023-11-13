// variables
let timeSleep = document.getElementById('timeSleep');
let timeWakeUp = document.getElementById('bedtime');
let sleepCyclesBtn = document.getElementById('calculateSleepTimes');
let bedtimeBtn = document.getElementById('calculateBedtime');
let aboutSection = document.getElementById('about');
let sleepCyclesSection = document.getElementById('sleepCycles');
let bedtimeSection = document.getElementById('bedtimeCalculator');
let feedback1 = document.getElementById('feedbackCalculator1');
let feedback2 = document.getElementById('feedbackCalculator2');
let sleepTimes = []; // array to store calculated sleep times

// event listeners

sleepCyclesBtn.addEventListener('click', sleepCyclesEvent, false);
bedtimeBtn.addEventListener('click', bedtimeEvent, false);
document.addEventListener('scroll', scrollEvent, false);

//! functions

// scroll event (page down, apply animations)

function scrollEvent() {
	let scrollAnimation = document.getElementById('scrollAnimation');
	console.log('scrolling');
	scrollAnimation.classList.add('fadeOutUp'); // fade out the header + hero

	// After a delay of 2 seconds, hide the header + hero
	setTimeout(function () {
		scrollAnimation.style.display = 'none';
	}, 270);

	// add alter header
	let newHeader = document.createElement('header');

	newHeader.innerHTML = `<header class="newHeader"><h1>The Sleep Zone</h1> 
					<nav class="open">
						<ul>
							<li><a href="#" id="reload">Home</a></li>
							<li><a href="#about">About</a></li>
							<li><a href="#calculator">Calculator</a></li>
						</ul>
					</nav>
	</header>`;

	aboutSection.parentNode.insertBefore(newHeader, aboutSection);

	//! reload page (home) _______________________________
	let reload = document.getElementById('reload');
	// add the reload event here so it works here (is defined)
	reload.addEventListener('click', reloadPage, false);
	// reload page function
	function reloadPage() {
		location.reload();
	}

	// after first scroll, remove the event listener!! only the first scroll (always down) matters
	document.removeEventListener('scroll', scrollEvent);
}

// buttons events

function sleepCyclesEvent() {
	console.log('user falls asleep at: ' + calculateSleepTime(timeSleep.value));

	if (timeSleep.value === '') {
		feedback1.textContent = 'Please enter time above';
		return;
	}
	feedback1.textContent = '';
	calculateWakeUpTime();
}

function bedtimeEvent() {
	if (timeWakeUp.value === '') {
		feedback2.textContent = 'Please enter time above';
		return;
	}
	feedback2.textContent = '';
	calculateBestWakeUpTime(timeWakeUp.value);
}

// time calculators -- need value from hour input

// CALCULATE FALL ASLEEP TIME (returns time user will likely fall asleep)
function calculateSleepTime(timeToSleep) {
	timeToSleep = timeToSleep.split(':'); // form an array of strings
	let hours = parseInt(timeToSleep[0]);
	let minutes = parseInt(timeToSleep[1]);

	// calculating sleep time (add 14 minutes to time when user goes to bed)
	if (minutes + 14 > 60) {
		hours += Math.floor((minutes + 14) / 60);
		minutes = (minutes + 14) % 60;
	} else {
		minutes += 14;
	}

	hours = hours % 24;
	minutes = minutes % 60;

	if (hours < 10) {
		hours = '0' + hours;
	}

	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	let timeUserFallsAsleep = hours + ':' + minutes;

	return timeUserFallsAsleep;
}

// CALCULATE BEST SLEEP TIME ACCORDING TO TARGETED WAKE UP
function calculateBestWakeUpTime(targetedWakeUp) {
	let target = targetedWakeUp.split(':'); // form an array of strings
	let hours = parseInt(target[0]);
	let minutes = parseInt(target[1]);

	let totalMinutes = hours * 60 + minutes;
	// 7h 44 minutes = 464 minutes (7.5h cycles + 14mins fall asleep time)
	totalMinutes -= 464;
	console.log(totalMinutes);

	// if the time is negative, add 24 hours
	if (totalMinutes < 0) {
		totalMinutes = 24 * 60 - Math.abs(totalMinutes); // use the module to avoid errors (since totalminutes is negative)
		console.log(totalMinutes);
	}

	let time = timeConvert(totalMinutes);

	console.log(time);

	// create and add article with time

	if (document.querySelector('.articleBedtimeReset')) {
		document.querySelector('.articleBedtimeReset').remove(); // remove the previous article if present
	}

	let articleBedtime = document.createElement('article');
	articleBedtime.classList.add('wake', 'fadeIn', 'articleBedtimeReset');
	articleBedtime.innerHTML += `<p>This is your best bedtime</p>
							<ul>
								<li><b>${time}</b></li>
							</ul>`;
	bedtimeSection.appendChild(articleBedtime); // after everything, append the generated article
	window.scrollTo(0, window.pageYOffset + 250); // scroll a bit down x2
}
// CALCULATE BEST WAKE UP TIMES ARRAY (fills the sleepTimes array)
function calculateWakeUpTime() {
	sleepTimes = []; // reset the array
	let timeUserFallsAsleep = calculateSleepTime(timeSleep.value);

	timeUserFallsAsleep = timeUserFallsAsleep.split(':');
	let hours = parseInt(timeUserFallsAsleep[0]);
	let minutes = parseInt(timeUserFallsAsleep[1]);

	let totalMinutes = hours * 60 + minutes; // use minutes to avoid rounding
	console.log(totalMinutes);

	for (let i = 90; i <= 450; i += 90) {
		// 1.5 hours = 90 minutes
		totalMinutes += i;
		console.log(`i: ${i}, totalMinutes: ${totalMinutes}, time: ${timeConvert(totalMinutes)}`);
		/* ul.innerHTML += `<li>${timeConvert(totalMinutes)}</li>`; */

		let time = timeConvert(totalMinutes);

		sleepTimes.push(time); // push the wake up time to the array
		totalMinutes -= i; // reset totalMinutes for the next iteration
	}

	// creating the article to be added with the sleep times => use the generated array

	if (document.querySelector('.articleReset')) {
		document.querySelector('.articleReset').remove(); // remove the previous article if present
	}

	let article = document.createElement('article');
	article.classList.add('list', 'fadeIn', 'articleReset');
	article.innerHTML += `<p>Suggested wake up times:</p>
								<ul id="sleepTimes">
									<li><b>${sleepTimes[4]}</b> - Recommended</li>
									<li><b>${sleepTimes[3]}</b></li>
									<li>${sleepTimes[2]}</li>
									<li>${sleepTimes[1]}</li>
									<li>${sleepTimes[0]}</li>
								</ul>
						<p>Set your alarm to wake you up exactly at one of these times!</p>`;
	sleepCyclesSection.appendChild(article); // after everything, append the generated article
	window.scrollTo(0, window.pageYOffset + 450); // scroll a bit down
}

// time conversor -- convert minutes to hours:minutes

// CONVERT TIME IN MINUTES TO HOURS:MINUTES (——)
function timeConvert(num) {
	let hours = Math.floor(num / 60); // math.floor rounds down to the nearest integer
	let minutes = num % 60; // the remainder is the minutes

	// resets day when it reaches 24
	if (hours >= 24) {
		hours -= 24;
	}

	// add leading 0
	if (hours < 10) {
		hours = '0' + hours;
	}

	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	return hours + ':' + minutes;
}
