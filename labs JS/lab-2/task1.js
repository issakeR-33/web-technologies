function minmaxArr(arr){

    let max = arr[0]
    let min = arr[0]

    for (let i = 1; i < arr.length; i++){
        if(arr[i] > max){
            max = arr[i];
        }
        
        if(arr[i] < min){
            min = arr[i];
        }
    }
    return {max, min};
}

console.log(minmaxArr([3,6,1,-10,0,2]))

let player1 = {
    name: "IssakeR3",
    regDate: 30,
    rank: 20,
    itemsCount: 100
};

let player2 = {
    name: "BigBob228",
    regDate: 25,
    rank: 20,
    itemsCount: 104
}

function playerCompare(obj1, obj2) {
    if (obj1.rank >= obj2.rank) {
        return `Player ${obj1.name} more stronger than ${obj2.name} by rank`;
    }
}

console.log(playerCompare(player1, player2));