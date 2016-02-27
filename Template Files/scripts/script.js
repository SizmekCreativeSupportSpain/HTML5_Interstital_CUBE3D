var autoCollapseTimeout;
var isAndroid2 = (/android 2/i).test(navigator.userAgent);
var android2ResizeTimeout;

var cubeDiv,intervaloGiro;
var initPosX = 0;
var currentRotation = 0;
var initRotation = 0;
var degree = 0;

function startAd() {
	cubeDiv = document.getElementById("cube");
	document.getElementById("closeButton").addEventListener("click",function(){
		collapse();
	});

	initializeCustomVariables();
	addEventListeners();
	expand();
	if (is_touch_device() && adConfig.isDraggable) {
		cubeDiv.addEventListener("touchstart",onTouchStartedDraggable);
	}else if(is_touch_device()){
		cubeDiv.addEventListener("touchstart",onTouchStarted);
	}else{
		cubeDiv.addEventListener("mousedown",onMouseDown);
	}
}

function initializeCustomVariables() {
	if (!EB._isLocalMode && EB._adConfig.customJSVars) {
		var customVariables = EB._adConfig.customJSVars;

		if (EBG.isNumber(customVariables.mdTimeUntilAutoCollapse)) {
			adConfig.timeUntilAutoCollapse = customVariables.mdTimeUntilAutoCollapse;
		}

		if (EBG.isBool(customVariables.mdLockScrollingWhenExpanded)) {
			adConfig.lockScrollingWhenExpanded = customVariables.mdLockScrollingWhenExpanded;
		}

		if (EBG.isBool(customVariables.mdCancelAutoCollapseOnUserInteraction)) {
			adConfig.cancelAutoCollapseOnUserInteraction = customVariables.mdCancelAutoCollapseOnUserInteraction;
		}
	}
}


function addEventListeners() {
	if (adConfig.cancelAutoCollapseOnUserInteraction) {
		var ad = document.getElementById("ad");
		ad.addEventListener("mousedown", cancelAutoCollapse);
		ad.addEventListener("touchstart", cancelAutoCollapse);
	}
}

function clickthrough(event) {
	EB.clickthrough();
}

function cancelAutoCollapse(event) {
	clearTimeout(autoCollapseTimeout);
	event.currentTarget.removeEventListener("mousedown", cancelAutoCollapse);
	event.currentTarget.removeEventListener("touchstart", cancelAutoCollapse);
}

function expand() {
	EB.expand({
		actionType: EBG.ActionType.AUTO
	});
	if (adConfig.lockScrollingWhenExpanded) {
		preventPageScrolling();
	}
	if (adConfig.timeUntilAutoCollapse > 0){
		autoCollapseTimeout = setTimeout(collapse, adConfig.timeUntilAutoCollapse);
	}
	setTimeout(function(){
		autoSpin();
	},1000);
}



function collapse(event) {
	EB.collapse();
	if (adConfig.lockScrollingWhenExpanded) {
		allowPageScrolling();
	}
	removeAd();
}
function onTouchStartedDraggable(e){
	initPosX = e.changedTouches[0].clientX;
	initRotation = currentRotation;
	cubeDiv.addEventListener('touchmove',onTouchMoveDraggable);
	cubeDiv.addEventListener('touchend',onTouchEndedDraggable);
}
function onTouchMoveDraggable(e){
	setSpinSpeed(0);
	degree = Math.round(currentRotation+(e.changedTouches[0].clientX-initPosX)*90/320);

    cubeDiv.style.webkitTransform = "scale(0.75) rotateY("+degree+"deg) translateZ(0px)";
	cubeDiv.style.transform = "scale(0.75) rotateY("+degree+"deg) translateZ(0px)";
}
function onTouchEndedDraggable(e){
	var diff = 0;
	clearInterval(intervaloGiro);
	degree = Math.round(currentRotation+(e.changedTouches[0].clientX-initPosX)*90/320);
	
	if(degree>initRotation){
		while(degree%90!=0){
			degree++;
			diff++;
		}
		if(diff<0){
			degree+=90;
		}
		EB.userActionCounter("Drag User Cube Left");
	}else{
		while(degree%90!=0){
			degree--;
			diff--;
		}
		if(diff>0){
			degree-=90;
		}
		EB.userActionCounter("Drag User Cube Right");
	}
	var speed = Math.abs(diff)/90;
	
	setSpinSpeed(speed);

	cubeDiv.style.webkitTransform = "scale(0.75) rotateY("+degree+"deg) translateZ(0px)";
	cubeDiv.style.transform = "scale(0.75) rotateY("+degree+"deg) translateZ(0px)";
	
	currentRotation = degree;
	cubeDiv.removeEventListener('touchmove',onTouchMoveDraggable);
	cubeDiv.removeEventListener('touchend',onTouchEndedDraggable);
	cubeDiv.removeEventListener('touchcanceled',onTouchEndedDraggable);

	setTimeout(function(){
		autoSpin();
	},1000);
}

	
function onTouchStarted(e){
	initPosX = e.changedTouches[0].clientX;
	cubeDiv.addEventListener('touchend',onTouchEnded);
}

function onTouchEnded(e){
	clearInterval(intervaloGiro);
	if(initPosX<e.changedTouches[0].clientX - 100){
		setSpinSpeed(1);
		applySpin(90);
		EB.userActionCounter("Touch User Cube Left");
	}else if(initPosX>e.changedTouches[0].clientX + 100){
		setSpinSpeed(1);
		applySpin();
		EB.userActionCounter("Touch User Cube Right");
	}else{
		//If the touch movement is not enough
		//EB.clickthrough();
	}
	cubeDiv.removeEventListener('touchend',onTouchEnded);
	setTimeout(function(){
		autoSpin();
	},1000);
}
function onMouseDown(e){
	initPosX = e.clientX;
	cubeDiv.addEventListener('mouseout',onMouseOut);
}
function onMouseOut(e){
	clearInterval(intervaloGiro);
	if(initPosX<e.clientX - 100){
		setSpinSpeed(1);
		applySpin(90);
		EB.userActionCounter("Desktop User Cube Left");
	}else if(initPosX>e.clientX + 100){
		setSpinSpeed(1);
		applySpin();
		EB.userActionCounter("Desktop User Cube Right");
	}else{
		//If the touch movement is not enough
		//EB.clickthrough();
	}
	cubeDiv.removeEventListener('mouseout',onMouseOut);
	setTimeout(function(){
		autoSpin();
	},1000);
}
function autoSpin(){
	setSpinSpeed(3);
	clearInterval(intervaloGiro);
	intervaloGiro = setInterval(function(){
		EB.automaticEventCounter("Cube Auto Spin");
		applySpin();		
	}, adConfig.autoSpinInterval);
}

function applySpin(degrees){
	if(!isNaN(degrees)){
		currentRotation += degrees;
	}else{
		currentRotation -= 90;
	}
	cubeDiv.style.webkitTransform = "scale(0.75) rotateY("+currentRotation+"deg) translateZ(0px)";
	cubeDiv.style.transform = "scale(0.75) rotateY("+currentRotation+"deg) translateZ(0px)";
}

function setSpinSpeed(seconds){
	cubeDiv.style.webkitTransition = seconds+"s";
	cubeDiv.style.transition = seconds+"s";
}