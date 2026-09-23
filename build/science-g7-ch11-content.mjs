// Independent manuscript. Source references are PDF page numbers, not printed folios.
export const title='Light: Shadows and Reflections',shortTitle=title;
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const p=(id,text,source,extra={})=>({id,type:'body',text,source,...extra});
const panel=(id,kind,paragraphs,source,extra={})=>({id,type:'panel',kind,paragraphs,source,...extra});
const d=(id,diagram,caption,source)=>({id,type:'diagram',diagram,caption,source});
const compare=(id,caption,rows,note,source)=>({id,type:'table',comparisonTable:true,caption,rows,note,source,widths:rows[0].length===4?[.19,.27,.27,.27]:[.2,.4,.4]});
export const opener=[
 'Watch a patch of light move across a wall. What changed its path?',
 'On a visit to a village in Maharashtra’s Western Ghats, Keshav and Jatin watch fireflies flashing among the trees. Some living things produce light. On the journey home, moonlit hills and vehicle headlights raise a different question: which objects make light, and which return light from elsewhere?',
 'Investigate what happens when light meets a material, a mirror or a tiny opening. Use observations to explain shadows and images, and build simple devices that put these ideas to work.'
];
export const lesson=[
 h('sources','11.1 Sources of Light',[1,2]),
 p('seeing','We see an object when light from it enters our eyes. Some objects emit visible light; others become visible because they reflect light falling on them. A book in a completely dark room cannot be seen merely by opening our eyes wider. Light must reach the book and then reach our eyes.',[1,2],{addition:'Explicit source–object–eye mechanism.'}),
 compare('luminous','Making light and reflecting light',[
  ['Aspect','Luminous object','Non-luminous object'],
  ['Visible light','Emits its own light.','Does not emit its own visible light.'],
  ['Examples','Sun, other stars, a glowing firefly, a lit lamp.','Moon, a book, a mirror, an unlit lamp.'],
  ['How we see it','Some emitted light reaches our eyes.','Light from another source is reflected towards our eyes.']
 ],'Describe the object in its present condition: the same lamp can be lit or unlit. A mirror redirects light; it is not a source of its own visible light.',[2]),
 p('natural-artificial','The Sun is Earth’s main natural light source; moonlight is reflected sunlight. Other stars, lightning, natural fires and some animals also emit light. People have used controlled fires and lamps burning oil, wax or gas for lighting. Electric lamps convert electrical energy into light; electricity was discovered and harnessed, not invented.',[2]),
 p('fireflies','Fireflies are beetles. Many use light signals in finding mates. Artificial light at night can disrupt those signals; habitat loss and careless tourism can also threaten populations. Watch from paths, keep unnecessary lights off and leave insects undisturbed. A night with no sightings does not by itself prove that a local population has disappeared.',[1,15],{type:'illustrated-note',heading:'Light has living roles',figure:'firefly',caption:'A firefly’s glow is light produced by a living organism.'}),
 p('led','For a similar light output, an efficient LED lamp usually uses less electrical power and lasts longer than a traditional incandescent lamp. Compare brightness, expressed in lumens, as well as power in watts; “LED” does not mean every lamp is brighter. India has promoted efficient lighting through programmes such as UJALA. Ask an adult to use an appropriate local collection or recycling route for spent lamps.',[2]),
 h('straight','11.2 Does Light Travel in Straight Lines?',[3]),
 p('straight-question','A torch beam seems straight, but an impression is not a test. Arrange a path with small openings. Predict what will happen when just one opening moves. Keep the source and screen still so that a changed observation has a clear possible cause.',[3]),
 panel('holes-task','setup',[
  '1. Ask an adult to make a small hole at the same position in each of three empty matchbox trays or stiff cards. Use clean empty boxes with no matches. Stand them upright at equal height.',
  '2. In a dim room, place a battery torch on one side and a white card screen on the other. Align the holes with the lamp. Adjust the supports until you can test the path reliably.',
  '3. Record what appears on the screen. Move only the middle card sideways, then restore it. Compare the screen in both positions; repeat to check the result.',
  'Do not look into the torch. Adults handle sharp tools. Keep a clear walkway and enough room light to move safely.'
 ],[3],{sourceActivity:'11.1',figure:'aligned-holes',figureCaption:'Align the lamp, three holes and screen before switching on. The drawing shows apparatus, not a result.'}),
 p('holes-evidence','If a light spot appears with the holes aligned, disappears when one card shifts, and returns when it is restored, the repeated change supports a straight path through the openings. If no spot appears at first, check the torch and alignment. An unsuccessful setup cannot establish how light travels.',[3]),
 panel('tube-task','setup',[
  '1. Look through a straight opaque flexible tube towards a small battery LED tealight. Keep its lamp a safe distance beyond the tube; never look directly into a powerful source.',
  '2. Bend the tube enough that its open ends no longer have a straight line of sight. Keep the same lamp on. Compare what you see and repeat after straightening.',
  '3. Record whether the lamp itself is visible, separately from any faint glow inside the tube. Use a dull, dark inner surface.',
  'A battery light avoids fire. If a teacher demonstrates with a candle, keep all tubes, hair and clothing away from the flame; learners do not handle it.'
 ],[3],{sourceActivity:'11.2',figure:'tube',figureCaption:'Compare a clear straight passage with a bent one using the same source.'}),
 p('tube-evidence','A direct view of the lamp is possible along a straight passage. A sufficiently bent opaque tube blocks that route. A shiny tube may reflect some light around a bend, so distinguish a reflected glow from an unobstructed view. Light has not curved smoothly around the corner; it may have changed direction at surfaces.',[3]),
 p('ray-model','In a uniform transparent medium such as still air, light travels along straight paths. We represent a selected path by a **ray**, a line with an arrow showing direction. A beam contains many such paths. Rays are a drawing model, not thin threads coming out of the eye.',[3,4],{addition:'Bounded ray model; no eye-emission misconception.'}),
 p('beam-visibility','We see a beam from the side only when some light is scattered towards our eyes. A teacher may demonstrate this with a low-power school-approved laser through water containing a drop of milk. The beam must end in a fixed non-reflective stop, below eye level; only the teacher handles it. Never aim a laser at eyes, mirrors, people or animals. A torch provides a safer alternative. Light can change direction between materials, and diffraction around edges is studied later; straight-line travel is a useful model with stated limits.',[4]),
 h('transmission','11.3 Light Through Materials',[4,5]),
 p('materials-question','Can you see a clear view through each material, and how much light reaches a screen behind it? These questions are related, but they are not identical. Make a prediction before testing glass or clear plastic, tracing paper, ordinary paper, cardboard and thick cloth.',[4,5]),
 panel('materials-task','setup',[
  '1. Fix a torch and white screen in a dim room. Check the screen with no sample present. Use safe sample edges; clear plastic can replace glass.',
  '2. Predict what will happen with each sample between torch and screen. Record the prediction before placing the sample in the beam.',
  '3. Hold each sample at the same marked position, covering the full beam. Record the brightness and spread of light on the screen. Also check whether a printed shape is clearly visible through the sample in ordinary room light.',
  '4. Compare prediction with observation. Repeat uncertain cases without changing sample thickness or distance. Keep torch light away from eyes.'
 ],[4,5],{sourceActivity:'11.3',figure:'materials',figureCaption:'Material samples can transmit, scatter, absorb and reflect light in different proportions.'}),
 {id:'material-record',type:'table',source:[4,5],caption:'Separate your prediction from your observation',widths:[.24,.25,.29,.22],rows:[['Sample','Prediction','Observation','Classification'],['Glass / clear plastic','Before testing','Screen and view','After testing'],['Tracing paper','Before testing','Screen and view','After testing'],['Paper / cardboard','Test separately','Screen and view','After testing'],['Thick cloth','Before testing','Screen and view','After testing']],note:'Use separate notebook rows for every sample. State thickness and number of layers. These are recording directions, not expected results.'},
 compare('transmission-table','Three useful material descriptions',[
  ['Aspect','Transparent','Translucent','Opaque'],
  ['View through it','Objects can be seen clearly.','Light passes, but details are blurred.','No view through the material.'],
  ['Light behaviour','Transmits much light with little scattering.','Transmits light but scatters it strongly.','Transmits negligible visible light at this thickness.'],
  ['Typical sample','Clear glass or clear acrylic.','Tracing paper or frosted glass.','Cardboard or a metal sheet.']
 ],'Read across one criterion. Colour alone does not determine the group. Thickness, layers and surface finish matter; a transparent sample still reflects or absorbs some light.',[5]),
 p('material-limits','A dim patch behind thick cloth could be light through gaps in the weave, rather than through its fibres. Cover the beam edges before deciding. A material is not permanently assigned to one group regardless of its form: a thin layer and a thick stack may behave differently. State what you tested.',[4,5],{addition:'Sample conditions and alternative light paths.'}),
 h('shadows','11.4 How Do Shadows Form?',[5,6]),
 p('shadow-question','Return to the screen behind an opaque sample. Where less light from the source reaches it, a darker region may be visible. Investigate which parts of the arrangement are needed to see that region, and which changes alter its outline.',[5,6]),
 panel('shadow-task','setup',[
  '1. Place an opaque ball or cardboard shape between a torch and a screen. Fix the torch and screen positions. Record the outline and approximate size of the dark region.',
  '2. Test one change at a time: remove the screen; replace it and remove the object; replace it and switch off the torch. Restore the original arrangement after each trial.',
  '3. Replace the object with one of the same size and shape but a different colour. Then use the original object and move it nearer the screen, then nearer the torch.',
  '4. Tilt a flat shape without moving the torch or screen. Record what changes and what stays the same. Compare the centre and edge of each dark region.',
  'Use a cool battery torch, never the Sun viewed directly. Keep paths clear and do not shine light towards eyes.'
 ],[6],{sourceActivity:'11.4',figure:'shadow-setup',figureCaption:'Keep the source and screen fixed when testing the object’s position.'}),
 {id:'shadow-record',type:'table',source:[6],caption:'Record each change against the starting arrangement',widths:[.52,.48],rows:[['Change','What to record'],['Remove screen / object / torch light','Test separately: where is a dark region visible?'],['Change only the object’s colour','Compare darkness and outline.'],['Move object nearer screen or source','Compare size; keep the other positions fixed.'],['Tilt the same flat object','Compare shape and sharpness.']],note:'Use sketches and measured widths where practical. Do not replace an unexpected observation with the result you think should occur.'},
 p('shadow-explanation','A **shadow** is a region receiving less light because an object blocks some paths from a source. A screen makes a cross-section of that region visible. A wall, ground or floor can serve as the screen. Removing a small card screen need not remove the shadow region itself: another surface farther away may show it.',[5,6,7]),
 p('shadow-size','With a small nearby source and a fixed screen, moving an object towards the source usually enlarges its shadow; moving it towards the screen usually makes it smaller and sharper. The blocked region widens as light spreads beyond the object. Tilting a flat object changes its outline. Different objects can cast similar outlines, so a shadow need not identify an object.',[7]),
 d('shadow-rays','shadow-rays','A side-view model with a small source. Boundary rays show why a nearby object can block a wider part of the screen; the lines are not physical strings.',[7]),
 p('shadow-colour','A shadow does not reproduce the object’s surface colours. It marks reduced illumination. Changing a red opaque ball to an otherwise matching blue one does not make the shadow blue. Its appearance also depends on the screen and other light reaching it, so shadows need not be perfectly black.',[6,7]),
 p('soft-shadows','An extended source sends light from many positions. At some points the object blocks only part of the source, making a lighter, soft edge. An opaque object can produce a strong shadow; translucent material often makes a weaker one. Even clear glass can create darker and brighter patches by reflecting or redirecting light. Those patterns depend on shape as well as transparency.',[6,7]),
 panel('shadow-pause','think',[
  'A learner removes the card screen and says, “The shadow no longer exists.” A dark patch is then found on the wall behind it. Explain the difference between a shadow region and the surface used to see it.',
  'Two differently coloured objects cast different-sized shadows. Is colour a fair explanation? Identify the positions and object properties you would match before testing that claim.'
 ],[6,7],{addition:'Separates shadow region, visible projection and fair comparison.'}),
 h('reflection','11.5 Reflection of Light',[7,8]),
 p('shiny-question','A polished metal plate may block light and cast a shadow, yet also send a bright patch elsewhere. Blocking transmission does not mean absorbing every bit of light. A surface can return some incident light to its surroundings.',[7,8]),
 panel('redirect-task','setup',[
  '1. Fix a battery torch so that it illuminates a small plane mirror or shiny flat steel plate. Use a stable support and a nearby pale wall or card screen.',
  '2. Slowly turn the mirror to try to send light towards a marked area on the wall. Keep the torch fixed. Record how the spot changes when the mirror turns.',
  '3. Compare a shiny surface with a dull card at the same position. Describe any difference in the returned light.',
  'Keep every reflected beam below eye level and away from people. A teacher may instead use sunlight, never directing it towards eyes or traffic.'
 ],[7,8],{sourceActivity:'11.5'}),
 p('reflection-definition','**Reflection** is the return of light from a surface into the medium it came from. A smooth mirror redirects a narrow beam in a definite direction. Turning the mirror changes that direction. Dull surfaces also reflect light, but roughness spreads it into many directions; that is how a sheet of paper can be seen from different places.',[8],{addition:'Reflection includes dull surfaces, not mirrors alone.'}),
 panel('slit-task','setup',[
  '1. Cover the gaps of a comb with black paper except for one narrow slit. Stand the comb on a white sheet laid flat on a table.',
  '2. Shine a battery torch through the slit at a shallow angle along the paper. Adjust it until a narrow band is visible. Keep the torch and comb still.',
  '3. Stand a small plane mirror upright in the band’s path. Mark its base. Trace the incoming and outgoing bands with a ruler after marking several points.',
  '4. Turn only the mirror and repeat on fresh paper. Describe what changed. Do not aim the beam or its reflection towards eyes; use taped mirror edges.'
 ],[8],{sourceActivity:'11.6',figure:'reflection-setup',figureCaption:'Prepare the slit and mirror before tracing the light paths. No result is drawn into the setup.'}),
 p('reflection-evidence','The visible band changes direction at the mirror. Between the slit and mirror, and between the mirror and another surface, the path is straight. Reflection is a change at a boundary, not evidence that light travels in a curved path through the surrounding air.',[8]),
 d('reflection-rays','reflection-rays','A top-view model: incoming and reflected rays meet at the mirror. The dashed normal is perpendicular to the mirror; it is a reference line, not a light ray.',[8]),
 p('reflection-rule','For a smooth plane mirror, the incoming and outgoing rays make equal angles with the normal. You will study this rule more fully later. Here, the tracing helps explain why a slight turn of the mirror moves a light spot: the reflecting surface, and therefore the direction it returns light, has changed.',[8],{addition:'Simple geometrical explanation for controlled mirror turning.'}),
 h('mirror-images','11.6 Images in a Plane Mirror',[9,10]),
 p('mirror-question','A bright patch on a wall is not the same as a recognisable mirror image. Look at a pen in a mirror. Where does it appear to be, and what properties can you compare without confusing an image with a second physical pen?',[9]),
 panel('pen-task','setup',[
  '1. Secure a plane mirror upright with covered edges. Stand a pen in front of it. Observe the image from a fixed viewing position.',
  '2. Move the pen to several distances. Compare its orientation and the image’s apparent position. Is the pen’s top still at the top in the image?',
  '3. Try placing a white screen at different positions in front of and behind the mirror. Distinguish a reflected bright patch from a sharp image of the pen on the screen.',
  '4. Record what you can observe, and which size or distance claims would need a measurement rather than a visual guess.'
 ],[9],{sourceActivity:'11.7'}),
 p('virtual-image','A plane mirror forms an upright image of the same size as the object. The image appears as far behind the mirror as the object is in front, measured perpendicular to the mirror. It is a **virtual image**: reflected light reaches our eyes as though it came from that position, but does not actually pass through the image behind the mirror. It cannot be projected directly onto a screen there.',[9,10]),
 d('pen-image','mirror-pen','The pen is an object; its appearance in the mirror is an image. Perceived size in a perspective view is not a ruler measurement of image size.',[9]),
 p('mirror-size','Moving away can make both object and image look smaller to the eye, just as a distant tree looks smaller. That change in viewing angle does not mean the plane mirror has reduced the actual image height. Compare size using a suitable position-matching method rather than a photograph taken from an arbitrary angle.',[9],{addition:'Distinguishes optical size from angular appearance.'}),
 panel('self-task','setup',[
  '1. Stand safely in front of a secured plane mirror. Move closer, then farther away. Notice where your image appears relative to the mirror.',
  '2. Raise your left arm, then touch your right ear. Describe the image without assuming it is another person who has turned around to face you.',
  '3. Write a short word on paper and hold it parallel to the mirror, facing the mirror. Compare the word with its image. Sketch both in your notebook.',
  '4. Optional teacher demonstration: use a safe semi-reflecting sheet and two matching upright objects to locate the apparent image. Measure equal distances from the sheet; do not move or handle large glass mirrors.'
 ],[9,10],{sourceActivity:'11.8'}),
 p('lateral','The familiar apparent left–right reversal is called **lateral inversion**. More precisely, a plane mirror reverses the direction perpendicular to its surface: front and back. It does not exchange the top and bottom. Comparing the image with a person imagined turning around to face you produces the familiar left–right description. Letters show this especially clearly.',[10]),
 d('mirror-word','mirror-word','A word facing a mirror and its reversed image. The shape of each letter helps you track the change.',[10]),
 p('ambulance','Some ambulances carry mirror writing on the front so that the name reads normally in a driver’s rear-view mirror. Symmetric printed letters such as T and O may look unchanged under left–right reversal. This depends on the letter shape and typeface; it is not true of every written word.',[10,15]),
 p('metal-mirror','A mirror need not be ordinary silvered glass. Carefully polished metal can form an image too. Aranmula Kannadi, made in Kerala, is a traditional metal-alloy mirror with its reflecting surface at the front. Its craft links material properties with the smooth surface needed for a clear image.',[10]),
 h('pinhole','11.7 A Pinhole Camera',[10,11]),
 p('pinhole-question','Can light form an image on a screen without a mirror? A tiny opening admits narrow bundles of light from different parts of an object. First investigate a simple arrangement; then build an enclosed version that reduces stray light.',[10,11]),
 panel('pinhole-task','setup',[
  '1. An adult makes a small clean pinhole in an opaque card. Place the card between a bright battery LED shape and a tracing-paper screen in a dim room.',
  '2. Shield the sides with dark card so stray light does not brighten the screen. Move the screen slowly until you can distinguish an image; note its orientation and colour.',
  '3. Change only the hole size by substituting a second card at the same position. Compare brightness and clarity; keep the object and screen fixed.',
  'A teacher may demonstrate with a candle in a stable holder with clear space. Learners do not handle flames. Adults use pins or blades; never view the Sun through this apparatus.'
 ],[11],{sourceActivity:'11.9'}),
 p('pinhole-explanation','The image is inverted. Light from the top of the object travels through the hole to the lower part of the screen; light from the bottom reaches the upper part. The paths cross at the opening. No ray has to bend there. The image can retain colours because light from different object parts reaches different screen regions.',[11]),
 panel('camera-task','setup',[
  '1. Find two cardboard boxes that slide snugly into each other. Open one end of each. An adult makes a tiny pinhole in the opposite face of the larger box.',
  '2. Cut a 5–6 cm square window in the opposite face of the smaller box. Tape tracing paper smoothly over it to make a screen.',
  '3. Slide the smaller box inside the larger one with its tracing-paper face towards the pinhole. The open viewing end remains outside. Seal unwanted light leaks with dark tape.',
  '4. Aim at a sunlit tree or building with the Sun safely behind you. Shade the viewing opening with a loose dark cloth without covering your nose or mouth. Slide the inner box and observe orientation, colour, size and clarity.',
  'Never aim at or look towards the Sun. Adults cut card; use blunt scissors where possible. Keep the camera dry and use it from a safe standing position.'
 ],[11],{sourceActivity:'11.10',figure:'pinhole-kit',figureCaption:'The small box’s tracing-paper face goes inside, towards the pinhole. View its screen through the open outer end.'}),
 p('camera-distance','Sliding the inner box changes the distance from hole to screen. A larger hole-to-screen distance generally gives a larger, dimmer image of the same distant scene. The movement changes image scale; a pinhole has no lens to focus like a camera lens. Better shading may reveal an image that seemed absent in a bright viewing opening.',[11]),
 d('pinhole-rays','pinhole-rays','Two representative paths explain the inverted image. The object and screen are on opposite sides of a tiny opening; the hole is enlarged in this model for clarity.',[11]),
 p('pinhole-tradeoff','A larger hole admits more light, often giving a brighter but less distinct image as neighbouring object points overlap. A smaller hole often improves clarity but darkens the image. An extremely tiny hole is not automatically best: diffraction eventually limits sharpness. Record what your camera shows rather than assuming one size must win.',[11],{addition:'Brightness–sharpness trade-off and bounded small-hole claim.'}),
 compare('image-comparison','A shadow, a mirror image and a pinhole image',[
  ['Aspect','Shadow','Plane-mirror image','Pinhole image'],
  ['Formation','Light is blocked from part of a region.','Reflected paths appear to start behind a mirror.','Light from object points passes through a tiny hole.'],
  ['Appearance','Outline depends on object, source and screen.','Upright, same size; laterally inverted.','Inverted; size depends on distances.'],
  ['Colour detail','Does not reproduce surface colours.','Retains object colour information.','Can retain object colour information.'],
  ['Screen','A surface makes the shadow visible.','Cannot be directly projected onto a screen.','Forms on a screen behind the hole.']
 ],'Compare the same criterion across all three columns. A dark silhouette alone cannot establish whether you are seeing a shadow or an image; inspect the light path.',[9,11,12]),
 panel('image-pause','think',[
  'A leaf-shaped dark patch appears on paper. One learner calls it a shadow; another calls it a pinhole image. What would you inspect in the arrangement to decide between those explanations?',
  'Your camera shows no clear image. Suggest two changes that improve the test without changing the object. Explain why “no visible image” does not yet show that light failed to pass through the hole.'
 ],[11,12],{addition:'Identify mechanism from apparatus and bound a negative observation.'}),
 h('devices','11.8 Building With Reflections',[12,13]),
 h('periscope-heading','11.8.1 A Periscope',[12],2),
 p('periscope-build','To make a simple **periscope**, use a tall cardboard tube with an upper opening facing one way and a lower opening facing the opposite way. An adult helps secure two small plane mirrors at the bends. Their reflecting faces must send light into the tube and then towards the viewing opening. In this arrangement the mirrors are parallel and each is at 45° to the tube’s length.',[12]),
 d('periscope-model','periscope','A cutaway of the housing and a separate path model. The model locates the two parallel mirrors; it is not a view of light glowing inside the tube.',[12]),
 p('periscope-use','Light from an object enters the upper opening, reflects down the tube, then reflects towards the eye at the lower opening. Try looking over a low cardboard barrier. If no view appears, check the mirror positions and clear openings. Tape all edges; use small safety mirrors or reflective plastic, not loose broken glass. Never aim the device at the Sun or use it to look into private spaces.',[12]),
 p('periscope-world','Periscopes and related viewing systems let observers see from protected positions, including in submarines, armoured vehicles and shelters. Real instruments may include lenses, prisms or cameras. The simple classroom model explains the two-reflection route without reproducing every part of a modern instrument.',[12]),
 h('kaleidoscope-heading','11.8.2 A Kaleidoscope',[12,13],2),
 p('kaleidoscope-build','Join three equal-width reflective strips into a triangular tube with the reflective faces inward. Fit them inside a cardboard tube. At one end, make a shallow sealed chamber with a transparent window, a few smooth coloured plastic pieces or beads, and a tracing-paper outer cover. Leave room for the pieces to move. At the other end, fit an eyehole cap. Adults cut materials and secure all edges; never use broken bangles or glass.',[12]),
 d('kaleidoscope-parts','kaleidoscope','Parts for a safe kaleidoscope. Use smooth plastic pieces, seal the end chamber and keep small parts away from younger children.',[12]),
 p('kaleidoscope-explain','Look through the eyehole towards a softly lit window, never towards the Sun. Gently turn the tube and compare patterns. Multiple reflections produce repeated images of the pieces. As the pieces move, the arrangement changes, creating new patterns; it need not be different after every possible turn. Artists and designers can use these repeated forms as starting points for designs.',[13]),
 p('kaleidoscope-open','An open-ended triangular mirror tube can also repeat parts of an outside scene, such as leaves. Compare it with the sealed coloured-piece version. The mirror arrangement supplies repeated views, while the objects supply colour and detail. Do not confuse a change in objects with a change in the number or angle of mirrors.',[13]),
 compare('device-comparison','Two devices using more than one reflection',[
  ['Aspect','Simple periscope','Kaleidoscope'],
  ['Arrangement','Two parallel mirrors at bends in a tube.','Three strips facing inward around a triangular space.'],
  ['Main result','A view from beyond an obstruction.','Repeated images forming patterns.'],
  ['What to investigate','Which path connects object and eye?','How do mirror angles and moving objects affect patterns?']
 ],'Both depend on reflection. Their different arrangements serve different purposes; the number of reflections along a particular viewing path need not equal the number of mirrors.',[12,13]),
 p('light-time','Light takes time to travel. Sunlight takes about 8 minutes 20 seconds to cover the average Sun–Earth distance. We therefore see the Sun as it was roughly eight minutes earlier. This is a time-of-travel idea, not a suggestion to stare at the Sun. The distances in classroom experiments are too short for our eyes to notice such a delay.',[16]),
 panel('connections-pause','think',[
  'A mirror lets you see a pen, a periscope lets you see past a barrier, and a pinhole camera forms a picture on paper. Trace the route from object to eye in each case. Which route needs a screen?',
  'Choose one observation from the chapter that supports straight-line travel and one that supports reflection. Explain why neither observation alone proves every claim about light.'
 ],[13,16],{addition:'Connect evidence and models without collapsing distinct image mechanisms.'})
];
export const glossary=[
 ['Luminous','Emitting its own visible light.'],['Non-luminous','Seen by light from other sources, rather than its own visible emission.'],
 ['Ray','A model line showing a light path and its direction.'],['Transparent','Transmitting light with little scattering so a clear view is possible.'],
 ['Translucent','Transmitting light while scattering it so a view is blurred.'],['Opaque','Transmitting negligible visible light at the stated thickness.'],
 ['Shadow','A region receiving less light because some paths are blocked.'],['Reflection','Light returning from a surface into the medium it came from.'],
 ['Plane mirror','A mirror with a flat reflecting surface.'],['Virtual image','An apparent origin of light where the rays do not actually meet.'],
 ['Lateral inversion','The familiar apparent left–right reversal of a mirror image.'],['Pinhole camera','A light-shielded device forming an image through a tiny opening.'],
 ['Periscope','A device using reflections to provide a view past an obstruction.'],['Kaleidoscope','A device using multiple reflections to make repeated patterns.']
];
export const summary=[
 'We see objects when light from them enters our eyes. Luminous objects emit light; non-luminous objects reflect light from other sources.',
 'Light follows straight paths in a uniform transparent medium. Aligned openings and straight-versus-bent passages provide evidence for this model.',
 'Transparent, translucent and opaque describe visible-light transmission through particular samples. Thickness, surface finish and scattering matter.',
 'A shadow is a region of reduced illumination. A surface makes it visible; its shape, size and sharpness depend on the source, object and screen.',
 'A shadow does not reproduce surface colours. Other illumination can soften or lighten it, and clear objects can also redirect light into patterns.',
 'Smooth mirrors return light in definite directions. Rough surfaces reflect light too, spreading it into many directions.',
 'A plane mirror forms an upright, same-sized virtual image at the same perpendicular distance behind the mirror as the object is in front. It shows lateral inversion.',
 'A pinhole image is inverted and forms on a screen. Its colours come from the object; its scale, brightness and sharpness depend on the arrangement.',
 'A simple periscope redirects a view with two mirrors. A kaleidoscope produces repeated patterns through multiple reflections.',
 'Keep strong and reflected beams away from eyes. Never view the Sun through an optical device. Record uncertain results and check the apparatus before drawing conclusions.'
];
export const exercises=[
 {id:'q1',source:[13],text:'Which are luminous in visible light: Mars, Moon, Pole Star, Sun, Venus and a mirror? Give a reason for each group.'},
 {id:'q2',source:[13],text:'Match each term with one lettered description. Explain one match.',table:{caption:'Terms and descriptions',widths:[.38,.62],rows:[['Term','Description (shuffled)'],['Pinhole camera','A. Transmits negligible visible light.'],['Opaque object','B. A region receiving less light because paths are blocked.'],['Transparent object','C. Forms an inverted image on a screen.'],['Shadow','D. Allows a clear view through it.']],note:'Entries on the same row are not necessarily a match.'}},
 {id:'q3',source:[14],text:'Sahil, Rekha, Patrick and Qasima look through the labelled openings towards the lit LED at the right. The tube is opaque, with dull inner walls and no mirrors. Who has a direct view of the source? Trace the possible paths and explain.',diagram:'pipe-question',caption:'Each name marks a viewing opening. The branches join one horizontal passage.'},
 {id:'q4',source:[14],text:'A boy stands on level ground with a small lamp above and to his left. Which shadow arrangement is possible: (a) extending left towards the lamp; (b) extending right, away from the lamp; (c) floating above his head; (d) a coloured copy of his clothes? Draw the boy, lamp and shadow, and explain your choice.'},
 {id:'q5',source:[14],text:'A ball is placed between a small fixed torch and a fixed wall. In case (i) it is nearer the torch; in case (ii) it is nearer the wall. Choose the better prediction: (a) the shadow is larger in (i) than in (ii); (b) it is smaller in (i) than in (ii). Use boundary rays to explain your answer.',diagram:'shadow-question',caption:'Move the same ball along the source–screen line. The drawing identifies the apparatus; draw your own predicted shadows.'},
 {id:'q6',source:[14],text:'Keep the ball and wall fixed. Match each change with its likely result. State how two torches must be positioned for two shadows to be distinguishable.',table:{caption:'Changes and possible results',widths:[.46,.54],rows:[['Change','Result (shuffled)'],['Torch nearer the ball','A. Smaller shadow.'],['Torch farther from the ball','B. Larger shadow.'],['Ball removed','C. Two displaced shadows, possibly overlapping.'],['Two separated torches used','D. Unobstructed illuminated patch.']],note:'Use a small source and compare with the original arrangement. The rows are not supplied answers.'}},
 {id:'q7',source:[15],layout:'side',text:'This asymmetric tree is viewed through a pinhole camera. Sketch its image on the screen. Mark the taller side of the crown and explain how light from the tree’s top reaches the screen.',figure:'tree',figureHeight:270,caption:'Use the unequal sides of the crown to track orientation.'},
 {id:'q8',source:[15],text:'Write your name on paper and hold it parallel to a plane mirror, facing the mirror. Sketch the mirror image. What changes, and what remains the same? Explain why a symmetric letter can look unchanged.'},
 {id:'q9',source:[15],text:'With a friend, measure your shadow at 9 AM, 12 PM and 4 PM from the same place, using the same posture and method. Never look at the Sun. Which is shortest, and how does the Sun’s height explain it? Must the shortest shadow occur exactly at clock noon?'},
 {id:'q10',source:[15],text:'A: a plane-mirror image shows lateral inversion. B: symmetric upright block capitals T and O appear unchanged in a plane mirror. Choose: (i) both true; (ii) both false; (iii) only A true; (iv) only B true. Explain why the letter shapes matter.'},
 {id:'q11',source:[15],layout:'side',text:'Could this tube become a periscope using two small plane mirrors? Copy the side view, mark both mirrors and draw a route from the upper opening to the lower one. Explain why the tube alone does not provide that view.',diagram:'periscope-question',caption:'Both openings face left. Choose mirror orientations for this particular tube.'},
 {id:'q12',source:[15],text:'A bird flying high may produce no easily visible shadow on the ground, while one flying near the ground makes a clearer shadow. Explain using the Sun as an extended source and the bird–ground distance. Does an undetectable dark patch mean the bird blocks no sunlight?'}
];
export const projects=[
 {id:'project-fireflies',source:[15],title:'1. A local story about fireflies',text:'Ask older residents whether fireflies were seen locally in the past. Compare accounts with any present observations made with an adult from safe paths. Record season, weather, time and lighting. Develop an illustrated story distinguishing observations, memories and possible explanations. Habitat loss or light pollution may be relevant, but interviews alone cannot establish the cause of a decline. Never catch the insects.'},
 {id:'project-colours',source:[15,16],title:'2. Coloured light and shadows',text:'Repeat the shadow investigation with a cool battery torch covered by coloured transparent film. Change one colour at a time, keeping distances, object and screen fixed. Record both the illuminated area and the darker patch. Compare in a dim room and with ordinary room light. Explain why a filter changes the light reaching the screen without making the shadow a copy of the object’s paint. Do not cover hot lamps.'},
 {id:'project-mirrors',source:[16],title:'3. More than one mirror',text:'With an adult, secure two small mirrors with taped edges. Place one coloured object between them and compare views with the mirrors at several angles, then parallel. Sketch and count the images you can actually distinguish. State the angle and viewing position. Explain how an image in one mirror can be reflected in the other; do not assume a finite, dim view shows every theoretically possible image.'},
 {id:'project-small-mirror',source:[16],title:'4. A small mirror and a large tree',text:'Predict whether a small plane mirror can show a tree much larger than itself. Use a mirror with safe edges to view a distant tree while keeping the Sun behind you and out of every reflected view. Change your eye’s position and distance from the mirror; record which parts are visible. Explain the difference between image size and the portion of a view admitted by a small mirror. Never use a loose broken piece.'}
];
