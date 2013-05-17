var fs = require('fs');
var http = require('http');

var artists;

function newSong(name, artistName, id)
{
	var temp = {
		"name":name,
		"artistName":artistName,
		"id":id
	};
	return temp;
}

function newArtist(name, songList)
{
	var temp = {
		"name":name,
		"songList":songList
	};
	return temp;
}

function nextSong()
{
	var totalSongs = 0;
	for (var i = 0; i < artists.length; ++i)
	{
		for (var j = 0; j < artists[i].songList.length; ++j)
		{
			++totalSongs;
		}
	}
	var nextIndex = Math.floor(Math.random() * totalSongs);
	totalSongs = 0;
	for (var i = 0; i < artists.length; ++i)
	{
		for (var j = 0; j < artists[i].songList.length; ++j)
		{
			if (totalSongs === nextIndex)
			{
				return artists[i].songList[j];
			}
			++totalSongs;
		}
	}
}

fs.readFile('./music.list', "ascii", function(err, data)
{
	if (err) throw err;
	fileContents = data;

	artists = JSON.parse(data);

	var requestInfo;

	var server = http.createServer(function(request, response)
	{
		requestInfo = null;
		request.on("data", function(chunk)
		{
			requestInfo = JSON.parse(chunk);
			if (requestInfo.post_type === "next song")
			{ response.end(JSON.stringify(nextSong())); }
			else if (requestInfo.post_type === "all songs")
			{ response.end(JSON.stringify(artists)); }
			else if (requestInfo.post_type === "add song")
			{
				data = requestInfo.data;
				
				var sameArtist = 0;
				for (var i = 0; sameArtist === 0 && i < artists.length; ++i)
				{
					if (data.artistName === artists[i].name)
					{
						artists[i].songList.push(data);
						sameArtist = 1;
					}
				}
				if (sameArtist ===0)
				{ artists.push(newArtist(data.artistName, [data])); }

				fs.writeFile("music.list", JSON.stringify(artists), {"encoding":"ascii"});

				response.end("done");
			}
		});
		request.on("end", function()
		{
			if (requestInfo === null)
			{
				fs.readFile('./client.html',function(err, data)
				{
					response.setHeader("Content-Type", "text/html");
					response.write(data);
					response.end();
				});
			}
		});
	});
	
	server.listen(7777);
});
