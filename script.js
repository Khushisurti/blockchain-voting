class Block {
   constructor(index, timestamp, data, previousHash = '') {
     this.index = index;
     this.timestamp = timestamp;
     this.data = data;
     this.previousHash = previousHash;
     this.hash = this.calculateHash();
   }
 
   calculateHash() {
     const value = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash;
     return CryptoJS.SHA256(value).toString();
   }
 }
 
 class Blockchain {
   constructor() {
     this.chain = [this.createGenesisBlock()];
   }
 
   createGenesisBlock() {
     return new Block(0, new Date().toLocaleString(), { vote: 'Genesis' }, '0');
   }
 
   getLatestBlock() {
     return this.chain[this.chain.length - 1];
   }
 
   addBlock(newData) {
     const latest = this.getLatestBlock();
     const newBlock = new Block(this.chain.length, new Date().toLocaleString(), { vote: newData }, latest.hash);
     this.chain.push(newBlock);
     displayChain();
   }
 
   isChainValid() {
     for (let i = 1; i < this.chain.length; i++) {
       const current = this.chain[i];
       const previous = this.chain[i - 1];
 
       if (current.hash !== current.calculateHash()) {
         return false;
       }
 
       if (current.previousHash !== previous.hash) {
         return false;
       }
     }
     return true;
   }
 }
 
 // Initialize blockchain
 const voteChain = new Blockchain();
 
 // Display blockchain
 function displayChain() {
   const display = document.getElementById('chainDisplay');
   display.innerHTML = '';
   voteChain.chain.forEach(block => {
     display.innerHTML += `Block #${block.index}
 Vote: ${block.data.vote}
 Time: ${block.timestamp}
 Hash: ${block.hash}
 Prev: ${block.previousHash}
 
 `;
   });
 }
 
 // Cast vote function
 function castVote(candidate) {
   voteChain.addBlock(candidate);
 }
 
 // Validate chain button
 document.getElementById("validateButton").addEventListener("click", () => {
   const result = document.getElementById("validationResult");
   const valid = voteChain.isChainValid();
   result.style.color = valid ? "green" : "red";
   result.textContent = valid ? "✅ Blockchain is valid." : "❌ Blockchain has been tampered with!";
 });
 
 // Show the initial chain
 displayChain();
 