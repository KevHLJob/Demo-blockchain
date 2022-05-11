const sha256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii");

class Block {
  constructor(data) {
    this.hash = null;
    this.height = 0;
    //pasara a hexadecimal propertie hex
    this.body = Buffer.from(JSON.stringify(data).toString("hex"));
    this.time = 0;
    this.previousBlockHash = "";
  }
  //validation hash for any element have a change.
  validate() {
    const self = this;
    return new Promise((resolve, reject) => {
      //hash actual
      let currentHash = self.hash;

      self.hash = sha256(JSON.stringify({ ...self, hash: null })).toString();

      if (currentHash != self.hash) {
        return resolve(false);
      }

      resolve(true);
    });
  }

  getBlockData(){
      const self= this;
      return new Promise((resolve, reject)=>{
        //code hexadecimal 
        let encodeData=self.body;
        let decodeData=hex2ascii(encodeData);
        let dataObject=JSON.parse(decodeData);
        //si el objeto es igual a bloque
        if (dataObject == 'Peep Block'){
            reject(new Error("This is Peep Block"));
        }

        resolve(dataObject);
      });
  }

  toString(){
    const{hash, height, body, time, previousBlockHash}=this;
    return `Block -
    hash: ${hash}
    height: ${height}
    body:${body}
    time: ${time}
    previousBlockHash: ${previousBlockHash}
    -------------------------------------`;



  }
}

module.exports = Block;
