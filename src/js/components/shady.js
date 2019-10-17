export default class Shady{
    constructor(name){
        this.name = name;
    }

    get fullName(){
        return `My name is ${this.name} Shady!`;
    }
}