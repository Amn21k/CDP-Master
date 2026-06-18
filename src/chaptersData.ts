export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterHindiTitle: string;
  summary: string;
  importantPoints: string[];
  oneLinerRevision: string[];
  weakTopicTags: string[];
}

export interface Note {
  id: string;
  chapterId: string;
  title: string;
  content: string;
}

export interface Flashcard {
  id: string;
  chapterId: string;
  question: string;
  answer: string;
}

export interface Mcq {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", "D"
  explanation: string;
}

export interface ChapterTest {
  id: string;
  chapterId: string;
  testTitle: string;
  questions: Mcq[];
}

export interface DailyQuiz {
  id: string;
  date: string;
  questions: Mcq[];
}

export interface Pyq {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  examYear: string;
  examType: string;
}

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "cdp",
    name: "Child Development and Pedagogy",
    code: "CDP-01",
    description: "Detailed child psychology, learning theories, inclusive education and pedagogical practices."
  }
];

export const SEED_CHAPTERS: Chapter[] = [
  {
    id: "chap-01",
    subjectId: "cdp",
    chapterNumber: 1,
    chapterTitle: "Introduction to Psychology",
    chapterHindiTitle: "मनोविज्ञान का परिचय",
    summary: "मनोविज्ञान (Psychology) की उत्पत्ति दर्शनशास्त्र (Philosophy) से हुई है। 'Psychology' शब्द का सबसे पहले प्रयोग 1590 ई. में रूडोल्फ गॉलकाय (Rudolf Goclenius) ने किया था। यह दो ग्रीक शब्दों से मिलकर बना है- Psyche (आत्मा/Soul) और Logos (ज्ञान/Discourse)। प्रारंभ में मनोविज्ञान को 'आत्मा का विज्ञान' माना जाता था। इसके बाद इसे 'मस्तिष्क का विज्ञान', फिर 'चेतना का विज्ञान' और आधुनिक समय में जे.बी. वॉटसन के अनुसार 'व्यवहार का विज्ञान' (Science of Behaviour) माना जाता है। विलियम जेम्स ने 'Principles of Psychology' पुस्तक लिखी थी। मनोविज्ञान की प्रथम प्रयोगशाला 1879 में जर्मनी के लिपज़िग में विल्हेम वुंड्ट (Wilhelm Wundt) द्वारा स्थापित की गई थी। जोहन हर्बर्ट को शिक्षा मनोविज्ञान का जनक माना जाता है।",
    importantPoints: [
      "रूडोल्फ गॉलकाय ने 1590 में सबसे पहले 'Psychology' शब्द का प्रयोग किया था।",
      "विल्हेम वुंड्ट ने 1879 में जर्मनी के लिपज़िग (Leipzig) में प्रथम मनोवैज्ञानिक प्रयोगशाला की स्थापना की थी।",
      "जे.बी. वॉटसन (J.B. Watson) को व्यवहारवाद (Behaviorism) का जनक माना जाता है।",
      "विलियम जेम्स (William James) ने 'Principles of Psychology' के माध्यम से आधुनिक मनोविज्ञान की आधारशिला रखी।",
      "जोहन हर्बर्ट (Johann Herbart) को शिक्षा मनोविज्ञान का जनक (Father of Educational Psychology) माना जाता है।",
      "मनोविज्ञान दर्शनशास्त्र (Philosophy) से अलग होकर स्वतंत्र विज्ञान बना है।",
      "शिक्षा की तीन स्वतंत्र चर (Independent Variables) शिक्षक, आश्रित चर विद्यार्थी और हस्तक्षेप चर पाठ्यक्रम होते हैं।"
    ],
    oneLinerRevision: [
      "मनोविज्ञान का प्रारंभिक अर्थ क्या था? - आत्मा का विज्ञान",
      "Psychology शब्द किन दो ग्रीक शब्दों से बना है? - Psyche + Logos",
      "मनोविज्ञान का आधुनिक संप्रत्यय क्या है? - व्यवहार का विज्ञान (Study of Behavior)",
      "प्रथम मनोविज्ञान प्रयोगशाला किसके द्वारा और कब स्थापित हुई? - विल्हेम वुंड्ट (1879, जर्मनी)",
      "सर्वप्रथम 'मनोविज्ञान' शब्द का प्रयोग किसने किया? - रूडोल्फ गॉलकाय (1590)",
      "शिक्षा मनोविज्ञान के जनक कौन हैं? - जोहन हर्बर्ट (Johann Herbart)",
      "किसने कहा: 'मनोविज्ञान ने पहले अपनी आत्मा त्यागी, फिर मन, फिर चेतना और अब व्यवहार अपनाता है'? - वुडवर्थ (Woodworth)",
      "स्वस्थ शरीर में स्वस्थ मस्तिष्क का निर्माण ही शिक्षा है - किसने कहा? - अरस्तू (Aristotle)"
    ],
    weakTopicTags: ["Behaviorism Basis", "First Psychology Laboratory", "Independent and Dependent Variables in Education"]
  },
  {
    id: "chap-02",
    subjectId: "cdp",
    chapterNumber: 2,
    chapterTitle: "Child Development",
    chapterHindiTitle: "बाल विकास",
    summary: "बाल विकास (Child Development) बालक के शारीरिक, मानसिक, सामाजिक, संवेगात्मक विकास का एक प्रगतिशील और क्रमबद्ध (Orderly) परिवर्तन है जो गर्भाधान (Conception) से शुरू होकर जीवनभर चलता है। वृद्धि (Growth) केवल शारीरिक परिवर्तनों (Physical/Structural) को दर्शाती है और परिपक्वता के बाद रुक जाती है, जबकि विकास मात्रात्मक और गुणात्मक दोनों होता है। विकास के दो प्रमुख सिद्धांत शिरोपुच्छीय (Cephalocaudal - सिर से पैर की ओर) और समीप-दूराभिमुख (Proximodistal - केंद्र से बाहर की ओर) हैं। इसके तहत पियाजे का संज्ञानात्मक विकास सिद्धांत (Cognitive Development - 4 अवस्थाएँ), वाइगोत्स्की का सामाजिक-सांस्कृतिक सिद्धांत (Socio-cultural - ZPD, Scaffolding), कोहलबर्ग का नैतिक विकास (3 स्तर, 6 चरण) और फ्रायड का मनोयौनिक विकास (Psychosexual Stages और Id, Ego, Superego) प्रमुख हैं।",
    importantPoints: [
      "शारीरिक अंगों और कोशिकाओं में आकार और वजन का बढ़ना 'वृद्धि' (Growth) कहलाता है, जो मापने योग्य होती है।",
      "विकास (Development) एक बहुआयामी (Multidimensional) और सतत जीवनभर चलने वाली प्रक्रिया है।",
      "शिरोपुच्छीय सिद्धांत (Cephalocaudal Principle) के अनुसार शारीरिक विकास सिर से प्रारंभ होकर नीचे पैर की तरफ बढ़ता है।",
      "समीप-दूराभिमुख सिद्धांत (Proximodistal Principle) के अनुसार विकास केंद्र (हृदय/रीढ़) से प्रारंभ होकर बाहर की ओर जाता है।",
      "पियाजे ने बच्चे को 'सक्रिय ज्ञान निर्माता' (Active Constructor of Knowledge) माना और स्कीमा (Schema) की अवधारणा दी।",
      "वाइगोत्स्की ने बालक के विकास में समाज, संस्कृति और भाषा को सबसे अहम भूमिका दी। मचान (Scaffolding) एक अस्थायी सहायता है।",
      "स्टैनले हॉल ने किशोरावस्था (Adolescence) को 'अत्यधिक तनाव, तूफान और संघर्ष का काल' कहा है।",
      "कैरल गिलिगन ने कोहलबर्ग के सिद्धांत को लैंगिक रूप से पक्षपाती (Gender biased) कहा, क्योंकि यह पुरुषों की न्याय दृष्टि और महिलाओं के देखभाल दृष्टिकोण में भेदभाव करता है।"
    ],
    oneLinerRevision: [
      "शारीरिक विकास सिर से पैर की तरफ होना क्या कहलाता है? - शिरोपुच्छीय सिद्धांत (Cephalocaudal)",
      "केंद्र से बाहर की तरफ होने वाला शारीरिक संगठन विकास? - समीप-दूराभिमुख सिद्धांत (Proximodistal)",
      "जीन पियाजे ने संज्ञानात्मक विकास की कितनी अवस्थाएं दीं? - चार मुख्य अवस्थाएं",
      "वाइगोत्स्की के अनुसार बालक की वास्तविक क्षमता और मार्गदर्शक सहायता क्षमता का अंतर? - ZPD (समीपस्थ विकास क्षेत्र)",
      "किस अवस्था को 'खिलौना आयु' (Toy Age) कहा जाता है? - पूर्व बाल्यावस्था (Early Childhood, 2-6 वर्ष)",
      "किशोरावस्था को 'तनाव और तूफान की अवस्था' किसने कहा है? - स्टेनले हॉल (Stanley Hall)",
      "कोहलबर्ग के नैतिक विकास सिद्धांत की आलोचना किसने की? - कैरल गिलिगन (Carol Gilligan)",
      "फ्रायड के अनुसार अचेतन मन और मूल प्रवृत्तियों पर आधारित व्यक्तित्व भाग? - इड (Id)",
      "नवजात शिशु के गाल छूने पर सिर घुमाकर मुंह खोजने का रिफ्लेक्स? - रूटिंग रिफ्लेक्स (Rooting Reflex)"
    ],
    weakTopicTags: ["Piaget Stages of Cognition", "Vygotsky ZPD Scaffolding", "Kohlberg Moral Levels", "Freud Id Ego Superego"]
  },
  {
    id: "chap-03",
    subjectId: "cdp",
    chapterNumber: 3,
    chapterTitle: "Heredity and Environment",
    chapterHindiTitle: "आनुवंशिकता एवं पर्यावरण",
    summary: "बालक का विकास आनुवंशिकता (Nature) और पर्यावरण (Nurture) के बीच होने वाली जटिल अंतःक्रिया का परिणाम है। वुडवर्थ के अनुसार, 'बालक का विकास आनुवंशिकता तथा वातावरण का गुणनफल है' (Development = Heredity × Environment)। मानव शरीर गुणसूत्रों के 23 जोड़ों (कुल 46 गुणसूत्रों) से बनता है। ग्रेगर जॉन मेंडल ने मटर के पौधों पर परीक्षण कर आनुवंशिकता के नियमों का प्रतिपादन किया, जिसमें प्रभुत्व, पृथक्करण और स्वतंत्र अपव्यूहन के नियम शामिल हैं। 'बीजकोष की निरंतरता' का नियम अगस्त वीसमैन (August Weismann) द्वारा प्रतिपादित किया गया, जिन्होंने सिद्ध किया कि अर्जित गुणों का संक्रमण अगली पीढ़ी में नहीं होता।",
    importantPoints: [
      "वुडवर्थ ने स्पष्ट किया कि विकास आनुवंशिकता और पर्यावरण के बीच गुणात्मक योग है, न कि जोड़।",
      "समस्त शारीरिक संरचना, बुद्धि, आंखों का रंग आनुवंशिकता द्वारा तय होते हैं; इसे स्थैतिक सामाजिक संरचना माना जाता है।",
      "प्रत्येक मानव कोशिका में 23 जोड़े गुणसूत्र (कुल 46 Chromosomes) होते हैं। 23वाँ जोड़ा लिंग निर्धारण (Sex Determination) करता है।",
      "पुरुषों में XY गुणसूत्र और सामान्य महिलाओं में XX गुणसूत्र होते हैं।",
      "मेंडल को आनुवंशिकी का जनक (Father of Genetics) माना जाता है, जिन्होंने मटर (Peas) के पौधों पर प्रयोग किए।",
      "वीसमैन ने चूहों पर प्रयोग कर पूंछ काटने के बाद भी चूहों की पूंछ गायब न होने से अर्जित गुणों के हस्तांतरण को नकारा।",
      "डाउन सिंड्रोम (Down Syndrome) 21वें गुणसूत्र की त्रिसूत्रता (Trisomy 21) के कारण होता है, जिससे कुल गुणसूत्र 47 हो जाते हैं।"
    ],
    oneLinerRevision: [
      "विकास आनुवंशिकता और पर्यावरण का क्या है? - गुणनफल (Product of Heredity & Environment)",
      "मानव शिशु में कुल कितने गुणसूत्र (Chromosomes) होते हैं? - 46 (23 जोड़े)",
      "मटर के पौधों पर आनुवंशिकी का प्रसिद्ध नियम किसने दिया? - ग्रेगर जॉन मेंडल",
      "बीजकोष की निरंतरता का नियम (Core of Germ Plasm) किसने दिया? - अगस्त वीसमैन",
      "Trisomy 21 किस बीमारी या सिंड्रोम को दर्शाता है? - डाउन सिंड्रोम (Down Syndrome)",
      "महिला में पाया जाने वाला गुणसूत्र समूह? - XX गुणसूत्र",
      "पुरुषों में पाया जाने वाला गुणसूत्र समूह जो लिंग निर्धारण करता है? - XY गुणसूत्र",
      "टर्नर सिंड्रोम (Turner Syndrome) में कुल कितने गुणसूत्र बचते हैं? - 45 गुणसूत्र (X0)",
      "किस विद्वान ने 'Hereditary Genius' पुस्तक लिखी थी? - फ्रांसिस गाल्टन (Galton)"
    ],
    weakTopicTags: ["Weismann Germ Plasm", "Mendelian Peas Laws", "Chromosome Disorders Down Turner"]
  },
  {
    id: "chap-04",
    subjectId: "cdp",
    chapterNumber: 4,
    chapterTitle: "Gender",
    chapterHindiTitle: "लिंग",
    summary: "लिंग (Gender) एक सामाजिक संप्रत्यय (Social Construct) है, जबकि जैविक लिंग (Sex) एक जैविक अवधारणा (Biological Attribute) है। समाज स्त्रियों और पुरुषों के लिए विशिष्ट व्यवहार, भूमिकाएं और पूर्वाग्रह तय करता है जिसे 'लैंगिक भूमिका' (Gender Roles) कहा जाता है। स्त्रियों और पुरुषों के प्रति समाज में पूर्वग्रह से ग्रसित रूढ़िवादी सोच को लैंगिक रूढ़िबद्धता (Gender Stereotyping) तथा उनके साथ असमान व्यवहार को लैंगिक पूर्वाग्रह (Gender Bias) कहा जाता है। इसके समाधान के लिए निष्पक्ष लैंगिक समता (Gender Equity) स्थापित करना आवश्यक है।",
    importantPoints: [
      "सेक्स (Sex) एक प्राकृतिक और जैविक संरचना है, जबकि जेंडर (Gender) एक सामाजिक और सांस्कृतिक संप्रत्यय है।",
      "समाज में यह मानना कि लड़कियां गृहकार्य के लिए बनी हैं और लड़के विज्ञान के लिए, 'लैंगिक रूढ़िबद्धता' (Gender Stereotyping) है।",
      "भाषा में 'उसने अध्यापिका से कहा' की जगह हमेशा पुरुषों को प्राथमिकता देना अनजाने में जेंडर पक्षपात दर्शाता है।",
      "लैंगिक पूर्वाग्रह (Gender Bias) को समाप्त करने के लिए गैर-पारंपरिक भूमिकाओं में महिलाओं और पुरुषों का चित्रण करना चाहिए।",
      "कक्षा में जेंडर-तटस्थ भाषा (Gender-neutral language; जैसे कैमरामैन की जगह कैमरापर्सन) का उपयोग करना चाहिए।"
    ],
    oneLinerRevision: [
      "जेंडर (Gender) किस प्रकार का संप्रत्यय है? - सामाजिक संप्रत्यय (Social Construct)",
      "सेक्स (Sex) किस प्रकार का संप्रत्यय है? - जैविक संप्रत्यय (Biological Construct)",
      "स्त्रियों और पुरुषों के प्रति बनी-बनाई रूढ़िवादी सोच क्या कहलाती है? - जेंडर रूढ़िवादिता (Gender Stereotyping)",
      "कक्षा में लड़कियों को गणित में कमजोर मानना क्या है? - लैंगिक पूर्वाग्रह (Gender Bias / Gender Stereotyping)",
      "जेंडर पूर्वाग्रह से बचने हेतु शिक्षक को किन भूमिकाओं को रचना चाहिए? - गैर-पारंपरिक लैंगिक भूमिकाओं को बढ़ावा देना",
      "चेयरमैन की जगह 'चेयरपर्सन' कहना किसका उदाहरण है? - जेंडर-तटस्थ भाषा (Gender-neutral language)"
    ],
    weakTopicTags: ["Gender as Social Construct", "Gender Stereotyping Mitigation", "Neutral Classroom Speech"]
  },
  {
    id: "chap-05",
    subjectId: "cdp",
    chapterNumber: 5,
    chapterTitle: "Socialisation",
    chapterHindiTitle: "समाजीकरण",
    summary: "समाजीकरण (Socialisation) वह प्रक्रिया है जिसके माध्यम से एक नवजात जैविक शिशु समाज के नियमों, परंपराओं, मूल्यों और सांस्कृतिक संप्रत्ययों को सीखकर एक जिम्मेदार 'सामाजिक प्राणी' बनता है। समाजीकरण दो मुख्य प्रकार का होता है- प्रााथमिक समाजीकरण (Primary - जिसमें परिवार और माता-पिता मुख्य भूमिका निभाते हैं और जो बचपन में होता है) तथा द्वितीयक समाजीकरण (Secondary - जिसमें विद्यालय, मित्र मंडली, मीडिया और सामाजिक संस्थाएं शामिल हैं)। इसके अलावा अप्रत्याशित समाजीकरण (Anticipatory - भाभी पेशेवर भूमिकाओं को पहले से अपनाना) और पुनःसमाजीकरण (Re-socialisation - अपराधी को सुधारना या वयस्क की शादी के बाद नए परिवेश में ढलना) भी प्रमुख प्रकार हैं। रॉबर्ट के. मर्टन ने 1957 में प्रत्याशित समाजीकरण शब्द दिया था।",
    importantPoints: [
      "समाजीकरण जन्म से प्रारंभ होकर मृत्यु पर्यंत चलने वाली एक जीवनभर की प्रक्रिया है।",
      "परिवार (Family) बालक के समाजीकरण का सबसे पहला और मुख्य 'प्राथमिक एजेंट' (Primary Agent) होता है।",
      "विद्यालय (School), सहपाठी/मित्र (Peer Group) और जनसंचार माध्यम (Mass Media) समाजीकरण के 'द्वितीयक एजेंट' हैं।",
      "रॉबर्ट मर्टन ने 'Anticipatory Socialisation' (प्रत्याशित समाजीकरण) का प्रतिपादन किया, जिसमें बालक भविष्य के समूहों में शामिल होने के लिए उनके तौर-तरीके पहले से सीखता है।",
      "पुनःसमाजीकरण (Re-socialisation) में व्यक्ति अपने पिछले व्यवहार को त्यागकर नए परिवेश (जैसे विवाह के बाद ससुराल या नई नौकरी) के अनुसार नए नियम सीखता है।"
    ],
    oneLinerRevision: [
      "बालक के समाजीकरण की प्राथमिक संस्था कौन सी है? - परिवार (Family)",
      "विद्यालय, मीडिया और मित्र मंडली किस प्रकार की समाजीकरण संस्थाएं हैं? - द्वितीयक संस्थाएं (Secondary Agents)",
      "भविष्य की भूमिकाओं को पहले से ही सीखने का तौर-तरीका? - प्रत्याशित समाजीकरण (Anticipatory Socialisation)",
      "शादी के बाद नए परिवार में लड़की का ढलना किस प्रकार का समाजीकरण है? - पुनःसमाजीकरण (Re-socialisation)",
      "प्रत्याशित समाजीकरण (Anticipatory Socialisation) शब्द किसने दिया? - समाजशास्त्री रॉबर्ट के. मर्टन (1957)",
      "समाजीकरण की प्रक्रिया कब तक चलती है? - जीवनभर (Lifelong Process)"
    ],
    weakTopicTags: ["Primary vs Secondary Agents", "Anticipatory Socialisation", "Re-socialisation Scenarios"]
  },
  {
    id: "chap-06",
    subjectId: "cdp",
    chapterNumber: 6,
    chapterTitle: "Intelligence and its Theories",
    chapterHindiTitle: "बुद्धि एवं उसके सिद्धांत",
    summary: "बुद्धि (Intelligence) विभिन्न परिस्थितियों में समस्याओं को हल करने, सीखने, तर्क करने और अनुकूलन करने की समग्र क्षमता है। अल्फ्रेड बिने को बुद्धि परीक्षणों का जनक माना जाता है जिन्होंने 1905 में प्रथम बुद्धि परीक्षण दिया। टर्मन ने बुद्धि लब्धि (IQ) का अंतिम संशोधित सूत्र प्रतिपादित किया: IQ = (मानसिक आयु / वास्तविक आयु) × 100। स्पीयरमैन ने बुद्धि को 'G-कारक' (सामान्य कारक, जन्मजात) और 'S-कारक' (विशिष्ट कारक, अभ्यास से अर्जित) में विभाजित किया। हावर्ड गार्डनर ने बहु-बुद्धि सिद्धांत (Multiple Intelligence Theory, 1983) दिया जिसमें उन्होंने 9 प्रकार की बुद्धियों का वर्णन किया। रॉबर्ट स्टर्नबर्ग ने बुद्धि का त्रि-चापीय सिद्धांत (Triarchic Theory) दिया जिसके 3 भाग विश्लेषणात्मक (Componential), सृजनात्मक (Experiential) और व्यावहारिक (Contextual) बुद्धि हैं। बुद्धि मापन के लिए भाटिया बैटरी परफॉर्मेंस टेस्ट (1955) में 5 मुख्य उप-परीक्षण शामिल हैं जो कि गैर-शाब्दिक हैं।",
    importantPoints: [
      "अल्फ्रेड बिने (Alfred Binet) को बुद्धि मापन का जनक माना जाता है। उन्होंने मानसिक आयु (Mental Age) का संप्रत्यय 1908 में दिया था।",
      "विलियम स्टर्न ने 1912 में IQ का मूल सूत्र दिया, जिसे टर्मन ने 1916 में (मानसिक आयु / वास्तविक आयु × 100) के रूप में संशोधित किया।",
      "भाटिया बैटरी बुद्धि परीक्षण (Bhatia Battery 1955) सी.एम. भाटिया द्वारा भारत में निर्मित एक प्रसिद्ध क्रियात्मक निष्पादन परीक्षण (Performance test) है।",
      "गार्डनर के अनुसार बुद्धि का कोई एकल स्वरूप नहीं होता, बल्कि यह बहु-घटकीय होती है (बहु-बुद्धि सिद्धांत)।",
      "स्टर्नबर्ग के त्रि-घटकीय सिद्धांत में व्यावहारिक बुद्धि को 'सार्थक/सफल बुद्धि' भी माना जाता है जो दैनिक जीवन में काम आती है।",
      "डेनियल गोलमैन ने भावात्मक बुद्धि (Emotional Intelligence) को 'बुद्धि लब्धि से अधिक महत्वपूर्ण क्यों?' पुस्तक द्वारा लोकप्रिय बनाया।"
    ],
    oneLinerRevision: [
      "बुद्धि लब्धि (IQ) का वर्तमान संशोधित सूत्र क्या है? - (मानसिक आयु / वास्तविक आयु) × 100",
      "मानसिक आयु (Mental Age) शब्द सर्वप्रथम किसने और कब दिया? - अल्फ्रेड बिने (1908)",
      "प्रथम बुद्धि परीक्षण का निर्माण किसने किया? - अल्फ्रेड बिने और साइमन (1905)",
      "बुद्धि का द्वि-कारक सिद्धांत (G & S Factor) किसने दिया? - चाार्ल्स स्पीयरमैन (Spearman)",
      "बहु-बुद्धि सिद्धांत (Multiple Intelligence Theory) के प्रतिपादक? - हावर्ड गार्डनर (1983)",
      "बुद्धि का त्रि-चापीय/घटकीय सिद्धांत (Triarchic Theory) किसने दिया? - रॉबर्ट स्टर्नबर्ग",
      "भाटिया बैटरी बुद्धि परीक्षण में कुल कितने उप-परीक्षण हैं? - 5 उप-परीक्षण (Performance Tests)",
      "भावनात्मक बुद्धि (Emotional Intelligence) शब्द को किसने लोकप्रिय बनाया? - डेनियल गोलमैन (Daniel Goleman)",
      "तरल एवं ठोस बुद्धि (Fluid & Crystallized Intelligence) का सिद्धांत किसने दिया? - रेमंड कैटेल (Cattell)"
    ],
    weakTopicTags: ["Multiple Intelligence Profile", "IQ Score Classifications", "Bhatia Performance Tests", "Sublimation Defense Mechanisms"]
  }
];

export const SEED_MOCK_QUESTIONS: Mcq[] = [
  // Chapter 1: Introduction to Psychology
  {
    id: "mcq-1-01",
    chapterId: "chap-01",
    question: "मनोविज्ञान ने सर्वप्रथम अपनी आत्मा का परित्याग किया, फिर अपने मन का, और फिर अपनी चेतना का, अभी वह एक प्रकार के व्यवहार को संजोए हुए है। यह प्रसिद्ध कथन किसका है? / 'Psychology first abandoned its soul, then its mind, and then its consciousness; now it preserves a kind of behavior.' This statement was by:",
    options: [
      "अल्फ्रेड बिने / Alfred Binet",
      "जे.बी. वॉटसन / J.B. Watson",
      "आर.एस. वुडवर्थ / R.S. Woodworth",
      "विलियम जेम्स / William James"
    ],
    correctAnswer: "C",
    explanation: "यह कथन प्रसिद्ध शिक्षा शास्त्री आर.एस. वुडवर्थ का है, जो मनोविज्ञान की ऐतिहासिक प्रगति को बहुत सुंदर शब्दों में प्रस्तुत करता है।"
  },
  {
    id: "mcq-1-02",
    chapterId: "chap-01",
    question: "मनोविज्ञान की प्रथम प्रयोगशाला स्थापित की गई थी- / Who established the first laboratory of psychology?",
    options: [
      "लिपज़िग में विलियम वुंड्ट द्वारा / By Wilhelm Wundt in Leipzig",
      "यूएसए में विलियम जेम्स द्वारा / By William James in USA",
      "फ्रांस में अल्फ्रेड बिने द्वारा / By Alfred Binet in France",
      "इंग्लैंड में फ्रांसिस गाल्टन द्वारा / By Francis Galton in England"
    ],
    correctAnswer: "A",
    explanation: "मनोविज्ञान की पहली प्रयोगशाला विल्हेम वुंड्ट (Wilhelm Wundt) द्वारा 1879 में जर्मनी के लिपज़िग विश्वविद्यालय में स्थापित की गई थी।"
  },
  {
    id: "mcq-1-03",
    chapterId: "chap-01",
    question: "व्यवहारवाद (Behaviorism) को मनोविज्ञान का मुख्य संप्रत्यय बनाने का श्रेय किसे जाता है? / Who is known as the father of Behaviorism in psychology?",
    options: [
      "विल्हेम वुंड्ट / Wilhelm Wundt",
      "जे.बी. वॉटसन / J.B. Watson",
      "सिगमंड फ्रायड / Sigmund Freud",
      "बी.एफ. स्किनर / B.F. Skinner"
    ],
    correctAnswer: "B",
    explanation: "बीसवीं सदी की शुरुआत में जे.बी. वॉटसन (John B. Watson) ने शुद्ध रूप से वस्तुनिष्ठ और व्यवहार के विज्ञान (Science of Behavior) के रूप में व्यवहारवाद की नींव रखी।"
  },
  {
    id: "mcq-1-04",
    chapterId: "chap-01",
    question: "शिक्षा की प्रक्रिया में निम्नलिखित में से स्वतंत्र चर (Independent Variable) कौन सा है? / In the process of education, which of the following is the independent variable?",
    options: [
      "पाठ्यक्रम / Curriculum",
      "विद्यार्थी / Student",
      "शिक्षक / Teacher",
      "पुस्तकालय / Library"
    ],
    correctAnswer: "C",
    explanation: "जॉन डीवी के त्रिध्रुवीय शिक्षा मॉडल में, शिक्षक को स्वतंत्र चर (Independent Variable), छात्र को आश्रित चर (Dependent Variable) और पाठ्यक्रम को हस्तक्षेप चर (Intervening Variable) माना जाता है।"
  },
  {
    id: "mcq-1-05",
    chapterId: "chap-01",
    question: "शिक्षा मनोविज्ञान का जनक (Father of Educational Psychology) निम्नलिखित में से किसे माना जाता है? / Who is considered the Father of Educational Psychology?",
    options: [
      "जोहन हर्बर्ट / Johann Herbart",
      "प्लेटो / Plato",
      "अरस्तू / Aristotle",
      "जीन पियाजे / Jean Piaget"
    ],
    correctAnswer: "A",
    explanation: "जोहन हर्बर्ट (Johann Herbart) को वैज्ञानिक आधार पर शिक्षा की रूपरेखा तैयार करने और सर्वप्रथम शिक्षा मनोविज्ञान का सैद्धांतिक आधार प्रस्तुत करने के कारण इसका जनक माना जाता है।"
  },

  // Chapter 2: Child Development
  {
    id: "mcq-2-01",
    chapterId: "chap-02",
    question: "विकास के शिरोपुच्छीय सिद्धांत (Cephalocaudal Principle) के अनुसार बालक का शारीरिक विकास किस क्रम में बढ़ता है? / According to the Cephalocaudal Principle of development, physical development proceeds from:",
    options: [
      "पैर से सिर की ओर / Toe to head",
      "सिर से पैर की ओर / Head to toe",
      "केंद्र से बाहर की ओर / Center to periphery",
      "बाहर से अंदर की ओर / Periphery to center"
    ],
    correctAnswer: "B",
    explanation: "शिरोपुच्छीय सिद्धांत (Cephalocaudal) के अनुसार विकास की प्रक्रिया सिर से प्रारंभ होकर नीचे धड़ और पैरों की तरफ आगे बढ़ती है।"
  },
  {
    id: "mcq-2-02",
    chapterId: "chap-02",
    question: "शारीरिक विकास के 'समीप-दूराभिमुख' (Proximodistal) सिद्धांत का क्या अर्थ है? / What is the meaning of the Proximodistal principle of physical development?",
    options: [
      "विकास सिर से पैर की ओर होता है। / Development from head to toe",
      "विकास शरीर के केंद्र से शुरू होकर बाहर की ओर जाता है। / Development proceeds from center of the body outwards",
      "बच्चा पहले जटिल और फिर सरल बातें सीखता है। / Child learns complex then simple",
      "विकास केवल पर्यावरण की देन है। / Development is purely environmental"
    ],
    correctAnswer: "B",
    explanation: "समीप-दूराभिमुख (Proximodistal) का अर्थ है कि रीढ़ की हड्डी और शरीर के अंदरूनी केंद्रीय अंग पहले विकसित होते हैं, उसके बाद हाथ, पैर और उंगलियां विकसित होती हैं।"
  },
  {
    id: "mcq-2-03",
    chapterId: "chap-02",
    question: "पियाजे के अनुसार पूर्व-संक्रियात्मक अवस्था (Pre-operational Stage) में बालक की वह क्या प्रवृत्ति है जिसमें वह खिलौने, गुड़िया या निर्जीव वस्तुओं को जीवित मानता है? / According to Piaget, what is the child's tendency in the Pre-operational Stage to believe that inanimate objects have lifelike qualities?",
    options: [
      "आत्मकेंद्रितता / Egocentrism",
      "वस्तु स्थायित्व / Object Permanence",
      "जीववाद / Animism",
      "संरक्षण / Conservation"
    ],
    correctAnswer: "C",
    explanation: "जीववाद (Animism) पूर्व-संक्रियात्मक अवस्था (2-7 वर्ष) की विशेषता है, जहाँ बालक चंद्रमा, हवा या खिलौनों को सजीव मानते हुए उनके साथ व्यवहार करता है।"
  },
  {
    id: "mcq-2-04",
    chapterId: "chap-02",
    question: "वाइगोत्स्की के अनुसार वास्तविक विकासात्मक स्तर और संभावित विकासात्मक स्तर का अंतर क्या कहलाता है? / According to Vygotsky, the difference between actual developmental level and potential developmental level is:",
    options: [
      "मचान (Scaffolding)",
      "समीपस्थ विकास क्षेत्र (Zone of Proximal Development - ZPD)",
      "अनुकूलन (Adaptation)",
      "आंतरिक वाक् (Inner Speech)"
    ],
    correctAnswer: "B",
    explanation: "ZPD बालक की स्वयं की कार्य क्षमता और किसी कुशल व्यक्ति के मार्गदर्शन में उसकी कार्य क्षमता के बीच का दायरा/क्षेत्र प्रदर्शित करता है।"
  },
  {
    id: "mcq-2-05",
    chapterId: "chap-02",
    question: "किशोरावस्था को 'अत्यधिक तूफान, संघर्ष, तनाव और विरोध का काल' किसने घोषित किया है? / Who called Adolescence a period of 'great storm, stress, conflict and strike'?",
    options: [
      "जरशील्ड / Jersild",
      "हरलॉक / Hurlock",
      "स्टेनले हॉल / Stanley Hall",
      "किलपैट्रिक / Kilpatrick"
    ],
    correctAnswer: "C",
    explanation: "स्टेनले हॉल (G. Stanley Hall) ने अपनी पुस्तक 'Adolescence' में किशोरावस्था के दौरान होने वाले तीव्र संवेगात्मक और शारीरिक विकारों के संदर्भ में इसे संघर्ष और तूफान की अवस्था कहा।"
  },

  // Chapter 3: Heredity and Environment
  {
    id: "mcq-3-01",
    chapterId: "chap-03",
    question: "बालक का विकास निम्नलिखित में से किसका उत्पाद है? / The development of a child is the product of:",
    options: [
      "केवल आनुवंशिकता / Heredity only",
      "केवल पर्यावरण / Environment only",
      "आनुवंशिकता और पर्यावरण की परस्पर अंतःक्रिया / Interplay of Heredity and Environment",
      "केवल परिपक्वता / Maturation only"
    ],
    correctAnswer: "C",
    explanation: "वुडवर्थ के अनुसार, बालक का विकास आनुवंशिकता और पर्यावरण के बीच लगातार चलने वाली अंतःक्रिया और दोनों के गुणनफल का परिणाम होता है।"
  },
  {
    id: "mcq-3-02",
    chapterId: "chap-03",
    question: "मनुष्य की कोशिकाओं में कुल कितने गुणसूत्र (Chromosomes) होते हैं? / How many chromosomes are there in human somatic cells?",
    options: [
      "23 गुणसूत्र",
      "46 गुणसूत्र",
      "44 गुणसूत्र",
      "47 गुणसूत्र"
    ],
    correctAnswer: "B",
    explanation: "मनुष्य की प्रत्येक कायिक कोशिका में कुल 46 गुणसूत्र (यानी 23 जोड़े गुणसूत्र) होते हैं, जिनमें से 22 जोड़े नर और मादा में समान होते हैं और 23वाँ जोड़ा लिंग निर्धारण गुणसूत्र होता है।"
  },
  {
    id: "mcq-3-03",
    chapterId: "chap-03",
    question: "वीसमैन ने चूहों पर प्रयोग करके किस नियम का खंडन किया था? / Weismann experimented on mice to disprove which theory?",
    options: [
      "प्रभुत्व का नियम / Law of Dominance",
      "उपार्जित गुणों के संचरण का नियम (बीजकोष की निरंतरता) / Transmission of Acquired Traits",
      "पृथक्करण का नियम / Law of Segregation",
      "प्रत्यागमन का नियम / Law of Regression"
    ],
    correctAnswer: "B",
    explanation: "वीसमैन ने कई पीढ़ियों तक चूहों की पूंछ काटी, किंतु अगली पीढ़ी में फिर पूंछ वाले चूहे पैदा हुए। इससे उन्होंने सिद्ध किया कि माता-पिता के उपार्जित गुणों का संचरण अगली संतति में सीधे नहीं होता (बीजकोष की निरंतरता)।"
  },
  {
    id: "mcq-3-04",
    chapterId: "chap-03",
    question: " Trisomy 21 (21वें गुणसूत्र जोड़े की त्रिसूत्रता) के कारण होने वाला विकासात्मक विकार क्या कहलाता है? / Development disorder caused by Trisomy 21 is known as:",
    options: [
      "टर्नर सिंड्रोम / Turner Syndrome",
      "क्लाइनफेल्टर सिंड्रोम / Klinefelter Syndrome",
      "डाउन सिंड्रोम / Down Syndrome",
      "थैलेसीमिया / Thalassemia"
    ],
    correctAnswer: "C",
    explanation: "Trisomy 21 के कारण डाउन सिंड्रोम होता है, जिसमें शिशु के शरीर में सामान्य 46 की जगह 47 गुणसूत्र आ जाते हैं। इससे बच्चा मंदबुद्धि और विशिष्ट शारीरिक बनावट वाला बनता है।"
  },
  {
    id: "mcq-3-05",
    chapterId: "chap-03",
    question: "प्रसिद्ध पुस्तक 'Hereditary Genius' जिसमें आनुवंशिकता के सकारात्मक सिद्धांतों का वर्णन है, किसने लिखी है? / Who is the author of 'Hereditary Genius'?",
    options: [
      "ग्रेगर मेंडल / Gregor Mendel",
      "रॉस / Ross",
      "फ्रांसिस गाल्टन / Francis Galton",
      "अगस्त वीसमैन / August Weismann"
    ],
    correctAnswer: "C",
    explanation: "फ्रांसिस गाल्टन ने 'Hereditary Genius' पुस्तक में बुद्धि और योग्यताओं के पीढ़ी-दर-पीढ़ी हस्तांतरण का गहन अध्ययन प्रस्तुत कर यूजेनिक्स (Eugenic science) की नींव रखी।"
  },

  // Chapter 4: Gender
  {
    id: "mcq-4-01",
    chapterId: "chap-04",
    question: "जेंडर (Gender) निम्नलिखित में से किस प्रकार की संरचना है? / Gender is a/an:",
    options: [
      "जैविक संरचना / Biological construct",
      "सामाजिक संरचना / Social construct",
      "शारीरिक संरचना / Physiological construct",
      "आनुवंशिक गुण / Genetic trait"
    ],
    correctAnswer: "B",
    explanation: "जेंडर स्त्री और पुरुष की सामाजिक भूमिकाओं, व्यवहारों और मान्यताओं से जुड़ा होता है, इसलिए यह एक 'सामाजिक संप्रत्यय' (Social Construct) है।"
  },
  {
    id: "mcq-4-02",
    chapterId: "chap-04",
    question: "यह मानना कि 'लड़कियां गृहकार्य जैसे पाक कला या गुड़िया से खेलने के लिए बनी हैं और लड़के बंदूक या कार के खेल और गणित के लिए' किसका उदाहरण है? / Believing that girls are meant for kitchen and boys are meant for math is an example of:",
    options: [
      "लैंगिक समानता / Gender Equity",
      "लैंगिक पहचान / Gender Identity",
      "लैंगिक रूढ़िबद्धता / Gender Stereotyping",
      "लैंगिक समरूपता / Gender Neutrality"
    ],
    correctAnswer: "C",
    explanation: "स्त्रियों और पुरुषों के लिए समाज द्वारा पहले से निर्धारित और सीमित भूमिकाओं को मानना 'लैंगिक रूढ़िबद्धता' (Gender Stereotyping) कहलाता है।"
  },
  {
    id: "mcq-4-03",
    chapterId: "chap-04",
    question: "कक्षा में लैंगिक पूर्वाग्रह (Gender Bias) से बचने के लिए एक शिक्षक को क्या करना चाहिए? / To avoid Gender Bias in the classroom, what should a teacher do?",
    options: [
      "कठिन कार्यों में केवल लड़कों को अवसर देना चाहिए।",
      "लड़कियों को हमेशा संगीत और लड़कों को खेल में प्रोत्साहित करना चाहिए।",
      "गैर-पारंपरिक भूमिकाओं में दोनों लिंगों को शामिल करना चाहिए।",
      "कक्षा में लड़कियों और लड़कों के बैठने की अलग-अलग व्यवस्था करनी चाहिए।"
    ],
    correctAnswer: "C",
    explanation: "महिलाओं और पुरुषों को उन क्षेत्रों में शामिल करना जो सामान्य सामाजिक परंपराओं के विरुद्ध हों (जैसे पुरुष शेफ या महिला पायलट), लैंगिक पूर्वाग्रह को कम करता है।"
  },

  // Chapter 5: Socialisation
  {
    id: "mcq-5-01",
    chapterId: "chap-05",
    question: "बालक के समाजीकरण का सबसे पहला और प्राथमिक एजेंट कौन सा होता है? / Which of the following is the first and primary agent of socialization of a child?",
    options: [
      "विद्यालय / School",
      "जनसंचार माध्यम / Mass Media",
      "परिवार / Family",
      "धार्मिक स्थल / Religion"
    ],
    correctAnswer: "C",
    explanation: "बालक जन्म के समय केवल जैविक प्राणी होता है और उसका प्रथम संवाद उसके परिवार और माता-पिता के साथ होता है, इसलिए परिवार समाजीकरण की प्राथमिक संस्था है।"
  },
  {
    id: "mcq-5-02",
    chapterId: "chap-05",
    question: "समाजीकरण के संदर्भ में स्कूल (School) और जनसंचार माध्यम (Media) किस प्रकार की एजेंसियां हैं? / In the context of socialization, School and Media are which type of agencies?",
    options: [
      "प्राथमिक एजेंसियाँ / Primary agencies",
      "द्वितीयक एजेंसियाँ / Secondary agencies",
      "हस्तक्षेप चर एजेंसियाँ / Intervening agencies",
      "तीव्र नकारात्मक एजेंसियाँ / Counteractive agencies"
    ],
    correctAnswer: "B",
    explanation: "परिवार के बाहर के सामाजिक नियम, कानून संस्कार बच्चा प्राथमिक काल के बाहर सीखता है, अतः विद्यालय और मास मीडिया' द्वितीयक (Secondary) सामाजिक एजेंसियां हैं।"
  },
  {
    id: "mcq-5-03",
    chapterId: "chap-05",
    question: "समाजशास्त्री रॉबर्ट के. मर्टन (1957) के अनुसार प्रत्याशित समाजीकरण (Anticipatory Socialisation) क्या है? / What is Anticipatory Socialisation according to Robert K. Merton?",
    options: [
      "बचपन में परिवार से सीखे संस्कार / Learning family values in childhood",
      "भविष्य में शामिल होने वाले समूह के तौर-तरीकों को पहले से ही अपनाना / Learning values of a group one wishes to join in future",
      "अतीत की यादों को भूलने की प्रक्रिया / Forgetting past experiences to adapt to present",
      "पड़ोसियों के नियमों को बलपूर्वक स्वीकार करना / Forced compliance of social norms"
    ],
    correctAnswer: "B",
    explanation: "प्रत्याशित समाजीकरण वह प्रक्रिया है जिसमें व्यक्ति भविष्य की भूमिकाओं, पदों या व्यवसायों में शामिल होने के लिए उनके तौर-तरीके और शिष्टाचार पहले से ही सीखने और ढलने लगता है।"
  },

  // Chapter 6: Intelligence and its Theories
  {
    id: "mcq-6-01",
    chapterId: "chap-06",
    question: "बुद्धि लब्धि (IQ) स्कोर की गणना का बिल्कुल सही और आधुनिक सूत्र टर्मन के अनुसार क्या है? / What is the correct formula of Intelligence Quotient (IQ)?",
    options: [
      "IQ = वास्तविक आयु / मानसिक आयु × 100",
      "IQ = मानसिक आयु × वास्तविक आयु / 100",
      "IQ = मानसिक आयु / वास्तविक आयु × 100",
      "IQ = वास्तविक आयु + मानसिक आयु"
    ],
    correctAnswer: "C",
    explanation: "टर्मन (1916) ने विलियम स्टर्न के पुराने सूत्र को संशोधित करके यह वर्तमान सूत्र दिया: (Mental Age / Chronological Age) × 100।"
  },
  {
    id: "mcq-6-02",
    chapterId: "chap-06",
    question: "बुद्धि के 'द्वि-कारक सिद्धांत' (Two-Factor Theory) का प्रतिपादन किसने किया था, जिसके अंतर्गत सामान्य मानसिक योग्यता (G-Factor) और विशिष्ट मानसिक योग्यता (S-Factor) को दर्शाया गया है? / Who propounded the Two-Factor Theory of intelligence?",
    options: [
      "अल्फ्रेड बिने / Alfred Binet",
      "चाार्ल्स स्पीयरमैन / Charles Spearman",
      "ई.एल. थॉर्नडाइक / E.L. Thorndike",
      "हावर्ड गार्डनर / Howard Gardner"
    ],
    correctAnswer: "B",
    explanation: "चार्ल्स स्पीयरमैन (Charles Spearman) ने बुद्धि के दो कारकों का वर्णन किया- G Factor (General) जो जन्मजात और सार्वभौमिक है, तथा S Factor (Specific) जो अभ्यास से अर्जित होता है।"
  },
  {
    id: "mcq-6-03",
    chapterId: "chap-06",
    question: " हावर्ड गार्डनर के बहु-बुद्धि सिद्धांत (Multiple Intelligence Theory) के अनुसार, वह कौन सी बुद्धि है जो स्वयं की भावनाओं, इच्छाओं और सामर्थ्य को गहराई से समझने में सहायक होती है? / According to Howard Gardner, which intelligence is responsible for understanding oneself?",
    options: [
      "अंतर्वैयक्तिक बुद्धि / Interpersonal Intelligence",
      "अंतःवैयक्तिक बुद्धि / Intrapersonal Intelligence",
      "स्थानिक बुद्धि / Spatial Intelligence",
      "तार्किक-गणितीय बुद्धि / Logical-Mathematical Intelligence"
    ],
    correctAnswer: "B",
    explanation: "Intrapersonal (अंतःवैयक्तिक) बुद्धि स्वयं की आंतरिक भावनाओं, कमियों और सामर्थ्य को गहराई से समझने से संबंधित है, जबकि Interpersonal दूसरों को समझने से संबंधित होती है।"
  },
  {
    id: "mcq-6-04",
    chapterId: "chap-06",
    question: "रॉबर्ट स्टर्नबर्ग द्वारा प्रतिपादित बुद्धि के त्रि-चापीय सिद्धांत (Triarchic Theory) की व्यावहारिक बुद्धि (Contextual Intelligence) को अन्य किस नाम से भी जाना जाता है? / Practical intelligence of Sternberg's Triarchic theory is also known as:",
    options: [
      "घटकीय बुद्धि / Componential Intelligence",
      "सृजनात्मक बुद्धि / Experiential Intelligence",
      "सफल/व्यावहारिक बुद्धि या सडक-चतुर बुद्धि / Street-smart or contextual intelligence",
      "संगीत बुद्धि / Musical Intelligence"
    ],
    correctAnswer: "C",
    explanation: "व्यावहारिक बुद्धि (Contextual Intelligence) को 'सफल बुद्धि' या 'स्ट्रीट-स्मार्ट बुद्धि' भी कहते हैं, जो व्यक्ति को दैनिक जीवन की व्यावहारिक समस्याओं से निपटने और वातावरण में अनुकूलन स्थापित करने में मदद करती है।"
  },
  {
    id: "mcq-6-05",
    chapterId: "chap-06",
    question: "प्रसिद्ध गैर-शाब्दिक बुद्धि परफॉर्मेंस टेस्ट 'भाटिया बैटरी' का निर्माण सी.एम. भाटिया द्वारा किस वर्ष किया गया था? / In which year was the famous Bhatia Battery Performance Test of intelligence constructed?",
    options: [
      "वर्ष 1916 / Year 1916",
      "वर्ष 1938 / Year 1938",
      "वर्ष 1955 / Year 1955",
      "वर्ष 1905 / Year 1905"
    ],
    correctAnswer: "C",
    explanation: "सी.एम. भाटिया (C.M. Bhatia) ने वर्ष 1955 में भारत के संदर्भ में 5 उप-परीक्षणों का एक गैर-शाब्दिक बुद्धि निष्पादन बैटरी परीक्षण (Performance Test Battery) निर्मित किया था।"
  }
];

export const COMPLETE_STUDY_TOPICS = [
  ...SEED_CHAPTERS.map(ch => ({
    id: ch.chapterNumber,
    title: `${ch.chapterNumber}. ${ch.chapterHindiTitle} (${ch.chapterTitle})`,
    shortDesc: ch.summary.slice(0, 100) + "...",
    icon: null, // assigned in app
    content: {
      sectionTitle: ch.chapterHindiTitle,
      introduction: ch.summary,
      keyPoints: ch.importantPoints.map((pt, idx) => ({ title: `बिंदु ${idx + 1}`, desc: pt })),
      teachingImplications: "शिक्षक को बाल विकास, बुद्धि सिद्धांतों और आनुवंशिकता की गहरी समझ रखकर हमेशा अपनी शिक्षण शैली को समावेशी, बाल-केंद्रित और अधिगम की गामक आवश्यकताओं के अनुसार ढालना चाहिए।",
      valuableFact: ch.oneLinerRevision[0]
    },
    oneLinerRevision: ch.oneLinerRevision,
    weakTopicTags: ch.weakTopicTags
  }))
];
