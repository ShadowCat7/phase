function fillAllSongs()
{
	var allSongsTextFill = "<tr class='everyEven'><td>" + allSongs[0].name + "</td></tr>";
	
	for (var i = 1; i < allSongs.length; ++i)
	{
		if (i % 2 === 0)
		{ allSongsTextFill += "<tr class='everyEven'>"; }
		else
		{ allSongsTextFill += "<tr class='everyOdd'>"; }
		allSongsTextFill += "<td>" + allSongs[i].name + "</td></tr>";
	}

	$("#allSongsTable").html(allSongsTextFill);
}

function fillUpcoming()
{
	var upcomingTextFill = "<tr><th>Song</th><th>Artist</th></tr><tr class='everyOdd'><td>" + currentSong.name + "</td><td>" + currentSong.artistName + "</td></tr>";

	for (var i = 0; i < upcomingSongList.length; ++i)
	{
		if (i % 2 === 0)
		{ upcomingTextFill += "<tr class='everyEven'>"; }
		else
		{ upcomingTextFill += "<tr class='everyOdd'>"; }
		upcomingTextFill += "<td>" + upcomingSongList[i].name + "</td><td>" + upcomingSongList[i].artistName + "</td></tr>";
	}

	$("#upcomingTable").html(upcomingTextFill);

	$(".infoTable tr")[1].style.background = "#EDCB64";
}

var allSongs = [];

function getAllSongs()
{
	var tempPost = JSON.stringify({"post_type":"all songs"});
	$.post("http://127.0.0.1:7777", tempPost, function(data, textStatus, jqXHR)
	{
		data = JSON.parse(data);
		allSongs = data;
		fillAllSongs();
	});
}

function findSongInList(artistName, songName)
{
	for (var i = 0; i < allSongs.length; ++i)
	{
		if (artistName === allSongs[i].name)
		{
			for (var j = 0; j < allSongs[i].songList.length; ++j)
			{
				if (allSongs[i].songList[j].name === songName)
				{ return allSongs[i].songList[j]; }
			}
		}
	}
}

var upcomingSongList = [];

function getNextSong(callback)
{
	var tempPost = JSON.stringify({"post_type":"next song"});
	$.post("http://127.0.0.1:7777", tempPost, function(data, textStatus, jqXHR)
	{
		upcomingSongList.push(JSON.parse(data));
		if (callback)
		{ callback(); }
	});
}

function nextSong()
{
	getNextSong(function()
	{
		currentSong = upcomingSongList.shift();
		ytplayer.loadVideoById(currentSong.id);
		fillUpcoming();
	});
}

function addNewSong()
{
	var inputs = $("input");
	var stayInLoop = 1;
	for (var i = 0; stayInLoop === 1 && i < 3; ++i)
	{
		if (inputs[i].value === "")
		{ stayInLoop = 0; }
		else
		{ inputs[i] = inputs[i].value; }
	}
	if (stayInLoop === 1)
	{
		var newVideoID = "";
		stayInLoop = new Boolean(true);
		var get = 0;
		for (var i = 0; stayInLoop && i < inputs[2].length; ++i)
		{
			if (get === 3)
			{
				if (inputs[2][i] === "&")
				{ stayInLoop = new Boolean(false); }
				else
				{ newVideoID += inputs[2][i]; }
			}
			else
			{
				if (inputs[2][i] === "&" || inputs[2][i] === "?")
				{ ++get; }
				else if (inputs[2][i] === "v")
				{ ++get; }
				else if (inputs[2][i] === "=")
				{ ++get; }
				else
				{ get = 0; }
			}
		}
		
		if (newVideoID != "")
		{
			var sendData =
			{
				"post_type": "add song",
				"data": {
					"name": inputs[0],
					"artistName": inputs[1],
					"id": newVideoID
				}
			}

			$.post("http://127.0.0.1:7777", JSON.stringify(sendData), function(data, textStatus, jqXHR)
			{
				if (data === "done")
				{
					for (var i = 0; i < 3; ++i)
					{ $("input")[i].value = ""; }
					getAllSongs();
				}
			});
		}
	}
}

$(document).ready(function()
{
	$(".rightContainer").hide();
	$("#songListContainer").show();
	swfobject.embedSWF("http://www.youtube.com/v/l8JCX9E0bEI&enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1&controls=0&disablekb=1&iv_load_policy=3", "ythere", $(".videoSize").width(), $(".videoSize").height(), "8", null, null, { allowScriptAccess: "always" }, { id: "myytplayer" });
	$(window).resize(function()
	{
		$("#myytplayer").width($(".videoSize").width());
		$("#myytplayer").height($(".videoSize").height());
	});
	
	$(".tab").hover(
		function()
		{ $(this).css("background-color", "AAAAAA"); },
		function()
		{ $(this).css("background-color", "111111"); }
	);
	
	$("#addTab").click(function()
	{
		$(".rightContainer").hide();
		$("#addSongContainer").show();
	});
	$("#songsTab").click(function()
	{
		$(".rightContainer").hide();
		$("#songListContainer").show();
	});
	$("#chatTab").click(function()
	{
		$(".rightContainer").hide();
		$("#chatContainer").show();
	});

	$("#upcomingTable").bind("contextmenu", function(e) {
		console.log("mouse.y: " + e.pageY);
		console.log("window.height: " + $(window).height());
		console.log("menu.height: " + $(".menu").height());
		var menuTop = e.pageY;
		if (e.pageY + 2 * $(".menu").height() >= $(window).height() + 1)
		{ menuTop = e.pageY - 2 * $(".menu").height(); }
		var menuLeft = e.pageX;
		if (e.pageX + 2 * $(".menu").width() >= $(window).width() + 1)
		{ menuLeft = e.pageX - 2 * $(".menu").width(); }
		$(".menu").css({
			top: menuTop,
			left: menuLeft
		});
		$(".menu").show();
		console.log("menu.height afterwards: " + $(".menu").height());
		console.log(" ");

		return false;
	});

	$(document).click(function()
	{ $(".menu").hide(); });

	$("#allSongsTable").on("click", function()
	{
		$("#allSongsTable tr").on("click", function(e)
		{
			var tempTable = $("#allSongsTable")[0];
			var rowIndex = 0;
			while (tempTable.rows.item(rowIndex) !== this)
			{ rowIndex++; }
			if (tempTable.rows.item(rowIndex) === "rgb(170, 0, 170)")
			{
				
			}
			else
			{
				tempTable.insertRow(rowIndex + 1).outerHTML = "<tr style='background-color:#AA00AA'><td style='padding-left:5%'>Hello</td></tr>";
			}

			e.stopPropagation();
		});
	});

	$("#upcomingTable").click(function()
	{
		$("#upcomingTable tr").click(function()
		{
			for (var i = 0; i < $("#upcomingTable tr").length; ++i)
			{
				if ($("#upcomingTable tr")[i].style.background === "rgb(237, 203, 100)")
				{
					if (i % 2 === 0)
					{ $("#upcomingTable tr")[i].style.background = "#777777"; }
					else
					{ $("#upcomingTable tr")[i].style.background = "#888888"; }
				}
			}
			this.style.background = "#EDCB64";
		});
	});
});