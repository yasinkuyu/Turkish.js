/*
 * Yasin Kuyu
 * twitter/yasinkuyu
 * 01/08/2014
 *
 * Turkish Suffix Library for Javascript
 * Türkçe Çekim ve Yapım Ekleri
 *
 */
'use strict';

    var VOWELS = "aıoöuüei";
    var FRONT_VOWELS = "aıou";
    var BACK_VOWELS = "eiöü";
    var HARD_CONSONANTS = "fstkçşhp";
    var DISCONTINIOUS_HARD_CONSONANTS = "pçtk";
    var SOFTEN_DHC = "bcdğ";
    var DISCONTINIOUS_HARD_CONSONANTS_AFTER_SUFFIX = "pçk";
    var SOFTEN_DHC_AFTER_SUFFIX = "bcğ";

    var MINOR_HARMONY = { 
         "a": "ı",
         "e": "i",
         "ö": "ü",
         "o": "u",
         "ı": "ı",
         "i": "i",
         "u": "ı",
         "ü": "ü"
    };

    var MINOR_HARMONY_FOR_FUTURE = {
        "a": "a",
        "e": "e",
        "ö": "e",
        "o": "a",
        "ı": "a",
        "i": "e",
        "u": "a",
        "ü": "e"
    };

    var EXCEPTION_WORDS = [
        "kontrol", "bandrol", "banal", "alpul", "ametal", "anormal", "amiral",
        "sadakat", "santral", "şefkat", "usul", "normal", "oryantal", "hakikat",
        "hayal", "saat", "kemal", "gol", "kalp", "metal", "faul", "mineral", "alkol",
        "misal", "meal", "oramiral", "tuğamiral", "orjinal", "koramiral", "general",
        "tümgeneral", "tuğgeneral", "korgeneral", "petrol", "liberal", "meral",
        "metrapol", "ekümenapol", "lokal", "lügat", "liyakat", "legal", "mentol",
        "beşamol", "meşgul", "meşekkat", "oval", "mahsul", "makul", "meraşal",
        "metaryal", "nasihat", "radikal", "moral", "dikkat", "rol", "sinyal",
        "sosyal", "total", "şevval", "sual", "spesiyal", "tuval", "turnusol", "hol",
        "tropikal", "zeval", "zelal", "terminal", "termal", "resul", "sadakat", "resital",
        "refakat", "pastoral", "hal", "müzikal", "müzikhol", "menkul", "mahmul", "maktul",
        "kolestrol", "kıraat", "ziraaat", "kapital", "katedral", "kabul", "kanaat", "jurnal",
        "kefal", "idrak", "istiklal", "integral", "final", "ekol", "emsal", "enternasyonal",
        "nasyonal", "enstrümantal", "harf", "cemal", "cemaat", "glikol", "karambol", "parabol", "kemal"
    ];
    
    var EXCEPTION_MISSING = { 
        "isim": "ism" ,
        "kasır": "kasr" ,
        "kısım": "kısm" ,
        "af": "aff",
        "ilim": "ilm",
        // "hatır": "hatr", # for daily usage only
        "boyun": "boyn",
        "nesil": "nesl",
        "koyun": "koyn", // koyun (sheep) or koyun (bosom)? for koyun (sheep) there is no exception but for koyun (bosom) there is. aaaaargh turkish!!
        "karın": "karn" // same with this, karın (your wife) or karın (stomach)? for karın (your wife) there is not a such exception
        //{ katli, katle, katli etc. it doesn't really have a nominative case but only with suffixes?
    };

    function lastVowel(word)
    {
        word = word.makeLower();

        var returndata = { letter : '', tone: ''};
        var vowel_count = 0;
        
        for (var i = 0; i < word.split('').length; i++) // Todo
        {
            if (FRONT_VOWELS.contains(word[i]))
            {
                vowel_count++;
                returndata = { letter : word[i], tone : "front" };
            }
            else if (BACK_VOWELS.contains(word[i]))
            {
                vowel_count++;
                returndata = { letter : word[i], tone : "back" };
            }
        }
        
        // fake return for exception behaviour in Turkish
        if (EXCEPTION_WORDS.contains(word))
        {
            if (returndata.letter == "o")
                returndata = { letter : "ö", tone : "back" };
            else if (returndata.letter == "a")
                returndata = { letter : "e", tone : "back" };
            else if (returndata.letter == "u")
                returndata = { letter : "ü", tone : "back" };
        }
        
        if (returndata == "")
            returndata = { letter : "", tone : "back" };

        returndata["vowel_count"] = vowel_count;
        
        return returndata;
    }
        
    function lastLetter(word)
    {

        word = word.makeLower();
        
        var returndata = {};
        var getLastLetter = word.substring(word.length - 1);

        if (getLastLetter == "'")
            getLastLetter = word.substring(word.length - 2).charAt(0); // Todo

        returndata["letter"] = getLastLetter;

        if (VOWELS.contains(getLastLetter))
        {
            returndata["vowel"] = true;

            if (FRONT_VOWELS.contains(getLastLetter))
                returndata["front_vowel"] = true;
            else
                returndata["back_vowel"] = true;
        }

        else
        {
            returndata['consonant'] = true;

            if (HARD_CONSONANTS.contains(getLastLetter))
            {
                returndata['hard_consonant'] = true;

                returndata["discontinious_hard_consonant_for_suffix"] = false;
    
                if (DISCONTINIOUS_HARD_CONSONANTS_AFTER_SUFFIX.contains(getLastLetter))
                {
                    returndata["discontinious_hard_consonant_for_suffix"] = true;
                    getLastLetter = SOFTEN_DHC_AFTER_SUFFIX[DISCONTINIOUS_HARD_CONSONANTS_AFTER_SUFFIX.lastIndexOf(getLastLetter)];
                    returndata["soften_consonant_for_suffix"] = getLastLetter;
                }
            }
        }
        
        return returndata;
    }

    function makeInfinitive(word)
    {
        return lastVowel(word).tone == "front" ? word.concat("mak") : word.concat("mek");
    }   
 
    function makePlural(word, param)
    {
        if (param.proper_noun) 
            word += "'";

        return lastVowel(word).tone == "front" ? word.concat("lar") : word.concat("ler");
    }

    function makeAccusative(word, param)
    {
        //firslty exceptions for o (he/she/it) 
        var lowerWord = word.makeLower();

        if (lowerWord == "o")
            return param.proper_noun == true ? word.fromUpperOrLower("O'nu") : word.fromUpperOrLower("onu");
        else
        {
            if (EXCEPTION_MISSING.hasOwnProperty(lowerWord) && param.proper_noun)
            {
                word = word.fromUpperOrLower(EXCEPTION_MISSING[lowerWord]);
                lowerWord = word.makeLower();
            }

            var getLastLetter = lastLetter(word);
            var getLastVowel = lastVowel(word);

            if (param.proper_noun) 
                word += "'";

            if (getLastLetter.vowel)
                word = word.concat("y");
            else if (getLastLetter.discontinious_hard_consonant_for_suffix && param.proper_noun == false)
            {
                if (getLastVowel.vowel_count > 1)
                    word = word.substring(0, word.length - 1).concat(getLastLetter.soften_consonant_for_suffix);
            }

            word = word.concat(MINOR_HARMONY[getLastVowel.letter]); //ToDo check
        }

        return word;
    }
  
    function makeDative(word, param)
    {
        
        //firslty exceptions for ben (I) and you (sen)
        var returndata;
        var lowerWord = word.makeLower();

        if (param.proper_noun)
            word += "'";

        if (lowerWord == "ben" && param.proper_noun == false)
            returndata = word.fromUpperOrLower("bana");
        else if (lowerWord == "sen" && param.proper_noun == false)
            returndata = word.fromUpperOrLower("sana");
        else
        {
            if (EXCEPTION_MISSING.hasOwnProperty(lowerWord) &&  param.proper_noun == false)
            {
                word = word.fromUpperOrLower(EXCEPTION_MISSING[lowerWord]);
                lowerWord = word.makeLower();
            }
            
            var getLastLetter = lastLetter(word);
            var getLastVowel = lastVowel(word);
            
            if (getLastLetter.vowel)
                word = word.concat("y");
            else if (getLastLetter.discontinious_hard_consonant_for_suffix == true)
            {
                if (getLastVowel.vowel_count > 1 && param.proper_noun == false)
                    word = word.substring(0, word.length - 1).concat(getLastLetter.soften_consonant_for_suffix);
            }

            if (getLastVowel.tone == "front")
                word = word.concat("a");
            else
                word = word.concat("e");

            returndata = word;
        }

        if (returndata.isUpper())
            returndata = returndata.makeUpper();

        return returndata;
    }

    function makeGenitive(word, param)
    {

        var getLastLetter = lastLetter(word);
        var getLastVowel = lastVowel(word);

        var lowerWord = word.makeLower();

        if (param.proper_noun)
            word += "'";
        
        if (EXCEPTION_MISSING.hasOwnProperty(lowerWord))
        {
            word = word.fromUpperOrLower(EXCEPTION_MISSING[lowerWord]);
            lowerWord = word.makeLower();
        }

        if (getLastLetter.vowel == true)
            word = word.concat("n");
        else if (getLastLetter.discontinious_hard_consonant_for_suffix && param.proper_noun == false)
        {
            if (getLastVowel.vowel_count > 1)
                word = word.substring(0, word.length - 1).concat(getLastLetter.soften_consonant_for_suffix); //ToDo: Check
        }
        
        var letter = getLastVowel.letter;
        
        word = word.concat(MINOR_HARMONY[letter]); //ToDo: Check
        word = word.concat("n");

        return word;
    }

    function makeAblative(word, param)
    {

        var getLastLetter = lastLetter(word);
        var getLastVowel = lastVowel(word);

        if (param.proper_noun)
            word += "'";

        if (HARD_CONSONANTS.contains(getLastLetter.letter))
            word = word.concat("t");
        else
            word = word.concat("d");

        if (getLastVowel.tone == "front")
            word = word.concat("an");
        else
            word = word.concat("en");

        return word;
    }
    
    function makeLocative(word, param)
    {

        var getLastLetter = lastLetter(word);
        var getLastVowel = lastVowel(word);

        if (param.proper_noun)
            word += "'";

        if (HARD_CONSONANTS.contains(getLastLetter.letter)) //ToDo: Check
            word = word.concat("t");
        else
            word = word.concat("d");

        if (getLastVowel.tone == "front")
            word = word.concat("a");
        else
            word = word.concat("e");

        return word;
    }

    // İyelik ekleri
    function possessiveAffix(word, param)
    {

        var person = param.person;
        var quantity = param.quantity;
            
        var getLastLetter = {};
        var getLastVowel = {};

        if (person != "3" && quantity != "plural") // Todo
        {
            getLastLetter = lastLetter(word);
            getLastVowel = lastVowel(word);
            
            if (param.proper_noun)
                word += "'";
            else if (getLastLetter.discontinious_hard_consonant_for_suffix)
            {
                if (getLastVowel.vowel_count > 1)
                    word = word.substring(0, word.length - 1).concat(getLastLetter.soften_consonant_for_suffix);

                if (EXCEPTION_MISSING.hasOwnProperty(word.makeLower())) // Todo
                    word = word.fromUpperOrLower(EXCEPTION_MISSING[word.makeLower()]);
            }
        }

        getLastLetter = lastLetter(word);
        getLastVowel = lastVowel(word);
        
        var lastLetterIsVowel = VOWELS.contains(getLastLetter.letter); // Todo: bool

        var letter = getLastVowel.letter;
        var minorHarmonyLetter = MINOR_HARMONY[letter];
        
        if (quantity == "singular")
        {
            if (lastLetterIsVowel == false)
                word = word.concat(minorHarmonyLetter);

            if (person == "1")
                word = word.concat("m");

            else if (person == "2")
                word = word.concat("n");
        }
        else
        {
            if (person == "1")
            {
                if (lastLetterIsVowel == false)
                    word = word.concat(minorHarmonyLetter);

                word = word.concat("m");
                word = word.concat(minorHarmonyLetter);
                word = word.concat("z");
            }
            else if (person == "2")
            {
                if (lastLetterIsVowel == false)
                    word = word.concat(minorHarmonyLetter);

                word = word.concat("n");
                word = word.concat(minorHarmonyLetter);
                word = word.concat("z");
            }
            else
            {
                if (word.makeLower() == "ism")
                    word = word.fromUpperOrLower("isim");
                
                word = makePlural(word, { proper_noun : true });
                word = word.concat(minorHarmonyLetter);
            }

        }
        
        return word;
    }

    String.prototype.isUpper = function() {
        var word = this;
        word = word.replace("ı", "i").replace("İ", "I").replace("ş", "s").replace("Ş", "S")
                   .replace("ğ", "g").replace("Ğ", "G").replace("ü", "u").replace("Ü", "U")
                   .replace("ç", "c").replace("Ç", "C").replace("ö", "o").replace("Ö", "O");
        
        return word.toUpperCase() === word;
    };   

    String.prototype.makeLower = function() {
        return this.replace("İ", "i").replace("I", "ı").toLowerCase();
    }; 

    String.prototype.makeUpper = function() {
        return this.replace("i", "İ").replace("ı", "I").toUpperCase();
    }; 

    String.prototype.concat = function(str) {
        return this.isUpper() ? this + str.makeUpper() : this + str; 
    }; 

    String.prototype.fromUpperOrLower = function(refWord) {
        
        var newWord = this;
        var returndata;

        if (refWord.substring(refWord.length - 1).isUpper())
            returndata = newWord.makeUpper();
        else
        {
            if ((refWord.substring(0)).isUpper()) // Todo
                returndata = newWord.substring(0).makeUpper() + newWord.substring(1, newWord.length - 1).makeLower();  // Todo
            else
                returndata = newWord.makeLower();
        }
          
        return returndata;
    };  

    String.prototype.contains = function(str, ignoreCase) {
      return (ignoreCase ? this.toUpperCase() : this)
        .indexOf(ignoreCase ? str.toUpperCase() : str) >= 0;
    };

    Array.prototype.contains = function ( str ) {
       for (var i in this) {
           if (this[i] == str) return true;
       }
       return false;
    }
