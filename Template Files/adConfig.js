var adConfig = {
    "timeUntilAutoCollapse": "0", //miliseconds, use 0 for no autocollapse
    "cancelAutoCollapseOnUserInteraction": true,
    "lockScrollingWhenExpanded": true,
    "isDraggable":true,
    "autoSpinInterval":8000  //miliseconds
};

////////Funciones comunes, NO ELIMINAR!!!!!!!!////////////////////

function initEB(){
	if (!EB.isInitialized()) {
		EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
	}else {
		startAd();
	}
}

function is_touch_device() {
	return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

function allowPageScrolling() {
    document.removeEventListener("touchmove", stopScrolling);
}

function removeAd() {
    document.getElementById("ad").style.display = "none";

    var message = {
        adId: getAdID(),
        type: "removeAd"
    };

    window.parent.postMessage(JSON.stringify(message), "*");
}

function getAdID() {
    if (EB._isLocalMode) {
        return null;
    }
    else {
        return EB._adConfig.adId;
    }
}

function onMessageReceived(event) {
    try {
        var messageData = JSON.parse(event.data);

        if (messageData.adId && messageData.adId === getAdID()) {
            if (messageData.type && messageData.type === "resize") {
                if (isAndroid2) {
                    forceResizeOnAndroid2();
                }
            }
        }
    }
    catch (error) {
        EBG.log.debug(error);
    }
}

function forceResizeOnAndroid2() {
    document.body.style.opacity = 0.99;
    clearTimeout(android2ResizeTimeout);
    android2ResizeTimeout = setTimeout(function() {
        document.body.style.opacity = 1;
        document.body.style.height = window.innerHeight;
        document.body.style.width = window.innerWidth;
    }, 200);
}

function preventPageScrolling() {
    document.addEventListener("touchmove", stopScrolling);
}

function stopScrolling(event) {
    event.preventDefault();
}

window.addEventListener("message", onMessageReceived);
window.addEventListener("load", initEB);
///////////////////////////////////////////////////////////////////