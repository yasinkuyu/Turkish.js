Turkish.js
==========

### Turkish Suffix Library for Javascript

## Install 

## Using
    
    // require("Turkish");

    console.log(makeGenitive("Öykü", { proper_noun : true } ));
    console.log(makeDative("Fatma", { proper_noun : true } ));
    console.log(makeDative("Yasin", { proper_noun : true } ));
    console.log(makeDative("ALİ", { proper_noun : true } ));
    console.log(makeAblative("Ali", { proper_noun : true } ));
    console.log(makeAccusative("Kaliningrad", { proper_noun : true } ));

    console.log(makeGenitive("ağaç", { proper_noun : false } ));
    console.log(makeAccusative("erik", { proper_noun : false } ));
    console.log(makeAccusative("Erik", { proper_noun : true } ));

    console.log(possessiveAffix("kavanoz", { person : "1", quantity : "singular" } ));
    console.log(possessiveAffix("kavanoz", {  person : "2", quantity : "singular"} ));
    console.log(possessiveAffix("kavanoz", {  person : "3", quantity : "singular"} ));

    console.log(possessiveAffix("halter", {  person : "1", quantity : "plural"} ));
    console.log(possessiveAffix("halter", {  person : "2", quantity : "plural"} ));
    console.log(possessiveAffix("halter", {  person : "3", quantity : "plural"} ));

    console.log(possessiveAffix("Kenya", {  person : "3", quantity : "plural"} ));
        
# Output
    
    Öykü'nün 
    Fatma'ya 
    Yasin'e 
    ALİ'YE 
    Ali'den 
    Kaliningrad'ı
    ağacın
    eriği
    Erik'i
    kavanozum
    kavanozun
    kavanozu
    halterimiz
    halteriniz
    halterleri
    Kenyaları 

## Turkish Grammar
 * Turkish is a highly agglutinative language, i.e., Turkish words have many grammatical suffixes or endings that determine meaning. Turkish vowels undergo vowel harmony. When a suffix is attached to a stem, the vowel in the suffix agrees in frontness or backness and in roundedness with the last vowel in the stem. Turkish has no gender.
 * [More Info](http://en.wikipedia.org/wiki/Turkish_grammar)

## Author
 * Yasin Kuyu
 * [Follow me at Twitter](http://twitter.com/yasinkuyu)

  
      C# Version
      https://github.com/yasinkuyu/Turkish.cs
      
      Python Version
      https://github.com/miklagard/Turkish-Suffix-Library
