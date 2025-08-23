let language = "cz";

function switch_languages() {
  var cz = document.getElementsByClassName("cz");
  var eng = document.getElementsByClassName("eng");
  if (language == "cz") {
    language = "eng";
    document.getElementById("cz").style.fontWeight = "normal";
    document.getElementById("eng").style.fontWeight = "bold";
    for (let i = 0; i < cz.length; i++) cz[i].style.display = "none";
    for (let i = 0; i < eng.length; i++) eng[i].style.display = "inline";
  } else if (language == "eng") {
    language = "cz";
    document.getElementById("cz").style.fontWeight = "bold";
    document.getElementById("eng").style.fontWeight = "normal";
    for (let i = 0; i < cz.length; i++) cz[i].style.display = "inline";
    for (let i = 0; i < eng.length; i++) eng[i].style.display = "none";
  }
  localStorage.setItem("language", language);
  additional_translation();
}
function additional_translation() {} // function to be defined in other file
