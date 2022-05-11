const sha256 = require('crypto-js/sha256');
const Block = require('./block');

class Blockchain{
constructor(){
    this.chain = [];
    this.height= -1;
    this.initializeChain();
}

async initializeChain(){
    if(this.height == -1){
        //create a new block
        const block= new Block({data:"Peep Block"});
        //take time create a block
        await this.addBlock(block);
    }
}

addBlock(block){
    let self= this;
    return new Promise(async(resolve, reject)=>{
        block.height= self.chain.length;
        block.time= new Date().getTime().toString();

        if (self.chain.length >0){
            //Hash del bloque anterior es igual al hash del bloque anterior.
            block.previousBlockHash= self.chain[self.chain.length -1].hash;
        }

        let errors= await self.validateChain();
        if(errors.length >0){
            reject(new Error('Chain is not valid: ', errors));
        }

        block.hash = sha256(JSON.stringify(block)).toString();
        self.chain.push(block);
        resolve(block);
    });
}

validateChain(){
    let self= this;
    const errors= [];

    return new Promise (async(resolve, reject)=>{
        //recorrer la cadena misma, bloque por bloque
        self.chain.map(async(block)=>{
            try {
                let isValid=await block.validate();
                if(!isValid){
                    errors.push(new Error(`The block ${block.height} is not valid`));

                }
            } catch (error) {
                errors.push(error);
            }
        });


        resolve(errors);
    });

}


print(){
    let self= this;
    for (let block of self.chain){
        console.log(block.toString());
    }
}
}

module.exports= Blockchain;