// Editorial alternatives are matched to source paragraphs, never page numbers.
// Each item is a complete teaching point; shared caveats remain in open prose.
export const comparisons = [
 ['Living things on land live', 'Terrestrial habitats', [
  'Where: on land, including the ground beneath your feet.',
  'Examples: forests, deserts, grasslands and mountains.']],
 ['Living things in water live', 'Aquatic habitats', [
  'Where: in water.', 'Examples: ponds, lakes, rivers and oceans.']],
 ['Plants with soft, non-woody stems', 'Herbs', [
  'Stem: soft and non-woody.', 'Examples: mint, coriander and tomato.',
  'Many are small, but height alone does not define a herb.']],
 ['**Shrubs** are woody', 'Shrubs', [
  'Stem: woody, usually with several main stems.', 'Branches: often begin close to the ground.',
  'Example: rose. Check branching as well as height.']],
 ['**Trees** are woody', 'Trees', [
  'Stem: a woody main trunk supports a crown of branches.', 'Example: mango.',
  'A young mango is still a tree, even when shorter than a mature tomato plant.']],
 ['Some plants have stems that are too weak', 'Climbers', [
  'Stems cannot stand without support.', 'Grow up a wall, fence, stick or another plant.',
  'Examples: money plant and grape vine.']],
 ['Other plants also have weak stems', 'Creepers', [
  'Stems cannot stand upright.', 'Spread along the ground instead of climbing.',
  'Examples: pumpkin and watermelon.']],
 ['In **reticulate venation**', 'Reticulate venation', [
  'Veins branch and join to form a net.', 'Hibiscus has a thick middle vein with finer branching veins.',
  'Other examples: mango, neem and peepal.']],
 ['In other leaves, many veins run alongside', 'Parallel venation', [
  'Many veins run alongside one another.', 'Grass: veins run along the blade.',
  'Banana: parallel side veins extend from a strong middle vein towards the edges.',
  'Parallel venation does not mean that a middle vein is absent.']],
 ['A chana seedling usually develops', 'Taproots', [
  'One main root has smaller side roots.', 'Examples: chana, mustard and radish.',
  'The edible part of a radish includes a swollen taproot that stores food.']],
 ['As the wheat seedling develops', 'Fibrous roots', [
  'Several thin roots develop in the young wheat seedling.', 'Later, roots grow from the stem base into a spreading bunch without one dominant root.',
  'Other examples: grass, maize and lemongrass.']],
 ['A taproot can grow deep', 'Depth and water', [
  'A taproot can reach water below the surface.', 'Deep roots may help during a dry spell.',
  'Actual depth also depends on the species and soil.']],
 ['Many fibrous root systems spread', 'Spread and soil', [
  'Many fibrous systems spread through the upper soil.', 'Dense roots hold loose soil and absorb water near the surface.',
  'Some fibrous roots also extend deep into the ground.']],
 ['A soaked chana can separate', 'Chana', [
  'Two fleshy seed leaves, called **cotyledons**, store food for the young plant.',
  'Between them is the rest of the embryo, with a tiny root and shoot.',
  'Trace each diagram label to its part. Locate it in your specimen if visible.']],
 ['In maize, one thin cotyledon', 'Maize', [
  'One thin cotyledon lies beside the embryo’s tiny root and shoot.',
  'The larger pale food store is the **endosperm**, not a second cotyledon.',
  'Failure to split a grain is not proof of its cotyledon count.']],
 ['Among flowering plants, those whose seeds', 'Flowering-plant groups', [
  '**Dicotyledons**, or **dicots**: two cotyledons.',
  '**Monocotyledons**, or **monocots**: one cotyledon.']],
 ['Consider a cactus adapted', 'Cactus', [
  'Fleshy stem: stores water.', 'Waxy surface: reduces water loss.',
  'In many cacti, leaves are spines and the green stem carries out photosynthesis.']],
 ['On snowy mountain slopes', 'Deodar', [
  'Snow can load branches heavily.', 'Conical form and sloping branches can help shed snow.',
  'Temperature, soil and water also affect where the tree can grow.']],
 ['The Rajasthan camel is tall', 'Dromedary · Rajasthan', [
  'Body: tall, with long legs.', 'Feet: broad, spreading pads on two toes distribute weight on loose sand.', 'Coat: thin.',
  'Humps: one.']],
 ['The Ladakh camel is shorter', 'Bactrian · Ladakh', [
  'Body: shorter and heavier, with sturdy legs.', 'Feet: broad, padded and two-toed.',
  'Coat: thick and shaggy, especially at the head and neck, for freezing winters.', 'Humps: two.']],
 ['Adaptations are not always about extreme places', 'Movement in familiar animals', [
  'Adaptations also occur in ordinary surroundings and may be hard to spot.',
  'Fish: a smooth body moves easily through water; fins help steer and push.',
  'Duck: skin between the toes makes a paddling surface.',
  'Pigeon: toes without broad webbing help it grip supports and walk.']],
 ['Read across a row to connect a plant', 'Reading this record', [
  'Read across: connect one plant with its recorded features.',
  'Compare down: follow one feature across different plants.',
  'Which differences would be hardest to show in a drawing?']],
];

export const findComparison = text => comparisons.find(([start]) => text.startsWith(start));
export const comparisonWords = comparisons.flatMap(([, title, items]) => [title, ...items]).join(' ');
export const plantThinking = 'A young mango may be shorter than a tomato plant. Which stem and branching features would you inspect before grouping them? A banana is a large herb: its trunk-like **pseudostem** consists of tightly overlapping leaf bases, not a woody trunk. Explain why height alone would put it in the wrong group.';
export const seedThinking = 'Suppose a leaf pattern is clear but the roots broke during handling. Record venation as observed and root type as uncertain. Keep your prediction in a separate column until you can inspect intact roots. What evidence would confirm the root type? Why would writing the prediction as a result make the table misleading?';
export const conservationThinking = 'A class records more kinds of birds in a protected grove than in a clearing. Does this alone show that protection caused the difference? Compare area, water and vegetation, and use equal observation times at similar times of day. Plan repeated visits using the same method. What would you record so another class could check your comparison?';
