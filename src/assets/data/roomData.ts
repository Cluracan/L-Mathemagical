import { createKeyGuard } from "../../utils/guards";

export const roomData = {
  grass: {
    id: "grass",
    descriptions: {
      long: 'It is a very hot day. You are sitting on the grass outside a crumbling palace. Your sister is reading a book called "Fractions and the Four Rules-- 5000 Carefully Graded Problems". You are bored, and the heat is making you feel a little sleepy. \n\nSuddenly you see an old man dressed as an abbot. He glances at you nervously and slips through the palace doors to the north.',
      short: "You are sitting on the grass.",
    },
    mapText: "Grass",
    exits: {
      n: "hallway",
    },
  },
  hallway: {
    id: "hallway",
    descriptions: {
      long: "You are in a dark hall way. At the south end is an outside door. There is another door at the north end.",
      short: "You are in the hall way.",
    },
    mapText: "Hallway",
    exits: {
      n: "kitchen",
      s: "grass",
    },
  },
  kitchen: {
    id: "kitchen",
    descriptions: {
      long: "You are in a room which once was a kitchen. It has quarry tiles on the floor and there is a cracked sink in one corner. There are doors to the north, south, east and west.",
      short: "You are in the old kitchen",
    },
    mapText: "Kitchen",
    exits: {
      n: "lShaped",
      e: "store",
      s: "hallway",
      w: "workshop",
    },
  },
  store: {
    id: "store",
    descriptions: {
      long: "You are in a large store room which has wooden shelves going up to the ceiling.",
      short:
        "You are in a large store room which has wooden shelves going up to the ceiling.",
    },
    mapText: "Store",
    exits: {
      w: "kitchen",
      u: "shelf",
    },
  },
  shelf: {
    id: "shelf",
    descriptions: {
      long: "You are sitting on the top shelf in the store room. The shelves are quite empty apart from a thick layer of dust and yourself.",
      short: "You are sitting on the top shelf in the store room.",
    },
    mapText: "Shelf",
    exits: {
      d: "store",
    },
  },
  workshop: {
    id: "workshop",
    descriptions: {
      long: "You are in a workshop with wooden benches around the walls. The room smells of machine oil and there are oily patches on the floor. Doors lead off to the south, east and west.",
      short: "You are in the workshop.",
    },
    mapText: "Workshop",
    exits: {
      e: "kitchen",
      s: "creeper",
      w: "narrowPassage",
    },
  },
  creeper: {
    id: "creeper",
    descriptions: {
      long: "You are in a room where a huge creeper has grown through the windows and covers a large area of the room. Doors lead to the north and west",
      short: "You are in the creeper room.",
    },
    mapText: "Creeper room",
    exits: {
      n: "workshop",
      w: "narrowPassageS",
    },
  },
  narrowPassageS: {
    id: "narrowPassageS",
    descriptions: {
      long: "You are at the south end of a narrow passage. There are several doors on the east side.",
      short: "You are at the south end of the narrow passage.",
    },
    mapText: "Passage",
    exits: {
      n: "narrowPassage",
      e: "creeper",
    },
  },
  narrowPassage: {
    id: "narrowPassage",
    descriptions: {
      long: "You are in a narrow passage which runs from north to south. There are several doors on the east side.",
      short: "You are in the middle of the narrow passage.",
    },
    mapText: "Passage",
    exits: {
      n: "narrowPassageN",
      e: "workshop",
      s: "narrowPassageS",
    },
  },
  narrowPassageN: {
    id: "narrowPassageN",
    descriptions: {
      long: "You are at the north end of a narrow passage. There is a door ahead of you.",
      short: "You are at the north end of the narrow passage.",
    },
    mapText: "Passage",
    exits: {
      n: "telephone",
      s: "narrowPassage",
    },
  },
  telephone: {
    id: "telephone",
    descriptions: {
      long: "You are in a room containing a heavy black oak chest with intricate carvings on it. The only door leads to the south.",
      short: "You are in the telephone room.",
    },
    mapText: "Telephone room",
    exits: {
      s: "narrowPassageN",
      d: "cellar00",
    },
  },
  lShaped: {
    id: "lShaped",
    descriptions: {
      long: "You are in an L-shaped room which smells of mice. Doors lead to the west, south and east.",
      short: "You are in the L-shaped room.",
    },
    mapText: "L room",
    exits: {
      s: "kitchen",
      e: "boiler",
      w: "cupboard",
    },
  },
  cupboard: {
    id: "cupboard",
    descriptions: {
      long: "You are in a large cupboard which once was used for storing linen.",
      short: "You are in the large cupboard.",
    },
    mapText: "Cupboard",
    exits: {
      e: "lShaped",
    },
  },
  boiler: {
    id: "boiler",
    descriptions: {
      long: "You are in a boiler room, full of machinery which appears to have been standing idle for some time. In one corner is a spiral staircase which goes up. On the east side, a flight of steps leads down, and to the west, there is a door.",
      short: "You are in the boiler room.",
    },
    mapText: "Boiler room",
    exits: {
      u: "stairsSpiral",
      d: "longPassageW",
      e: "longPassageW",
      w: "lShaped",
    },
  },
  longPassageW: {
    id: "longPassageW",
    descriptions: {
      long: "You are at the west end of a long passage with dark green tiles and flaky paint. You are standing at the bottom of a flight of steps.",
      short: "You are at the west end of a long passage.",
    },
    mapText: "Passage",
    exits: {
      u: "boiler",
      w: "boiler",
      e: "longPassageE",
    },
  },
  longPassageE: {
    id: "longPassageE",
    descriptions: {
      long: "You are at the east end of a long passage with dark green tiles and flaky paint. You are standing outside a door.",
      short: "You are at the east end of a long passage.",
    },
    mapText: "Passage",
    exits: {
      e: "file",
      w: "longPassageW",
    },
  },
  file: {
    id: "file",
    descriptions: {
      long: "You are in a room with two doors. To the east is a massive oak door which is many hundreds of years old.  A smaller door leads to the west.",
      short:
        "You are in a room with two doors. To the east is a massive oak door which is many hundreds of years old.  A smaller door leads to the west.",
    },
    mapText: "File room",
    exits: {
      w: "longPassageE",
      e: "panelled",
    },
  },
  stairsSpiral: {
    id: "stairsSpiral",
    descriptions: {
      long: "You are at the top of the spiral staircase above the boiler room. A door leads to the east.",
      short: "You are at the top of the spiral staircase.",
    },
    mapText: "Stairs",
    exits: {
      e: "pool",
      d: "boiler",
    },
  },
  pool: {
    id: "pool",
    descriptions: {
      long: "You are in a large room with marble walls and floors. Four classical statues stand at the corners of an indoor swimming pool which is empty. The main door is at the east end, but there is another door leading west.",
      short: "You are in the room with the pool.",
    },
    mapText: "Pool",
    exits: {
      e: "lobby",
      w: "stairsSpiral",
      d: "poolFloor",
    },
  },
  lobby: {
    id: "lobby",
    descriptions: {
      long: "You are in a lobby with orange walls. Doors lead off to the south, west, and east. A window on the north side looks down on to a shady courtyard. Something seems to be moving around down there but it is too dark to see clearly.",
      short: "You are in the orange lobby.",
    },
    mapText: "Lobby",
    exits: {
      e: "music",
      s: "limbo",
      w: "pool",
    },
  },
  music: {
    id: "music",
    descriptions: {
      long: "You are in the old music room. The walls are blotched with damp and there are holes in the skirting board. A small window is open in the northwest corner of the room, obstructed by an old, battered telescope. There are doors to the east and west.",
      short: "You are in the old music room.",
    },
    mapText: "Music room",
    exits: {
      e: "solarium",
      w: "lobby",
    },
  },
  solarium: {
    id: "solarium",
    descriptions: {
      long: "You are in the solarium. The room is flooded with sunlight and the heat is only just bearable. There are doors to the east and west. On the north side a French windows leads out on to a balcony.",
      short: "You are in the solarium",
    },
    mapText: "Solarium",
    exits: {
      e: "snooker",
      w: "music",
      n: "balcony",
    },
  },
  snooker: {
    id: "snooker",
    descriptions: {
      long: "You are in a room with doors to the south, west and east.",
      short: "You are in the snooker room.",
    },
    mapText: "Snooker room",
    exits: {
      e: "stoneLanding",
      w: "solarium",
      s: "ante",
    },
  },
  stoneLanding: {
    id: "stoneLanding",
    descriptions: {
      long: "You are on the landing of a stone staircase, with stairs going up and down. A door leads to the west.",
      short: "You are on the landing of a stone staircase.",
    },
    mapText: "Landing",
    exits: {
      u: "stoneStairs",
      w: "snooker",
      d: "largeKitchen",
    },
  },
  stoneStairs: {
    id: "stoneStairs",
    descriptions: {
      long: "You are at the top of the stone staircase. There is a door on the east side.",
      short: "You are at the top of the stone staircase.",
    },
    mapText: "Stairs",
    exits: {
      e: "lights",
      d: "stoneLanding",
    },
  },
  lights: {
    id: "lights",
    descriptions: {
      long: "You are in a room which has just one door leading west. Through a glass panel, below you, you can see a small theatre. Four coloured spotlights illuminate the empty stage.",
      short: "You are in the electrician's box.",
    },
    mapText: "Lighting box",
    exits: {
      w: "stoneStairs",
    },
  },
  cellar00: {
    id: "cellar00",
    descriptions: {
      long: "You are in a cellar. A ladder leads up to the room above and there is a door to the north. There is a notice on the door:-\n\n\t\t\t CELLAR MAZE.\n\t\t   STRICTLY NO ADMITTANCE.\n\t\t       By order of the\n\t\t   Drogo Central Committee.",
      short: "You are by the ladder in the cellar.",
    },
    mapText: "Cellar",
    exits: {
      u: "telephone",
      n: "cellar01",
    },
  },
  cellar01: {
    id: "cellar01",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "limbo",
      e: "cellar02",
      s: "cellar00",
      w: "limbo",
    },
  },
  cellar02: {
    id: "cellar02",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "limbo",
      e: "cellar03",
      s: "cellar04",
      w: "cellar01",
    },
  },
  cellar03: {
    id: "cellar03",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "limbo",
      e: "cellar08",
      s: "cellar05",
      w: "cellar02",
    },
  },
  cellar04: {
    id: "cellar04",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar02",
      e: "cellar05",
      s: "limbo",
      w: "limbo",
    },
  },
  cellar05: {
    id: "cellar05",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar03",
      e: "cellar06",
      s: "limbo",
      w: "cellar04",
    },
  },
  cellar06: {
    id: "cellar06",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar08",
      e: "cellar10",
      s: "cellar07",
      w: "cellar05",
    },
  },
  cellar07: {
    id: "cellar07",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar06",
      e: "limbo",
      s: "limbo",
      w: "limbo",
    },
  },
  cellar08: {
    id: "cellar08",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar09",
      e: "limbo",
      s: "cellar06",
      w: "cellar03",
    },
  },
  cellar09: {
    id: "cellar09",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "limbo",
      e: "limbo",
      s: "cellar08",
      w: "limbo",
    },
  },
  cellar10: {
    id: "cellar10",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar11",
      e: "limbo",
      s: "limbo",
      w: "cellar06",
    },
  },
  cellar11: {
    id: "cellar11",
    descriptions: {
      long: "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
      short:
        "You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.",
    },
    mapText: "Cellar",
    exits: {
      n: "cellar12",
      e: "limbo",
      s: "cellar10",
      w: "limbo",
    },
  },
  cellar12: {
    id: "cellar12",
    descriptions: {
      long: "You are outside the palace at the bottom of a flight of stone steps. A door leads into the palace.",
      short: "You are at the bottom of the stone steps.",
    },
    mapText: "Cellar",
    exits: {
      e: "limbo",
      s: "cellar11",
      w: "limbo",
      u: "courtyard",
    },
  },
  courtyard: {
    id: "courtyard",
    descriptions: {
      long: "You have entered a large courtyard paved with square slabs, many covered with moss and lichen. Some stone steps lead down to a door in the palace.",
      short: "You are in the turtle courtyard",
    },
    mapText: "Courtyard",
    exits: {
      d: "cellar12",
    },
  },
  ante: {
    id: "ante",
    descriptions: {
      long: 'You are in an ante-room having doors to the west and north. Over the west door is an old wooden board displaying a faded warning. It says, "Be warned that all who enter here will see nothing but codes."',
      short: "You are in the ante-room.",
    },
    mapText: "Ante-room",
    exits: {
      n: "snooker",
      w: "code",
    },
  },
  code: {
    id: "code",
    descriptions: {
      long: "You are in the code room. It is a stark, white room whose plaster walls are covered in scribblings. Doors lead east and west.",
      short: "You are in the code room.",
    },
    mapText: "Code room",
    exits: {
      e: "ante",
      w: "oriental",
    },
  },
  oriental: {
    id: "oriental",
    descriptions: {
      long: "You are in an oriental room. Paintings of bamboo and red dragons cover the walls. The only door leads to the east.",
      short: "You are in the oriental room.",
    },
    mapText: "Oriental room",
    exits: {
      e: "code",
    },
  },
  largeKitchen: {
    id: "largeKitchen",
    descriptions: {
      long: "You have entered a large kitchen. There is a delicious smell of baking. Around the walls are hung enormous metal pans and cooking utensils. In one corner is a large old-fashioned kitchen range giving out a great heat. The only way out is by the stairs.\n\nIn the middle of the room is a scrubbed table, at which sits a cook surrounded by dozens of mixing bowls.",
      short: "You are in the great kitchen.",
    },
    mapText: "Kitchen",
    exits: {
      u: "stoneLanding",
    },
  },
  panelled: {
    id: "panelled",
    descriptions: {
      long: "You are in a panelled room. Round the walls are seventeen panels covered by wallpaper with a repeating pattern. Each pattern uses the same basic unit, but the way in which the unit is repeated is different for each panel. Doors lead to the west and north.",
      short: "You are in the panelled room.",
    },
    mapText: "Panelled room",
    exits: {
      w: "file",
      n: "gardenSW",
    },
  },
  gardenSW: {
    id: "gardenSW",
    descriptions: {
      long: "You are in the south west corner of the walled garden. Close by, hidden behind a huge ceanothus bush, is a small door leading into the palace.",
      short: "You are in the south west corner of the walled garden.",
    },
    mapText: "Garden",
    exits: {
      s: "panelled",
      n: "gardenN",
    },
  },
  gardenN: {
    id: "gardenN",
    descriptions: {
      long: "You are in a walled garden filled with blue flowers. There are beds of delphiniums and anchusas. The air is filled with the scent of lavender and buddleia. The palace is on the south side of the garden and some stone steps lead up to a balcony. On the north side a path leads through a gap in the wall.",
      short: "You are in the walled garden",
    },
    mapText: "Garden",
    exits: {
      n: "riverS",
      s: "gardenSW",
      u: "balcony",
    },
  },
  balcony: {
    id: "balcony",
    descriptions: {
      long: "You are on a balcony. A faint perfume is rising from the walled garden beneath you. Some worn steps lead down to the garden and a French window leads back into the palace.",
      short: "You are on the balcony.",
    },
    mapText: "Balcony",
    exits: {
      s: "solarium",
      d: "gardenN",
    },
  },
  riverS: {
    id: "riverS",
    descriptions: {
      long: "You are on a lawn which leads down to a wide river. A notice on the bank reads:--\n\n\t\t\tDANGER\n\t\t     Piranha Fish.\n\nThere are thorny hedges to the east and west. To the south there is a path through a gap in the wall.\n\nAn old and rusty tin bath is lying on the bank.",
      short:
        "You are on the lawn beside the river.\n\nAn old and rusty tin bath is lying on the bank.",
    },
    mapText: "River S",
    exits: {
      s: "gardenN",
      n: "riverN",
    },
  },
  riverN: {
    id: "riverN",
    descriptions: {
      long: "You are on the north bank of the river which is covered in brambles. A narrow path winds to the northeast.\n\nAn old and rusty tin bath is lying on the bank.",
      short:
        "You are on the north bank of the river.\n\nAn old and rusty tin bath is lying on the bank.",
    },
    mapText: "River N",
    exits: {
      ne: "orchard",
      s: "riverS",
    },
  },
  orchard: {
    id: "orchard",
    descriptions: {
      long: "You are in a beautiful orchard and are surrounded by trees laden with many different kinds of fruit, some of which you have never seen before. There is a clearing in the centre of the orchard from which a path leads to the southwest.",
      short: "You are in the orchard.",
    },
    mapText: "Orchard",
    exits: {
      sw: "riverN",
    },
  },
  poolFloor: {
    id: "poolFloor",
    descriptions: {
      long: "You are standing in the empty swimming pool. It slopes down gently towards the west. On the north side of the pool is a small hole, about 20cm square, which was once covered by a grating.",
      short: "You are standing in the swimming pool.",
    },
    mapText: "pool floor",
    exits: {
      u: "pool",
      in: "tunnelTop",
    },
  },
  tunnelTop: {
    id: "tunnelTop",
    descriptions: {
      long: "You are at one end of a dark tunnel littered with brick rubble. A small opening leads out into the light. The tunnel slopes downwards and is just wide enough for you to crawl along.",
      short: "You are at the top of the tunnel.",
    },
    mapText: "Tunnel",
    exits: {
      out: "poolFloor",
      d: "tunnelBottom",
    },
  },
  tunnelBottom: {
    id: "tunnelBottom",
    descriptions: {
      long: "You are at the bottom of a dark tunnel. It is quite wide here and there is just enough room to stand up. A rough hole knocked through some stonework leads out into the light.",
      short: "You are at the bottom of the tunnel.",
    },
    mapText: "Tunnel",
    exits: {
      u: "tunnelTop",
      s: "granite",
    },
  },
  granite: {
    id: "granite",
    descriptions: {
      long: "You are in a passage with granite walls and a door to the south. A rough hole has been knocked through the stonework at the north end. On one wall there is a wooden noticeboard with the words:-\n\n\t\tNO BREACH OF SECURITY\n\n\t\tIS TOO SMALL TO IGNORE.",
      short: "You are in a granite passage.",
    },
    mapText: "Passage",
    exits: {
      n: "tunnelBottom",
      s: "woodenStairs",
    },
  },
  woodenStairs: {
    id: "woodenStairs",
    descriptions: {
      long: "You are at the bottom of some wooden stairs outside a door which leads north.",
      short: "You are at the bottom of the wooden stairs.",
    },
    mapText: "Stairs",
    exits: {
      u: "landing",
      n: "granite",
    },
  },
  landing: {
    id: "landing",
    descriptions: {
      long: "You are on the landing at the top of some wooden stairs. There is a door to the East here.",
      short: "You are at the top of the wooden stairs.",
    },
    mapText: "landing",
    exits: {
      d: "woodenStairs",
      e: "circular",
    },
  },
  circular: {
    id: "circular",
    descriptions: {
      long: "You are in a large circular room beneath a glass dome. Eight identical doors lead to the north, northwest, west, southwest, south, southeast, east, and northeast.",
      short: "You are in the circular room.",
    },
    mapText: "Circular room",
    exits: {
      n: "broomCupboard",
      nw: "half",
      w: "landing",
      se: "triangle",
      ne: "safe",
      e: "hexagon",
      sw: "computer",
      s: "guardsPassage",
    },
  },
  broomCupboard: {
    id: "broomCupboard",
    descriptions: {
      long: "You have walked into a broom cupboard.",
      short: "You are in a broom cupboard.",
    },
    mapText: "Cupboard",
    exits: {
      s: "circular",
    },
  },
  half: {
    id: "half",
    descriptions: {
      long: "You are in a room which has been left half-decorated. The walls are painted half black and half white. Doors lead to the southeast, west, and north.",
      short: "You are in the half-decorated room.",
    },
    mapText: "Half Room",
    exits: {
      se: "circular",
      w: "mirror",
      n: "ladderBottom",
    },
  },
  mirror: {
    id: "mirror",
    descriptions: {
      long: "You have passed through a large door which covers the whole of one side of a wall.\n\nYou are standing in a corridor with several other people. As the door slowly closes behind you, the corridor grows longer and longer, and more people appear. There seem to be doors to the east and west.",
      short:
        "You have passed through a large door which covers the whole of one side of a wall.\n\nYou seem to be standing in a very long corridor with dozens of other people.",
    },
    mapText: "Corridor",
    exits: {
      e: "half",
      w: "limbo",
    },
  },
  ladderBottom: {
    id: "ladderBottom",
    descriptions: {
      long: "You are in a cramped space like a chimney. A metal ladder disappears up into the darkness. A wooden door leads south.",
      short: "You are at the bottom of the metal ladder.",
    },
    mapText: "Ladder",
    exits: {
      s: "half",
      u: "ladderTop",
    },
  },
  ladderTop: {
    id: "ladderTop",
    descriptions: {
      long: "It is completely dark. You have reached the top of the ladder. There seems to be a trap door above you.",
      short: "You are at the top of the metal ladder.",
    },
    mapText: "Ladder",
    exits: {
      d: "ladderBottom",
      u: "attic",
    },
  },
  triangle: {
    id: "triangle",
    descriptions: {
      long: "You have entered a grim room with a triangular floor and three slanting triangular walls which meet at a point high above you. Doors lead off to the south and northwest. Hundreds of bats are hanging from the slanting walls.",
      short: "You are in the triangular room.",
    },
    mapText: "Triangle room",
    exits: {
      nw: "circular",
      s: "blue",
    },
  },
  blue: {
    id: "blue",
    descriptions: {
      long: "You are in a room painted a dark shade of blue. Silver stars cover the high ceiling like the night sky. The only door leads north.",
      short: "You are in the blue room.",
    },
    mapText: "Blue room",
    exits: {
      n: "triangle",
    },
  },
  hexagon: {
    id: "hexagon",
    descriptions: {
      long: "You are in a room with six walls. There is a door to the west. On the east wall is a brass plaque engraved with:-\n\n\t\t\t?@3+>*=@\n\t\t\t+33./",
      short: "You are in the room with six walls.",
    },
    mapText: "Hexagonal room",
    exits: {
      w: "circular",
    },
  },
  safe: {
    id: "safe",
    descriptions: {
      long: "You have entered a room with a stone floor. In the north wall is the large door of a safe. There is a door to the southwest.",
      short: "You are in the room with the safe",
    },
    mapText: "Safe",
    exits: {
      n: "carpetPassageS",
      sw: "circular",
    },
  },
  carpetPassageS: {
    id: "carpetPassageS",
    descriptions: {
      long: "You are at the south end of a passage, just inside the safe door. The passage has a strange soft appearance because the floor, walls, and ceiling are completely covered in a deep blue carpet.",
      short: "You are at the south end of the soft passage.",
    },
    mapText: "Passage",
    exits: {
      s: "safe",
      n: "carpetPassageN",
    },
  },
  carpetPassageN: {
    id: "carpetPassageN",
    descriptions: {
      long: "You are at the north end of the soft passage outside a wooden door.",
      short: "You are at the north end of the soft passage.",
    },
    mapText: "Passage",
    exits: {
      s: "carpetPassageS",
      n: "spider",
    },
  },
  spider: {
    id: "spider",
    descriptions: {
      long: "You are in a square room which is full of cobwebs. The only door leads south.",
      short: "You are in the spider room.",
    },
    mapText: "Square room",
    exits: {
      s: "carpetPassageN",
    },
  },
  attic: {
    id: "attic",
    descriptions: {
      long: 'You are in a tiny attic room with no furniture. A small arched window looks down on to an orchard. There are bars across the window. It is very quiet.\n\nA previous occupant of the room has scratched some numbers on one of the walls:- "121, 49, 196, 25, 64."',
      short: "You are in an attic room.",
    },
    mapText: "Attic",
    exits: {
      e: "atticPassage",
    },
  },
  atticPassage: {
    id: "atticPassage",
    descriptions: {
      long: "You are in an attic passage with doors at the east and west ends. There is a faint smell of stale kippers. Paint is peeling from the walls.",
      short: "You are in the attic passage",
    },
    mapText: "Passage",
    exits: {
      w: "attic",
      e: "pig",
    },
  },
  pig: {
    id: "pig",
    descriptions: {
      long: "You are in a green room with a single door to the west. A large chandelier hangs from the ceiling and there are pieces of straw on the floor.",
      short: "You are in the green room.",
    },
    mapText: "Green room",
    exits: {
      w: "atticPassage",
    },
  },
  computer: {
    id: "computer",
    descriptions: {
      long: "You are in a room with grey walls and grey carpet tiles. A series of fluorescent tubes provide stark lighting along with a low buzzing sound. There is a door to the northeast.",
      short: "You are in the computer room.",
    },
    mapText: "Computer room",
    exits: {
      ne: "circular",
    },
  },
  guardsPassage: {
    id: "guardsPassage",
    descriptions: {
      long: "You are in a narrow passage running from north to south. The south door is ajar, and through the crack you can see about a dozen Drogo Robot Guards.",
      short: "You are in a narrow passage.",
    },
    mapText: "Passage",
    exits: {
      n: "circular",
      s: "guards",
    },
  },
  guards: {
    id: "guards",
    descriptions: {
      long: "You are in a shabby room decorated with posters. Against one wall are racks of electronic equipment studded with glowing coloured lights. There are doors to the north and west.\n\nAbout a dozen Drogo Robot Guards are in an untidy line, beneath a huge poster of a middle-aged lady who is smiling resolutely.",
      short:
        "You are in the guard room.\n\nAbout a dozen Drogo Robot Guards are in an untidy line, beneath a huge poster of a middle-aged lady who is smiling resolutely.",
    },
    mapText: "Guard room",
    exits: {
      n: "guardsPassage",
      w: "cell",
    },
  },
  cell: {
    id: "cell",
    descriptions: {
      long: "You are in a sparsely furnished cell. A window is open, but it is too high for you to jump and there is no way to climb down.",
      short: "You are in a cell.",
    },
    mapText: "Cell",
    exits: {
      e: "guards",
      d: "grounds",
    },
  },
  grounds: {
    id: "grounds",
    descriptions: {
      long: "You are on the grass outside the palace. The grounds sweep gently down to a small stream, and beyond this lies a large forest.",
      short: "You are in the palace grounds.",
    },
    mapText: "Grounds",
    exits: {},
  },
  pit: {
    id: "pit",
    descriptions: {
      long: "This huge pit is used to store unwanted or as yet unused items.  You should not be here!",
      short:
        "You are in the pit, although you shouldn't be. How did you get here?",
    },
    mapText: "Pit",
    exits: {},
  },
  limbo: {
    id: "limbo",
    descriptions: {
      long: "You are in 'Limbo', which is a classic MUD destination. Well, maybe 'classic' is pushing it a little. Anyway, if you are reading this, you've probably passed through a wall to get here...\n\n ...so unless you are Harry Potter, Hermoine Granger, or a ghost, something has gone wrong...\n\nFeel free to let someone know about this. There don't appear to be any exits, although the ceiling is emitting a strange glow...",
      short:
        "You are in Limbo, which is another classic MUD destination. Well, maybe 'classic' is pushing it a little. Anyway, if you're reading this, you should be able to escape.",
    },
    mapText: "Limbo",
    exits: { u: "kitchen" },
  },
} as const satisfies Record<
  string,
  {
    id: string;
    descriptions: Record<"long" | "short", string>;
    mapText: string;
    exits: Partial<Record<ExitDirection, string>>;
  }
>;
//(above) Can't reference roomData in initialisation (or you just get 'any' type for roomData and an error), so have to widen id: keyof roomData to id: string etc

export type RoomId = keyof typeof roomData;

export interface Room {
  id: RoomId;
  descriptions: Record<"long" | "short", string>;
  mapText: string;
  exits: Partial<Record<ExitDirection, RoomId>>;
}

export type ExitDirection =
  | "n"
  | "e"
  | "s"
  | "w"
  | "u"
  | "d"
  | "in"
  | "out"
  | "ne"
  | "nw"
  | "se"
  | "sw";

export const isRoomId = createKeyGuard(roomData);

//  const _checkRoomData: Record<RoomId, Room> = roomData;
// This can check for errors in roomData (like mispelt exit or id), but can't locate them!
