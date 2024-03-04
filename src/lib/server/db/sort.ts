export const random_shuffle = (array : any[], seed: number):any[]=>{
    let m = array.length;
    let t, i;
    while(m){
        i = Math.floor(random(seed)*m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed
    }
    return array
}

const random = (seed:number):number =>{
    let x = Math.sin(seed++)*10000;
    return x - Math.floor(x);
}