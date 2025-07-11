// Sample songs for the flashcard game
// Note: Thai song collection for the flashcard game
// Replace with your own song collection

// Improved Thai text abbreviation function based on advanced rules
const convertToAbbreviation = (lyrics) => {
  // Thai consonant clusters
  const consonantClusters = ["กร", "กล", "กว", "ขร", "ขล", "ขว", "คร", "คล", "คว", "ตร",
                            "ปร", "ปล", "พร", "พล", "ผล", "ทร", "พระ", "อย", "หม", "หล"];
  
  // Tone marks mapping
  const toneMarks = {
    "่": "่",  // mai ek
    "้": "้",  // mai tho
    "๊": "๊",  // mai tri
    "๋": "๋",  // mai chattawa
  };

  // Function to extract abbreviation for a single word
  const extractAbbreviation = (word) => {
    // Keep special markers unchanged
    if (word.match(/^\[.*\]$/) || word === "\\n") {
      return word;
    }

    let tone = "";
    // Extract tone mark (first occurrence only)
    for (const char of word) {
      if (toneMarks[char]) {
        tone = toneMarks[char];
        break;
      }
    }

    // Handle words starting with vowel prefixes
    if ((word.startsWith("เ") || word.startsWith("ไ") || 
         word.startsWith("ใ") || word.startsWith("แ")) && word.length > 1) {
      const nextChar = word[1];
      return nextChar + tone + "อ";
    }

    // Check consonant clusters
    for (const cluster of consonantClusters) {
      if (word.startsWith(cluster)) {
        return cluster + tone + "อ";
      }
    }

    // Default case - first character
    if (word.length > 0) {
      return word[0] + tone + "อ";
    }
    
    return word;
  };

  // Normalize spacing and split into words
  const normalized = lyrics.replace(/\s+/g, " ")
                          .replace(/\\\s*n/g, "\\n")
                          .replace(/\[\s*Hook\s*\]/g, "[Hook]")
                          .replace(/\[\s*Intro\s*\]/g, "[Intro]")
                          .trim();
  
  const words = normalized.split(" ");
  
  // Convert each word and join
  return words.map(extractAbbreviation).join(" ");
};

// Standalone function to abbreviate a single Thai word
const extractAbbreviation = (word) => {
  // Thai consonant clusters
  const consonantClusters = ["กร", "กล", "กว", "ขร", "ขล", "ขว", "คร", "คล", "คว", "ตร",
                            "ปร", "ปล", "พร", "พล", "ผล", "ทร", "พระ", "อย", "หม", "หล"];
  
  // Tone marks mapping
  const toneMarks = {
    "่": "่",  // mai ek
    "้": "้",  // mai tho
    "๊": "๊",  // mai tri
    "๋": "๋",  // mai chattawa
  };

  // Keep special markers unchanged
  if (word.match(/^\[.*\]$/) || word === "\\n") {
    return word;
  }

  let tone = "";
  // Extract tone mark (first occurrence only)
  for (const char of word) {
    if (toneMarks[char]) {
      tone = toneMarks[char];
      break;
    }
  }

  // Handle words starting with vowel prefixes
  if ((word.startsWith("เ") || word.startsWith("ไ") || 
       word.startsWith("ใ") || word.startsWith("แ")) && word.length > 1) {
    const nextChar = word[1];
    return nextChar + tone + "อ";
  }

  // Check consonant clusters
  for (const cluster of consonantClusters) {
    if (word.startsWith(cluster)) {
      return cluster + tone + "อ";
    }
  }

  // Default case - first character
  if (word.length > 0) {
    return word[0] + tone + "อ";
  }
  
  return word;
};

// Example usage function (for testing)
const testAbbreviation = () => {
  console.log("Testing individual words:");
  console.log("สวัสดี →", extractAbbreviation("สวัสดี"));     // "สอ"
  console.log("ครับ →", extractAbbreviation("ครับ"));         // "ครอ" (consonant cluster)
  console.log("เธอ →", extractAbbreviation("เธอ"));           // "ธอ" (vowel prefix)
  console.log("ไทย →", extractAbbreviation("ไทย"));           // "ทอ" (vowel prefix)
  console.log("ดี้ →", extractAbbreviation("ดี้"));           // "ด้อ" (with tone mark)
  console.log("ประเทศ →", extractAbbreviation("ประเทศ"));     // "ประอ" (consonant cluster)
  console.log("[Hook] →", extractAbbreviation("[Hook]"));     // "[Hook]" (unchanged)
  
  console.log("\nTesting full sentences:");
  console.log("สวัสดีครับ ยินดีที่ได้รู้จัก →", convertToAbbreviation("สวัสดีครับ ยินดีที่ได้รู้จัก"));
  console.log("เธอเป็นคนดี →", convertToAbbreviation("เธอเป็นคนดี"));
  console.log("ประเทศไทย →", convertToAbbreviation("ประเทศไทย"));
};

// Uncomment the line below to test the functions
// testAbbreviation();

export const sampleSongs = [
  {
    id: 1,
    type: "song",
    title: "ขาหมู",
    artist: "Tattoo Color",
    lyrics: "[Hook] กลอ ควอ รอ ท่อ ทอ ห้อ รอ ต้อ สอ จอ \nต่อ ยอ ค้อ ยอ คอ จอ หอ มอ รอ ปอ",
    hint: "[Hook] เกลียดความรักที่ทำให้เราต้องเสียใจ\nแต่ยังค้น ยังคอยจะหามันเรื่อยไป"
  },
  { 
    id: 2,
    type: "song",
    title: "โกหก",
    artist: "Tattoo Color",
    lyrics: "[Intro]ทอ ถ้อ คอ พอ จอ อ่อ หวอ ช่อ ย้อ ยอ จอ อ่อ หวอ คอ หวอ \n [Hook] บอ ว่อ รอ รอ รอ ฉอ กอ หอ ท้อ น้อ \n วอ น้อ ทอ อย่อ ฉอ ร้อ ทอ ธอ กอ ออ ถ้อ คอ ทอ ร้อ จอ",
    hint: "[Intro] ทุกถ้อยคำ พูดจา อ่อนหวาน ช่างเย้ายวนใจ อ่อนไหว คำหวาน\n[Hook] บอกว่ารัก รัก รักฉันโกหกทั้งนั้น\nวันนี้ทุกอย่างฉันรู้ทันเธอกลับเอาถ้อยคำทำร้ายใจ"
  },
  {
    id: 3,
    type: "song",
    title: "คุกเข่า",
    artist: "Cocktail",
    lyrics: "[Hook] ฉอ กอ ลอ ขอ ร้อ อ้อ วอ ธอ อย่อ ปอ\n ท้อ ตอ ลอ คอ ข่อ กอ ขอ ธอ ออ ว้อ",
    hint: "[Hook] ฉันกำลังขอร้องอ้อนวอนเธออย่าไป\nทิ้งตัวลงคุกเข่ากอดขาเธอเอาไว้"
  },
  {
    id: 4,
    type: "song",
    title: "คู่ชีวิต",
    artist: "Cocktail",
    lyrics: "[Intro] ธอ คอ ทอ ส่อ นอ ควอ จอ นอ ควอ ฝอ\n คอ ทอ อย่อ หมอ จอ ต้อ กอ\n ธอ ปอ นอ ทอ ท่อ ฉอ อ่อ ก่อ หลอ ตอ ลอ นอ ฝอ",
    hint: "[Intro] เธอคือทุกสิ่ง ในความจริงในความฝัน\nคือทุกอย่างเหมือนใจต้องการ\nเธอเป็นนิทานที่ฉันอ่าน ก่อนหลับตาและนอนฝัน"
  },
  {
    id: 5,
    type: "song",
    title: "ไม่บอกเธอ",
    artist: "Bedroom Audio",
    lyrics: "[Intro] อยอ ขอ ยอ ข้อ ปอ ก้อ ธอ อยอ ร้อ จ้อ ต้อ ต่อ ด้อ จอ\n [Hook] ต่อ บอ ตอ น้อ ม่อ ร้อ จอ รอ ปอ หรอ ม่อ \nกอ ยอ ม่อ ร้อ ว่อ ธอ คอ ช่อ รอ",
    hint: "[Intro] อยากขยับเข้าไปใกล้เธอ อยากรู้จักตั้งแต่ได้เจอ\n[Hook] แต่บอกตอนนี้ไม่รู้จะเร็วไปหรือไม่\nก็ยังไม่รู้ว่าเธอคิดเช่นไร"
  },
  {
    id: 6,
    type: "song",
    title: "Event",
    artist: "Season Five",
    lyrics: convertToAbbreviation(`[Hook] ขอสักคนที่มีหัวใจอยู่ในนั้น\nหัวใจตรงกับฉัน มาความรักฉันไป`),
    hint: "[Hook] ขอสักคนที่มีหัวใจอยู่ในนั้น\nหัวใจตรงกับฉัน มาความรักฉันไป"
  },
  {
    id: 7,
    type: "song",
    title: "ซาโยนาระ",
    artist: "MILD",
    lyrics: convertToAbbreviation(`[Hook] ฉันว่าเราหยุด ก่อนดีไหม ก่อนจะสายไป\nก่อนอะไรอะไรจะเปลี่ยนแปลง หนึ่งคำพูดแรงแรง`),
    hint: "[Hook] ฉันว่าเราหยุด ก่อนดีไหม ก่อนจะสายไป\nก่อนอะไรอะไรจะเปลี่ยนแปลง หนึ่งคำพูดแรงแรง"
  },
  {
    id: 8,
    type: "song",
    title: "ยินดีที่ไม่รู้จัก",
    artist: "25hours",
    lyrics: convertToAbbreviation(`[Intro] ไม่รู้ว่าเธอเป็นใคร ไม่รู้ว่าฉันเป็นใคร\nไม่รู้ว่าโลกความจริง ของเรานั้นเป็นอย่างไร`),
    hint: "[Intro] ไม่รู้ว่าเธอเป็นใคร ไม่รู้ว่าฉันเป็นใคร\nไม่รู้ว่าโลกความจริง ของเรานั้นเป็นอย่างไร"
  },
  {
    id: 9,
    type: "song",
    title: "ซ่อนกลิ่น",
    artist: "Palmy",
    lyrics: convertToAbbreviation(`[Hook] คงไว้ได้แค่กลิ่น ที่ไม่เคยเลือนลา\nยังหอมดังวันเก่า ยามเมื่อลมโชยมา`),
    hint: "[Hook] คงไว้ได้แค่กลิ่น ที่ไม่เคยเลือนลา\nยังหอมดังวันเก่า ยามเมื่อลมโชยมา"
  },
  {
    id: 10,
    type: "song",
    title: "เรือเล็กควรออกจากฝั่ง",
    artist: "BodySlam",
    lyrics: convertToAbbreviation(`[Hook] จะออกไปแตะขอบฟ้า\nสุดท้ายแม้โชคชะตาไม่เข้าใจ`),
    hint: "[Hook] จะออกไปแตะขอบฟ้า\nสุดท้ายแม้โชคชะตาไม่เข้าใจ"
  },
  {
    id: 11,
    type: "song",
    title: "มันเป็นใคร",
    artist: "Polycat",
    lyrics: convertToAbbreviation(`[Hook] เธอเป็นคนเดียวที่ไม่ควรเสียใจ\nจะตามไปจนได้เจอว่าเขามันเป็นใคร`),
    hint: "[Hook] เธอเป็นคนเดียวที่ไม่ควรเสียใจ\nจะตามไปจนได้เจอว่าเขามันเป็นใคร"
  },
  {
    id: 12,
    type: "song",
    title: "คำยินดี",
    artist: "Klear",
    lyrics: convertToAbbreviation(`[Hook] ขอให้ความรัก มีแต่ความสุขใจ\nไม่ว่าสิ่งไหน เข้ากันหมดทุกอย่าง`),
    hint: "[Hook] ขอให้ความรัก มีแต่ความสุขใจ\nไม่ว่าสิ่งไหน เข้ากันหมดทุกอย่าง"
  },
  {
    id: 13,
    type: "song",
    title: "นิทาน",
    artist: "Musketeers",
    lyrics: convertToAbbreviation(`[Hook] มันก็เลยต้องปีน ปีนให้สูงขึ้นไป\nไม่ว่าสูงเท่าใด (ลาลาลา ล้าลาลาลา)`),
    hint: "[Hook] มันก็เลยต้องปีน ปีนให้สูงขึ้นไป\nไม่ว่าสูงเท่าใด (ลาลาลา ล้าลาลา)"
  },
  {
    id: 14,
    type: "song",
    title: "ภาพถ่ายวันวาน",
    artist: "Purpeech",
    lyrics: convertToAbbreviation(`[Intro] เรื่องราวแห่งความรัก ครั้งหนึ่ง\nที่เปื้อนด้วยรอยยิ้มและมีน้ำตาให้กับมัน\nหากเปรียบดั่งดวงดาว คงสวยงาม\nประดับประดาด้วยเรื่องราวที่คิดถึง`),
    hint: "[Intro] เรื่องราวแห่งความรัก ครั้งหนึ่ง\nที่เปื้อนด้วยรอยยิ้มและมีน้ำตาให้กับมัน\nหากเปรียบดั่งดวงดาว คงสวยงาม\nประดับประดาด้วยเรื่องราวที่คิดถึง"
  },
  {
    id: 15,
    type: "song",
    title: "จดจำ",
    artist: "Only Monday",
    lyrics: convertToAbbreviation(`[Hook] ได้แต่จดจำวันที่ดีที่มีเธออยู่ในหัวใจ\nต่อให้มันจะเจ็บเท่าไรแค่มีเธออยู่ในหัวใจ`),
    hint: "[Hook] ได้แต่จดจำวันที่ดีที่มีเธออยู่ในหัวใจ\nต่อให้มันจะเจ็บเท่าไรแค่มีเธออยู่ในหัวใจ"
  },
  {
    id: 16,
    type: "song",
    title: "อ้าว",
    artist: "Atom ชนกันต์",
    lyrics: convertToAbbreviation(`[Intro] บีบเข้าไป บีบน้ำตาแล้วบีบมือฉัน ขอร้องให้เห็นใจ\n[Hook] อ้าวเฮ้ย ไม่เหมือนที่คุยกันไว้นี่หน่า\nที่บอกว่าเธอจะเลือกเขาและไม่มีวันกลับมา`),
    hint: "[Intro] บีบเข้าไป บีบน้ำตาแล้วบีบมือฉัน ขอร้องให้เห็นใจ\n[Hook] อ้าวเฮ้ย ไม่เหมือนที่คุยกันไว้นี่หน่า\nที่บอกว่าเธอจะเลือกเขาและไม่มีวันกลับมา"
  },
  {
    id: 17,
    type: "song",
    title: "ทางของฝุ่น",
    artist: "Atom ชนกันต์",
    lyrics: convertToAbbreviation(`[Intro] อย่าให้ฉันรั้ง เธอไว้เลย\nจากตรงนี้ยังอีกไกล ยังมีฝันที่เธอต้องไขว่ ต้องคว้า\n[Hook] ที่เธอเห็นแค่ฝุ่นมันเข้าตา ฉันไม่ได้ร้องไห้\nอย่ามองกลับมา อย่าห่วงว่าฉันจะเสียใจ`),
    hint: "[Intro] อย่าให้ฉันรั้ง เธอไว้เลย\nจากตรงนี้ยังอีกไกล ยังมีฝันที่เธอต้องไขว่ ต้องคว้า\n[Hook] ที่เธอเห็นแค่ฝุ่นมันเข้าตา ฉันไม่ได้ร้องไห้\nอย่ามองกลับมา อย่าห่วงว่าฉันจะเสียใจ"
  },
  {
    id: 18,
    type: "song",
    title: "เพื่อนเล่น ไม่เล่นเพื่อน",
    artist: "Tilly Bird",
    lyrics: convertToAbbreviation(`[Intro] หยุดคิดแบบนี้ หยุดคิดเลย\nรู้สึกดีทั้งที่เป็นแค่เพื่อนกัน\n[Hook] ถ้าเธอให้ฉันเป็นเพื่อนเล่น\nอย่าเล่นเกินกว่านั้นได้ไหม`),
    hint: "[Intro] หยุดคิดแบบนี้ หยุดคิดเลย\nรู้สึกดีทั้งที่เป็นแค่เพื่อนกัน\n[Hook] ถ้าเธอให้ฉันเป็นเพื่อนเล่น\nอย่าเล่นเกินกว่านั้นได้ไหม"
  },
  {
    id: 19,
    type: "song",
    title: "ฝันถึงแฟนเก่า",
    artist: "Three Man Down",
    lyrics: convertToAbbreviation(`[Intro] ในกลางดึกคืนหนึ่งฉันฝันถึงเธอ\nภาพเธอยังคงสวยงามอย่างเคย\n[Hook] ได้แต่สงสัยว่าถ้าวันนั้น ฉันไม่ทำเธอเสียใจ\nเราจะยังคบกันอยู่ไหม เธอยังจะรักฉันใช่ไหม`),
    hint: "[Intro] ในกลางดึกคืนหนึ่งฉันฝันถึงเธอ\nภาพเธอยังคงสวยงามอย่างเคย\n[Hook] ได้แต่สงสัยว่าถ้าวันนั้น ฉันไม่ทำเธอเสียใจ\nเราจะยังคบกันอยู่ไหม เธอยังจะรักฉันใช่ไหม"
  },
  {
    id: 20,
    type: "song",
    title: "เคลิ้ม",
    artist: "Slot Machine",
    lyrics: convertToAbbreviation(`[Hook] หัวใจดวงนี้ไม่หลาบจำ เหมือนโดนซ้ำ ๆ แล้วสะใจ\nหัวใจนี่มันงมงาย ตักเตือนไม่เคยฟังกัน\nเหมือนโดนเท่านั้นยังไม่พอ ขอยอมเจ็บช้ำมันต่อไปหัวใจเจ้ากรรมนั้นไซร้ เฝ้าคอยทำร้ายตัวเอง`),
    hint: "[Hook] หัวใจดวงนี้ไม่หลาบจำ เหมือนโดนซ้ำ ๆ แล้วสะใจ\nหัวใจนี่มันงมงาย ตักเตือนไม่เคยฟังกัน\nเหมือนโดนเท่านั้นยังไม่พอ ขอยอมเจ็บช้ำมันต่อไปหัวใจเจ้ากรรมนั้นไซร้ เฝ้าคอยทำร้ายตัวเอง"
  },
  {
    id: 21,
    type: "song",
    title: "จันทร์เจ้า",
    artist: "Slot Machine",
    lyrics: convertToAbbreviation(`[Intro] วันที่เรานั้นเคยเอ่ยคำร่ำลา\nเป็นคำสัญญาย้ำเตือนความทรงจำ`),
    hint: "[Intro] วันที่เรานั้นเคยเอ่ยคำร่ำลา\nเป็นคำสัญญาย้ำเตือนความทรงจำ"
  },
  {
    id: 22,
    type: "song",
    title: "ฤดูร้อน",
    artist: "Paradox",
    lyrics: convertToAbbreviation(`[Hook] ยืนมองท้องฟ้าไม่เป็นเช่นเคย\nฤดูร้อนไม่มีเธอเหมือนก่อนเหมือนเก่าขาดเธอ`),
    hint: "[Hook] ยืนมองท้องฟ้าไม่เป็นเช่นเคย\nฤดูร้อนไม่มีเธอเหมือนก่อนเหมือนเก่าขาดเธอ"
  },
  {
    id: 23,
    type: "song",
    title: "ความจริง",
    artist: "Room39",
    lyrics: convertToAbbreviation(`[Hook] อย่าลืมความจริงที่ เธอเคยทิ้งเราไป\nอย่าลืมความจริงที่ มันไม่มีทาง\nกับความรักที่เราต้องเจ็บ และใช้น้ำตาล้างทุกอย่าง\nให้ลบเลือน อย่าลืมว่าความจริงเป็นอย่างไร`),
    hint: "[Hook] อย่าลืมความจริงที่ เธอเคยทิ้งเราไป\nอย่าลืมความจริงที่ มันไม่มีทาง\nกับความรักที่เราต้องเจ็บ และใช้น้ำตาล้างทุกอย่าง\nให้ลบเลือน อย่าลืมว่าความจริงเป็นอย่างไร"
  },
  {
    id: 24,
    type: "song",
    title: "ไกลแค่ไหนคือใกล้",
    artist: "Getsunova",
    lyrics: convertToAbbreviation(`[Intro] พยายามจะทำวิธีต่าง ๆ ให้เธอนั้นรักฉัน\nพยายามทุกวัน มอบให้ทุกอย่างที่เธอต้องการ\n[Hook] อีกไกลแค่ไหนจนกว่าฉันจะใกล้บอกที\nอีกไกลแค่ไหนจนกว่าเธอจะรักฉันเสียที`),
    hint: "[Intro] พยายามจะทำวิธีต่าง ๆ ให้เธอนั้นรักฉัน\nพยายามทุกวัน มอบให้ทุกอย่างที่เธอต้องการ\n[Hook] อีกไกลแค่ไหนจนกว่าฉันจะใกล้บอกที\nอีกไกลแค่ไหนจนกว่าเธอจะรักฉันเสียที"
  },
  {
    id: 25,
    type: "song",
    title: "อยู่ต่อเลยได้ไหม",
    artist: "สิงโต นำโชค",
    lyrics: convertToAbbreviation("[Intro] มองไปก็มีแต่ฝนโปรยปราย\nในหัวใจก็มีแต่ความเหน็บหนาว\n[Hook] อยู่ต่อเลยได้ไหม\nอย่าปล่อยให้ตัวฉันไป\nเธอก็รู้ทั้งหัวใจฉันอยู่ที่เธอหมดแล้วตอนนี้"),
    hint: "[Intro] มองไปก็มีแต่ฝนโปรยปราย\nในหัวใจก็มีแต่ความเหน็บหนาว\n[Hook] อยู่ต่อเลยได้ไหม\nอย่าปล่อยให้ตัวฉันไป\nเธอก็รู้ทั้งหัวใจฉันอยู่ที่เธอหมดแล้วตอนนี้"
  },
  {
    id: 26,
    type: "song",
    title: "สลักจิต",
    artist: "ป๊อบ ปองกูล",
    lyrics: convertToAbbreviation("[Hook] ยังแอบนัดพบเจอกับเธอบางคืนในฝัน\nแอบอิงซบบนเงาของเธอในอ้อมกอดเขา\nแม้นานเท่าไหร่ไม่เคยได้พบเจอ\nก็ไม่เคยเลือนลบเธอไปจากความทรงจำ\nแอบเอาเธอนั้นฝังไว้ในใจ"),
    hint: "[Hook] ยังแอบนัดพบเจอกับเธอบางคืนในฝัน\nแอบอิงซบบนเงาของเธอในอ้อมกอดเขา\nแม้นานเท่าไหร่ไม่เคยได้พบเจอ\nก็ไม่เคยเลือนลบเธอไปจากความทรงจำ\nแอบเอาเธอนั้นฝังไว้ในใจ"
  },
  {
    id: 27,
    type: "song",
    title: "เหมือนวิวาห์",
    artist: "Jeff Satur",
    lyrics: convertToAbbreviation(`[Hook] ยามเมื่อฝน เทลงมา เดาว่าฟ้านั้นอวยพร\nให้ความรักเราทั้งสองครองคู่ไปนิรันดร\nฮักเจ้าหลาย ฮักเจ้าหลาย จงยื่นมือให้ฟ้าท่านเถิด\nฝนที่เทลงบนมือเราดั่งงานวิวาห์`),
    hint: "[Hook] ยามเมื่อฝน เทลงมา เดาว่าฟ้านั้นอวยพร\nให้ความรักเราทั้งสองครองคู่ไปนิรันดร\nฮักเจ้าหลาย ฮักเจ้าหลาย จงยื่นมือให้ฟ้าท่านเถิด\nฝนที่เทลงบนมือเราดั่งงานวิวาห์"
  },
  {
    id: 28,
    type: "song",
    title: "ถอย",
    artist: "Gliss",
    lyrics: convertToAbbreviation("[Intro] ฉันเคยเป็นดั่งคนที่เธอรัก ที่เธอเคยมอบความรัก แต่เหมือนหัวใจวันนี้เธอเปลี่ยนไป\n[Hook] ฉันเลยถอยไปอยู่ตรงนั้นตรงที่ไม่มีใครให้กอด\nเลยถอยไปอยู่ตรงนั้นพบความลำพังเหมือนครั้งก่อน\nเหมือนตอนที่ไม่มีใคร ฉัน ยังทนได้"),
    hint: "[Intro] ฉันเคยเป็นดั่งคนที่เธอรัก ที่เธอเคยมอบความรัก แต่เหมือนหัวใจวันนี้เธอเปลี่ยนไป\n[Hook] ฉันเลยถอยไปอยู่ตรงนั้นตรงที่ไม่มีใครให้กอด\nเลยถอยไปอยู่ตรงนั้นพบความลำพังเหมือนครั้งก่อน\nเหมือนตอนที่ไม่มีใคร ฉัน ยังทนได้"
  },
  {
    id: 29,
    type: "song",
    title: "ขอใจเธอแลกเบอร์โทร",
    artist: "หญิงลี ศรีจุมพล",
    lyrics: convertToAbbreviation(`[Hook] ท่านกำลังเข้าสู่บริการรับฝาก หัวใจ\nลงทะเบียนฝากไว้ตัวเอากลับไป ใจให้เก็บรักษา\nยอมจำนนเธอแล้ววันนี้แค่แรก เห็นหน้า\nฝากไว้กับฉันนะหัวใจของเธอ แลกเบอร์โทร โอ๊ะ โอ โอย`),
    hint: "[Hook] ท่านกำลังเข้าสู่บริการรับฝาก หัวใจ\nลงทะเบียนฝากไว้ตัวเอากลับไป ใจให้เก็บรักษา\nยอมจำนนเธอแล้ววันนี้แค่แรก เห็นหน้า\nฝากไว้กับฉันนะหัวใจของเธอ แลกเบอร์โทร โอ๊ะ โอ โอย"
  },
  {
    id: 30,
    type: "song",
    title: "เธอเก่ง",
    artist: "Unknown",
    lyrics: convertToAbbreviation("[Verse] เธอเก่งที่ทำให้ฉันยังจำเธอไม่ลืม\nเธอเก่งที่ทำให้ฉันดื่มด่ำกับความทุกข์ทน\n[Hook] ฉันแพ้ให้เธอทุกทาง โอ้ที่รัก\nฉันแพ้ให้เธอทุกทาง หมดหัวใจ"),
    hint: "[Verse] เธอเก่งที่ทำให้ฉันยังจำเธอไม่ลืม\nเธอเก่งที่ทำให้ฉันดื่มด่ำกับความทุกข์ทน\n[Hook] ฉันแพ้ให้เธอทุกทาง โอ้ที่รัก\nฉันแพ้ให้เธอทุกทาง หมดหัวใจ"
  }
];

// Helper function to get a random song
export const getRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * sampleSongs.length);
  return sampleSongs[randomIndex];
};

// Helper function to shuffle songs
export const shuffleSongs = (songs) => {
  return [...songs].sort(() => Math.random() - 0.5);
}; 