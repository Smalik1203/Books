import {applyClass7ComparisonTables} from './science-g7-comparison-tables.mjs';
// Independent Chapter 4 content; source numbers refer to the supplied PDF.
export const title="The World of Metals and Non-metals";
export const shortTitle="The World of Metals and Non-metals";
export const opener=[
  "A sheet of foil bends around food. A wire carries electricity. What makes a material right for its job?",
  "Yashwant and Anandi visit an ironsmith in Rajasthan with their grandfather. Sudarshan makes tawas, buckets, tongs and farming tools. He chooses iron for some parts and wood for handles. Each choice has a reason.",
  "Follow their questions into the classroom. Compare how materials change shape, carry heat and electricity, and react with air and water. Use several pieces of evidence before deciding what a material can do.",
  "Look closely at the tools in the picture. Choose one and name the job of each part. Would you choose the same material for every part? Record one choice and a reason in your notebook, then return to it after the investigations to see whether your evidence supports it."
];
export const lesson=[
  {
    "id": "craft-head",
    "type": "heading",
    "text": "From a workshop to a question",
    "source": [
      1,
      2
    ]
  },
  {
    "id": "craft",
    "type": "body",
    "source": [
      1,
      2
    ],
    "text": "Sudarshan heats an iron workpiece in a coal-fired furnace, holds it with tongs and shapes it with a hammer. Heating makes the iron easier to deform. The children watch from a safe distance; forging is skilled work with hot metal, sharp tools and flying particles. Do not try it at home."
  },
  {
    "id": "choices",
    "type": "body",
    "source": [
      1,
      2
    ],
    "text": "The same workshop contains metal, wood and coal, but their jobs differ. Iron forms strong working parts such as spades, axes, trowels and rakes. Wood can form handles. Coal supplies energy when burned. Anandi asks whether every material can be beaten into a flat shape. That is a question we can investigate with suitable small samples."
  },
  {
    "id": "properties-head",
    "type": "heading",
    "text": "4.1  Comparing Material Properties",
    "source": [
      2
    ]
  },
  {
    "id": "appearance-intro",
    "type": "body",
    "source": [
      2,
      3
    ],
    "text": "Recall the properties you used to describe materials in Class 6. First record what a sample looks like and how it behaves; name a property after considering the evidence. Use teacher-identified samples rather than guessing their identity from colour. A coating of paint or dirt can hide the surface underneath."
  },
  {
    "id": "same-sample",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Before you begin, compare the pieces as well as their material names. A thin foil sheet and a thick nail will not change shape equally under one light tap. Record their starting shapes so that size and shape do not become hidden parts of your explanation."
  },
  {
    "id": "hammer-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      2,
      3
    ],
    "sourceActivity": "4.1",
    "figure": "samples",
    "figureCaption": "Copper, aluminium, an iron nail, sulfur, coal and wood: compare intact samples before testing.",
    "paragraphs": [
      "Work with your teacher using small copper and aluminium scraps, an iron nail, a pea-sized sulfur lump, coal and wood. Avoid sharp edges and dust; wash hands afterwards.",
      "1. In the same light, record each surface’s appearance and evidence of hardness or softness. Predict flattening, fracture or another change when tapped.",
      "2. The teacher gives each sample controlled light taps on a stable hard surface. Wear eye protection and stay behind the safety screen, keeping fingers away. The teacher contains fragments and handles cleanup.",
      "3. Compare before and after. Record the actual change, including little or no visible change, rather than forcing every sample into two outcomes."
    ]
  },
  {
    "id": "record-properties",
    "type": "table",
    "source": [
      3
    ],
    "caption": "Table 4.1  Keep observations separate from predictions",
    "widths": [
      0.25,
      0.35,
      0.4
    ],
    "rows": [
      [
        "Record",
        "Include",
        "Purpose"
      ],
      [
        "Sample",
        "Name; surface condition",
        "Identify any coating."
      ],
      [
        "Before tapping",
        "Lustre; hardness; prediction",
        "Describe the starting sample."
      ],
      [
        "After tapping",
        "Flattening, fracture or other change",
        "Record the actual result."
      ]
    ],
    "note": "Give each of the six samples a notebook row. Read across for evidence; compare down for patterns."
  },
  {
    "id": "lustre",
    "type": "body",
    "source": [
      3
    ],
    "text": "A clean metal surface often reflects light with a characteristic shine called **metallic lustre**. Copper, aluminium and iron commonly show it. A dull surface alone does not establish that a sample is not a metal: an oxide layer or dirt can cover the shine. Nor does shine alone identify a metal; some non-metals also look shiny."
  },
  {
    "id": "properties-apart",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Hardness and malleability answer different questions. Hardness concerns resistance to local indentation or scratching; malleability concerns a change into a sheet without fracture. A material can resist a small dent yet still be shaped with suitable tools. Keep the two descriptions separate in your notes."
  },
  {
    "id": "malleability-head",
    "type": "heading",
    "level": 2,
    "text": "Sheets, fragments and exceptions",
    "source": [
      3,
      4
    ]
  },
  {
    "id": "malleability",
    "type": "body",
    "source": [
      3,
      4
    ],
    "text": "The ability to be hammered or rolled into sheets without breaking is **malleability**. Many metals, including copper and aluminium, are malleable. An iron nail may flatten only slightly with the force used. A small change is still evidence to describe; failure to flatten it by hand does not show that iron cannot be shaped."
  },
  {
    "id": "shape-comparison",
    "type": "comparison",
    "source": [
      3,
      4
    ],
    "columns": [
      {
        "title": "Malleable behaviour",
        "items": [
          "Under a suitable force, the sample changes shape without breaking apart.",
          "A metal sheet can be thinner than the starting piece.",
          "Aluminium foil and silver leaf are useful examples."
        ]
      },
      {
        "title": "Brittle behaviour",
        "items": [
          "Under a suitable force, the sample fractures into smaller pieces.",
          "Breaking is different from spreading into a continuous sheet.",
          "Sulfur and coal commonly show this behaviour."
        ]
      }
    ]
  },
  {
    "id": "exceptions",
    "type": "body",
    "source": [
      3,
      4
    ],
    "correction": "Do not universalise hardness, solidity or the response of wood.",
    "text": "**Brittle** materials tend to fracture rather than deform substantially. Wood may dent, split along its grain or splinter; the result depends on the piece and force. Most familiar metals are solid at room temperature, but mercury is liquid. Sodium and potassium are soft metals. These are examples to learn about, not materials to handle or cut in class; mercury is toxic and sodium and potassium react dangerously with water."
  },
  {
    "id": "single-test-think",
    "type": "panel",
    "kind": "think",
    "source": [
      3,
      4
    ],
    "addition": "Reasoning across exceptions.",
    "paragraphs": [
      "“It is shiny and hard, so it must be a metal.” “It broke when tapped, so it cannot contain metal.” What does each observation establish, and what remains uncertain?",
      "Choose two further properties to examine safely. Why would several properties provide stronger evidence than appearance or hammering alone?"
    ]
  },
  {
    "id": "property-conclusion",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "A useful conclusion names both the sample and the conditions: “This copper piece flattened under the teacher’s taps.” It is more precise than “Everything shiny flattens.” Compare evidence from several identified samples before using it to describe a broader group."
  },
  {
    "id": "ductility-head",
    "type": "heading",
    "level": 2,
    "text": "Drawing a material into wire",
    "source": [
      4,
      5
    ]
  },
  {
    "id": "ductility",
    "type": "body",
    "source": [
      4,
      5
    ],
    "text": "**Ductility** is the ability to be drawn into wire. Copper and aluminium are used in electrical wiring; metal wires also form jewellery, mesh strainers and strings in instruments such as the veena, sitar, violin and guitar. Gold is exceptionally ductile and malleable. The length made from a given mass depends on the wire’s thickness, so a length claim needs that condition."
  },
  {
    "id": "foil-wire",
    "type": "figure",
    "figure": "foil-wire",
    "source": [
      3,
      4,
      5
    ],
    "caption": "A foil sheet uses malleability; wire and woven metal mesh use ductility. These are different ways of shaping a material."
  },
  {
    "id": "steel",
    "type": "body",
    "source": [
      5,
      14
    ],
    "text": "Many everyday “metal” objects are made from **alloys**: materials containing a metal mixed with one or more other elements. Steel is mainly iron with a small amount of carbon, sometimes with other elements added. Strong steel wires can be combined into ropes for cranes and suspension bridges. Ductility permits wire-making; strength helps the finished rope carry a load. Neither property alone is enough."
  },
  {
    "id": "wire-context",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "A cable may contain many strands rather than one thick wire. Thin strands can bend around a curve while sharing the load or electrical path. In a metal mesh, spaces between the wires matter too: the strainer holds larger pieces while liquid passes through. Shape works together with material properties."
  },
  {
    "id": "heritage",
    "type": "body",
    "source": [
      4,
      10
    ],
    "text": "Harappan craftspersons used copper and gold. Later iron-working supported strong agricultural tools. Extracting metal from ore, heating it and shaping it require different skills. An early copper object and a later iron object reveal a sequence, but do not explain why their use spread at different times."
  },
  {
    "id": "heritage-question",
    "type": "body",
    "source": [
      4
    ],
    "correction": "Replace a speculative discovery-order explanation with an evidence question.",
    "text": "Why might copper-working have developed before widespread iron-working? Look for archaeological dates, evidence about ores and furnaces, and the difficulty of extracting and shaping each material. Test your explanation against that evidence."
  },
  {
    "id": "sonority-head",
    "type": "heading",
    "level": 2,
    "text": "Listening to a material",
    "source": [
      5,
      6
    ]
  },
  {
    "id": "sound-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      5,
      6
    ],
    "sourceActivity": "4.2",
    "paragraphs": [
      "1. Select a metal spoon, coin, coal piece and small wood block with your teacher. Use a clear, hard surface and a teacher-approved low drop height. Keep feet and faces clear.",
      "2. Drop each separately from the same height onto the same surface. Compare the character and duration of the sounds, as well as loudness.",
      "3. Repeat and record a description for each. Stop using any damaged or crumbling object and record the damage.",
      "4. Could shape, surface or drop height affect the sound? Explain which conditions you kept alike."
    ]
  },
  {
    "id": "sonority",
    "type": "body",
    "source": [
      5,
      6
    ],
    "text": "Many metal objects produce a ringing sound when struck. This property is called **sonority**, and such objects are described as sonorous. A school bell and ghungroos use vibrating metal to make sound. Coal and wood often produce duller sounds in this comparison. Shape and support also matter: a spoon held tightly may not ring like a freely hanging one."
  },
  {
    "id": "sound-access",
    "type": "body",
    "source": [
      5
    ],
    "text": "Differences in sound can provide information about surroundings. A person using a mobility cane may notice changes when its tip contacts wood, metal or another surface. These sounds are useful clues alongside touch and learned skills. A sound by itself cannot tell us everything about the material or whether a route is safe."
  },
  {
    "id": "sound-context",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Think about a bell after it is struck. It continues vibrating for a time, so the sound lasts beyond the impact. Holding it firmly can damp those vibrations. Comparing a bell with a solid block therefore tests differences in construction as well as differences in material."
  },
  {
    "id": "heat-head",
    "type": "heading",
    "level": 2,
    "text": "Heat travels through materials",
    "source": [
      6,
      7
    ]
  },
  {
    "id": "heat-intro",
    "type": "body",
    "source": [
      6,
      7
    ],
    "text": "Cooking vessels often have a metal body and a handle made from a poorer heat conductor. Does heat travel along two different spoons at the same rate? To compare fairly, the spoons should be as similar as possible in length and thickness, and should begin at the same temperature."
  },
  {
    "id": "heat-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      6,
      7
    ],
    "sourceActivity": "4.3",
    "figure": "heat-spoons",
    "figureCaption": "Immerse the two spoon bowls equally. Compare matching points on the handles after the same time.",
    "paragraphs": [
      "Your teacher handles hot water in a heat-resistant container on a stable tray. Wear eye protection; do not touch heated metal or test temperatures with fingers.",
      "1. Put similar-sized metal and wooden spoons into the water together, equally immersing their bowls. Keep handles above the water.",
      "2. The teacher places suitable contact temperature probes at matching points above the water. Record starting readings and readings after equal intervals.",
      "3. Compare the temperature changes. Note differences in shape or probe contact. Without suitable probes, use teacher-provided measurements or a teacher demonstration."
    ]
  },
  {
    "id": "heat-record",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Read your temperature record as a change from the starting value. If one handle began warmer, its final temperature alone could mislead you. Compare the rise over the same interval, and check whether the pattern repeats before attributing it to the spoon material."
  },
  {
    "id": "heat-explain",
    "type": "body",
    "source": [
      7
    ],
    "correction": "Replace touch testing with measured comparison; poor conduction is not zero conduction.",
    "text": "**Conduction** transfers energy through a material from a hotter region towards a cooler one. Here, heat passes from water into the spoon bowls and along the handles. The metal handle generally warms faster. Wood transfers some heat too: a poor conductor can still become hot."
  },
  {
    "id": "heat-use",
    "type": "body",
    "source": [
      7,
      16
    ],
    "text": "A pan needs to transfer heat to its contents, withstand its working temperature and be suitable for contact with food. Aluminium, iron, steel and copper are used in cookware for combinations of properties. A wooden or suitable heat-resistant handle slows heat transfer to the hand, but it can still become hot near a flame. We will examine heat transfer further in Chapter 7."
  },
  {
    "id": "electric-head",
    "type": "heading",
    "level": 2,
    "text": "Testing an electrical path",
    "source": [
      7,
      8
    ]
  },
  {
    "id": "electric-intro",
    "type": "body",
    "source": [
      7,
      8
    ],
    "text": "Recall the tester circuit from Chapter 3. Place a sample in a gap so current must pass through the sample to reach the lamp. Predict which materials will allow enough current for a visible glow. A dark lamp is an observation; first check whether the tester itself works before interpreting that observation."
  },
  {
    "id": "electric-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      7,
      8
    ],
    "sourceActivity": "4.4",
    "paragraphs": [
      "Use a teacher-approved 1.5 V cell, correctly rated incandescent lamp in a holder and insulated leads. Never use mains sockets or connect cell terminals directly together.",
      "1. Select aluminium foil, iron, copper, sulfur, coal, dry wood, stone, a rubber eraser and nylon rope. Keep samples dry, handle sharp ends carefully and predict a result for each.",
      "2. Build the tester in the diagram. Bridge its gap with known conducting copper wire to check the lamp, then remove that wire.",
      "3. Put each sample across the gap with firm contacts. Keep clips apart. Test briefly, record glow or no visible glow, then disconnect.",
      "4. After a dark result, recheck the copper control and inspect contacts or coatings. Record uncertainty instead of classifying every dark result as perfect insulation."
    ]
  },
  {
    "id": "tester-diagram",
    "type": "diagram",
    "diagram": "tester",
    "source": [
      7,
      8
    ],
    "caption": "A sample bridges the gap. The lamp stays in the circuit to limit current; the drawing does not predict a result."
  },
  {
    "id": "electric-table",
    "type": "table",
    "source": [
      8
    ],
    "caption": "Table 4.2  Read the observation before classifying",
    "widths": [
      0.24,
      0.36,
      0.4
    ],
    "rows": [
      [
        "Notebook column",
        "Record",
        "Check"
      ],
      [
        "Sample",
        "Material; surface condition",
        "Firm contacts?"
      ],
      [
        "Prediction",
        "Glow or no glow; reason",
        "Before testing?"
      ],
      [
        "Observation",
        "What the lamp did",
        "Copper control working?"
      ],
      [
        "Conclusion",
        "Current detected or not",
        "Limits of this tester?"
      ]
    ],
    "note": "Make a row for each sample. No glow means too little current to light this lamp under these conditions."
  },
  {
    "id": "electric-explain",
    "type": "body",
    "source": [
      8
    ],
    "text": "Metals such as copper, aluminium and iron are generally good electrical conductors. Dry wood, rubber and many plastics are poor conductors in a low-voltage tester. Non-metals are not all alike: graphite, a form of carbon, conducts electricity. Coal contains carbon but is not pure graphite; a result for one coal sample cannot classify every form of carbon."
  },
  {
    "id": "electric-safety",
    "type": "body",
    "source": [
      7,
      8
    ],
    "correction": "Ordinary gloves and tool coverings are not reliable protection for mains work.",
    "text": "Insulating coverings help separate conducting parts from people and from one another. An electrician needs equipment rated for the work and follows procedures that include isolating the supply. Ordinary rubber gloves, shoes or a plastic handle do not make live electrical work safe. Our classroom tester gives no evidence that a material will protect someone at mains voltage."
  },
  {
    "id": "contact-example",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Suppose a painted metal strip gives no visible glow, but its clean exposed edge lets the lamp light. The two observations concern different contacts on the same object. They support an explanation involving the coating, rather than the conclusion that the underlying metal changed from an insulator into a conductor."
  },
  {
    "id": "rust-head",
    "type": "heading",
    "text": "4.2  Why Does Iron Rust?",
    "source": [
      8,
      9,
      10
    ]
  },
  {
    "id": "rust-intro",
    "type": "body",
    "source": [
      8,
      9
    ],
    "text": "An iron gate left outdoors may develop a reddish-brown coating. Does air alone cause it, does water alone cause it, or are both involved? Compare similar clean iron nails under three conditions. The purpose of each bottle is to limit one condition while keeping the kind of nail, location and observation period alike."
  },
  {
    "id": "rust-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      9
    ],
    "sourceActivity": "4.5",
    "paragraphs": [
      "Your teacher prepares three clean bottles labelled A, B and C and similar bright iron nails. Handle nail points carefully. The teacher removes old rust with sandpaper, handles hot water and keeps silica gel away from mouths.",
      "1. In A, suspend a dry nail above fresh silica gel and close the bottle tightly. The silica gel removes moisture from the trapped air.",
      "2. In B, the teacher covers a nail completely with freshly boiled water cooled with minimal contact with air, adds a continuous oil layer and caps it. Boiling reduces dissolved oxygen; oil slows oxygen entering again.",
      "3. In C, partly immerse a nail in ordinary water and leave the bottle open to air. Put all bottles in the same safe place at room temperature.",
      "4. Predict the changes separately for A, B and C. Observe without opening for 8–10 days. Record dates, where any brown deposit appears, and differences between repeated observations."
    ]
  },
  {
    "id": "rust-controls",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Compare A with C to examine the role of water, and B with C to examine oxygen exposure. Bottle C also checks that rust can develop during your observation period. If no bottle changes, consider whether the nails were coated or the experiment needs more time before drawing a conclusion."
  },
  {
    "id": "rust-diagram",
    "type": "diagram",
    "diagram": "rust",
    "source": [
      9
    ],
    "caption": "Starting conditions, not results. All three nails begin clean; B reduces oxygen exposure rather than proving oxygen is completely absent."
  },
  {
    "id": "rust-table",
    "type": "table",
    "source": [
      9
    ],
    "caption": "Table 4.3  Follow each bottle through time",
    "widths": [
      0.16,
      0.43,
      0.41
    ],
    "rows": [
      [
        "Bottle",
        "Designed condition",
        "Notebook observations"
      ],
      [
        "A",
        "Dry air; silica gel; capped",
        "Date and nail appearance"
      ],
      [
        "B",
        "Boiled water; oil barrier; capped",
        "Date and nail appearance"
      ],
      [
        "C",
        "Ordinary water and air; open",
        "Date and nail appearance"
      ]
    ],
    "note": "Read across for each setup, then compare the observed changes down the three rows. No rusting outcome is supplied here."
  },
  {
    "id": "rust-explain",
    "type": "body",
    "source": [
      10
    ],
    "text": "The usual result is little visible rust in A and B and more in C. This supports the conclusion that both water and oxygen are needed for ordinary iron rusting. **Rust** is a reddish-brown material containing hydrated iron oxides; **rusting** is the process that forms it. Rust is not simply dried water or dirt resting on the surface: the iron has reacted."
  },
  {
    "id": "rust-time",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Describe where the first change appears, not only whether a nail looks brown at the end. A dated sequence can reveal a change that a single final glance misses. Use the same lighting and viewing position so that a shadow or reflection is not mistaken for a new patch of rust."
  },
  {
    "id": "rust-think",
    "type": "panel",
    "kind": "think",
    "source": [
      9,
      10
    ],
    "addition": "Evaluate controls and imperfect exclusion.",
    "paragraphs": [
      "Suppose bottle B develops a small rusty patch. Does that one result show that oxygen is unnecessary? Suggest two ways oxygen could still have reached the nail.",
      "Explain how you would check the water preparation, oil layer and seal. Why are similar nails, a shared observation period and a working comparison bottle important before changing the explanation?"
    ]
  },
  {
    "id": "corrosion",
    "type": "body",
    "source": [
      10
    ],
    "text": "**Corrosion** is the gradual deterioration of a material, especially a metal, through reaction with its surroundings. Rusting is the familiar corrosion of iron. Copper may acquire a green coating and silver may tarnish black; those coatings are not iron rust. Air, water and other substances can contribute, so different metals do not all corrode in the same way."
  },
  {
    "id": "protect",
    "type": "comparison",
    "source": [
      10
    ],
    "columns": [
      {
        "title": "Keep the surface covered",
        "items": [
          "Paint forms a barrier between iron and its surroundings.",
          "Oil or grease can help keep water and air away.",
          "A damaged or incomplete coating may leave iron exposed."
        ]
      },
      {
        "title": "Choose a protective coating",
        "items": [
          "Galvanisation coats iron or steel with zinc.",
          "Zinc can protect iron as well as forming a surface layer.",
          "Check and maintain the coating instead of assuming protection lasts forever."
        ]
      }
    ]
  },
  {
    "id": "corrosion-photo",
    "type": "figure",
    "figure": "corrosion",
    "source": [
      10
    ],
    "caption": "Clean and rusted iron beside a painted bracket. Illustrative comparison; these are not the results of the bottle experiment."
  },
  {
    "id": "pillar",
    "type": "body",
    "source": [
      10
    ],
    "correction": "Omit unneeded approximate dimensions; qualify resistance rather than claim immunity.",
    "text": "Repairing corroded structures costs resources and money. Yet the Iron Pillar at Delhi, associated with the time of Chandragupta II more than 1,600 years ago, is famous for resisting corrosion. Its material, manufacture and environment help explain this resistance. It is evidence of sophisticated metalworking, not proof that all old iron is immune to rust."
  },
  {
    "id": "metal-air-head",
    "type": "heading",
    "text": "4.3  Metals React with Air and Water",
    "source": [
      11,
      12
    ]
  },
  {
    "id": "magnesium-intro",
    "type": "body",
    "source": [
      11
    ],
    "text": "Rusting is a slow change. Some metal reactions occur much more quickly. Magnesium can react with oxygen when heated. In the following teacher demonstration, separate three observations: what happens during burning, what remains afterwards, and how the cooled product behaves when mixed with water and tested with an indicator."
  },
  {
    "id": "magnesium-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      11
    ],
    "sourceActivity": "4.6",
    "figure": "magnesium-kit",
    "figureCaption": "Equipment before the demonstration. The ribbon is unburned; products are examined only after cooling.",
    "paragraphs": [
      "Teacher demonstration only under the school’s safety procedure. Wear eye protection, keep a safe distance and do not look directly at magnesium’s intense burning light.",
      "1. The teacher cleans a short ribbon with sandpaper, holds it in tongs over a heatproof surface, ignites it and safely collects the residue. Record the changes the teacher helps you observe.",
      "2. After cooling, the teacher adds water and stirs. Test separate clean portions with red and blue litmus; compare with water alone.",
      "3. Record both results, including unclear changes, then decide whether the mixture is acidic, basic or neutral. Students do not handle flames or hot products."
    ]
  },
  {
    "id": "magnesium-explain",
    "type": "body",
    "source": [
      11
    ],
    "text": "Magnesium burns with intense white light and forms a white solid, mainly magnesium oxide, by combining with oxygen. With water, some oxide forms magnesium hydroxide, making a basic mixture. Red litmus turns blue; blue litmus stays blue. The sparingly soluble oxide can leave the mixture cloudy."
  },
  {
    "id": "magnesium-equation",
    "type": "equation",
    "source": [
      11
    ],
    "text": "Magnesium + oxygen → magnesium oxide",
    "caption": "A word equation names the reactants and product. It does not represent the speed of a reaction or a measured mass."
  },
  {
    "id": "oxide-qualification",
    "type": "body",
    "source": [
      11,
      14
    ],
    "correction": "Qualify the metal-oxide generalisation.",
    "text": "Many metal oxides are basic, with exceptions. Our litmus evidence concerns the magnesium product mixed with water; it cannot establish a rule for every metal oxide. Chapter 5 revisits changes that form new substances."
  },
  {
    "id": "oxygen-source",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "The oxygen in this demonstration comes from the surrounding air. Water is added only after the ribbon has burned and the product has cooled. Keeping that sequence clear helps explain why the white residue is formed during burning, while the indicator test supplies a different piece of evidence afterwards."
  },
  {
    "id": "sodium",
    "type": "body",
    "source": [
      12
    ],
    "text": "Sodium reacts vigorously with water, releasing heat that can ignite the hydrogen formed. In laboratories, suitable oil such as kerosene limits its contact with air and moisture. Never handle sodium, open its container or try this reaction. Its oxide is basic, matching the broad pattern for many metal oxides."
  },
  {
    "id": "nonmetal-head",
    "type": "heading",
    "text": "4.4  A Different Pattern: Non-metals",
    "source": [
      12,
      13
    ]
  },
  {
    "id": "sulfur-intro",
    "type": "body",
    "source": [
      12,
      13
    ],
    "text": "Sulfur is yellow, brittle and unlike the familiar metals in several tests. What happens when it combines with oxygen? Its product is a gas, so the demonstration needs a way to contain and extract the gas safely. Do not try to identify it by smell."
  },
  {
    "id": "sulfur-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      12,
      13
    ],
    "sourceActivity": "4.7",
    "figure": "sulfur-kit",
    "figureCaption": "A proper deflagrating spoon and gas jar. The apparatus is shown before heating, without a predicted result.",
    "paragraphs": [
      "Teacher demonstration only in a working fume cupboard, with eye protection and the school’s approved method. Sulfur dioxide harms breathing. Without these facilities, use a recorded demonstration.",
      "1. The teacher burns a tiny amount of sulfur in a proper deflagrating spoon and collects the product in a covered gas jar inside the cupboard. Do not improvise a spoon from a bottle cap and wire.",
      "2. After safe cooling and spoon removal, the teacher adds water and mixes it with the contained gas. Observe without inhaling; never identify the gas by smell.",
      "3. The teacher tests separate portions with red and blue litmus against a water control. Record both results and infer the mixture’s nature. The teacher handles disposal."
    ]
  },
  {
    "id": "sulfur-explain",
    "type": "body",
    "source": [
      13
    ],
    "text": "Burning sulfur in oxygen produces sulfur dioxide. When this gas dissolves in water, it forms an acidic solution, often represented at this level as sulfurous acid in water. Blue litmus turns red while red litmus stays red. The indicator reveals acidity; it does not directly identify every substance present."
  },
  {
    "id": "sulfur-equation",
    "type": "equation",
    "source": [
      13
    ],
    "text": "Sulfur + oxygen → sulfur dioxide",
    "caption": "Compare this gaseous oxide with the solid oxide formed by burning magnesium."
  },
  {
    "id": "oxide-comparison",
    "type": "comparison",
    "source": [
      11,
      13
    ],
    "columns": [
      {
        "title": "Magnesium product",
        "items": [
          "Starting element: a metal.",
          "Product in air: mainly solid magnesium oxide.",
          "With water: a basic mixture; red litmus turns blue."
        ]
      },
      {
        "title": "Sulfur product",
        "items": [
          "Starting element: a non-metal.",
          "Product in air: sulfur dioxide gas.",
          "With water: an acidic solution; blue litmus turns red."
        ]
      }
    ]
  },
  {
    "id": "sulfur-water-intro",
    "type": "body",
    "source": [
      13
    ],
    "text": "Dissolving sulfur dioxide in water is different from placing unburned sulfur in water. The starting substances are different. Keep those two tests separate in your notes: a product formed by reaction need not behave like the element from which it was made."
  },
  {
    "id": "compare-substances",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Write the starting substance beside each observation: magnesium, magnesium oxide, sulfur or sulfur dioxide. These names identify different substances. A property of the starting element cannot automatically be assigned to its oxide, even though the oxide contains atoms of that element."
  },
  {
    "id": "sulfur-water-task",
    "type": "panel",
    "kind": "setup",
    "source": [
      13
    ],
    "sourceActivity": "4.8",
    "paragraphs": [
      "1. With your teacher, place a small amount of sulfur in a clear container. Avoid raising dust, touching your face or tasting it.",
      "2. Add room-temperature water and gently stir with a clean rod. Observe whether the sulfur disappears, remains visible or shows another change.",
      "3. Record the conditions and the observation. Do not heat the mixture. Your teacher collects the sulfur for reuse or appropriate disposal.",
      "4. Compare this observation with the teacher’s sulfur-dioxide demonstration. Explain why the two starting substances must not be treated as the same material."
    ]
  },
  {
    "id": "sulfur-water-explain",
    "type": "body",
    "source": [
      13
    ],
    "correction": "Limit a negative observation to sulfur under the conditions used; identify white phosphorus.",
    "text": "Sulfur remains largely undissolved and shows no obvious reaction with room-temperature water in this test. That observation does not show that every non-metal is unreactive with water. White phosphorus, a particular form of the non-metal phosphorus, can ignite in air and is stored under water in specialist laboratories. Do not handle it. Other forms of phosphorus have different properties."
  },
  {
    "id": "elements-head",
    "type": "heading",
    "level": 2,
    "text": "Elements and everyday materials",
    "source": [
      13
    ]
  },
  {
    "id": "elements",
    "type": "body",
    "source": [
      13
    ],
    "text": "An **element** is a substance that cannot be broken into simpler substances by chemical means. Metals and non-metals are groups of elements. Iron, copper and aluminium are metallic elements; sulfur, oxygen, hydrogen, nitrogen and carbon are non-metallic elements. IUPAC’s periodic table currently contains 118 named elements. Some are made in laboratories; some very short-lived elements occur only fleetingly."
  },
  {
    "id": "material-distinction",
    "type": "body",
    "source": [
      13
    ],
    "text": "Plastic, glass, wood, rubber and paper are materials, but they are not elements. Coal is a mixture rich in carbon, and steel is an alloy. These materials can be compared by their properties, yet it is misleading to classify every non-metallic object as a non-metal element. First distinguish the object, the material it is made from and the elements it contains."
  },
  {
    "id": "nonmetal-properties",
    "type": "bullets",
    "source": [
      13,
      14
    ],
    "items": [
      "Many solid non-metals are brittle; they are not readily hammered into sheets or drawn into wires.",
      "Many non-metals are poor heat and electrical conductors, but graphite conducts electricity.",
      "Non-metals do not all look or feel alike: some are gases; diamond is very hard; iodine can look shiny.",
      "Many non-metal oxides form acidic solutions with water, but some oxides are neutral. Test the particular substance before extending a pattern."
    ]
  },
  {
    "id": "classification-think",
    "type": "panel",
    "kind": "think",
    "source": [
      13
    ],
    "addition": "Distinguish element, material and property.",
    "paragraphs": [
      "A pencil core can carry a small current, yet it contains graphite, a non-metal form of carbon. A steel spoon contains carbon too. Why would “conducts electricity” and “contains carbon” each be insufficient to classify the whole object?",
      "Describe what evidence identifies an element, and what evidence describes a material’s behaviour. Use the difference to explain why a wooden ruler is not an example of a non-metal element."
    ]
  },
  {
    "id": "uses-head",
    "type": "heading",
    "text": "4.5  Why Both Groups Matter",
    "source": [
      13,
      14
    ]
  },
  {
    "id": "uses-intro",
    "type": "body",
    "source": [
      13,
      14
    ],
    "text": "Shiny metal tools are easy to notice. Non-metals may be less conspicuous, yet living things and many technologies depend on them. Their importance cannot be ranked by shine, strength or price. Sometimes an element is used directly; sometimes its compounds provide the useful function."
  },
  {
    "id": "nonmetal-uses",
    "type": "bullets",
    "source": [
      14
    ],
    "items": [
      "Oxygen supports human respiration and combustion. Some organisms live without it, so it is not essential to all life.",
      "Carbon forms the framework of carbohydrates, fats and proteins, supporting growth, structures and energy supply.",
      "Plants need usable nitrogen compounds. Fertilisers can supply them; most plants cannot directly use nitrogen gas.",
      "Chlorine-based disinfectants treat water under controlled conditions. Do not add laboratory chemicals to drinking water.",
      "Iodine-containing antiseptics are used in healthcare. Laboratory iodine is not a preparation to apply to wounds."
    ]
  },
  {
    "id": "modern-metals",
    "type": "body",
    "source": [
      14
    ],
    "text": "Metals and alloys are used in utensils, tools, buildings and transport. Titanium alloys combine low density with useful strength for aerospace uses; zirconium alloys are used in parts of nuclear reactors. Choosing a material also involves corrosion resistance, working temperature, availability and cost. A material that works well for one job may be unsuitable for another."
  },
  {
    "id": "choose-table",
    "type": "table",
    "source": [
      14,
      16
    ],
    "caption": "Table 4.4  Link a useful property with a limitation",
    "widths": [
      0.24,
      0.38,
      0.38
    ],
    "rows": [
      [
        "Application",
        "Useful property",
        "Also consider"
      ],
      [
        "Pan body",
        "Heat transfer",
        "Food-safe surface"
      ],
      [
        "Electrical wire",
        "Conductivity; ductility",
        "Insulation"
      ],
      [
        "Jewellery",
        "Lustre; shapeability",
        "Tarnish; skin contact"
      ],
      [
        "Outdoor structure",
        "Strength; durability",
        "Corrosion protection"
      ]
    ],
    "note": "Read across to weigh several requirements. These are design considerations, not test results."
  },
  {
    "id": "design-tradeoff",
    "type": "body",
    "source": [],
    "addition": "Focused evidence-reading and application guidance at a protected page join.",
    "text": "Choosing a material can involve a trade-off. A stronger part may be heavier or harder to shape; a cheap unprotected part may require frequent replacement outdoors. Explain your choice using the object’s actual job and expected conditions, rather than calling one material “best” for every use."
  },
  {
    "id": "recycling",
    "type": "body",
    "source": [
      14,
      16
    ],
    "text": "Iron and aluminium are widely recycled in India. Collecting, sorting and processing metal can reduce the need for new raw materials, though recycling still uses energy and careful waste handling. Repair, reuse and longer product life can reduce waste too. Keep batteries and electronic waste separate from ordinary scrap, and use authorised collection systems."
  },
  {
    "id": "closing",
    "type": "body",
    "source": [
      1,
      2,
      14
    ],
    "text": "Return to Sudarshan’s workshop. Explain the iron workpiece, the wood handle and the decision to heat metal before shaping it. Then choose another object and ask which properties its job demands. A scientific explanation links a named material to relevant evidence, recognises exceptions and considers what happens over the object’s whole lifetime."
  }
];
export const glossary=[
  [
    "Metallic lustre",
    "The characteristic shine of a clean metal surface."
  ],
  [
    "Malleability",
    "Ability to form sheets without breaking."
  ],
  [
    "Ductility",
    "Ability to be drawn into wire."
  ],
  [
    "Brittleness",
    "Tendency to fracture instead of deforming substantially."
  ],
  [
    "Sonority",
    "Ability to produce a ringing sound when struck."
  ],
  [
    "Conduction",
    "Transfer of energy through a material from hotter to cooler regions."
  ],
  [
    "Rusting",
    "Reaction of iron involving water and oxygen that forms rust."
  ],
  [
    "Corrosion",
    "Deterioration through reaction with the surroundings."
  ],
  [
    "Element",
    "Substance not broken into simpler substances by chemical means."
  ],
  [
    "Alloy",
    "A material containing a metal mixed with other elements."
  ]
];
export const summary=[
  "Use several properties to compare materials; a single test rarely identifies a material by itself.",
  "Many metals are lustrous, malleable, ductile and sonorous, but there are exceptions to broad property patterns.",
  "Metal wires and sheets make different uses of ductility and malleability. Alloys combine elements to obtain useful properties.",
  "Metals generally conduct heat and electricity well. Poor conduction is not the same as no conduction.",
  "A dark tester lamp needs a control and contact checks before drawing a conclusion about a sample.",
  "Ordinary rusting of iron requires water and oxygen. Drying, barriers and protective coatings can reduce corrosion.",
  "Magnesium forms a mainly solid oxide when burned. Its mixture with water is basic.",
  "Sulfur forms sulfur dioxide when burned. The gas gives an acidic solution in water; sulfur itself behaves differently.",
  "Metals and non-metals are groups of elements. Wood, plastic, coal and steel are not individual elements.",
  "Both metals and non-metals support life and technology. Choose, maintain, reuse and recycle materials responsibly."
];
export const exercises=[
  {
    "id": "q1",
    "source": [
      15
    ],
    "text": "Which metal is commonly used for inexpensive food-packaging foil that can fold readily? Choose aluminium, copper, iron or gold, and name the relevant property."
  },
  {
    "id": "q2",
    "source": [
      15
    ],
    "text": "Which metal can react so vigorously with water that a fire may result: copper, aluminium, zinc or sodium? Explain why this is a knowledge question, not a test to try."
  },
  {
    "id": "q3",
    "source": [
      15
    ],
    "text": "State whether each claim is true or false and explain. (a) Aluminium and copper are non-metals used in utensils and statues. (b) All metal oxides give solutions that turn blue litmus red. (c) Oxygen is a non-metal essential for human respiration. (d) Copper is used to boil water because it conducts electricity well."
  },
  {
    "id": "q4",
    "source": [
      15
    ],
    "text": "Why are only some metals and alloys suitable for jewellery? Consider appearance, ease of shaping, corrosion, wear and contact with skin. Explain why lustre alone is not enough."
  },
  {
    "id": "q5",
    "source": [
      15
    ],
    "text": "Unscramble the element names from these letter groups: PEPORC; OGDL; ENXYGO; TENGOINR; NECOHIRL. Then match them to: electrical wiring; exceptional malleability and ductility; human respiration; a plant nutrient supplied in fertilisers; water purification."
  },
  {
    "id": "q6",
    "source": [
      15
    ],
    "text": "What products form when magnesium and sulfur react with oxygen? Compare their physical states and the litmus evidence after each product is mixed with water."
  },
  {
    "id": "q7",
    "source": [
      16
    ],
    "text": "A teacher heats magnesium in air and mixes its cooled ash with water. Complete the missing names and colour changes in this flow chart in your notebook. Explain which observation supports the conclusion that the mixture is basic.",
    "diagram": "oxide-question",
    "caption": "Use separate clean portions for each litmus test. Supply the missing information in your notebook."
  },
  {
    "id": "q8",
    "source": [
      16
    ],
    "text": "Choose a suitable pan-body material from iron, copper, sulfur, coal, plastic, wood and cardboard. Give reasons concerning heat transfer, stability and safe use. Would you choose the same material for the handle?"
  },
  {
    "id": "q9",
    "source": [
      16
    ],
    "text": "Three similar clean iron nails are covered separately by oil, ordinary water and vinegar and left for the same time. Which setup would you expect to limit rusting most? State your assumptions about complete oil coverage and access to air. Explain why vinegar can attack iron and why appearance alone may not measure all corrosion."
  },
  {
    "id": "q10",
    "source": [
      16
    ],
    "text": "Give three uses of metals or non-metals. For each, connect the use with a property and identify one limitation or condition that matters."
  },
  {
    "id": "q11",
    "source": [
      16
    ],
    "text": "Zinc coatings protect iron. Sulfur shows no obvious reaction with water in our test. Is that observation enough to recommend sulfur as a protective coating? Consider brittleness, adhesion, complete coverage and what happens if the layer is damaged."
  },
  {
    "id": "q12",
    "source": [
      16
    ],
    "text": "Why does an ironsmith heat iron before shaping a tool? Explain how heating helps the metal deform. Does this mean every metal must be heated before it can be shaped?"
  }
];
export const projects=[
  {
    "id": "craft-project",
    "source": [
      16
    ],
    "title": "Metal craft and place",
    "text": "Research Dhokra, Bidriware, Pembarthi and Kamrupi metalwork. Identify the states or regions associated with each, the materials used and a shaping or decorating method. Make a photograph collage in your notebook with image-source credits. If you speak to a craftsperson, go with an adult, ask permission and observe tools from a safe distance."
  },
  {
    "id": "map-project",
    "source": [
      16
    ],
    "title": "Map resources carefully",
    "text": "Use a current Geological Survey of India or Indian Bureau of Mines source to locate important deposits or production areas for iron, gold and aluminium ores. Mark the states on an India map and add a key. Distinguish a mineral deposit, an active mine and a processing plant; aluminium is obtained from ores such as bauxite, not mined as shiny metal. Record the date of your source."
  },
  {
    "id": "phone-project",
    "source": [
      16
    ],
    "title": "Materials inside a smartphone",
    "text": "Research how copper, aluminium, carbon and other elements or compounds contribute to a smartphone. Use a manufacturer or scientific source and connect each example with a function. Do not dismantle a phone or its battery. Explain why a screen, circuit board or battery is a combination of materials rather than one pure element, and find an authorised route for electronic waste."
  },
  {
    "id": "debate-project",
    "source": [
      16
    ],
    "title": "Comfort, luxury and resources",
    "text": "Debate whether metal use for comfort and luxury should increase or decrease. Separate essential services from optional uses. Prepare evidence about durability, mining, energy, repair and recycling, then consider the strongest argument against your initial view. Agree on two practical ways your school could use materials more responsibly, and explain what evidence would show whether they worked."
  }
];

applyClass7ComparisonTables(lesson,4);
