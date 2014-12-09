var tests = [
	{
		description: "Habrahabr",
		url: "http://habrahabr.ru",
		cases: [
			{
				description: "Has element #TMpanel",
				code: function() {
					return document.getElementById('TMpanel') != undefined;
				}
			},
			{
				description: "Element #TMpanel length == 899",
				code: function() {
					return document.getElementById('TMpanel').innerHTML.length == 899;
				}
			}
		]
	},
	{
		description: "Pikabu",
		url: "http://pikabu.ru",
		cases: [
			{
				description: "Has element #TMpanel",
				code: function() {
					return document.getElementById('TMpanel') != undefined;
				}
			},
			{
				description: "Element #TMpanel length == 899",
				code: function() {
					return document.getElementById('TMpanel').innerHTML.length == 899;
				}
			}
		]
	}
	// {
	// 	description: "Dimaskdd",
	// 	url: "https://api.twitch.tv/kraken/streams/dimaskdd.json",
	// 	cases: [
	// 		{
	// 			description: "Is live",
	// 			code: function() {
	// 				return JSON.parse(document.body.innerText).stream !== null;
	// 			}
	// 		}
	// 	]
	// },
	// {
	// 	description: "SLTV",
	// 	url: "https://api.twitch.tv/kraken/streams/roxkisabver.json",
	// 	cases: [
	// 		{
	// 			description: "Is live",
	// 			code: function() {
	// 				return JSON.parse(document.body.innerText).stream !== null;
	// 			}
	// 		}
	// 	]
	// }
];

