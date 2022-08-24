import {myHelperFunction} from './helpers';

describe('myHelperFunction', () =>{
    it('should help me!', ()=> {
        const result = myHelperFunction();
        expect(result).toEqual("You've been helped!!")
    })
})