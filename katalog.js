// Artikelkatalog der Einkaufsliste.
// Pro Abteilung eine Liste von Einträgen, getrennt durch Komma oder Zeilenumbruch.
// Innerhalb eines Eintrags trennt „|“ Synonyme; das erste Wort ist der angezeigte Name.
// Ein vorangestelltes „~“ markiert eine Falschschreibung: sie wird erkannt, aber als Hauptname angezeigt.
// Groß-/Kleinschreibung, Umlaute und Bindestriche spielen beim Abgleich keine Rolle.

const ABTEILUNGEN = [
  { id: 'gemuese',       name: 'Gemüse' },
  { id: 'obst',          name: 'Obst' },
  { id: 'brot',          name: 'Brot & Backwaren' },
  { id: 'molkerei',      name: 'Molkerei & Eier' },
  { id: 'kaese',         name: 'Käse' },
  { id: 'fleisch',       name: 'Fleisch & Wurst' },
  { id: 'fisch',         name: 'Fisch' },
  { id: 'kuehlveg',      name: 'Tofu, Frischteig & Feinkost' },
  { id: 'fruehstueck',   name: 'Frühstück, Kaffee & Tee' },
  { id: 'nudeln',        name: 'Nudeln, Reis & Beilagen' },
  { id: 'konserven',     name: 'Konserven & Saucen' },
  { id: 'oel',           name: 'Öl, Essig & Gewürze' },
  { id: 'backen',        name: 'Backzutaten & Nüsse' },
  { id: 'suess',         name: 'Süßes & Snacks' },
  { id: 'pflanzendrink', name: 'H-Milch & Pflanzendrinks' },
  { id: 'getraenke',     name: 'Getränke' },
  { id: 'tk',            name: 'Tiefkühl' },
  { id: 'drogerie',      name: 'Drogerie & Körperpflege' },
  { id: 'haushalt',      name: 'Haushalt & Putzen' },
  { id: 'sonstiges',     name: 'Sonstiges' },
];

const KATALOG = {
  gemuese: `
    Tomaten|Tomate|Rispentomaten|Strauchtomaten|Fleischtomaten, Cherrytomaten|Kirschtomaten|Cocktailtomaten|Datteltomaten|Snacktomaten,
    Gurke|Salatgurke|Gurken|Minigurken|Snackgurken, Zucchini|Zucchetti, Paprika|Paprikaschote|Spitzpaprika|Paprikaschoten,
    Karotten|Karotte|Möhren|Möhre|Gelbe Rüben|Rüebli, Kartoffeln|Kartoffel|Erdäpfel|Drillinge|Frühkartoffeln|Festkochende Kartoffeln|Mehligkochende Kartoffeln,
    Süßkartoffeln|Süßkartoffel|Batate, Zwiebeln|Zwiebel|Gemüsezwiebel|Rote Zwiebeln|Schalotten, Frühlingszwiebeln|Lauchzwiebeln,
    Knoblauch|Knoblauchzehen|Knoblauchknolle, Ingwer|Ingwerknolle, Kurkumawurzel, Brokkoli|Broccoli|~Brokoli, Blumenkohl|Karfiol, Romanesco,
    Pilze|Champignons|Champignon|Braune Champignons|Egerlinge, Kräuterseitlinge, Pfifferlinge|Eierschwammerl, Shiitake, Austernpilze,
    Salat|Kopfsalat|Blattsalat|Pflücksalat|Salatmix|Salatmischung, Eisbergsalat|Eisberg, Römersalat|Romana|Romanasalat|Salatherzen,
    Lollo Rosso|Lollo Bionda|Eichblattsalat, Feldsalat|Rapunzel|Nüsslisalat, Rucola|~Ruccola|Rauke, Chicorée|Chicoree, Radicchio,
    Spinat|Blattspinat|Babyspinat|Spinatblätter, Lauch|Porree, Staudensellerie|Stangensellerie|Sellerie, Knollensellerie|Sellerieknolle,
    Suppengemüse|Suppengrün|Wurzelwerk, Aubergine|Auberginen|Melanzani, Kürbis|Hokkaido|Butternut|Butternutkürbis|Hokkaidokürbis,
    Rote Bete|Rote Beete|Randen, Radieschen, Rettich|Rettiche, Kohlrabi, Weißkohl|Weißkraut|Spitzkohl, Rotkohl|Rotkraut|Blaukraut,
    Wirsing, Rosenkohl, Grünkohl, Chinakohl, Pak Choi|Pak Choy|Pak-Choi, Fenchel, Spargel|Grüner Spargel|Weißer Spargel,
    Maiskolben|Zuckermais, Zuckerschoten|Zuckererbsen|Kaiserschoten, Grüne Bohnen|Buschbohnen|Stangenbohnen|Brechbohnen,
    Avocado|Avocados, Mangold, Pastinaken|Pastinake, Petersilienwurzel, Topinambur, Schwarzwurzeln, Artischocken, Okra,
    Chili|Chilischote|Chilischoten|Peperoni|Jalapenos, Kräuter|Frische Kräuter|Kräutertopf, Basilikum, Petersilie|Glatte Petersilie|Krause Petersilie,
    Schnittlauch, Koriander|Koriandergrün, Dill, Minze|Pfefferminze, Rosmarin, Thymian, Salbei, Zitronengras, Kresse|Gartenkresse, Sprossen|Keimlinge,
    Gemüse|Frisches Gemüse, Rohkost, Salatgemüse
  `,
  obst: `
    Äpfel|Apfel|Tafeläpfel, Bananen|Banane, Birnen|Birne, Orangen|Orange|Apfelsinen, Mandarinen|Clementinen|Mandarine|Clementine,
    Zitronen|Zitrone, Limetten|Limette, Grapefruit|Pampelmuse, Trauben|Weintrauben|Tafeltrauben, Erdbeeren|Erdbeere,
    Himbeeren|Himbeere, Blaubeeren|Blaubeere|Heidelbeeren|Heidelbeere, Brombeeren|Brombeere, Johannisbeeren|Ribisel, Stachelbeeren,
    Beeren|Frische Beeren, Kirschen|Kirsche, Pfirsiche|Pfirsich|Plattpfirsiche, Nektarinen|Nektarine, Aprikosen|Aprikose|Marillen,
    Pflaumen|Pflaume|Zwetschgen|Zwetschen, Kiwi|Kiwis, Mango|Mangos, Ananas, Melone|Wassermelone|Honigmelone|Galiamelone|Cantaloupe,
    Granatapfel, Feigen|Feige, Maracuja|Passionsfrucht, Papaya, Physalis, Kaki|Sharon, Rhabarber, Obst|Frisches Obst, Litschi|Lychee,
    Kokosnuss, Quitten
  `,
  brot: `
    Brot|Vollkornbrot|Roggenbrot|Mischbrot|Sauerteigbrot|Bauernbrot|Dinkelbrot|Körnerbrot|Laib, Toast|Toastbrot|Sandwichtoast|Vollkorntoast,
    Brötchen|Semmeln|Semmel|Weckle|Schrippen|Wecken|Brötle|Kaisersemmel, Brezen|Breze|Brezel|Laugenbrezel|Laugenbrezen|Brezn,
    Laugenstangen|Laugengebäck, Baguette, Ciabatta, Croissants|Croissant|Buttercroissant, Knäckebrot, Zwieback,
    Fladenbrot|Pita|Pitabrot|Naan, Pumpernickel, Aufbackbrötchen, Burger Buns|Burgerbrötchen|Buns, Hot Dog Brötchen,
    Kuchen, Hefezopf, Wraps|Wrap|Tortillas|Tortilla Wraps|Weizentortillas, Toastbrötchen, Bagels|Bagel, Muffins, Donuts,
    Brioche, Knödelbrot
  `,
  molkerei: `
    Milch|Frischmilch|Vollmilch|Fettarme Milch|Weidemilch|Heumilch|Bergbauernmilch, Joghurt|~Jogurt|Naturjoghurt|Fruchtjoghurt,
    Griechischer Joghurt|~Griechischer Jogurt|Joghurt griechische Art, Skyr, Quark|Magerquark|Speisequark|Sahnequark,
    Sahne|Schlagsahne|Schlagrahm|Rahm|Kochsahne|Cremefine, Saure Sahne|Sauerrahm, Schmand, Crème fraîche|Creme fraiche,
    Butter|Süßrahmbutter|Sauerrahmbutter|Irische Butter|Markenbutter, Kräuterbutter, Margarine|Streichfett|Pflanzenmargarine,
    Eier|Ei|Freilandeier|Bioeier, Buttermilch, Kefir, Ayran, Trinkjoghurt, Pudding|Schokopudding|Vanillepudding|Grießpudding,
    Milchreis Becher, Tzatziki|~Zaziki, Kräuterquark, Kakao Trinkmilch|Kakaomilch|Schokomilch, Latte Macchiato Becher|Eiskaffee,
    Desserts|Nachtisch
  `,
  kaese: `
    Käse|Käsescheiben|Scheibenkäse|Aufschnittkäse, Gouda, Emmentaler, Bergkäse, Edamer, Tilsiter, Butterkäse, Leerdammer, Appenzeller,
    Reibekäse|Geriebener Käse|Pizzakäse|Streukäse, Parmesan|Parmigiano|Grana Padano, Pecorino, Mozzarella|Büffelmozzarella|Mini Mozzarella,
    Burrata, Feta|Hirtenkäse|Schafskäse, Halloumi|~Halumi|Grillkäse, Frischkäse|Philadelphia|Doppelrahmfrischkäse,
    Hüttenkäse|Körniger Frischkäse|Cottage Cheese, Mascarpone, Ricotta, Camembert, Brie, Ziegenkäse|Ziegenfrischkäse,
    Gorgonzola|Blauschimmelkäse|Roquefort, Raclettekäse|Raclette, Manchego, Cheddar, Obatzda, Comté|Gruyère, Harzer
  `,
  fleisch: `
    Hackfleisch|Hack|Rinderhack|Gemischtes Hack|Faschiertes|Hackfleisch gemischt, Hähnchenbrust|Hühnerbrust|Hühnchenbrust|Hähnchenbrustfilet|Hühnerbrustfilet|Pouletbrust,
    Hähnchen|Hühnchen|Hähnchenschenkel|Hähnchenkeulen|Chicken Wings|Brathähnchen|Huhn, Putenbrust|Pute|Putenschnitzel|Putenfleisch,
    Schnitzel|Schweineschnitzel|Kalbsschnitzel, Steak|Rindersteak|Rumpsteak|Entrecote|Hüftsteak, Rindfleisch|Gulasch|Rinderfilet|Rinderbraten|Suppenfleisch,
    Schweinefleisch|Schweinebraten|Schweinefilet|Kotelett|Nackensteak|Schweinebauch, Lamm|Lammkeule|Lammkotelett|Lammhack,
    Geschnetzeltes, Hackbällchen|Frikadellen|Fleischpflanzerl|Buletten, Bratwurst|Nürnberger|Rostbratwurst|Rostbratwürstchen,
    Weißwurst|Weißwürste, Wiener|Wiener Würstchen|Würstchen|Würstl|Wienerle|Frankfurter|Würschtl|Schweinswürstl|Schweinswürstchen|Debreziner,
    Leberkäse|Fleischkäse|Leberkas, Salami, Schinken|Kochschinken|Schinkenaufschnitt, Rohschinken|Serrano|Serranoschinken|Parmaschinken|Prosciutto|Schwarzwälder Schinken,
    Speck|Bacon|Speckwürfel|Schinkenwürfel|Frühstücksspeck|Pancetta, Aufschnitt|Wurst|Wurstaufschnitt, Leberwurst|Teewurst,
    Mortadella|Lyoner|Fleischwurst, Chorizo, Cabanossi|Kabanossi, Fleischsalat|Wurstsalat, Grillfleisch|Grillwürstchen, Ente|Entenbrust, Gyros, Döner
  `,
  fisch: `
    Lachs|Lachsfilet|Wildlachs, Räucherlachs, Forelle|Forellenfilet, Räucherforelle|Geräucherte Forelle, Kabeljau|Dorsch|Seelachs|Fischfilet|Alaska Seelachs,
    Garnelen|Shrimps|Scampi|Crevetten|Riesengarnelen|Krabben, Matjes|Hering|Bismarckhering|Rollmops|Heringsfilet, Makrele|Räuchermakrele,
    Dorade|Wolfsbarsch|Zander|Saibling, Tintenfisch|Calamari|Pulpo, Muscheln|Miesmuscheln|Venusmuscheln, Surimi, Fisch, Thunfischsteak, Lachsforelle
  `,
  kuehlveg: `
    Tofu|Räuchertofu|Seidentofu|Naturtofu, Tempeh, Seitan, Veggie Burger|Vegane Burger|Gemüsebratlinge|Vegane Würstchen|Veggie Hack|Vegetarisches Hack,
    Falafel, Hummus|Humus|Hommus, Schupfnudeln, Gnocchi, Tortellini|Ravioli|Frische Nudeln|Frische Pasta|Tortelloni, Maultaschen,
    Spätzle|Knöpfle|Eierspätzle, Pizzateig, Blätterteig, Quicheteig|Mürbeteig|Tarteteig, Flammkuchenteig, Strudelteig|Yufkateig|Filoteig,
    Croissantteig|Brötchenteig, Kartoffelteig|Kloßteig, Brotaufstrich|Aufstrich|Vegane Aufstriche, Antipasti|Oliven Feinkost,
    Frischer Pesto, Kimchi, Salat Fertig|Fertigsalat, Wraps Fertig|Sandwiches
  `,
  fruehstueck: `
    Haferflocken|Hafer|Zarte Haferflocken|Kernige Haferflocken, Müsli|Muesli|Knuspermüsli|Früchtemüsli|Porridge, Granola|Crunchy,
    Cornflakes|Cerealien|Frühstücksflocken|Frühstückscerealien|Smacks|Choco Pops, Nutella|Nussnougatcreme|Schokocreme|Nuss-Nougat-Creme,
    Marmelade|Konfitüre|Erdbeermarmelade|Fruchtaufstrich|Gelee, Honig, Erdnussbutter|Erdnussmus, Mandelmus, Cashewmus|Nussmus,
    Kaffee|Kaffeebohnen|Espresso|Espressobohnen|Gemahlener Kaffee|Filterkaffee, Kaffeepads|Kaffeekapseln|Nespresso|Kapseln,
    Instantkaffee|Löslicher Kaffee, Filtertüten|Kaffeefilter, Tee|Schwarztee|Früchtetee|Kräutertee|Teebeutel, Grüner Tee|Grüntee,
    Pfefferminztee, Kamillentee, Ingwertee, Chai, Kakao|Kakaopulver|Kaba|Trinkschokolade, Chiasamen|Chia, Leinsamen|Geschrotete Leinsamen,
    Proteinpulver, Ovomaltine, Ahornsirup|Agavendicksaft|Dattelsirup
  `,
  nudeln: `
    Spaghetti|~Spagetti|Spaghettini, Nudeln|Pasta|Teigwaren, Penne, Fusilli|Spirelli, Farfalle, Rigatoni, Tagliatelle|Bandnudeln|Pappardelle,
    Linguine, Makkaroni|Maccheroni, Lasagneplatten|Lasagneblätter|Lasagne Platten, Vollkornnudeln, Eiernudeln|Suppennudeln|Fadennudeln,
    Reis|Langkornreis|Parboiled Reis|Kochbeutelreis, Basmatireis|Basmati, Jasminreis|Duftreis, Risottoreis|Arborio, Milchreis, Wildreis,
    Sushireis, Couscous, Bulgur, Quinoa, Linsen|Rote Linsen|Berglinsen|Belugalinsen|Tellerlinsen, Polenta|Maisgrieß,
    Kartoffelpüree|Püree|Kartoffelbrei, Knödel|Semmelknödel|Kartoffelknödel|Klöße|Serviettenknödel, Glasnudeln, Reisnudeln,
    Mie Nudeln|Mienudeln|Instant Nudeln|Ramen|Udon|Asianudeln, Hirse, Graupen, Buchweizen, Orzo|Kritharaki, Tortellini getrocknet
  `,
  konserven: `
    Tomatenkonzentrat|Tomatenmark, Passierte Tomaten|Passata|Tomatenpassata, Gehackte Tomaten|Stückige Tomaten|Dosentomaten|Pizzatomaten|Geschälte Tomaten|Tomaten Dose,
    Kokosmilch|Kokosnussmilch|Kokoscreme, Kichererbsen, Kidneybohnen, Weiße Bohnen|Cannellini, Schwarze Bohnen, Bohnen Dose|Baked Beans,
    Mais|Mais Dose|Dosenmais|Gemüsemais, Thunfisch|Thunfisch Dose|Thunfischdose, Sardinen|Ölsardinen, Sardellen|Anchovis, Oliven|Grüne Oliven|Schwarze Oliven|Kalamata,
    Kapern, Essiggurken|Gewürzgurken|Cornichons|Saure Gurken, Sauerkraut, Rotkohl Glas|Apfelrotkohl, Apfelmus, Apfel-Bananen-Mus|Apfel-Mango-Mus|Fruchtmus|Quetschie|Fruchtpüree,
    Obstkonserven|Pfirsiche Dose|Ananas Dose|Mandarinen Dose, Suppe|Dosensuppe|Tütensuppe, Tomatensauce|Tomatensoße|Pastasauce|Nudelsoße|Nudelsauce|Arrabbiata|Bolognese Sauce,
    Pesto|Basilikumpesto|Pesto Rosso|Pesto Genovese, Ketchup|Tomatenketchup, Mayonnaise|Mayo|Remoulade, Senf|Mittelscharfer Senf|Süßer Senf|Dijon Senf,
    Grillsauce|BBQ Sauce|Barbecue Sauce, Sojasauce|Sojasoße|Tamari|Shoyu, Currypaste|Rote Currypaste|Grüne Currypaste, Tahina|Tahini|Sesampaste|Sesammus,
    Erdnusssauce|Satay Sauce, Sweet Chili Sauce|Chilisauce, Sriracha, Tabasco|Scharfe Sauce, Fischsauce, Austernsauce, Hoisin Sauce, Teriyaki Sauce,
    Getrocknete Tomaten, Artischockenherzen, Rote Bete Glas, Chutney|Mango Chutney, Fertiggerichte|Ravioli Dose|Eintopf, Salsa|Dip|Guacamole,
    Pilze Dose|Champignons Dose, Jackfruit, Kokosraspeln Dose, Meerrettich|Kren, Worcestersauce, Rotkraut Glas, Erbsen Dose|Erbsen und Möhren Dose
  `,
  oel: `
    Olivenöl|Natives Olivenöl|Olivenöl extra vergine, Öl|Rapsöl|Sonnenblumenöl|Speiseöl|Bratöl|Pflanzenöl, Kokosöl, Sesamöl, Walnussöl|Leinöl|Kürbiskernöl,
    Balsamico|Balsamessig|Aceto Balsamico|Balsamicoessig|Crema di Balsamico|Balsamico Creme, Essig|Weißweinessig|Apfelessig|Rotweinessig|Branntweinessig|Kräuteressig, Zitronensaft|Limettensaft|Zitronensaftkonzentrat,
    Salz|Meersalz|Jodsalz|Speisesalz|Fleur de Sel, Pfeffer|Pfefferkörner|Schwarzer Pfeffer|Pfeffermühle, Gewürze|Gewürz,
    Paprikapulver|Paprika edelsüß|Paprika rosenscharf|Geräuchertes Paprikapulver, Currypulver|Curry, Kurkuma|Kurkumapulver, Kreuzkümmel|Cumin,
    Kümmel, Zimt|Zimtstangen, Muskat|Muskatnuss, Oregano|Getrockneter Oregano, Chiliflocken|Chilipulver|Cayennepfeffer, Knoblauchpulver|Knoblauchgranulat,
    Kräuter der Provence|Italienische Kräuter|Pizzagewürz|Getrocknete Kräuter, Lorbeerblätter|Lorbeer, Gewürznelken|Nelken, Garam Masala, Ras el Hanout,
    Zaatar|Za'atar, Sumach, Vanille|Vanilleschote, Gemüsebrühe|Brühe|Bouillon|Instantbrühe|Brühwürfel, Hühnerbrühe, Rinderbrühe|Fond|Kalbsfond,
    Maggi|Würze|Flüssigwürze, Salatdressing|Dressing|Salatsauce, Senfsaat, Hefeflocken, Gyrosgewürz|Grillgewürz|Steakgewürz, Kräutersalz
  `,
  backen: `
    Mehl|Weizenmehl|Mehl Type 405|Type 550, Dinkelmehl, Vollkornmehl|Roggenmehl, Zucker|Kristallzucker|Haushaltszucker, Rohrzucker|Brauner Zucker, Puderzucker,
    Backpulver, Natron, Hefe|Trockenhefe|Frische Hefe, Vanillezucker|Vanillinzucker|Bourbon Vanillezucker, Speisestärke|Stärke|Maisstärke|Mondamin,
    Kuvertüre|Backschokolade|Schokotropfen, Mandeln|Gemahlene Mandeln|Mandelblättchen|Mandelstifte, Haselnüsse|Gemahlene Haselnüsse|Haselnusskerne,
    Walnüsse|Walnusskerne, Nüsse|Nussmischung, Cashews|Cashewkerne, Pinienkerne, Sonnenblumenkerne, Kürbiskerne, Sesam|Sesamsaat,
    Rosinen|Sultaninen, Datteln|Medjool Datteln, Trockenobst|Getrocknete Aprikosen|Getrocknete Mango|Getrocknete Cranberries|Cranberries, Kokosraspeln|Kokosflocken,
    Gelatine|Agar Agar, Paniermehl|Semmelbrösel|Panko, Grieß|Hartweizengrieß|Weichweizengrieß, Streusel|Zuckerstreusel|Schokostreusel,
    Backmischung|Kuchenmischung, Puddingpulver, Tortenguss, Marzipan, Honig Backen, Lebensmittelfarbe, Backoblaten, Pistazien
  `,
  suess: `
    Schokolade|Tafelschokolade|Zartbitterschokolade|Milchschokolade|Ritter Sport|Milka|Lindt, Kekse|Plätzchen|Butterkekse|Leibniz|Cookies|Biskuits,
    Chips|Kartoffelchips|Crisps|Pringles, Tortilla Chips|Nachos|Tortillachips, Gummibärchen|Haribo|Fruchtgummi|Weingummi, Salzstangen|Salzbrezeln|Brezeln Snack,
    Cracker|Crackers|Tuc, Popcorn, Müsliriegel|Riegel|Proteinriegel|Schokoriegel|Snickers|Mars|Kinderriegel, Bonbons|Lutscher,
    Kaugummi, Erdnüsse|Erdnüsse geröstet|Erdnusskerne, Studentenfutter, Reiswaffeln|Maiswaffeln, Pralinen|Merci|Ferrero, Lebkuchen, Waffeln|Waffelröllchen,
    Süßigkeiten|Naschzeug, Lakritz|Lakritze, Kinderschokolade|Kinder, Dunkle Schokolade, Chips Dip, Nüsse gesalzen, Trockenfrüchte Snack
  `,
  pflanzendrink: `
    Hafermilch|Haferdrink|Hafer Barista|Haferdrink Barista|Oatly|Hafermilch Barista, Sojamilch|Sojadrink|Soja Barista, Mandelmilch|Mandeldrink,
    Reismilch|Reisdrink, Kokosdrink|Kokosmilchdrink, Pflanzendrink|Pflanzenmilch|Veganer Drink, Erbsendrink, Cashewdrink,
    H-Milch|Haltbare Milch|Haltbarmilch|H Milch, Kondensmilch|Kaffeesahne|Bärenmarke|Dosenmilch, Kaffeeweißer
  `,
  getraenke: `
    Wasser|Mineralwasser|Sprudel|Sprudelwasser|Stilles Wasser|Medium|Tafelwasser, Saft|Orangensaft|Apfelsaft|O-Saft|Multivitaminsaft|Traubensaft|Direktsaft,
    Apfelschorle|Schorle|Saftschorle|Johannisbeerschorle, Cola|Coca Cola|Coke|Pepsi|Cola Zero, Limo|Limonade|Fanta|Sprite|Spezi|Mezzo Mix|Zitronenlimonade,
    Eistee|Ice Tea, Bier|Helles|Weißbier|Weissbier|Pils|Weizen|Dunkles|Export, Radler|Alsterwasser, Alkoholfreies Bier,
    Wein|Rotwein|Weißwein|Rosé|Rosewein, Sekt|Prosecco|Secco|Champagner|Crémant, Gin, Wodka|Vodka, Rum, Whisky|Whiskey, Aperol|Campari,
    Tonic Water|Tonic|Bitter Lemon|Ginger Ale|Ginger Beer, Energy Drink|Red Bull|Monster, Mate|Club Mate, Kombucha, Smoothie|Smoothies,
    Ingwershot|Shots, Holunderblütensirup|Sirup, Malzbier, Sportgetränk|Isotonisches Getränk, Leergut|Pfandflaschen
  `,
  tk: `
    Tiefkühlpizza|Pizza|TK Pizza|Steinofenpizza, Pommes|Pommes Frites|Kroketten|Rösti|Kartoffelecken|Wedges, Fischstäbchen|Backfisch|Schlemmerfilet,
    Tiefkühlgemüse|TK Gemüse|Rahmspinat|Buttergemüse|Gemüsemischung|Wokgemüse|Pfannengemüse, Erbsen|TK Erbsen|Erbsen Möhren|Junge Erbsen,
    Beerenmix|TK Beeren|Tiefkühlbeeren|Beerenmischung|Waldbeeren|Beerenmix Bio|Himbeeren TK|Heidelbeeren TK, Mango TK|Früchtemix TK|Smoothie Mix,
    Eis|Eiscreme|Speiseeis|Magnum|Ben & Jerrys|Eis am Stiel|Stieleis, Edamame, Chicken Nuggets|Nuggets|Hähnchen Nuggets, Kräuter TK|TK Kräuter|Tiefkühlkräuter,
    Aufbackbrezen|TK Brezen|Aufbackbrötchen TK, Frühlingsrollen, Lasagne TK|Tiefkühlgerichte|Fertiggerichte TK, Eiswürfel|Crushed Ice,
    Garnelen TK|TK Garnelen, Spinat TK|TK Spinat, Blätterteig TK, Dumplings|Gyoza, Flammkuchen
  `,
  drogerie: `
    Deo|Deodorant|Deospray|Deoroller|Deostick|Antitranspirant, Zahnpasta|Zahncreme|Ajona|Elmex|Sensodyne|Colgate|Signal|Parodontax|Ajona Zahnpasta,
    Zahnbürste|Zahnbürsten|Aufsteckbürsten|Aufsteckbürste, Zahnseide|Interdentalbürsten|Zahnzwischenraumbürsten|Zahnhölzer, Mundspülung|Listerine|Mundwasser,
    Duschgel|Duschbad|Duschcreme|Shower Gel, Shampoo|Haarshampoo, Spülung|Conditioner|Haarspülung, Haarkur|Haarmaske|Haaröl,
    Haargel|Haarspray|Haarwachs|Stylingcreme|Haarschaum, Seife|Flüssigseife|Handseife|Stückseife, Handcreme, Bodylotion|Körperlotion|Körpermilch|Körpercreme,
    Gesichtscreme|Tagescreme|Nachtcreme|Nivea|Feuchtigkeitscreme|Creme, Sonnencreme|Sonnenschutz|Sonnenmilch|Sonnenspray|After Sun,
    Lippenpflege|Labello|Lippenbalsam, Rasierer|Rasierklingen|Klingen|Einwegrasierer, Rasierschaum|Rasiergel, Aftershave|After Shave,
    Wattepads|Abschminkpads|Kosmetikpads|Wattepad, Wattestäbchen|Ohrenstäbchen, Watte, Taschentücher|Tempo|Papiertaschentücher|Kosmetiktücher,
    Toilettenpapier|Klopapier|Klorolle|Klorollen, Feuchttücher|Feuchtes Toilettenpapier|Feuchte Tücher, Pflaster|Heftpflaster|Blasenpflaster,
    Tampons|Binden|Slipeinlagen|Damenhygiene|Menstruationstasse, Kondome, Nagelfeile|Nagellack|Nagellackentferner|Nagelschere,
    Make-up|Mascara|Lippenstift|Puder|Concealer|Foundation|Kajal|Lidschatten, Abschminktücher|Mizellenwasser|Gesichtswasser|Reinigungsgel|Waschgel,
    Parfum|Parfüm|Eau de Toilette, Kontaktlinsenmittel|Kontaktlinsen|Kochsalzlösung, Vitamine|Nahrungsergänzung|Magnesium|Vitamin D|Zink|Brausetabletten,
    Windeln|Babywindeln|Pampers, Babynahrung|Babybrei|Gläschen, Haargummis|Haarklammern|Haarbürste|Kamm, Fußcreme|Hirschtalg|Blasen,
    Wärmepflaster|Erkältungsbad|Halsbonbons|Hustenbonbons|Nasenspray, Ohrstöpsel, Duftkerze, Intimpflege
  `,
  haushalt: `
    Spülmittel|Spüli|Pril|Fairy|Handspülmittel|Geschirrspülmittel, Spülmaschinentabs|Tabs|Geschirrspültabs|Spülmaschinenpulver|Finish|Somat,
    Klarspüler, Regeneriersalz|Spülmaschinensalz|Spezialsalz, Waschmittel|Flüssigwaschmittel|Colorwaschmittel|Vollwaschmittel|Persil|Ariel|Waschpulver|Feinwaschmittel|Wollwaschmittel,
    Weichspüler|Lenor, Fleckentferner|Vanish|Gallseife|Fleckenspray, Allzweckreiniger|Reiniger|Putzmittel|Universalreiniger|Meister Proper,
    Glasreiniger|Fensterreiniger, Badreiniger|Kalkreiniger|Kalklöser|Badspray, Entkalker|Kaffeemaschinenentkalker, WC-Reiniger|WC Reiniger|Klostein|WC Ente|Domestos|WC Steine|Kloreiniger,
    Schwämme|Spülschwamm|Schwamm|Topfschwamm|Topfreiniger, Spültücher|Putztücher|Mikrofasertuch|Lappen|Schwammtücher, Küchenrolle|Küchenpapier|Haushaltsrolle|Zewa,
    Müllbeutel|Müllsäcke|Mülltüten|Biomüllbeutel|Gelbe Säcke, Alufolie|Aluminiumfolie, Frischhaltefolie, Backpapier, Gefrierbeutel|Zipbeutel|Brotbeutel|Frühstücksbeutel,
    Butterbrotpapier, Batterien|AA Batterien|AAA Batterien, Glühbirne|Leuchtmittel|LED Lampe|Glühbirnen, Kerzen|Teelichter, Streichhölzer|Feuerzeug,
    Servietten, Pappteller|Einweggeschirr|Strohhalme|Pappbecher, Grillkohle|Anzünder|Grillanzünder, Katzenfutter|Hundefutter|Katzenstreu|Tierfutter|Leckerlis,
    Blumenerde|Blumendünger|Dünger, Rohrreiniger|Abflussreiniger, Ofenreiniger|Backofenreiniger, Bodenreiniger|Holzreiniger|Laminatreiniger, Essigreiniger,
    Wäscheklammern, Staubsaugerbeutel, Handschuhe|Gummihandschuhe|Einmalhandschuhe, Luftbefeuchter, Duftspray|Raumduft|Lufterfrischer, Mottenschutz, Schuhcreme
  `,
  sonstiges: ``,
};

// Typischer Vorrat: im Rezept-Prüfblatt standardmäßig abgewählt.
const VORRAT = [
  'Salz', 'Pfeffer', 'Öl', 'Olivenöl', 'Mehl', 'Zucker', 'Wasser', 'Essig', 'Zimt', 'Paprikapulver',
  'Backpulver', 'Currypulver', 'Muskat', 'Oregano', 'Speisestärke', 'Vanillezucker', 'Gemüsebrühe',
  'Chiliflocken', 'Kreuzkümmel', 'Lorbeerblätter', 'Natron', 'Sojasauce',
];

// Open Food Facts & Co.: categories_tags → Abteilung. Die erste passende Regel gewinnt.
const OFF_KATEGORIEN = [
  ['frozen', 'tk'], ['ice-creams', 'tk'],
  ['plant-based-milk', 'pflanzendrink'], ['milk-substitute', 'pflanzendrink'], ['plant-milks', 'pflanzendrink'], ['uht-milk', 'pflanzendrink'],
  ['cheeses', 'kaese'], ['yogurts', 'molkerei'], ['creams', 'molkerei'], ['butters', 'molkerei'], ['eggs', 'molkerei'], ['dairies', 'molkerei'], ['milks', 'molkerei'],
  ['tofu', 'kuehlveg'], ['meat-analogues', 'kuehlveg'], ['fresh-pasta', 'kuehlveg'], ['doughs', 'kuehlveg'], ['hummus', 'kuehlveg'],
  ['sausages', 'fleisch'], ['hams', 'fleisch'], ['meats', 'fleisch'], ['poultry', 'fleisch'],
  ['canned-fishes', 'konserven'], ['tunas', 'konserven'], ['fishes', 'fisch'], ['seafood', 'fisch'],
  ['breads', 'brot'], ['viennoiseries', 'brot'], ['cakes', 'brot'],
  ['breakfast-cereals', 'fruehstueck'], ['mueslis', 'fruehstueck'], ['spreads', 'fruehstueck'], ['honeys', 'fruehstueck'], ['jams', 'fruehstueck'],
  ['coffees', 'fruehstueck'], ['teas', 'fruehstueck'], ['cocoa', 'fruehstueck'],
  ['pastas', 'nudeln'], ['rices', 'nudeln'], ['cereal-grains', 'nudeln'], ['lentils', 'nudeln'],
  ['canned', 'konserven'], ['legumes', 'konserven'], ['sauces', 'konserven'], ['condiments', 'konserven'], ['pickles', 'konserven'], ['soups', 'konserven'], ['compotes', 'konserven'],
  ['vinegars', 'oel'], ['oils', 'oel'], ['spices', 'oel'], ['salts', 'oel'], ['herbs', 'oel'], ['broths', 'oel'],
  ['flours', 'backen'], ['sugars', 'backen'], ['baking', 'backen'], ['nuts', 'backen'], ['dried-fruits', 'backen'], ['seeds', 'backen'],
  ['chocolates', 'suess'], ['biscuits', 'suess'], ['confectioneries', 'suess'], ['snacks', 'suess'], ['chips', 'suess'], ['candies', 'suess'],
  ['waters', 'getraenke'], ['juices', 'getraenke'], ['sodas', 'getraenke'], ['beers', 'getraenke'], ['wines', 'getraenke'],
  ['alcoholic-beverages', 'getraenke'], ['beverages', 'getraenke'],
  ['fruits', 'obst'], ['vegetables', 'gemuese'],
];

// Bereiche im Laden: fassen Abteilungen für die Farbmarkierung zusammen.
// Mehr als acht Farben lassen sich nicht zuverlässig unterscheiden, daher Bereiche statt Einzelfarben.
const BEREICHE = [
  { id: 'frische',   name: 'Obst & Gemüse',       abteilungen: ['gemuese', 'obst'] },
  { id: 'brot',      name: 'Brot',                abteilungen: ['brot'] },
  { id: 'kuehl',     name: 'Kühlregal',           abteilungen: ['molkerei', 'kaese', 'kuehlveg'] },
  { id: 'fleisch',   name: 'Fleisch & Fisch',     abteilungen: ['fleisch', 'fisch'] },
  { id: 'trocken',   name: 'Trockenwaren',        abteilungen: ['fruehstueck', 'nudeln', 'konserven', 'oel', 'backen', 'suess'] },
  { id: 'getraenke', name: 'Getränke',            abteilungen: ['pflanzendrink', 'getraenke'] },
  { id: 'tk',        name: 'Tiefkühl',            abteilungen: ['tk'] },
  { id: 'nonfood',   name: 'Drogerie & Haushalt', abteilungen: ['drogerie', 'haushalt'] },
];
