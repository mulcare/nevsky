// Run this script inside the "tools" directory to generate data.js and build_counters3.sh

"use strict"

const fs = require('fs')

// :r !python3 genboxes.py
const boxes = {
"Wesenberg": [1448,3625,304,60],
"Fellin": [1013,4583,184,61],
"Odenpäh": [1378,5103,250,61],
"Adsel": [1504,5612,185,60],
"Wenden": [909,5759,232,60],
"Luga": [2667,3295,148,62],
"Kaibolovo": [2904,3522,285,62],
"Koporye": [3133,3160,241,62],
"Neva": [3924,2934,148,62],
"Volkhov": [4591,3783,231,63],
"Lovat": [4243,5581,187,63],
"Porkhov": [3515,5467,241,63],
"Izborsk": [2240,5431,241,62],
"Velikiye Luki": [3706,6347,351,61],
"Tesovo": [3936,4102,121,32],
"Zheltsy": [3501,4176,128,30],
"Sablia": [3788,4541,104,31],
"Gdov": [2427,4149,88,30],
"Dubrovno": [3153,5214,161,31],
"Ostrov": [2746,5717,115,30],
"Rositten": [2046,6307,146,30],
"Kirrumpäh": [1877,5389,175,30],
"Pernau": [517,4580,118,30],
"Narwia": [2371,3549,123,31],
"Wierland": [1999,3680,200,100],
"Warbola": [292,3797,142,31],
"Waiga": [1535,4113,200,100],
"Jerwen": [1064,3946,200,100],
"Harrien": [567,3983,200,100],
"Sackala": [617,4769,200,100],
"Metsepole": [509,5226,200,100],
"Lettgallia": [2048,5777,200,100],
"Tolowa": [1541,5933,200,100],
"Ugaunia": [1957,4940,200,100],
"Revala": [1030,3410,200,100],
"Velikaya River": [3029,6090,200,100],
"Sorot River": [3299,5781,200,100],
"Shelon River": [3654,4864,200,100],
"Zhelcha River": [2782,4586,200,100],
"Plyussa River": [2829,4234,200,100],
"Ingria": [3820,3639,200,100],
"Vod": [3488,3345,200,100],
"Izhora": [4074,3323,200,100],
"Karelia": [3833,2408,200,100],
"Ladoga": [4619,2817,238,90],
"Novgorod": [4318,4315,333,112],
"Rusa": [4329,5166,205,92],
"Riga": [273,6231,205,91],
"Pskov": [2680,5263,205,91],
"Dorpat": [1625,4589,253,91],
"Leal": [108,4266,205,91],
"Reval": [601,3564,206,91],
"box1": [40,168,592,917],
"box2": [650,168,591,913],
"box3": [1313,167,591,916],
"box4": [1922,167,590,916],
"box5": [2587,167,592,918],
"box6": [3196,167,588,916],
"box7": [3859,167,594,916],
"box8": [4469,166,591,918],
"box9": [39,1119,594,915],
"Victory": [172,183,217,215],
"Turn": [399,184,216,214],
"Novgorod Veche": [4193,5847,844,628],
"Uzmen": [2112,4692,200,100],
"way-crossroads": [1500,4717,462,149],
"way-wirz": [1295,4526,175,350],
"way-peipus-east": [2232,4197,220,465],
"way-peipus-north": [2065,3836,361,228],
"way-peipus-west": [1988,4141,218,520],
}

let data = []
function print(str) {
	data.push(str)
}

var locmap = {}

// 0=offmap, 1-N=map locales, 100-M=calendar boxes
var locales = []
var ways = []
var waterways = []
var trackways = []

const scale = 1

const vp_map = {
	archbishopric: 3,
	city: 2,
	fort: 1,
	bishopric: 2,
	castle: 1,
	traderoute: 1,
	town: 0.5,
	region: 0.5,
}

const wall_map = {
	archbishopric: 3,
	city: 3,
	fort: 3,
	traderoute: 0,
	bishopric: 4,
	castle: 4,
	town: 0,
	region: 0,
}

function defloc(region, stronghold, type, name) {
	let [x, y, w, h] = boxes[name]
	x = Math.round(x * scale)
	y = Math.round(y * scale)
	w = Math.round(w * scale)
	h = Math.round(h * scale)
	locmap[name] = locales.length
	let vp = vp_map[type]
	let walls = wall_map[type]
	locales.push({ name, type, stronghold, walls, vp, region, ways: [], box: { x, y, w, h } })
}

function defway(type, list) {
	let ix = ways.length
	list = list.map(name=>locmap[name]).sort((a,b)=>a-b)
	ways.push({type, locales: list})
	for (let from of list) {
		for (let to of list) {
			if (from !== to) {
				let old = locales[from].ways.find(w => w[0] === to)
				if (old)
					old.push(ix)
				else
					locales[from].ways.push([to, ix])
			}
		}
	}
	return ways[ix]
}

function waterway(locs) { return defway('waterway', locs.split(", ")) }
function trackway(locs) { return defway('trackway', locs.split(", ")) }

defloc("Danish Estonia", 3, "bishopric", "Reval")
defloc("Danish Estonia", 2, "castle", "Wesenberg")
defloc("Danish Estonia", 0, "town", "Narwia")
defloc("Danish Estonia", 0, "town", "Warbola")
defloc("Danish Estonia", 0, "region", "Harrien")
defloc("Danish Estonia", 0, "region", "Revala")
defloc("Danish Estonia", 0, "region", "Wierland")

defloc("Crusader Livonia", 3, "bishopric", "Dorpat")
defloc("Crusader Livonia", 3, "bishopric", "Leal")
defloc("Crusader Livonia", 3, "bishopric", "Riga")
defloc("Crusader Livonia", 2, "castle", "Adsel")
defloc("Crusader Livonia", 2, "castle", "Fellin")
defloc("Crusader Livonia", 2, "castle", "Odenpäh")
defloc("Crusader Livonia", 2, "castle", "Wenden")
defloc("Crusader Livonia", 0, "town", "Kirrumpäh")
defloc("Crusader Livonia", 0, "town", "Pernau")
defloc("Crusader Livonia", 0, "town", "Rositten")
defloc("Crusader Livonia", 0, "region", "Jerwen")
defloc("Crusader Livonia", 0, "region", "Lettgallia")
defloc("Crusader Livonia", 0, "region", "Metsepole")
defloc("Crusader Livonia", 0, "region", "Sackala")
defloc("Crusader Livonia", 0, "region", "Tolowa")
defloc("Crusader Livonia", 0, "region", "Ugaunia")
defloc("Crusader Livonia", 0, "region", "Waiga")

defloc("Novgorodan Rus", 3, "archbishopric", "Novgorod")
defloc("Novgorodan Rus", 3, "city", "Ladoga")
defloc("Novgorodan Rus", 3, "city", "Pskov")
defloc("Novgorodan Rus", 3, "city", "Rusa")
defloc("Novgorodan Rus", 0, "traderoute", "Lovat")
defloc("Novgorodan Rus", 0, "traderoute", "Luga")
defloc("Novgorodan Rus", 0, "traderoute", "Neva")
defloc("Novgorodan Rus", 0, "traderoute", "Volkhov")
defloc("Novgorodan Rus", 1, "fort", "Izborsk")
defloc("Novgorodan Rus", 1, "fort", "Kaibolovo")
defloc("Novgorodan Rus", 1, "fort", "Koporye")
defloc("Novgorodan Rus", 1, "fort", "Porkhov")
defloc("Novgorodan Rus", 1, "fort", "Velikiye Luki")
defloc("Novgorodan Rus", 0, "town", "Dubrovno")
defloc("Novgorodan Rus", 0, "town", "Gdov")
defloc("Novgorodan Rus", 0, "town", "Ostrov")
defloc("Novgorodan Rus", 0, "town", "Sablia")
defloc("Novgorodan Rus", 0, "town", "Tesovo")
defloc("Novgorodan Rus", 0, "town", "Zheltsy")
defloc("Novgorodan Rus", 0, "region", "Ingria")
defloc("Novgorodan Rus", 0, "region", "Izhora")
defloc("Novgorodan Rus", 0, "region", "Karelia")
defloc("Novgorodan Rus", 0, "region", "Plyussa River")
defloc("Novgorodan Rus", 0, "region", "Shelon River")
defloc("Novgorodan Rus", 0, "region", "Sorot River")
defloc("Novgorodan Rus", 0, "region", "Uzmen")
defloc("Novgorodan Rus", 0, "region", "Velikaya River")
defloc("Novgorodan Rus", 0, "region", "Vod")
defloc("Novgorodan Rus", 0, "region", "Zhelcha River")

waterway("Dorpat, Narwia, Gdov, Uzmen").name = "Pleipat W"
waterway("Gdov, Uzmen").name = "Pleipat E"
waterway("Fellin, Dorpat, Odenpäh").name = "Wirz"
trackway("Dorpat, Odenpäh, Ugaunia").name = "Crossroads"

waterway("Uzmen, Pskov")
waterway("Uzmen, Zhelcha River")
waterway("Novgorod, Shelon River, Rusa")
waterway("Pernau, Fellin, Jerwen")
waterway("Riga, Wenden")
waterway("Wenden, Adsel")
waterway("Pskov, Ostrov")
waterway("Ostrov, Velikaya River")
waterway("Sorot River, Velikaya River")
waterway("Rusa, Lovat")
waterway("Lovat, Velikiye Luki")
waterway("Shelon River, Dubrovno")
waterway("Shelon River, Porkhov")
waterway("Narwia, Plyussa River")
waterway("Luga, Kaibolovo")
waterway("Kaibolovo, Zheltsy")
waterway("Zheltsy, Sablia")
waterway("Zheltsy, Tesovo")
waterway("Ladoga, Volkhov")
waterway("Volkhov, Novgorod")
waterway("Neva, Ladoga")

trackway("Reval, Revala")
trackway("Revala, Wesenberg")
trackway("Wierland, Narwia")
trackway("Narwia, Kaibolovo")
trackway("Wierland, Waiga")
trackway("Wesenberg, Jerwen")
trackway("Reval, Warbola")
trackway("Warbola, Harrien")
trackway("Harrien, Jerwen")
trackway("Warbola, Leal")

trackway("Waiga, Dorpat")
trackway("Leal, Pernau")
trackway("Fellin, Sackala")
trackway("Sackala, Metsepole")
trackway("Metsepole, Wenden")
trackway("Wenden, Tolowa")
trackway("Tolowa, Rositten")
trackway("Lettgallia, Rositten")
trackway("Adsel, Tolowa, Lettgallia")
trackway("Adsel, Kirrumpäh")
trackway("Odenpäh, Kirrumpäh")
trackway("Kirrumpäh, Izborsk")
trackway("Ugaunia, Uzmen")
trackway("Ugaunia, Izborsk")
trackway("Lettgallia, Ostrov")
trackway("Lettgallia, Izborsk")

trackway("Izborsk, Pskov")
trackway("Kaibolovo, Koporye")
trackway("Koporye, Vod")
trackway("Vod, Neva")
trackway("Vod, Ingria")
trackway("Karelia, Neva")
trackway("Neva, Izhora")
trackway("Izhora, Ladoga")
trackway("Izhora, Ingria")
trackway("Ingria, Tesovo")
trackway("Tesovo, Novgorod")
trackway("Novgorod, Sablia")
trackway("Sablia, Shelon River")

trackway("Gdov, Plyussa River")
trackway("Plyussa River, Zheltsy")
trackway("Plyussa River, Zhelcha River")
trackway("Zhelcha River, Pskov")
trackway("Pskov, Dubrovno")
trackway("Dubrovno, Porkhov")
trackway("Porkhov, Sorot River")
trackway("Velikaya River, Velikiye Luki")

let seaports = [
	"Riga", "Pernau", "Leal", "Reval", "Narwia", "Luga", "Koporye", "Neva"
].map(name => locmap[name]).sort((a,b)=>a-b)

function dumplist(name, list) {
	print(name + ":[")
	for (let item of list)
		print(JSON.stringify(item) + ",") 
	print("],")
}

function seats(list) {
	return list.split(", ").map(name => locmap[name]).sort((a,b)=>a-b)
}

let lords = [

	{
		side: "Teutonic",
		name: "Andreas",
		full_name: "Andreas von Felben",
		title: "Landmeister in Livonia",
		seats: seats("Riga, Wenden"),
		marshal: 2,
		fealty: 2,
		service: 4,
		lordship: 3,
		command: 3,
		forces: {
			knights: 1,
			sergeants: 2,
			men_at_arms: 1,
		},
		assets: {
			transport: 2,
			prov: 2,
		},
		ships: 1,
	},

	{
		side: "Teutonic",
		name: "Heinrich",
		full_name: "Heinrich",
		title: "Bishop of Ösel-Wiek",
		seats: seats("Leal"),
		marshal: 0,
		fealty: 3,
		service: 4,
		lordship: 2,
		command: 1,
		forces: {
			knights: 1,
			sergeants: 1,
			men_at_arms: 1,
		},
		assets: {
			ship: 1,
			coin: 2,
			prov: 1,
		},
		ships: 1,
	},

	{
		side: "Teutonic",
		name: "Hermann",
		full_name: "Hermann",
		title: "Bishop of Dorpat",
		seats: seats("Dorpat, Odenpäh"),
		marshal: 1,
		fealty: 4,
		service: 4,
		lordship: 3,
		command: 3,
		forces: {
			knights: 1,
			sergeants: 1,
			men_at_arms: 1,
			militia: 1,
		},
		assets: {
			transport: 1,
			coin: 1,
			prov: 1,
		},
		ships: 0,
	},

	{
		side: "Teutonic",
		name: "Knud & Abel",
		full_name: "Knud & Abel",
		title: "Princes of Denmark",
		seats: seats("Reval, Wesenburg"),
		marshal: 0,
		fealty: 2,
		service: 3,
		lordship: 3,
		command: 2,
		forces: {
			knights: 1,
			sergeants: 1,
			men_at_arms: 2,
			militia: 1,
		},
		assets: {
			ship: 2,
			prov: 2,
		},
		ships: 1,
	},

	{
		side: "Teutonic",
		name: "Rudolf",
		full_name: "Rudolf von Kassel",
		title: "Castellan of Wenden",
		seats: seats("Wenden"),
		marshal: 0,
		fealty: 5,
		service: 2,
		lordship: 1,
		command: 3,
		forces: {
			knights: 1,
			sergeants: 1,
			men_at_arms: 1,
		},
		assets: {
			transport: 1,
			prov: 1,
		},
		ships: 0,
	},

	{
		side: "Teutonic",
		name: "Yaroslav",
		full_name: "Yaroslav",
		title: "Exile of Pskov",
		seats: seats("Odenpäh, Pskov"),
		marshal: 0,
		fealty: 4,
		service: 2,
		lordship: 1,
		command: 2,
		forces: {
			knights: 1,
			light_horse: 1,
			men_at_arms: 1,
		},
		assets: {
			transport: 1,
			prov: 1,
		},
		ships: 0,
	},

	{
		side: "Russian",
		name: "Aleksandr",
		full_name: "Aleksandr",
		title: "Prince of Novgorod",
		seats: seats("Novgorod, Rusa"),
		marshal: 2,
		fealty: 0,
		service: 6,
		lordship: 4,
		command: 3,
		forces: {
			knights: 3,
			men_at_arms: 2,
		},
		assets: {
			transport: 2,
		},
		ships: 1,
	},

	{
		side: "Russian",
		name: "Andrey",
		full_name: "Andrey",
		title: "Prince of Suzdal",
		seats: seats("Novgorod, Rusa"),
		marshal: 1,
		fealty: 4,
		service: 5,
		lordship: 3,
		command: 2,
		forces: {
			knights: 3,
			men_at_arms: 2,
		},
		assets: {
			transport: 2,
		},
		ships: 1,
	},

	{
		side: "Russian",
		name: "Domash",
		full_name: "Domash",
		title: "Tysyatskiy of Novgorod",
		seats: seats("Novgorod"),
		marshal: 0,
		fealty: 4,
		service: 4,
		lordship: 2,
		command: 2,
		forces: {
			sergeants: 1,
			light_horse: 1,
			men_at_arms: 2,
			militia: 1,
		},
		assets: {
			transport: 4,
			prov: 4,
		},
		ships: 1,
	},

	{
		side: "Russian",
		name: "Gavrilo",
		full_name: "Gavrilo",
		title: "Voyevoda of Pskov",
		seats: seats("Pskov"),
		marshal: 0,
		fealty: 3,
		service: 4,
		lordship: 3,
		command: 2,
		forces: {
			knights: 1,
			light_horse: 1,
			men_at_arms: 1,
			militia: 1,
		},
		assets: {
			transport: 2,
			coin: 1,
			prov: 2,
		},
		ships: 1,
	},

	{
		side: "Russian",
		name: "Karelians",
		full_name: "Karelians",
		title: "Tributaries of Novgorod",
		seats: seats("Ladoga"),
		marshal: 0,
		fealty: 4,
		service: 2,
		lordship: 1,
		command: 2,
		forces: {
			light_horse: 1,
			militia: 4,
		},
		assets: {
			transport: 1,
		},
		ships: 1,
	},

	{
		side: "Russian",
		name: "Vladislav",
		full_name: "Vladislav",
		title: "Bailiff of Ladoga",
		seats: seats("Ladoga"),
		marshal: 0,
		fealty: 5,
		service: 3,
		lordship: 2,
		command: 3,
		forces: {
			sergeants: 1,
			light_horse: 1,
			men_at_arms: 2,
		},
		assets: {
			transport: 1,
			prov: 1,
		},
		ships: 1,
	},

]

let AOW = {}
let cards = []

function cmpnum(a,b) { return a - b }

function arts_of_war_event(name, event) {
	let c = { name, event, capability: null, lords: null }
	cards.push(c)
	AOW[name] = c
}

function arts_of_war_capability(name, capability, lord_names) {
	AOW[name].capability = capability
	if (lord_names === "ALL") {
		AOW[name].lords = null
	}
	else if (lord_names === "any") {
		let side = name[0] === 'T' ? "Teutonic" : "Russian"
		lord_names = lords.filter(l => l.side === side).map(l => l.name)
		AOW[name].lords = lord_names.map(n => lords.findIndex(l => l.name === n)).sort(cmpnum)
	}
	else {
		AOW[name].lords = lord_names.map(n => lords.findIndex(l => l.name === n)).sort(cmpnum)
	}
}

arts_of_war_event("T1", "Grand Prince")
arts_of_war_event("T2", "Torzhok")
arts_of_war_event("T3", "Vodian Treachery")
arts_of_war_event("T4", "Bridge")
arts_of_war_event("T5", "Marsh")
arts_of_war_event("T6", "Ambush")
arts_of_war_event("T7", "Tverdilo")
arts_of_war_event("T8", "Teutonic Fervor")
arts_of_war_event("T9", "Hill")
arts_of_war_event("T10", "Field Organ")
arts_of_war_event("T11", "Pope Gregory")
arts_of_war_event("T12", "Khan Baty")
arts_of_war_event("T13", "Heinrich Sees the Curia")
arts_of_war_event("T14", "Bountiful Harvest")
arts_of_war_event("T15", "Mindaugas")
arts_of_war_event("T16", "Famine")
arts_of_war_event("T17", "Dietrich von Grüningen")
arts_of_war_event("T18", "Swedish Crusade")
arts_of_war_event("TNo", "No Event")
arts_of_war_event("TNo", "No Event")
arts_of_war_event("TNo", "No Event")

arts_of_war_capability("T1", "Treaty of Stensby", [ "Heinrich", "Knud & Abel" ])
arts_of_war_capability("T2", "Raiders", "any")
arts_of_war_capability("T3", "Converts", "any")
arts_of_war_capability("T4", "Balistarii", "any")
arts_of_war_capability("T5", "Balistarii", "any")
arts_of_war_capability("T6", "Balistarii", "any")
arts_of_war_capability("T7", "Warrior Monks", [ "Andreas", "Rudolf" ])
arts_of_war_capability("T8", "Hillforts", "ALL")
arts_of_war_capability("T9", "Halbbrüder", [ "Andreas", "Rudolf" ])
arts_of_war_capability("T10", "Halbbrüder", [ "Andreas", "Rudolf" ])
arts_of_war_capability("T11", "Crusade", [ "Andreas", "Rudolf" ])
arts_of_war_capability("T12", "Ordensburgen", "ALL")
arts_of_war_capability("T13", "William of Modena", "ALL")
arts_of_war_capability("T14", "Trebuchets", "any")
arts_of_war_capability("T15", "Warrior Monks", [ "Andreas", "Rudolf" ])
arts_of_war_capability("T16", "Ransom", "ALL")
arts_of_war_capability("T17", "Stonemasons", "any")
arts_of_war_capability("T18", "Cogs", [ "Heinrich", "Knud & Abel", "Andreas" ])

arts_of_war_event("R1", "Bridge")
arts_of_war_event("R2", "Marsh")
arts_of_war_event("R3", "Pogost")
arts_of_war_event("R4", "Raven's Rock")
arts_of_war_event("R5", "Hill")
arts_of_war_event("R6", "Ambush")
arts_of_war_event("R7", "Famine")
arts_of_war_event("R8", "Prince of Polotsk")
arts_of_war_event("R9", "Osilian Revolt")
arts_of_war_event("R10", "Batu Khan")
arts_of_war_event("R11", "Valdemar")
arts_of_war_event("R12", "Mindaugas")
arts_of_war_event("R13", "Pelgui")
arts_of_war_event("R14", "Prussian Revolt")
arts_of_war_event("R15", "Death of the Pope")
arts_of_war_event("R16", "Tempest")
arts_of_war_event("R17", "Dietrich von Grüningen")
arts_of_war_event("R18", "Bountiful Harvest")
arts_of_war_event("RNo", "No Event")
arts_of_war_event("RNo", "No Event")
arts_of_war_event("RNo", "No Event")

arts_of_war_capability("R1", "Luchniki", [ "Vladislav", "Karelians", "Gavrilo", "Domash" ])
arts_of_war_capability("R2", "Luchniki", [ "Vladislav", "Karelians", "Gavrilo", "Domash" ])
arts_of_war_capability("R3", "Streltsy", [ "Aleksandr", "Andrey", "Domash", "Gavrilo", "Vladislav" ]) // NOT Karelians
arts_of_war_capability("R4", "Smerdi", "ALL")
arts_of_war_capability("R5", "Druzhina", [ "Aleksandr", "Andrey", "Gavrilo" ])
arts_of_war_capability("R6", "Druzhina", [ "Aleksandr", "Andrey", "Gavrilo" ])
arts_of_war_capability("R7", "Ransom", "ALL")
arts_of_war_capability("R8", "Black Sea Trade", "ALL")
arts_of_war_capability("R9", "Baltic Sea Trade", "ALL")
arts_of_war_capability("R10", "Steppe Warriors", [ "Aleksandr", "Andrey" ])
arts_of_war_capability("R11", "House of Suzdal", [ "Aleksandr", "Andrey" ])
arts_of_war_capability("R12", "Raiders", "any")
arts_of_war_capability("R13", "Streltsy", [ "Aleksandr", "Andrey", "Domash", "Gavrilo", "Vladislav" ]) // NOT Karelians
arts_of_war_capability("R14", "Raiders", "any")
arts_of_war_capability("R15", "Archbishopric", "any")
arts_of_war_capability("R16", "Lodya", "any")
arts_of_war_capability("R17", "Veliky Knyaz", "any")
arts_of_war_capability("R18", "Stone Kremlin", "any")

let vassals = []
for (let lord of lords)
	lord.vassals = []

function vassal(lord, service, name, forces, capability) {
	let lord_id = lords.findIndex(x => x.name === lord)
	if (lord_id < 0) throw Error("no such lord", lord)
	lords[lord_id].vassals.push(vassals.length)
	vassals.push({ lord: lord_id, name, service, forces, capability })
}

vassal("Andreas", 1, "Lettgallian Auxiliaries", { light_horse: 1, militia: 1 })
vassal("Andreas", 2, "Summer Crusaders", { knights: 3 }, "Crusade")
vassal("Andreas", 3, "Teutonic Vassals", { knights: 1, men_at_arms: 2 })

vassal("Heinrich", 2, "Heinrich von Lode", { knights: 1, men_at_arms: 1 })
vassal("Heinrich", 2, "Odward von Lode", { knights: 1, men_at_arms: 1 })

vassal("Hermann", 2, "Helmond von Lüneburg", { knights: 1, men_at_arms: 1 })
vassal("Hermann", 2, "Johannes von Dolen", { knights: 1, men_at_arms: 1 })
vassal("Hermann", 1, "Ugaunian Auxiliaries", { light_horse: 1, militia: 1 })

vassal("Knud & Abel", 2, "Dietrich von Kivel", { knights: 1, men_at_arms: 1 })
vassal("Knud & Abel", 1, "Estonian Auxiliaries", { light_horse: 1, militia: 1 })
vassal("Knud & Abel", 2, "Otto von Lüneburg", { knights: 1, men_at_arms: 1 })

vassal("Rudolf", 2, "Ex-Sword Brethren", { knights: 1, sergeants: 1 })
vassal("Rudolf", 2, "Jerwen Teutonic Vassals", { knights: 1, men_at_arms: 1 })
vassal("Rudolf", 2, "Summer Crusaders", { knights: 2 }, "Crusade")

vassal("Yaroslav", 1, "Mstislavich Partisans", { militia: 2 })

vassal("Aleksandr", 3, "Mongols", { asiatic_horse: 2 }, "Steppe Warriors")
vassal("Aleksandr", 3, "Mongols", { asiatic_horse: 2 }, "Steppe Warriors")
vassal("Aleksandr", 4, "Pereyaslavl", { men_at_arms: 1 })
vassal("Aleksandr", 3, "Rostov", { men_at_arms: 1 })
vassal("Aleksandr", 3, "Yaroslavl", { men_at_arms: 1 })

vassal("Andrey", 3, "Kipchaqs", { asiatic_horse: 3 }, "Steppe Warriors")
vassal("Andrey", 3, "Kipchaqs", { asiatic_horse: 3 }, "Steppe Warriors")
vassal("Andrey", 4, "Suzdal", { men_at_arms: 1 })
vassal("Andrey", 4, "Vladimir", { men_at_arms: 1 })

vassal("Domash", 2, "Novgorod", { militia: 2 })
vassal("Domash", 2, "Novgorod", { militia: 2 })
vassal("Domash", 2, "Novgorod", { militia: 2 })

vassal("Gavrilo", 1, "Borderland Russians", { light_horse: 1, militia: 1 })
vassal("Gavrilo", 2, "Pskov Militia", { militia: 2 })
vassal("Gavrilo", 4, "Pskov", { men_at_arms: 1 })

vassal("Vladislav", 1, "Izhoran Auxiliaries", { militia: 1 })
vassal("Vladislav", 1, "Ingrian Auxiliaries", { militia: 1 })
vassal("Vladislav", 1, "Vepsian Auxiliaries", { militia: 1 })
vassal("Vladislav", 1, "Vodian Auxiliaries", { militia: 1 })

function to_path(name) {
	return name
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[ -]/g, '_')
		.replace(/ü/g, 'u')
		.replace(/ö/g, 'o')
		.replace(/ä/g, 'a')
}

let lord_service = {Russian:[],Teutonic:[]}
let vassal_service = {Russian:[],Teutonic:[]}

let last_path, last_side, last_ix

last_path = null
last_side = null
lords.forEach((lord,id) => {
	let side = lord.side
	let path = "counters300/lord_" + side.toLowerCase() + "_" + to_path(lord.name)
	if (side !== last_side) {
		last_ix = 0
		last_side = side
	}
	lord.image = last_ix
	if (path !== last_path) {
		last_ix++
		last_path = path
		lord_service[side].push(path + ".a.png")
		lord_service[side].push(path + ".b.png")
	}
})

last_path = null
last_side = null
vassals.forEach((vassal,id) => {
	let lord = lords[vassal.lord]
	let side = lord.side
	let path = "counters300/vassal_" + side.toLowerCase() + "_" + to_path(lord.name) + "_" + to_path(vassal.name)
	if (side !== last_side) {
		last_ix = 0
		last_side = side
	}
	vassal.image = last_ix
	if (path !== last_path) {
		last_ix++
		last_path = path
		vassal_service[side].push(path + ".a.png")
		vassal_service[side].push(path + ".b.png")
	}
})

let script = []
script.push("mkdir -p service300")
script.push("montage -mode concatenate -tile 2x " + lord_service.Teutonic.join(" ") + " service300/service_lords_teutonic.png")
script.push("montage -mode concatenate -tile 2x " + vassal_service.Teutonic.join(" ") + " service300/service_vassals_teutonic.png")
script.push("montage -mode concatenate -tile 2x " + lord_service.Russian.join(" ") + " service300/service_lords_russian.png")
script.push("montage -mode concatenate -tile 2x " + vassal_service.Russian.join(" ") + " service300/service_vassals_russian.png")

print("const data = {")
print("seaports:" + JSON.stringify(seaports) + ",")
dumplist("locales", locales)
dumplist("ways", ways)
dumplist("lords", lords)
dumplist("vassals", vassals)
dumplist("cards", cards)
print("}")
print("if (typeof module !== 'undefined') module.exports = data")

fs.writeFileSync("tools/build_counters3.sh", script.join("\n") + "\n")
fs.writeFileSync("data.js", data.join("\n") + "\n")
