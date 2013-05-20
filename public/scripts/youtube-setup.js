function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");

	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");

	getAllSongs();

	for (var i = 0; i < 19; ++i)
	{ getNextSong(); }
	nextSong();
}

function muteVideo() {
	if (ytplayer.isMuted()) {
		ytplayer.unMute();
		$("#muteButton").text("Mute");
	}
	else {
		ytplayer.mute();
		$("#muteButton").text("Unmute");
	}
}

function onPlayerStateChange(newState) {
	if (newState === 0)
	{ nextSong(); }
	else if (newState === 2)
	{ ytplayer.playVideo(); }
}
