import { StudySet } from '../types';

export const INITIAL_STUDY_SETS: StudySet[] = [
  {
    id: 'african-history-kingdoms',
    title: 'Great African Kingdoms & Empires',
    description: 'Master the rise, wealth, governance, and architecture of Mali, Songhai, Great Zimbabwe, Kush, and Aksum.',
    category: 'AFRICAN HISTORY',
    estimatedMinutes: 15,
    featured: true,
    createdAt: '2026-01-01',
    goDeeperResources: [
      {
        id: 'res-mali-1',
        title: 'General History of Africa (UNESCO Volumes III & IV)',
        authorOrSource: 'UNESCO / D.T. Niane & J. Ki-Zerbo',
        type: 'book',
        description: 'The monumental authoritative historical reference on medieval West African civilizations, trans-Saharan trade, and urban intellectual centers.',
        topicMatch: 'Mali & Songhai Empires',
        externalUrl: 'https://unesco.org/general-history-of-africa'
      },
      {
        id: 'res-mali-2',
        title: 'The Golden Trade of the Moors',
        authorOrSource: 'E.W. Bovill',
        type: 'book',
        description: 'A classic study tracing the trans-Saharan camel caravans, gold routes, and cultural exchanges between West Africa and the Mediterranean.',
        topicMatch: 'Trans-Saharan Economy'
      },
      {
        id: 'res-mali-3',
        title: 'The Architecture of Great Zimbabwe: An Archaeological Re-Assessment',
        authorOrSource: 'Webber Ndoro / British Museum Studies',
        type: 'article',
        description: 'Examines dry-stone masonry, monumental terracing, and regional trading economies of the Shona kingdoms.',
        topicMatch: 'Great Zimbabwe'
      }
    ],
    concepts: [
      {
        id: 'mali-musa',
        setId: 'african-history-kingdoms',
        title: 'Mansa Musa & The Mali Empire',
        summary: 'Mansa Musa (r. 1312–1337) transformed Mali into a premier global center of wealth, Islamic scholarship, and trade, famous for his historic 1324 pilgrimage to Mecca.',
        category: 'AFRICAN HISTORY',
        difficulty: 'Medium',
        tags: ['Mali', 'Trade', 'Timbuktu', 'Gold'],
        
        explanation: 'Mansa Musa ruled the Mali Empire during its 14th-century golden age. Under his leadership, Mali controlled vast gold-producing regions in Bambuk and Bure alongside lucrative trans-Saharan salt trade networks. Rather than simply accumulating wealth, Musa invested heavily in civic infrastructure, building grand mosques and turning Timbuktu and Gao into premier global hubs of Islamic scholarship and book manufacturing.',
        
        keyFacts: [
          'His 1324 pilgrimage to Mecca included 60,000 attendants and over 100 camels carrying pure gold bullion.',
          'The gold spent in Cairo and Alexandria caused regional inflation that took over a decade to normalize.',
          'He commissioned Andalusian architect Abu Ishaq al-Sahili to design the iconic Djinguereber Mosque in Timbuktu.',
          'Mali was famously featured on the 1375 Catalan Atlas holding a golden nugget, introducing West Africa prominently to European cartography.'
        ],

        terminology: [
          { term: 'Mansa', definition: 'The imperial title meaning "Emperor" or "King of Kings" in the Manding language.' },
          { term: 'Trans-Saharan Trade', definition: 'The complex caravan trade network linking West African gold and kola nuts with North African salt, silk, and textiles across the Sahara.' },
          { term: 'University of Sankore', definition: 'A major center of higher education and manuscript preservation in Timbuktu that hosted up to 25,000 scholars.' }
        ],

        whyItMatters: 'Mansa Musa’s reign dismantled the false Eurocentric myth that medieval Africa was isolated. It demonstrated that West Africa was an integrated economic powerhouse whose monetary policies and university systems influenced continents.',

        historicalContext: 'In the 14th century, Europe was suffering through famines and the early stages of the Hundred Years\' War, while West Africa was experiencing an era of unprecedented urban prosperity, legal order, and scientific scholarship.',

        concreteExample: {
          title: 'The Cairo Gold Shock of 1324',
          text: 'During his months in Cairo, Mansa Musa gifted and spent gold so generously among citizens and merchants that the market price of gold dropped by roughly 12–25%. The historian Al-Umari, visiting Cairo 12 years later, noted that the economy had still not completely stabilized.'
        },

        visualAid: {
          type: 'timeline',
          title: 'Chronology of the Mali Golden Age',
          description: 'Key milestones in Mali’s expansion and intellectual peak.',
          items: [
            { label: '1235 CE', value: 'Battle of Kirina', detail: 'Sundiata Keita unites Mandinka clans and founds the Mali Empire.' },
            { label: '1312 CE', value: 'Ascension of Mansa Musa', detail: 'Musa begins modernizing administration, trade routes, and military defense.' },
            { label: '1324 CE', value: 'Historic Hajj to Mecca', detail: 'Trans-continental caravan introduces Mali to global maps and trade diplomacy.' },
            { label: '1327 CE', value: 'Djinguereber Mosque & Sankore', detail: 'Timbuktu becomes a world capital for astronomy, law, and mathematics.' }
          ]
        },

        simpleExplanation: 'Imagine an emperor so wealthy that when he went on a road trip with his caravan, the amount of gold he gave away as tips and gifts changed the entire value of money across multiple countries for over a decade. That was Mansa Musa of Mali.',

        deepExplanation: `🏛️ Geopolitical Strategy & Statecraft:
Beyond his legendary wealth, Mansa Musa operated as an astute geopolitician and administrative reformer. He centralized fiscal management by placing regional gold-producing districts under imperial tax oversight while granting autonomy to local chiefs, ensuring long-term provincial stability. He secured Mali’s vast northern borders through calculated diplomatic alliances with the Marinid dynasty of Fez and the Mamluk Sultanate of Cairo, establishing safe trans-Saharan trade corridors.

📚 The Manuscript Economy & Intellectual Zenith:
Musa strategically transformed Timbuktu and Jenne from commercial trading hubs into premier global centers of higher learning. By financing the migration of Andalusian and North African jurists, astronomers, mathematicians, and architects—most notably the renowned polymath Abu Ishaq al-Sahili—Musa established a vibrant manuscript economy. In Timbuktu's Sankore and Djinguereber madrasas, manuscripts were copied, debated, and preserved, creating a book market valued higher than gold or luxury imports.

🌍 Historiographical Legacy:
Modern economic historians analyze Musa’s 1324 hajj not merely as a religious devotion, but as a deliberate sovereign public relations campaign. By circulating metric tons of gold through Cairo, Medina, and Mecca, Mali was permanently positioned on European cartography, as immortalized in Abraham Cresques's 1375 Catalan Atlas, dismantling pre-modern European misconceptions of an isolated Africa.`,

        selfExplanationPrompt: 'Explain in your own words how Mansa Musa used Mali\'s gold and trade routes to turn Timbuktu into an international center of learning.',
        selfExplanationKeyPoints: [
          'Control over trans-Saharan trade (gold and salt routes)',
          'Investing pilgrimage resources into hiring architects, jurists, and scholars',
          'Founding mosques and the University of Sankore in Timbuktu',
          'Establishing a vibrant manuscript trade and educational system'
        ],

        flashcardQuestion: 'Who was Mansa Musa and why was his 1324 pilgrimage to Mecca historically significant?',
        flashcardAnswer: 'Mansa Musa was the 14th-century ruler of Mali. His lavish pilgrimage distributed so much gold that it altered the Mediterranean economy and placed Mali prominently on world maps.',
        flashcardHint: 'Think about the gold distribution across Cairo and the global recognition of Timbuktu.',

        practiceQuestion: 'Which historical ruler distributed gold so lavishly during his 1324 pilgrimage that he influenced gold markets across Egypt and the Mediterranean?',
        practiceOptions: [
          'Sunni Ali of Songhai',
          'Mansa Musa of Mali',
          'King Ezana of Aksum',
          'Sundiata Keita of Mali'
        ],
        correctOptionIndex: 1,
        practiceExplanation: 'Mansa Musa’s 1324 pilgrimage to Mecca involved thousands of attendants and camels carrying pure gold bullion, temporarily deflating gold prices in Cairo and securing Mali’s international prestige.'
      },
      {
        id: 'great-zimbabwe-stone',
        setId: 'african-history-kingdoms',
        title: 'Great Zimbabwe & Dry-Stone Architecture',
        summary: 'Great Zimbabwe was a medieval Shona kingdom renowned for massive granite stone enclosures built entirely without mortar, serving as a hub for gold and cattle trade.',
        category: 'AFRICAN HISTORY',
        difficulty: 'Medium',
        tags: ['Southern Africa', 'Architecture', 'Shona', 'Archaeology'],

        explanation: 'Flourishing between the 11th and 15th centuries in modern Zimbabwe, Great Zimbabwe was the royal capital of a sophisticated Shona state. The city is celebrated for its monumental architecture, notably the Great Enclosure with outer walls over 11 meters high and 250 meters in circumference, constructed entirely using dry-stone masonry—granite blocks quarried and fitted together with exquisite precision without a single drop of mortar or cement.',

        keyFacts: [
          'The city supported an estimated population of 10,000 to 20,000 residents at its peak.',
          'Construction made use of natural granite exfoliation, where rock was heated with fire and cooled with water to fracture in even slabs.',
          'Archaeologists have excavated 14th-century Chinese Ming celadon, Persian glassware, and Syrian beads at the site.',
          'The iconic carved soapstone birds found at the ruins now form the national emblem of Zimbabwe.'
        ],

        terminology: [
          { term: 'Dzimbahwe', definition: 'Shona word meaning "houses of stone" or "venerated royal residences", giving the modern nation of Zimbabwe its name.' },
          { term: 'Dry-Stone Masonry', definition: 'An architectural building technique where dressed stones are interlocked without mortar or cement, relying on gravity and geometric balance.' },
          { term: 'Sofala', definition: 'The primary Indian Ocean coastal port in modern Mozambique through which Great Zimbabwe exported its gold, ivory, and copper.' }
        ],

        whyItMatters: 'For decades during colonial rule, racist authorities falsely claimed that Great Zimbabwe must have been built by Phoenicians or Arabs. Modern archaeology firmly proved it was designed, engineered, and inhabited exclusively by indigenous Shona ancestors.',

        historicalContext: 'While medieval Europe was constructing Gothic stone cathedrals with heavy mortar and flying buttresses, Southern African architects engineered curved, self-supporting stone towers using purely frictional dry-stone mechanics.',

        concreteExample: {
          title: 'The Conical Tower Mystery',
          text: 'Inside the Great Enclosure stands a solid 10-meter-tall conical stone tower with no internal staircase or chamber. Archaeological consensus indicates it was a symbolic monument representing a grain silo, embodying royal benevolence, agrarian prosperity, and spiritual fertility.'
        },

        visualAid: {
          type: 'architecture',
          title: 'Structural Breakdown of Great Zimbabwe',
          description: 'Three distinct architectural complexes of the city.',
          items: [
            { label: 'Hill Complex', value: 'Acropolis Fortress', detail: 'The spiritual and royal sanctuary built atop a steep 80m granite cliff.' },
            { label: 'Great Enclosure', value: 'Monumental Outer Wall', detail: 'A massive elliptical wall spanning 250 meters made of over a million granite blocks.' },
            { label: 'Valley Enclosures', value: 'Urban Settlements', detail: 'Residential clusters for nobility, merchants, metalworkers, and traders.' }
          ]
        },

        simpleExplanation: 'Imagine stacking millions of heavy granite stones into giant 3-story walls so perfectly balanced that they have stood strong for over 700 years without using any cement or glue.',

        deepExplanation: `🏰 Structural Mechanics & Monumental Masonry:
Great Zimbabwe's dry-stone architecture represents an extraordinary mastery of structural geology and geometry. Builders exploited natural granite exfoliation—heating sheet granite with controlled fires and dousing it with water to induce thermal fracturing along horizontal bedding planes. This produced regular, rectangular ashlar-like blocks. The Great Enclosure's outer wall, spanning 250 meters in circumference and rising over 11 meters high, incorporates subtle inward battering (sloping) and rounded corners, allowing gravitational force and dry friction to distribute shear stress evenly without mortar or binding cement.

💎 Macro-Economic Hegemony & Indian Ocean Trade:
Great Zimbabwe’s state formation was anchored in a dual-economic model: agro-pastoral wealth managed through vast cattle herds, combined with monopoly control over transit trade routes. Sitting strategically at the intersection between the mineral-rich inland gold-bearing plateau and the Indian Ocean coastal ports of the Swahili Corridor (especially Sofala), the ruling Shona elite extracted tribute and controlled the flow of gold, copper, and ivory. In exchange, archaeological excavations have unearthed luxury imports including 14th-century Chinese Ming dynasty celadon porcelain, Persian cobalt glassware, Syria-crafted glass beads, and Portuguese trade artifacts.

📜 Historiographical Warfare & Ideological Reclamation:
During the 19th and 20th centuries, colonial authorities and white settler regimes under Ian Smith actively censored archaeological publications and promoted baseless theories attributing the site to Phoenicians, Arabs, or Biblical figures (King Solomon/Queen of Sheba). Rigorous scientific stratigraphic excavations led by David Randall-MacIver (1905), Gertrude Caton-Thompson (1929), and later Zimbabwean archaeologists proved indisputably that Great Zimbabwe was engineered, inhabited, and expanded by indigenous Shona-speaking Karanga ancestors, turning the ruins into a triumphant symbol of national sovereignty.`,

        selfExplanationPrompt: 'Explain why the dry-stone architecture of Great Zimbabwe is considered a masterclass in engineering, and what the presence of Chinese and Persian goods proves about its society.',
        selfExplanationKeyPoints: [
          'Dry-stone technique: interlocking granite blocks without mortar',
          'Longevity and structural balance over centuries',
          'Foreign artifacts prove active participation in Indian Ocean maritime trade',
          'Refutation of colonial isolation myths'
        ],

        flashcardQuestion: 'What architectural technique distinguishes the Great Enclosure of Great Zimbabwe?',
        flashcardAnswer: 'It was built using dry-stone masonry (granite blocks precisely stacked without any mortar or cement), standing up to 11 meters high for centuries.',
        flashcardHint: 'No cement or mortar was used.',

        practiceQuestion: 'What material and technique was used to construct the iconic monumental walls of Great Zimbabwe?',
        practiceOptions: [
          'Sun-dried mudbrick with wooden supports',
          'Carved limestone bonded with gypsum mortar',
          'Granite dry-stone masonry stacked without mortar',
          'Volcanic basalt blocks held by lime plaster'
        ],
        correctOptionIndex: 2,
        practiceExplanation: 'Great Zimbabwe’s builders quarried exfoliated granite blocks and laid them in undulating, curvilinear dry-stone walls that remain standing due to brilliant structural engineering without mortar.'
      },
      {
        id: 'aksum-coinage-trade',
        setId: 'african-history-kingdoms',
        title: 'The Kingdom of Aksum & Ancient Currency',
        summary: 'Located in modern Ethiopia and Eritrea, Aksum was a major naval and trading power, one of the first African states to mint its own gold, silver, and bronze coins.',
        category: 'AFRICAN HISTORY',
        difficulty: 'Advanced',
        tags: ['East Africa', 'Aksum', 'Coinage', 'Ge\'ez'],

        explanation: 'From roughly 100 BCE to 940 CE, the Kingdom of Aksum dominated the Horn of Africa and the southern Red Sea. Its strategic position enabled it to control maritime routes connecting the Roman Empire, Byzantine Empire, Persia, and India. Under King Endubis in the late 3rd century, Aksum became the first sub-Saharan state to mint its own official currency in gold, silver, and bronze, inscribed in both Ge’ez and Greek to facilitate international trade.',

        keyFacts: [
          'Aksum was named by 3rd-century Persian prophet Mani as one of the four great world empires alongside Rome, Persia, and China.',
          'King Ezana converted to Christianity in 330 CE, commissioning coins bearing the Cross before the Roman Empire had fully standardized it.',
          'The civilization developed the Ge’ez abugida writing script, which remains the liturgical script of the Ethiopian and Eritrean Orthodox Tewahedo Churches.',
          'Aksumite stonemasons carved single-block monolithic granite stelae (obelisks) weighing up to 500 tons, the largest single stones ever quarried in the ancient world.'
        ],

        terminology: [
          { term: 'Adulis', definition: 'The principal port city of Aksum on the Red Sea through which ivory, frankincense, gold, and live animals were shipped across Eurasia.' },
          { term: 'Ge’ez', definition: 'An ancient South Semitic language and writing system developed in the Horn of Africa, written from left to right with integrated vowel markers.' },
          { term: 'Stele (Obelisk)', definition: 'A monumental upright stone slab or pillar carved with simulated windows and doors, marking royal subterranean burial tombs.' }
        ],

        whyItMatters: 'Aksum proves that ancient Africa was an equal peer to Greco-Roman and Persian civilizations in naval technology, multilingual diplomacy, monetary economics, and monumental stone carving.',

        historicalContext: 'When the Roman Empire was fragmenting in the 4th century CE, Aksum was expanding its naval fleet across the Red Sea and establishing protectorates across parts of the Arabian Peninsula (modern Yemen).',

        concreteExample: {
          title: 'Multilingual Currency as Economic Diplomacy',
          text: 'Aksum minted coins with Greek inscriptions for foreign merchants trading at the Red Sea port of Adulis, while minting local coins in Ge’ez for domestic markets. This enabled seamless integration into the international trade system of the Mediterranean and Indian Ocean.'
        },

        visualAid: {
          type: 'diagram',
          title: 'Aksum Trade & Sovereign Pillars',
          description: 'Key components of Aksumite hegemony in the Horn of Africa.',
          items: [
            { label: 'Maritime Port', value: 'Adulis on Red Sea', detail: 'Controlled goods moving between Alexandria, Byzantium, and western India.' },
            { label: 'Sovereign Currency', value: 'Gold, Silver, Bronze Coins', detail: 'Guaranteed purchasing power and standardized state taxation.' },
            { label: 'Literacy & Faith', value: 'Ge’ez Script & Early Christianity', detail: 'Script and state religion established early under King Ezana in 330 CE.' }
          ]
        },

        simpleExplanation: 'Ancient Aksum was like the Switzerland and Singapore of the ancient Red Sea: they had their own world-famous gold coins, their own written alphabet, massive skyscrapers made of single stone blocks, and controlled the busiest shipping routes in the world.',

        deepExplanation: `🪙 Sovereign Monetary Policy & Economic Statecraft:
Aksum was one of only four great empires of antiquity—alongside Rome, Sasanian Persia, and Han China—to develop a sophisticated tri-metallic currency system (gold, silver, and bronze). Under King Endubis (c. 270–300 CE), Aksum institutionalized state monetary sovereignty. Gold coins were minted with Greek inscriptions to serve as convertible international reserve currency throughout the Red Sea, Mediterranean, and western Indian Ocean, while silver and bronze denominations featured indigenous Ge'ez script for domestic trade and taxation, demonstrating an advanced dual-tier fiscal policy.

🚢 Maritime Hegemony & Geostrategic Axis:
From its deepwater port of Adulis, Aksum commanded the Bab-el-Mandeb strait, controlling maritime traffic between the Roman/Byzantine Mediterranean and the Indian subcontinent. The Periplus of the Erythraean Sea details how Aksum exported high-value commodities including ivory, frankincense, myrrh, gold, obsidian, and emeralds, while importing Indian iron, silk, Mediterranean wine, and Roman glassware. This maritime supremacy allowed Aksumite kings in the 6th century (such as King Kaleb) to project naval power across the Red Sea and establish hegemony over the Himyarite kingdom in South Arabia (modern Yemen).

🏛️ Monolithic Megaliths & Epigraphic Record:
Aksumite engineering reached its zenith in the quarrying and erection of single-block granite stelae (obelisks) up to 33 meters in height and weighing over 500 tons. These monolithic monuments, carved with intricate faux architectural multi-story motifs, marked underground royal burial hypogea. The accompanying royal trilingual inscriptions (written in Greek, Sabaean, and Ge'ez) provide unparalleled historical documentation of military campaigns, diplomatic treaties, and the early adoption of Christianity under King Ezana in 330 CE.`,

        selfExplanationPrompt: 'Explain how Aksum\'s location on the Red Sea and its minting of gold currency helped it become one of the four great powers of the ancient world.',
        selfExplanationKeyPoints: [
          'Control over Red Sea maritime trade routes via the port of Adulis',
          'Connecting the Roman/Byzantine world with India and Arabia',
          'Minting independent gold currency with Greek and Ge\'ez inscriptions',
          'Recognition alongside Rome, Persia, and China'
        ],

        flashcardQuestion: 'Why was the Kingdom of Aksum’s minting of coinage significant in world history?',
        flashcardAnswer: 'Aksum was among the very few ancient empires (alongside Rome, Persia, and China) to mint its own gold coinage, demonstrating its high economic sovereignty and Red Sea trade dominance.',
        flashcardHint: 'King Endubis initiated this in the late 3rd century.',

        practiceQuestion: 'Under which famous 4th-century ruler did the Kingdom of Aksum officially adopt Christianity and erect monumental obelisks (stelae)?',
        practiceOptions: [
          'King Ezana',
          'Emperor Menelik I',
          'King Kaleb',
          'Queen Yennenga'
        ],
        correctOptionIndex: 0,
        practiceExplanation: 'King Ezana converted to Christianity circa 330 CE, commissioning Ge’ez inscriptions celebrating his reign and expanding Aksum’s monumental stelae architectural tradition.'
      },
      {
        id: 'songhai-askia-admin',
        setId: 'african-history-kingdoms',
        title: 'The Songhai Empire & Askia the Great',
        summary: 'At its peak in the 15th and 16th centuries, Songhai was the largest empire in African history, celebrated for standardized weights, river naval fleets, and legal administration.',
        category: 'AFRICAN HISTORY',
        difficulty: 'Advanced',
        tags: ['Songhai', 'Gao', 'Askia', 'Governance'],

        explanation: 'Following the decline of Mali, the Songhai Empire centered on Gao became the preeminent power in West Africa under Sunni Ali and subsequently Askia Muhammad I (Askia the Great, r. 1493–1528). Askia organized a centralized bureaucratic administration, divided the empire into provinces with appointed governors, standardized weights and measures across all market towns, and maintained a standing professional army and riverine navy along the Niger River.',

        keyFacts: [
          'Songhai stretched over thousands of kilometers from the Atlantic coast of Senegal to modern Niger and Nigeria.',
          'Askia Muhammad established uniform commercial weights and inspection systems in all major markets, protecting traders from fraud.',
          'The University of Sankore in Timbuktu reached its zenith during Songhai rule, educating thousands of international scholars in astronomy, medicine, and mathematics.',
          'The empire maintained a specialized war fleet of canoes patrolling the 1,600-kilometer navigable stretch of the Niger River.'
        ],

        terminology: [
          { term: 'Askia', definition: 'The royal dynastic title adopted by Muhammad Ture after overthrowing Sunni Ali’s son in 1493.' },
          { term: 'Gao', definition: 'The vibrant imperial capital city of Songhai situated on the bend of the Niger River.' },
          { term: 'Qadi', definition: 'A trained Islamic judge appointed by the central administration to settle civil disputes and commercial contracts based on statutory law.' }
        ],

        whyItMatters: 'Songhai demonstrates that large-scale African governance included complex administrative civil services, standardized commerce regulations, and state-funded research universities long before modern state formation.',

        historicalContext: 'While the European Renaissance was beginning in Italy, the cities of Gao, Timbuktu, and Jenne were operating unified legal jurisdictions and publishing mathematical and theological treatises read across North Africa and the Middle East.',

        concreteExample: {
          title: 'Standardizing Market Scales Across 2,000 Kilometers',
          text: 'Before Askia Muhammad, traders traveling between Gao, Timbuktu, and Walata had to recalculate regional weight discrepancies for gold dust and grain. Askia created certified standard weights and appointed market inspectors (chiefs of the market) with authority to confiscate dishonest merchants\' goods.'
        },

        visualAid: {
          type: 'diagram',
          title: 'Bureaucratic Structure of Songhai',
          description: 'Centralized government divisions under Askia Muhammad.',
          items: [
            { label: 'Fari-Mundyo', value: 'Minister of Agriculture', detail: 'Oversaw royal estates, grain reserves, and tax collection.' },
            { label: 'Hi-Koy', value: 'Admiral of the Fleet', detail: 'Commanded the naval transport and war canoes along the Niger River.' },
            { label: 'Korey-Farma', value: 'Minister of White Foreigners', detail: 'Managed relations, visas, and trade with North African and European merchants.' }
          ]
        },

        simpleExplanation: 'Songhai was the largest empire West Africa ever had. Its leader, Askia the Great, ran it like a modern nation with government ministers for agriculture, a river navy, court judges, and standardized market weights so no one got ripped off.',

        deepExplanation: `👑 Institutional Bureaucracy & Administrative Architecture:
Askia Muhammad I (Askia the Great) transformed Songhai from a loose confederation of conquered territories into the most systematically administered empire in pre-colonial African history. He created a centralized civil service cabinet consisting of specialized ministries: the Fari-Mundyo (Minister of Agriculture and Royal Estates), the Hi-Koy (Supreme Admiral of the Niger Naval Fleet), the Korey-Farma (Minister of Foreign Affairs and White Merchants), and the Hari-Farma (Superintendent of Inland Fisheries). Regional governance was standardized by dividing the empire into thirty provinces overseen by imperial governors (Farma) subject to regular judicial audits.

⚖️ Fiscal Uniformity, Weights & Measures, and Commercial Law:
Recognizing that trade flourished on transparency, Askia enacted sweeping commercial reforms. He standardized market scales, grain bushel measures, and gold weights across thousands of kilometers from the Atlantic coast of Senegambia to the borders of the Hausa states. Market inspectors (chiefs of the market) were empowered to confiscate fraudulent goods and enforce uniform sales taxes. Furthermore, Askia appointed independent Islamic jurists (Qadis) in every major city, separating statutory commercial arbitration from royal executive caprice.

🎓 Scholarly Autonomy & Intellectual Renaissance:
Askia leveraged theological legitimacy to consolidate power following his 1493 ascension. During his 1497 pilgrimage to Mecca, he was invested as the Caliph of the Western Sudan. He cultivated close partnerships with the scholarly elite of Timbuktu and Jenne, offering the ulama full tax exemption, land endowments, and intellectual autonomy. This policy nurtured luminaries like Ahmad Baba al-Timbukti, whose personal library contained thousands of manuscripts spanning Islamic jurisprudence, astronomy, optics, and lexicography.`,

        selfExplanationPrompt: 'Explain how Askia Muhammad reorganized the Songhai Empire to govern its vast territory effectively.',
        selfExplanationKeyPoints: [
          'Dividing the empire into provinces with appointed governors',
          'Creating a professional standing army and river navy',
          'Standardizing weights, measures, and commercial market rules',
          'Strengthening universities and appointing independent judicial qadis'
        ],

        flashcardQuestion: 'What major administrative reform was introduced by Askia Muhammad I (Askia the Great) across the Songhai Empire?',
        flashcardAnswer: 'He created a centralized civil service with appointed governors, standardized market weights and measures, and established a professional river navy along the Niger River.',
        flashcardHint: 'Think about fairness in trade markets and governance.',

        practiceQuestion: 'What role did the Niger River naval fleet play in the administration of the Songhai Empire?',
        practiceOptions: [
          'It was solely used for ceremonial royal fishing excursions',
          'It defended troop movements, enforced trade taxes, and secured communication across thousands of kilometers',
          'It was owned and operated exclusively by European merchant companies',
          'It prevented all commercial transit between Gao and Timbuktu'
        ],
        correctOptionIndex: 1,
        practiceExplanation: 'The Songhai riverine navy, commanded by the high-ranking Admiral (Hi-Koy), provided rapid troop mobilization and secured merchant transport along the vital Niger River lifeline.'
      }
    ]
  },
  {
    id: 'african-geography-biomes',
    title: 'African Geography & Major Biomes',
    description: 'Master Africa’s diverse physical geography: the Great Rift Valley, Congo Basin rainforest, Sahara, and Sahel transition zones.',
    category: 'GEOGRAPHY',
    estimatedMinutes: 12,
    featured: true,
    createdAt: '2026-01-05',
    concepts: [
      {
        id: 'great-rift-valley',
        setId: 'african-geography-biomes',
        title: 'The Great Rift Valley & East African Rift System',
        summary: 'The Great Rift Valley is a 6,000-kilometer tectonic fracture zone stretching from the Middle East to Mozambique, shaping lakes, volcanoes, and human evolutionary history.',
        category: 'GEOGRAPHY',
        difficulty: 'Medium',
        tags: ['Geology', 'East Africa', 'Lakes', 'Tectonics'],

        explanation: 'The East African Rift System (EARS) is an active continental rift zone where the African Tectonic Plate is actively splitting into two new plates: the Nubian Plate to the west and the Somali Plate to the east. This geological separation has created dramatic topographical features including the towering volcanic peaks of Kilimanjaro and Mount Kenya, deep tectonic depression lakes like Lake Tanganyika and Lake Malawi, and fossil-rich valleys crucial to human evolutionary biology.',

        keyFacts: [
          'The rift spans approximately 6,000 km from the Beqaa Valley in Lebanon down to central Mozambique.',
          'Lake Tanganyika in the Western Rift is the world’s second-deepest and second-largest freshwater lake by volume.',
          'The Olduvai Gorge in Tanzania, situated in the rift, has yielded foundational hominid fossils including Australopithecus and Homo habilis.',
          'Geologists estimate the Somali plate will fully separate from mainland Africa in 5 to 10 million years, forming a new sea.'
        ],

        terminology: [
          { term: 'Continental Rifting', definition: 'The process where a continental tectonic plate splits apart under geothermal mantle plumes, forming a rift valley.' },
          { term: 'Graben', definition: 'A depressed block of the Earth’s crust bordered by parallel normal fault lines, forming the valley floor.' },
          { term: 'Cradle of Humankind', definition: 'The East and Southern African rift zones where hominid fossil records trace the emergence of early humans.' }
        ],

        whyItMatters: 'The unique microclimates, changing forest-savanna ecotones, and tectonic lake basins of the Great Rift Valley drove the environmental adaptations that triggered bipedalism and human evolution.',

        historicalContext: 'British explorer John Walter Gregory first described the phenomenon in the 1890s, recognizing that the sheer cliffs and linear lakes were formed by colossal tectonic faulting rather than water erosion.',

        concreteExample: {
          title: 'Why Lake Tanganyika is Biologically Unique',
          text: 'Because the tectonic trench of Lake Tanganyika is over 1,470 meters deep and millions of years old, it hosts more than 250 species of cichlid fish found nowhere else on Earth, serving as a living evolutionary laboratory.'
        },

        visualAid: {
          type: 'diagram',
          title: 'East African Rift Tectonic Branches',
          description: 'Geographical separation of the Eastern and Western Rift Valleys.',
          items: [
            { label: 'Eastern Gregory Rift', value: 'Volcanic & Soda Lakes', detail: 'Includes Mt. Kilimanjaro, Lake Natron, Lake Nakuru, and the Afar Triple Junction.' },
            { label: 'Western Albertine Rift', value: 'Deep Trench Lakes', detail: 'Contains Lake Tanganyika, Lake Kivu, Lake Albert, and the Rwenzori Mountains.' },
            { label: 'Afar Depression', value: 'Triple Junction Basin', detail: 'Lowest point where the Red Sea, Gulf of Aden, and African rifts meet.' }
          ]
        },

        simpleExplanation: 'The Great Rift Valley is a giant tear in the Earth’s crust stretching across eastern Africa. The ground is pulling apart, creating huge lakes, volcanoes, and the valleys where the earliest human ancestors walked.',

        deepExplanation: `🌋 Geodynamic Mechanisms & Plate Divergence:
The East African Rift System (EARS) represents an active intra-continental divergent boundary where thermal upwelling in the Earth's asthenosphere creates a superplume beneath the East African Plateau. This intense geothermal heating causes the lithosphere to stretch, thin, and fracture, progressively cleaving the African Plate into two distinct microplates: the western Nubian Plate and the eastern Somali Plate. Over the past 25 million years, this tectonic tension has produced a classic graben-and-horst topography, characterized by sunken valley floors bordered by steep, parallel fault scarps rising up to 2,000 meters.

🌊 Hydrological Dynamics & Endorheic Basin Evolution:
The bifurcated rift branches (the Eastern Gregory Rift and the Western Albertine Rift) exhibit drastically divergent hydrological profiles. The Albertine Rift hosts ancient, deep tectonic trenches including Lake Tanganyika (maximum depth 1,470 m, containing 17% of the world's surface freshwater) and Lake Malawi. These isolated, stratified aquatic environments act as hyper-speciated evolutionary laboratories, sustaining over 1,500 endemic cichlid species. Conversely, the Gregory Rift features shallow, high-alkaline soda lakes (such as Lake Natron and Lake Bogoria) fueled by volcanic carbonatite minerals, creating unique extremophile ecosystems.

🧬 Paleoanthropological Matrix & Human Origins:
The dynamic ecological fluctuations of the Rift Valley played a foundational role in hominin evolution. The progressive uplift of rift shoulders created rain shadows that transformed dense rainforests into mosaic forest-savanna ecotones. This environmental heterogeneity exerted evolutionary pressure on early hominins, driving adaptations such as bipedal locomotion, increased encephalization, and tool manufacture, as documented in the stratigraphy of Olduvai Gorge, Hadar, and Lake Turkana.`,

        selfExplanationPrompt: 'Explain how plate tectonics created the Great Rift Valley and why this region is so important for biology and human origins.',
        selfExplanationKeyPoints: [
          'Splitting of the African plate into Nubian and Somali plates',
          'Formation of deep graben valleys, volcanoes, and unique freshwater lakes',
          'Fossil discoveries in Olduvai Gorge tracing human origins',
          'Rich biodiversity and isolated species evolution in rift lakes'
        ],

        flashcardQuestion: 'What geological process created the Great Rift Valley in East Africa?',
        flashcardAnswer: 'Continental rifting: the active tectonic splitting of the African Plate into the Nubian Plate and Somali Plate along a 6,000 km fault zone.',
        flashcardHint: 'Think about tectonic plates pulling apart.',

        practiceQuestion: 'Which famous archaeological site located in the Great Rift Valley has provided critical fossil discoveries of early hominids like Homo habilis?',
        practiceOptions: [
          'Olduvai Gorge in Tanzania',
          'Carthage Amphitheatre in Tunisia',
          'Valley of the Kings in Egypt',
          'Mapungubwe Hill in South Africa'
        ],
        correctOptionIndex: 0,
        practiceExplanation: 'Olduvai Gorge in northern Tanzania, situated within the Great Rift Valley, revealed hominid fossils discovered by Louis and Mary Leakey that revolutionized our understanding of human evolution.'
      },
      {
        id: 'congo-basin-rainforest',
        setId: 'african-geography-biomes',
        title: 'The Congo Basin: The Earth\'s Second Lung',
        summary: 'The Congo Basin contains the world’s second-largest tropical rainforest, acting as a massive global carbon sink and home to immense biodiversity.',
        category: 'GEOGRAPHY',
        difficulty: 'Medium',
        tags: ['Rainforest', 'Central Africa', 'Ecology', 'Congo River'],

        explanation: 'Spanning across six Central African nations (DRC, Republic of Congo, Cameroon, CAR, Gabon, and Equatorial Guinea), the Congo Basin spans roughly 3.7 million square kilometers. It harbors 10,000 species of tropical plants, over 400 mammal species including western lowland gorillas and forest elephants, and holds the world\'s largest tropical peatland complex, storing over 30 billion tons of carbon.',

        keyFacts: [
          'It is the world’s second-largest tropical rainforest after the Amazon.',
          'The Congo River is the second-longest in Africa and the deepest river in the world, exceeding 220 meters in depth.',
          'The Cuvette Centrale peatlands in the Congo Basin store equivalent to roughly 3 years of global fossil fuel emissions.',
          'The forest acts as an atmospheric water pump, generating rainfall that feeds crops across the Sahel and Horn of Africa.'
        ],

        terminology: [
          { term: 'Carbon Sink', definition: 'A natural reservoir that absorbs more carbon dioxide from the atmosphere than it releases, mitigating climate change.' },
          { term: 'Peatland (Cuvette Centrale)', definition: 'Waterlogged organic soil made of partially decayed vegetation that holds vast quantities of locked carbon.' },
          { term: 'Endemism', definition: 'Ecological state of a species being unique to a defined geographic location, such as the Okapi and Bonobo in the Congo Basin.' }
        ],

        whyItMatters: 'Preserving the Congo Basin is critical to global climate stability. If its peatlands are drained or deforested, tens of billions of tons of carbon dioxide would be released into the atmosphere.',

        historicalContext: 'Indigenous peoples including the Mbuti and Ba’Aka have sustainably inhabited and conserved the Congo Basin forest ecosystem for tens of thousands of years through deep ethno-botanical knowledge.',

        concreteExample: {
          title: 'The Okapi: A Symbol of Forest Endemism',
          text: 'The Okapi, often called the "forest giraffe", has striped zebra-like hind legs and a long purple tongue for stripping leaves. It exists only in the dense Ituri rainforest of the Democratic Republic of Congo.'
        },

        visualAid: {
          type: 'diagram',
          title: 'Ecological Layers of the Congo Rainforest',
          description: 'Vertical stratification of the forest ecosystem.',
          items: [
            { label: 'Emergent Layer (50m+)', value: 'Giant Canopy Trees', detail: 'Towering hardwood species like Moabi and African Teak.' },
            { label: 'Closed Canopy (30m)', value: 'Living Green Ceiling', detail: 'Houses 90% of forest bird, primate, and insect life.' },
            { label: 'Understory & Forest Floor', value: 'Peat Soil & Hydrology', detail: 'Filtered light, wetlands, rivers, and immense carbon storage.' }
          ]
        },

        simpleExplanation: 'The Congo Basin is a giant, lush green forest the size of Western Europe. It is the Earth\'s second lung, storing billions of tons of carbon and home to rare animals like gorillas, forest elephants, and the okapi.',

        deepExplanation: `🌿 Biogeochemical Cycling & Atmospheric Moisture Pumps:
The Congo Basin functions as a paramount continental climate engine. Through intense evapotranspiration, the dense multilayered canopy acts as an atmospheric water pump, releasing vast plumes of water vapor that generate localized convection storms. These "flying rivers" transport moisture thousands of kilometers, directly replenishing annual precipitation across the Sahel, the Ethiopian Highlands, and the Nile River Basin. Deforestation in the Congo Basin would therefore trigger systemic hydrological collapse across the entire African continent.

🌍 The Cuvette Centrale Peatlands & Carbon Sequestration:
Covering over 145,000 square kilometers across the Democratic Republic of Congo and the Republic of Congo, the Cuvette Centrale is the largest tropical peatland complex on the planet. Discovered and systematically mapped only in recent years, these waterlogged, anaerobic peat soils store an estimated 30 to 35 billion metric tons of carbon—equivalent to approximately three years of total global fossil fuel combustion emissions. Maintaining these peatlands in their saturated, undisturbed state is essential; their drainage or exposure to fire would transform the basin from a vital global carbon sink into a catastrophic carbon source.

🛡️ Fluvial Morphology, Speciation, and Ecological Stratification:
The Congo River, discharging 41,000 cubic meters of water per second into the Atlantic Ocean, is the world's deepest river system, plunging to depths exceeding 220 meters. Its extreme depth and violent subterranean rapids create physical aquatic barriers that drive rapid allopatric speciation among freshwater fish. On land, the basin's ecological stability over millions of years has preserved rare, highly specialized endemic fauna—such as the Okapi, Bonobo (Pygmy Chimpanzee), and Western Lowland Gorilla—making it one of the most irreplaceable biodiversity hotspots on Earth.`,

        selfExplanationPrompt: 'Explain why the Congo Basin and its peatlands are vital for both African weather patterns and global climate stability.',
        selfExplanationKeyPoints: [
          'World\'s second-largest tropical rainforest and primary carbon sink',
          'Peatlands store over 30 billion tons of carbon (equivalent to 3 years of global emissions)',
          'Atmospheric moisture generation fueling rainfall across Africa',
          'Crucial habitat for endangered endemic species'
        ],

        flashcardQuestion: 'Why is the Congo Basin referred to as one of the Earth’s most vital carbon sinks?',
        flashcardAnswer: 'It contains the world\'s second-largest tropical rainforest and the Cuvette Centrale peatlands, which store over 30 billion tons of carbon.',
        flashcardHint: 'Think about carbon storage and rainforest size.',

        practiceQuestion: 'What makes the Cuvette Centrale peatland complex in the Congo Basin globally significant?',
        practiceOptions: [
          'It is a commercial diamond open-pit mine',
          'It holds the world’s largest tropical peatland, storing massive amounts of carbon that protect the global climate',
          'It was completely formed by artificial 20th-century irrigation canals',
          'It is an arid sand dune desert devoid of vegetation'
        ],
        correctOptionIndex: 1,
        practiceExplanation: 'Discovered and mapped comprehensively in recent years, the Cuvette Centrale peatlands store an estimated 30 billion tons of carbon, making their preservation paramount to planetary climate regulation.'
      }
    ]
  },
  {
    id: 'african-literature-voices',
    title: 'Pioneers of African Literature',
    description: 'Explore the storytelling traditions, post-colonial themes, and masterpieces of Chinua Achebe, Ngũgĩ wa Thiong\'o, and Wole Soyinka.',
    category: 'LITERATURE',
    estimatedMinutes: 10,
    featured: false,
    createdAt: '2026-01-10',
    concepts: [
      {
        id: 'chinua-achebe-things-fall-apart',
        setId: 'african-literature-voices',
        title: 'Chinua Achebe & "Things Fall Apart"',
        summary: 'Published in 1958, Achebe’s masterpiece reclaimed African narrative sovereignty, portraying pre-colonial Igbo society with nuance and tragedy.',
        category: 'LITERATURE',
        difficulty: 'Easy',
        tags: ['Literature', 'Igbo', 'Achebe', 'Postcolonial'],

        explanation: 'Chinua Achebe wrote "Things Fall Apart" in direct response to colonial European literature like Joyce Cary\'s "Mister Johnson" and Joseph Conrad\'s "Heart of Darkness", which depicted Africans as primitive or voiceless. Achebe’s novel depicts the complex social structures, judicial assemblies, proverbs, religious rituals, and personal tragedy of Okonkwo and the Igbo village of Umuofia before and during British colonial encroachment.',

        keyFacts: [
          'Translated into over 60 languages with over 20 million copies sold worldwide.',
          'The title is drawn from W.B. Yeats’s poem "The Second Coming".',
          'Famous for incorporating authentic Igbo proverbs, which Achebe called "the palm-oil with which words are eaten."',
          'It established the African Writers Series (Heinemann), opening the door for generations of African authors.'
        ],

        terminology: [
          { term: 'Proverbs in African Orature', definition: 'Concise, culturally resonant aphorisms used to communicate philosophical principles, moral guidance, and diplomatic discourse.' },
          { term: 'Post-Colonial Literature', definition: 'Literature that examines and critiques the cultural, political, and human consequences of colonial rule.' },
          { term: 'African Narrative Sovereignty', definition: 'The principle that African people must narrate their own histories, cultures, and lived experiences from their own perspective.' }
        ],

        whyItMatters: 'Achebe proved to the global literary world that African societies had rich systems of justice, philosophy, and community governance before colonization, changing world literature forever.',

        historicalContext: 'Published two years before Nigeria achieved independence in 1960, the novel resonated globally as a cultural declaration of independence.',

        concreteExample: {
          title: 'The Egwugwu Masquerade Court',
          text: 'In "Things Fall Apart", community disputes (such as domestic conflicts) are judged by the Egwugwu—ancestral masqueraders representing the nine villages. This showed European readers a sophisticated, community-led system of restorative justice.'
        },

        visualAid: {
          type: 'quote',
          title: 'Achebe on African Storytelling',
          description: 'The moral purpose of authentic African literature.',
          quote: {
            text: 'Until the lions have their own historians, the history of the hunt will always glorify the hunter.',
            author: 'Chinua Achebe',
            year: '1994'
          }
        },

        simpleExplanation: 'Chinua Achebe wrote a world-famous book showing that African villages were full of deep philosophy, poetry, laws, and culture before colonial rule, proving that African people must tell their own stories.',

        deepExplanation: `📖 Deconstructing Colonial Discourse & Reclaiming African Voice:
Chinua Achebe wrote "Things Fall Apart" (1958) as a deliberate counter-discursive intervention against the reductionist colonial canon—exemplified by Joseph Conrad's "Heart of Darkness" and Joyce Cary's "Mister Johnson"—which portrayed Africa as an amorphous, primeval void devoid of language, morality, or history. Achebe's revolutionary act was not merely political protest, but ontological restoration: presenting pre-colonial Igbo society as a fully realized, dialectical civilization complete with philosophical inquiry, structured legal jurisprudence, artistic traditions, and complex psychological conflicts.

🗣️ Linguistic Transmutation & The Africanization of English:
Achebe pioneered a revolutionary literary aesthetic by refashioning standard British English into an authentic African medium. He deliberately incorporated Igbo rhetorical structures, speech cadences, syntactic pauses, and above all, orature and proverbs ("the palm-oil with which words are eaten"). By embedding indigenous metaphors directly into the narrative fabric, Achebe demonstrated that an African writer could wield the colonial language without capitulating to colonial aesthetics, forging a transnational post-colonial literary style.

⚖️ Tragic Dialectics: Okonkwo and the Fragility of Dogma:
Unlike simplistic anti-colonial polemics, Achebe created in Okonkwo a classical tragic protagonist whose hyper-masculine rigidity and terror of weakness mirror the fatal blind spots of human ambition. The novel does not sentimentalize Igbo society; rather, it critiques both internal societal contradictions (such as the abandonment of twins and the ostracization of the Osu) and the devastating structural violence of British colonial-missionary encroachment. The poignant concluding irony—where Okonkwo's life is reduced to a single indifferent paragraph in the District Commissioner's bureaucratic anthropological treatise—lays bare the cold erasure inflicted by imperial historiography.`,

        selfExplanationPrompt: 'Explain why Chinua Achebe wrote "Things Fall Apart" and how his novel challenged colonial European stereotypes.',
        selfExplanationKeyPoints: [
          'Response to colonial European novels that dehumanized Africans',
          'Portraying complex Igbo social, judicial, and cultural structures',
          'Use of authentic Igbo proverbs and speech traditions in literature',
          'Reclaiming African narrative sovereignty before independence'
        ],

        flashcardQuestion: 'Why is Chinua Achebe’s 1958 novel "Things Fall Apart" considered a foundational milestone in world literature?',
        flashcardAnswer: 'It reclaimed African narrative sovereignty by depicting pre-colonial Igbo society with rich nuance and complexity, directly challenging colonial European literary stereotypes.',
        flashcardHint: 'Think about who tells the story and cultural representation.',

        practiceQuestion: 'What did Chinua Achebe mean when he described proverbs as "the palm-oil with which words are eaten"?',
        practiceOptions: [
          'That cooking recipes are the primary topic of African novels',
          'That proverbs are essential cultural seasoning that make communication smooth, wise, and resonant',
          'That proverbs should only be spoken by royal court chefs',
          'That words have no meaning without agricultural trade'
        ],
        correctOptionIndex: 1,
        practiceExplanation: 'Achebe emphasized that in Igbo conversation, proverbs provide the essential philosophical context, wisdom, and respect required for civil communication.'
      }
    ]
  }
];
