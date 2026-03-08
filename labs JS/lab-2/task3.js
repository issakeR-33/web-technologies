function transferGradeToText(grade) {
    if (grade >= 90 && grade <= 100) {
        return "Відмінно";
    } 
    else if (grade >= 75) {
        return "Добре";
    } 
    else if (grade >= 60) {
        return "Задовільно";
    } 
    else if (grade <= 59) {
        return "Незадовільно";
    }
    else {
        return "Невірна оцінка";
    }
}

console.log(transferGradeToText(85),"\n");


function transferGradeToTextShort(grade) {
    return grade >= 90 ? "Відмінно" :
           grade >= 75 ? "Добре" :
           grade >= 60 ? "Задовільно" : 
           grade<=59 ?"Незадовільно": "Погано";
}



console.log(transferGradeToTextShort(100),"\n");


function transferSeasonToText(mounth) {
    if (mounth>=1 && mounth<=2 || mounth==12) {
        return "Зима";
    }
    else if (mounth>=3 && mounth<=5) {
        return "Весна";
    }
    else if (mounth>=6 && mounth<=8) {
        return "Літо";
    }
    else if (mounth>=9 && mounth<=11) {
        return "Осінь";
    }
    else {
        return "Невірний місяць";
    }   
}

console.log(transferSeasonToText(3),"\n");


function transferSeasonToTextShort(mounth) {
    return mounth>=1 && mounth<=2 || mounth==12 ? "Зима" :
        mounth>=3 && mounth<=5 ? "Весна" :    
        mounth>=6 && mounth<=8 ? "Літо" : 
        mounth>=9 && mounth<=11 ? "Осінь" : "Невірний місяць";
}

console.log(transferSeasonToTextShort(6),"\n");